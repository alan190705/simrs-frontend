import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiResponse } from '@/types/api';
import { config } from './config';

// ============================================================
// AXIOS INSTANCE
// ============================================================
export const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  timeout: 15_000,
});

// ============================================================
// INTERCEPTOR REQUEST: Sisipkan Authorization header
// ============================================================
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('simrs_access_token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// ============================================================
// INTERCEPTOR RESPONSE: Auto-refresh saat 401
// ============================================================
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

function clearAuthAndRedirect() {
  localStorage.removeItem('simrs_access_token');
  localStorage.removeItem('simrs_refresh_token');
  localStorage.removeItem('simrs_user');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    // Skip kalau bukan 401, atau tidak ada config
    if (!original || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Jangan retry endpoint auth itu sendiri
    const url = original.url ?? '';
    if (
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    // Jangan retry 2x
    if (original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('simrs_refresh_token');
    if (!refreshToken) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    // Kalau sedang refresh, antri request ini
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((newToken: string) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Pakai axios "polos" biar tidak kena interceptor ini (hindari infinite loop)
      const res = await axios.post(
        `${config.apiUrl}/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      // Response backend: langsung { access_token, refresh_token, user } atau dibungkus { data }
      const payload = res.data?.data ?? res.data;
      const newAccess = payload.access_token as string;
      const newRefresh = payload.refresh_token as string;
      const newUser = payload.user;

      localStorage.setItem('simrs_access_token', newAccess);
      if (newRefresh) localStorage.setItem('simrs_refresh_token', newRefresh);
      if (newUser) localStorage.setItem('simrs_user', JSON.stringify(newUser));

      // Jalankan semua request yang antri
      pendingQueue.forEach((cb) => cb(newAccess));
      pendingQueue = [];

      // Ulangi request yang error tadi
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (refreshErr) {
      // Refresh gagal → paksa logout
      pendingQueue = [];
      clearAuthAndRedirect();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

// ============================================================
// HELPER
// ============================================================
export async function get<T>(url: string, params?: object) {
  const res = await api.get<ApiResponse<T>>(url, { params });
  return res.data;
}

export async function getRaw<T>(url: string, params?: object) {
  const res = await api.get<T>(url, { params });
  return res.data;
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined;
    if (data?.message) return data.message;
    if (err.code === 'ERR_NETWORK') {
      return 'Tidak dapat terhubung ke server. Periksa alamat API dan koneksi jaringan.';
    }
  }
  return 'Terjadi kesalahan tak terduga.';
}
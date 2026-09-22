import axios from 'axios';
import type { ApiError, ApiResponse } from '@/types/api';
import { config } from './config';

export const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  timeout: 15_000,
});

// ============================================================
// Interceptor: otomatis sisipkan Authorization header
// ============================================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('simrs_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// Helper
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
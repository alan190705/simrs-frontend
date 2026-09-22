import { config } from '@/lib/config';
import type { LoginResponse } from './auth.types';

const AUTH_BASE_URL = `${config.apiUrl}/auth`;

export async function loginRequest(
  identifier: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message || 'Login gagal');
  }

  return (json?.data ?? json) as LoginResponse;
}

export async function refreshRequest(refreshToken: string): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message || 'Sesi berakhir, silakan login ulang');
  }

  return (json?.data ?? json) as LoginResponse;
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await fetch(`${AUTH_BASE_URL}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  }).catch(() => null);
}
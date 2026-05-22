import { apiClient } from '../api/client';
import { clearTokens, getRefreshToken, saveTokens } from './tokenStorage';

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: 'superadmin' | 'admin' | 'landlord' | 'tenant';
  avatar?: string | null;
}

export type AuthProfile = Record<string, unknown> | null;

interface AuthResponse {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: 'tenant' | 'landlord';
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  if (!res.data?.accessToken || !res.data.refreshToken) {
    throw new Error('Mobile login did not return tokens.');
  }
  await saveTokens(res.data.accessToken, res.data.refreshToken);
  return res.data.user;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const res = await apiClient.post<AuthResponse>('/auth/register', payload);
  if (!res.data?.accessToken || !res.data.refreshToken) {
    throw new Error('Mobile registration did not return tokens.');
  }
  await saveTokens(res.data.accessToken, res.data.refreshToken);
  return res.data.user;
}

export async function getMe(): Promise<{ user: AuthUser; profile: AuthProfile }> {
  const res = await apiClient.get<{ user: AuthUser; profile: AuthProfile }>('/auth/me');
  return res.data!;
}

export async function refreshToken(): Promise<AuthUser | null> {
  const storedRefreshToken = await getRefreshToken();
  if (!storedRefreshToken) return null;
  const res = await apiClient.post<AuthResponse>('/auth/refresh-token', {
    refreshToken: storedRefreshToken,
  });
  if (!res.data?.accessToken || !res.data.refreshToken) return null;
  await saveTokens(res.data.accessToken, res.data.refreshToken);
  return res.data.user;
}

export async function logout() {
  const storedRefreshToken = await getRefreshToken();
  try {
    await apiClient.post('/auth/logout', {
      refreshToken: storedRefreshToken,
    });
  } finally {
    await clearTokens();
  }
}

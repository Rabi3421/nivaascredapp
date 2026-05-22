import { API_BASE_URL } from '../../config/api';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../auth/tokenStorage';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export class ApiClientError extends Error {
  constructor(
    public override message: string,
    public status: number,
    public errors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshMobileSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-type': 'mobile',
      },
      body: JSON.stringify({ refreshToken }),
    });
    const json = (await res.json()) as ApiResponse<{
      accessToken?: string;
      refreshToken?: string;
    }>;

    if (!res.ok || !json.success || !json.data?.accessToken || !json.data.refreshToken) {
      await clearTokens();
      return false;
    }

    await saveTokens(json.data.accessToken, json.data.refreshToken);
    return true;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  hasRetried = false,
): Promise<ApiResponse<T>> {
  const accessToken = await getAccessToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('x-client-type', 'mobile');
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (res.status === 401 && !hasRetried) {
    const refreshed = await refreshMobileSession();
    if (refreshed) {
      return request<T>(path, options, true);
    }
  }

  if (!res.ok || !json.success) {
    throw new ApiClientError(json.message || 'Request failed', res.status, json.errors);
  }

  return json;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

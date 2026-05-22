import { ApiClientError } from '../services/api/client';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof ApiClientError) {
    const firstFieldError = error.errors ? Object.values(error.errors)[0] : undefined;
    return firstFieldError || error.message || fallback;
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

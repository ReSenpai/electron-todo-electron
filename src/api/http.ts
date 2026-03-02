import axios, { type InternalAxiosRequestConfig } from 'axios';
import { AppError } from '../types/errors';
import { tokenStorage } from '../app/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Auth interceptor ───────────────────────────── */

export async function authRequestInterceptor(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

httpClient.interceptors.request.use(authRequestInterceptor);

/* ── Error helper ───────────────────────────────── */

export function toAppError(err: unknown): AppError {
  const response = (err as { response?: { status: number; data: { error: string } } }).response;
  if (response) {
    return new AppError(response.data.error, response.status);
  }
  return new AppError('Network error');
}

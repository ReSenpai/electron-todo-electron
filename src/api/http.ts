import axios from 'axios';
import { AppError } from '../types/errors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function toAppError(err: unknown): AppError {
  const response = (err as { response?: { status: number; data: { error: string } } }).response;
  if (response) {
    return new AppError(response.data.error, response.status);
  }
  return new AppError('Network error');
}

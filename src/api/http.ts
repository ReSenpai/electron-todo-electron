import axios from 'axios';
import { AppError } from '../types/errors';

export const httpClient = axios.create({
  baseURL: 'http://localhost:3000',
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

import { httpClient, toAppError } from '../../api/http';
import type { User } from '../../types/models';

interface AuthResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    const { data } = await httpClient.post<AuthResponse>('/auth/login', { email, password });
    return data.token;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

export async function register(email: string, password: string): Promise<string> {
  try {
    const { data } = await httpClient.post<AuthResponse>('/auth/register', { email, password });
    return data.token;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

export async function getMe(): Promise<User> {
  try {
    const { data } = await httpClient.get<User>('/auth/me');
    return data;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

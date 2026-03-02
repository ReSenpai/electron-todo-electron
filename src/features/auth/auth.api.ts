import { httpClient, toAppError } from '../../api/http';

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

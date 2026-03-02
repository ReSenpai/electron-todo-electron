import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../../api/http';
import { login, register } from './auth.api';
import { AppError } from '../../types/errors';

vi.mock('../../api/http', async () => {
  const actual = await vi.importActual<typeof import('../../api/http')>('../../api/http');
  return {
    ...actual,
    httpClient: {
      post: vi.fn(),
    },
  };
});

const mockedPost = vi.mocked(httpClient.post);

describe('auth.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('возвращает token при успешном логине', async () => {
      mockedPost.mockResolvedValueOnce({ data: { token: 'jwt-token-123' } });

      const result = await login('test@example.com', 'password123');

      expect(mockedPost).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toBe('jwt-token-123');
    });

    it('выбрасывает AppError при 401', async () => {
      mockedPost.mockRejectedValueOnce({
        response: { status: 401, data: { error: 'Invalid credentials' } },
      });

      const error = await login('test@example.com', 'wrong').catch((e) => e);

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid credentials');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('register', () => {
    it('возвращает token при успешной регистрации', async () => {
      mockedPost.mockResolvedValueOnce({ data: { token: 'jwt-token-new' } });

      const result = await register('new@example.com', 'password123');

      expect(mockedPost).toHaveBeenCalledWith('/auth/register', {
        email: 'new@example.com',
        password: 'password123',
      });
      expect(result).toBe('jwt-token-new');
    });

    it('выбрасывает AppError при 409 (email занят)', async () => {
      mockedPost.mockRejectedValueOnce({
        response: { status: 409, data: { error: 'Email already taken' } },
      });

      const error = await register('dup@example.com', 'pass').catch((e) => e);

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Email already taken');
      expect(error.statusCode).toBe(409);
    });

    it('выбрасывает AppError при 422 (невалидные данные)', async () => {
      mockedPost.mockRejectedValueOnce({
        response: { status: 422, data: { error: 'Invalid email format' } },
      });

      const error = await register('bad-email', 'pass').catch((e) => e);

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid email format');
      expect(error.statusCode).toBe(422);
    });
  });
});

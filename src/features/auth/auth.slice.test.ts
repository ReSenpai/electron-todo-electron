import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginThunk, registerThunk, logout } from './auth.slice';
import * as authApi from './auth.api';

vi.mock('./auth.api');
const mockedLogin = vi.mocked(authApi.login);
const mockedRegister = vi.mocked(authApi.register);

function createStore() {
  return configureStore({ reducer: { auth: authReducer } });
}

describe('auth.slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('начальное состояние', () => {
    const store = createStore();
    expect(store.getState().auth).toEqual({
      token: null,
      isLoading: false,
      error: null,
    });
  });

  describe('loginThunk', () => {
    it('при успехе — сохраняет token', async () => {
      mockedLogin.mockResolvedValueOnce('jwt-123');

      const store = createStore();
      await store.dispatch(loginThunk({ email: 'a@b.com', password: '123' }));

      expect(store.getState().auth).toEqual({
        token: 'jwt-123',
        isLoading: false,
        error: null,
      });
    });

    it('при ошибке — сохраняет error', async () => {
      mockedLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

      const store = createStore();
      await store.dispatch(loginThunk({ email: 'a@b.com', password: 'wrong' }));

      expect(store.getState().auth).toEqual({
        token: null,
        isLoading: false,
        error: 'Invalid credentials',
      });
    });

    it('во время загрузки — isLoading: true', () => {
      mockedLogin.mockReturnValueOnce(new Promise(() => {})); // pending forever

      const store = createStore();
      store.dispatch(loginThunk({ email: 'a@b.com', password: '123' }));

      expect(store.getState().auth.isLoading).toBe(true);
      expect(store.getState().auth.error).toBeNull();
    });
  });

  describe('registerThunk', () => {
    it('при успехе — сохраняет token', async () => {
      mockedRegister.mockResolvedValueOnce('jwt-new');

      const store = createStore();
      await store.dispatch(registerThunk({ email: 'new@b.com', password: '123' }));

      expect(store.getState().auth.token).toBe('jwt-new');
      expect(store.getState().auth.isLoading).toBe(false);
    });

    it('при ошибке — сохраняет error', async () => {
      mockedRegister.mockRejectedValueOnce(new Error('Email already taken'));

      const store = createStore();
      await store.dispatch(registerThunk({ email: 'dup@b.com', password: '123' }));

      expect(store.getState().auth.error).toBe('Email already taken');
      expect(store.getState().auth.token).toBeNull();
    });
  });

  describe('logout', () => {
    it('очищает token и error', async () => {
      mockedLogin.mockResolvedValueOnce('jwt-123');

      const store = createStore();
      await store.dispatch(loginThunk({ email: 'a@b.com', password: '123' }));
      expect(store.getState().auth.token).toBe('jwt-123');

      store.dispatch(logout());

      expect(store.getState().auth).toEqual({
        token: null,
        isLoading: false,
        error: null,
      });
    });
  });
});

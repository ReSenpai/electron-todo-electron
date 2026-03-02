import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../app/tokenStorage', () => ({
  tokenStorage: {
    getToken: vi.fn().mockResolvedValue(null),
    setToken: vi.fn().mockResolvedValue(undefined),
    removeToken: vi.fn().mockResolvedValue(undefined),
  },
}));

import authReducer, { loginThunk, registerThunk, logoutThunk } from './auth.slice';
import * as authApi from './auth.api';
import { tokenStorage } from '../../app/tokenStorage';

vi.mock('./auth.api');
const mockedLogin = vi.mocked(authApi.login);
const mockedRegister = vi.mocked(authApi.register);
const mockedSetToken = vi.mocked(tokenStorage.setToken);
const mockedRemoveToken = vi.mocked(tokenStorage.removeToken);

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

    it('при успехе — вызывает tokenStorage.setToken', async () => {
      mockedLogin.mockResolvedValueOnce('jwt-123');

      const store = createStore();
      await store.dispatch(loginThunk({ email: 'a@b.com', password: '123' }));

      expect(mockedSetToken).toHaveBeenCalledWith('jwt-123');
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

    it('при успехе — вызывает tokenStorage.setToken', async () => {
      mockedRegister.mockResolvedValueOnce('jwt-new');

      const store = createStore();
      await store.dispatch(registerThunk({ email: 'new@b.com', password: '123' }));

      expect(mockedSetToken).toHaveBeenCalledWith('jwt-new');
    });

    it('при ошибке — сохраняет error', async () => {
      mockedRegister.mockRejectedValueOnce(new Error('Email already taken'));

      const store = createStore();
      await store.dispatch(registerThunk({ email: 'dup@b.com', password: '123' }));

      expect(store.getState().auth.error).toBe('Email already taken');
      expect(store.getState().auth.token).toBeNull();
    });
  });

  describe('logoutThunk', () => {
    it('очищает token и error', async () => {
      mockedLogin.mockResolvedValueOnce('jwt-123');

      const store = createStore();
      await store.dispatch(loginThunk({ email: 'a@b.com', password: '123' }));
      expect(store.getState().auth.token).toBe('jwt-123');

      await store.dispatch(logoutThunk());

      expect(store.getState().auth).toEqual({
        token: null,
        isLoading: false,
        error: null,
      });
    });

    it('вызывает tokenStorage.removeToken', async () => {
      const store = createStore();
      await store.dispatch(logoutThunk());

      expect(mockedRemoveToken).toHaveBeenCalled();
    });
  });
});

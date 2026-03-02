import { describe, it, expect, beforeEach } from 'vitest';
import { getToken, setToken, removeToken } from './tokenStore';

describe('tokenStore (main process)', () => {
  beforeEach(() => {
    removeToken();
  });

  it('изначально токен — null', () => {
    expect(getToken()).toBeNull();
  });

  it('setToken сохраняет значение', () => {
    setToken('jwt-abc-123');
    expect(getToken()).toBe('jwt-abc-123');
  });

  it('removeToken удаляет токен', () => {
    setToken('jwt-abc-123');
    removeToken();
    expect(getToken()).toBeNull();
  });

  it('setToken перезаписывает предыдущее значение', () => {
    setToken('old-token');
    setToken('new-token');
    expect(getToken()).toBe('new-token');
  });
});

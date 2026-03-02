import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('keytar', () => {
  const store = new Map<string, string>();
  return {
    default: {
      getPassword: vi.fn((_service: string, account: string) =>
        Promise.resolve(store.get(account) ?? null),
      ),
      setPassword: vi.fn((_service: string, account: string, password: string) => {
        store.set(account, password);
        return Promise.resolve();
      }),
      deletePassword: vi.fn((_service: string, account: string) => {
        const had = store.has(account);
        store.delete(account);
        return Promise.resolve(had);
      }),
    },
  };
});

import { getToken, setToken, removeToken } from './tokenStore';

describe('tokenStore (keytar)', () => {
  beforeEach(async () => {
    await removeToken();
  });

  it('изначально токен — null', async () => {
    expect(await getToken()).toBeNull();
  });

  it('setToken сохраняет значение', async () => {
    await setToken('jwt-abc-123');
    expect(await getToken()).toBe('jwt-abc-123');
  });

  it('removeToken удаляет токен', async () => {
    await setToken('jwt-abc-123');
    await removeToken();
    expect(await getToken()).toBeNull();
  });

  it('setToken перезаписывает предыдущее значение', async () => {
    await setToken('old-token');
    await setToken('new-token');
    expect(await getToken()).toBe('new-token');
  });
});

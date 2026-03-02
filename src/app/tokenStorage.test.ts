import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

async function importFresh() {
  const mod = await import('./tokenStorage');
  return mod.tokenStorage as {
    getToken: () => Promise<string | null>;
    setToken: (token: string) => Promise<void>;
    removeToken: () => Promise<void>;
  };
}

describe('tokenStorage', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error — cleanup global
    delete globalThis.window;
  });

  describe('когда electronAPI доступен (Electron)', () => {
    it('getToken вызывает electronAPI.getToken', async () => {
      const mockAPI = {
        getToken: vi.fn().mockResolvedValue('electron-token'),
        setToken: vi.fn().mockResolvedValue(undefined),
        removeToken: vi.fn().mockResolvedValue(undefined),
      };
      // @ts-expect-error — мокаем window
      globalThis.window = { electronAPI: mockAPI };

      const tokenStorage = await importFresh();
      const result = await tokenStorage.getToken();

      expect(mockAPI.getToken).toHaveBeenCalled();
      expect(result).toBe('electron-token');
    });

    it('setToken вызывает electronAPI.setToken', async () => {
      const mockAPI = {
        getToken: vi.fn(),
        setToken: vi.fn().mockResolvedValue(undefined),
        removeToken: vi.fn(),
      };
      // @ts-expect-error — мокаем window
      globalThis.window = { electronAPI: mockAPI };

      const tokenStorage = await importFresh();
      await tokenStorage.setToken('my-token');

      expect(mockAPI.setToken).toHaveBeenCalledWith('my-token');
    });

    it('removeToken вызывает electronAPI.removeToken', async () => {
      const mockAPI = {
        getToken: vi.fn(),
        setToken: vi.fn(),
        removeToken: vi.fn().mockResolvedValue(undefined),
      };
      // @ts-expect-error — мокаем window
      globalThis.window = { electronAPI: mockAPI };

      const tokenStorage = await importFresh();
      await tokenStorage.removeToken();

      expect(mockAPI.removeToken).toHaveBeenCalled();
    });
  });

  describe('когда electronAPI недоступен (fallback на localStorage)', () => {
    it('getToken возвращает значение из localStorage', async () => {
      const store: Record<string, string> = { token: 'local-token' };
      // @ts-expect-error — мокаем window без electronAPI
      globalThis.window = {
        localStorage: {
          getItem: vi.fn((key: string) => store[key] ?? null),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          length: 0,
          clear: vi.fn(),
          key: vi.fn(),
        },
      };

      const tokenStorage = await importFresh();
      const result = await tokenStorage.getToken();

      expect(result).toBe('local-token');
    });

    it('setToken сохраняет значение в localStorage', async () => {
      const setItem = vi.fn();
      // @ts-expect-error — мокаем window без electronAPI
      globalThis.window = {
        localStorage: {
          getItem: vi.fn(),
          setItem,
          removeItem: vi.fn(),
          length: 0,
          clear: vi.fn(),
          key: vi.fn(),
        },
      };

      const tokenStorage = await importFresh();
      await tokenStorage.setToken('new-token');

      expect(setItem).toHaveBeenCalledWith('token', 'new-token');
    });

    it('removeToken удаляет из localStorage', async () => {
      const removeItem = vi.fn();
      // @ts-expect-error — мокаем window без electronAPI
      globalThis.window = {
        localStorage: {
          getItem: vi.fn(),
          setItem: vi.fn(),
          removeItem,
          length: 0,
          clear: vi.fn(),
          key: vi.fn(),
        },
      };

      const tokenStorage = await importFresh();
      await tokenStorage.removeToken();

      expect(removeItem).toHaveBeenCalledWith('token');
    });
  });
});

const isElectron =
  typeof window !== 'undefined' && window.electronAPI !== undefined;

const hasLocalStorage =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const TOKEN_KEY = 'token';

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    if (isElectron) return window.electronAPI!.getToken();
    if (hasLocalStorage) return window.localStorage.getItem(TOKEN_KEY);
    return null;
  },

  async setToken(token: string): Promise<void> {
    if (isElectron) return window.electronAPI!.setToken(token);
    if (hasLocalStorage) window.localStorage.setItem(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    if (isElectron) return window.electronAPI!.removeToken();
    if (hasLocalStorage) window.localStorage.removeItem(TOKEN_KEY);
  },
};

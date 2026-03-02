import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosHeaders } from 'axios';

vi.mock('../app/tokenStorage', () => ({
  tokenStorage: {
    getToken: vi.fn().mockResolvedValue(null),
    setToken: vi.fn(),
    removeToken: vi.fn(),
  },
}));

import { httpClient, authRequestInterceptor } from '../api/http';
import { tokenStorage } from '../app/tokenStorage';

const mockedGetToken = vi.mocked(tokenStorage.getToken);

describe('httpClient', () => {
  it('имеет baseURL', () => {
    expect(httpClient.defaults.baseURL).toBeDefined();
    expect(httpClient.defaults.baseURL).not.toBe('');
  });

  it('имеет Content-Type application/json', () => {
    expect(httpClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});

describe('authRequestInterceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('добавляет Authorization header когда токен есть', async () => {
    mockedGetToken.mockResolvedValueOnce('jwt-abc-123');

    const config = { headers: new AxiosHeaders() };
    const result = await authRequestInterceptor(config as any);

    expect(result.headers.Authorization).toBe('Bearer jwt-abc-123');
  });

  it('не добавляет Authorization header когда токена нет', async () => {
    mockedGetToken.mockResolvedValueOnce(null);

    const config = { headers: new AxiosHeaders() };
    const result = await authRequestInterceptor(config as any);

    expect(result.headers.Authorization).toBeUndefined();
  });
});

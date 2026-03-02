import { describe, it, expect } from 'vitest';
import { httpClient } from '../api/http';

describe('httpClient', () => {
  it('имеет baseURL', () => {
    expect(httpClient.defaults.baseURL).toBe('http://localhost:3000');
  });

  it('имеет Content-Type application/json', () => {
    expect(httpClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});

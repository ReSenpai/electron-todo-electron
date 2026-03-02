import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../../api/http';
import { getLists, createList, updateList, deleteList } from './lists.api';
import { AppError } from '../../types/errors';
import type { TodoList } from '../../types/models';

vi.mock('../../api/http', async () => {
  const actual = await vi.importActual<typeof import('../../api/http')>('../../api/http');
  return {
    ...actual,
    httpClient: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

const mockedGet = vi.mocked(httpClient.get);
const mockedPost = vi.mocked(httpClient.post);
const mockedPut = vi.mocked(httpClient.put);
const mockedDelete = vi.mocked(httpClient.delete);

const listFixture: TodoList = {
  id: 'uuid-list-1',
  title: 'Покупки',
  created_at: '2026-03-02T12:00:00Z',
  updated_at: null,
};

describe('lists.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLists', () => {
    it('возвращает массив списков', async () => {
      mockedGet.mockResolvedValueOnce({ data: [listFixture] });

      const result = await getLists();

      expect(mockedGet).toHaveBeenCalledWith('/lists');
      expect(result).toEqual([listFixture]);
    });

    it('выбрасывает AppError при 401', async () => {
      mockedGet.mockRejectedValueOnce({
        response: { status: 401, data: { error: 'Unauthorized' } },
      });

      const error = await getLists().catch((e) => e);

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('createList', () => {
    it('создаёт список и возвращает его', async () => {
      mockedPost.mockResolvedValueOnce({ data: listFixture });

      const result = await createList('Покупки');

      expect(mockedPost).toHaveBeenCalledWith('/lists', { title: 'Покупки' });
      expect(result).toEqual(listFixture);
    });
  });

  describe('updateList', () => {
    it('обновляет название списка', async () => {
      const updated = { ...listFixture, title: 'Покупки на неделю' };
      mockedPut.mockResolvedValueOnce({ data: updated });

      const result = await updateList('uuid-list-1', 'Покупки на неделю');

      expect(mockedPut).toHaveBeenCalledWith('/lists/uuid-list-1', {
        title: 'Покупки на неделю',
      });
      expect(result).toEqual(updated);
    });

    it('выбрасывает AppError при 404', async () => {
      mockedPut.mockRejectedValueOnce({
        response: { status: 404, data: { error: 'List not found' } },
      });

      const error = await updateList('bad-id', 'title').catch((e) => e);

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('List not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('deleteList', () => {
    it('удаляет список (без возвращаемых данных)', async () => {
      mockedDelete.mockResolvedValueOnce({ data: null, status: 204 });

      await deleteList('uuid-list-1');

      expect(mockedDelete).toHaveBeenCalledWith('/lists/uuid-list-1');
    });

    it('выбрасывает AppError при 404', async () => {
      mockedDelete.mockRejectedValueOnce({
        response: { status: 404, data: { error: 'List not found' } },
      });

      const error = await deleteList('bad-id').catch((e) => e);

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
    });
  });
});

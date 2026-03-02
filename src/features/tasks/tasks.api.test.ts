import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../../api/http';
import { getTasks, createTask, updateTask, deleteTask } from './tasks.api';
import { AppError } from '../../types/errors';
import { TaskStatus } from '../../types/enums';
import type { Task } from '../../types/models';

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

const listId = 'uuid-list-1';

const taskFixture: Task = {
  id: 'uuid-task-1',
  list_id: listId,
  title: 'Купить молоко',
  status: TaskStatus.TODO,
  created_at: '2026-03-02T12:00:00Z',
  updated_at: null,
};

describe('tasks.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('возвращает массив задач для списка', async () => {
      mockedGet.mockResolvedValueOnce({ data: [taskFixture] });

      const result = await getTasks(listId);

      expect(mockedGet).toHaveBeenCalledWith(`/lists/${listId}/tasks`);
      expect(result).toEqual([taskFixture]);
    });

    it('выбрасывает AppError при 404 (список не найден)', async () => {
      mockedGet.mockRejectedValueOnce({
        response: { status: 404, data: { error: 'List not found' } },
      });

      const error = await getTasks('bad-id').catch((e) => e);

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('List not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('createTask', () => {
    it('создаёт задачу в списке', async () => {
      mockedPost.mockResolvedValueOnce({ data: taskFixture });

      const result = await createTask(listId, 'Купить молоко');

      expect(mockedPost).toHaveBeenCalledWith(`/lists/${listId}/tasks`, {
        title: 'Купить молоко',
      });
      expect(result).toEqual(taskFixture);
    });
  });

  describe('updateTask', () => {
    it('обновляет title и status задачи', async () => {
      const updated: Task = {
        ...taskFixture,
        title: 'Купить молоко и хлеб',
        status: TaskStatus.IN_PROGRESS,
      };
      mockedPut.mockResolvedValueOnce({ data: updated });

      const result = await updateTask(listId, 'uuid-task-1', {
        title: 'Купить молоко и хлеб',
        status: TaskStatus.IN_PROGRESS,
      });

      expect(mockedPut).toHaveBeenCalledWith(`/lists/${listId}/tasks/uuid-task-1`, {
        title: 'Купить молоко и хлеб',
        status: 'in_progress',
      });
      expect(result).toEqual(updated);
    });

    it('выбрасывает AppError при 404', async () => {
      mockedPut.mockRejectedValueOnce({
        response: { status: 404, data: { error: 'Task not found' } },
      });

      const error = await updateTask(listId, 'bad-id', {
        title: 'x',
        status: TaskStatus.DONE,
      }).catch((e) => e);

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
    });
  });

  describe('deleteTask', () => {
    it('удаляет задачу', async () => {
      mockedDelete.mockResolvedValueOnce({ data: null, status: 204 });

      await deleteTask(listId, 'uuid-task-1');

      expect(mockedDelete).toHaveBeenCalledWith(`/lists/${listId}/tasks/uuid-task-1`);
    });
  });
});

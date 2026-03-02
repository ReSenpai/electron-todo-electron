import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, {
  fetchTasksThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
} from './tasks.slice';
import * as tasksApi from './tasks.api';
import { TaskStatus } from '../../types/enums';
import type { Task } from '../../types/models';

vi.mock('./tasks.api');
const mockedGetTasks = vi.mocked(tasksApi.getTasks);
const mockedCreateTask = vi.mocked(tasksApi.createTask);
const mockedUpdateTask = vi.mocked(tasksApi.updateTask);
const mockedDeleteTask = vi.mocked(tasksApi.deleteTask);

const listId = 'uuid-list-1';

const taskFixture: Task = {
  id: 'uuid-task-1',
  list_id: listId,
  title: 'Купить молоко',
  status: TaskStatus.TODO,
  created_at: '2026-03-02T12:00:00Z',
  updated_at: null,
};

function createStore() {
  return configureStore({ reducer: { tasks: tasksReducer } });
}

describe('tasks.slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('начальное состояние', () => {
    const store = createStore();
    expect(store.getState().tasks).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  describe('fetchTasksThunk', () => {
    it('при успехе — загружает задачи', async () => {
      mockedGetTasks.mockResolvedValueOnce([taskFixture]);

      const store = createStore();
      await store.dispatch(fetchTasksThunk(listId));

      expect(store.getState().tasks.items).toEqual([taskFixture]);
      expect(store.getState().tasks.isLoading).toBe(false);
    });

    it('при ошибке — сохраняет error', async () => {
      mockedGetTasks.mockRejectedValueOnce(new Error('List not found'));

      const store = createStore();
      await store.dispatch(fetchTasksThunk(listId));

      expect(store.getState().tasks.error).toBe('List not found');
      expect(store.getState().tasks.items).toEqual([]);
    });

    it('во время загрузки — isLoading: true', () => {
      mockedGetTasks.mockReturnValueOnce(new Promise(() => {}));

      const store = createStore();
      store.dispatch(fetchTasksThunk(listId));

      expect(store.getState().tasks.isLoading).toBe(true);
    });
  });

  describe('createTaskThunk', () => {
    it('добавляет новую задачу в items', async () => {
      mockedCreateTask.mockResolvedValueOnce(taskFixture);

      const store = createStore();
      await store.dispatch(createTaskThunk({ listId, title: 'Купить молоко' }));

      expect(store.getState().tasks.items).toEqual([taskFixture]);
    });
  });

  describe('updateTaskThunk', () => {
    it('обновляет задачу в списке', async () => {
      mockedGetTasks.mockResolvedValueOnce([taskFixture]);
      const updated: Task = {
        ...taskFixture,
        title: 'Купить молоко и хлеб',
        status: TaskStatus.IN_PROGRESS,
      };
      mockedUpdateTask.mockResolvedValueOnce(updated);

      const store = createStore();
      await store.dispatch(fetchTasksThunk(listId));
      await store.dispatch(
        updateTaskThunk({
          listId,
          taskId: 'uuid-task-1',
          payload: { title: 'Купить молоко и хлеб', status: TaskStatus.IN_PROGRESS },
        }),
      );

      expect(store.getState().tasks.items[0].title).toBe('Купить молоко и хлеб');
      expect(store.getState().tasks.items[0].status).toBe(TaskStatus.IN_PROGRESS);
    });
  });

  describe('deleteTaskThunk', () => {
    it('удаляет задачу из items', async () => {
      mockedGetTasks.mockResolvedValueOnce([taskFixture]);
      mockedDeleteTask.mockResolvedValueOnce(undefined);

      const store = createStore();
      await store.dispatch(fetchTasksThunk(listId));
      expect(store.getState().tasks.items).toHaveLength(1);

      await store.dispatch(deleteTaskThunk({ listId, taskId: 'uuid-task-1' }));

      expect(store.getState().tasks.items).toHaveLength(0);
    });
  });
});

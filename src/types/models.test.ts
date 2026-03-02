import { describe, it, expect } from 'vitest';
import { TaskStatus } from '../types/enums';
import type { User, TodoList, Task } from '../types/models';

describe('Models', () => {
  it('User имеет id и email', () => {
    const user: User = { id: 'uuid-1', email: 'test@example.com' };
    expect(user.id).toBe('uuid-1');
    expect(user.email).toBe('test@example.com');
  });

  it('TodoList имеет id, title, created_at, updated_at', () => {
    const list: TodoList = {
      id: 'uuid-2',
      title: 'Покупки',
      created_at: '2026-03-02T12:00:00Z',
      updated_at: null,
    };
    expect(list.id).toBe('uuid-2');
    expect(list.title).toBe('Покупки');
    expect(list.created_at).toBe('2026-03-02T12:00:00Z');
    expect(list.updated_at).toBeNull();
  });

  it('Task имеет id, list_id, title, status, created_at, updated_at', () => {
    const task: Task = {
      id: 'uuid-3',
      list_id: 'uuid-2',
      title: 'Купить молоко',
      status: TaskStatus.TODO,
      created_at: '2026-03-02T12:00:00Z',
      updated_at: null,
    };
    expect(task.id).toBe('uuid-3');
    expect(task.list_id).toBe('uuid-2');
    expect(task.title).toBe('Купить молоко');
    expect(task.status).toBe('todo');
    expect(task.created_at).toBe('2026-03-02T12:00:00Z');
    expect(task.updated_at).toBeNull();
  });
});

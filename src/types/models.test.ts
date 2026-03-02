import { describe, it, expect } from 'vitest';
import { TaskStatus } from '../types/enums';
import type { User, TodoList, Task } from '../types/models';

describe('Models', () => {
  it('User имеет id и email', () => {
    const user: User = { id: 'uuid-1', email: 'test@example.com' };
    expect(user.id).toBe('uuid-1');
    expect(user.email).toBe('test@example.com');
  });

  it('TodoList имеет id и title', () => {
    const list: TodoList = { id: 'uuid-2', title: 'Покупки' };
    expect(list.id).toBe('uuid-2');
    expect(list.title).toBe('Покупки');
  });

  it('Task имеет id, title, status и listId', () => {
    const task: Task = {
      id: 'uuid-3',
      title: 'Купить молоко',
      status: TaskStatus.TODO,
      listId: 'uuid-2',
    };
    expect(task.id).toBe('uuid-3');
    expect(task.title).toBe('Купить молоко');
    expect(task.status).toBe('todo');
    expect(task.listId).toBe('uuid-2');
  });
});

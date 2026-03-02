import { describe, it, expect } from 'vitest';
import { TaskStatus } from '../types/enums';

describe('TaskStatus', () => {
  it('содержит значение TODO', () => {
    expect(TaskStatus.TODO).toBe('todo');
  });

  it('содержит значение IN_PROGRESS', () => {
    expect(TaskStatus.IN_PROGRESS).toBe('in_progress');
  });

  it('содержит значение DONE', () => {
    expect(TaskStatus.DONE).toBe('done');
  });

  it('содержит ровно 3 значения', () => {
    const values = Object.values(TaskStatus);
    expect(values).toHaveLength(3);
  });
});

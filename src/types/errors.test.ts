import { describe, it, expect } from 'vitest';
import { AppError } from '../types/errors';

describe('AppError', () => {
  it('создаётся с message и statusCode', () => {
    const error = new AppError('Not found', 404);
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('является экземпляром Error', () => {
    const error = new AppError('Unauthorized', 401);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('имеет имя AppError', () => {
    const error = new AppError('Server error', 500);
    expect(error.name).toBe('AppError');
  });

  it('statusCode по умолчанию 0 (неизвестная ошибка)', () => {
    const error = new AppError('Что-то пошло не так');
    expect(error.statusCode).toBe(0);
  });
});

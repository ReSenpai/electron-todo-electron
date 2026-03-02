import { describe, it, expect } from 'vitest';
import { store } from './store';

describe('store', () => {
  it('содержит все три редьюсера', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('lists');
    expect(state).toHaveProperty('tasks');
  });

  it('auth — начальное состояние', () => {
    expect(store.getState().auth).toEqual({
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  });

  it('lists — начальное состояние', () => {
    expect(store.getState().lists).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('tasks — начальное состояние', () => {
    expect(store.getState().tasks).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });
});

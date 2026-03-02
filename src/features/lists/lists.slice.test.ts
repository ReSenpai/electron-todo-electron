import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import listsReducer, {
  fetchListsThunk,
  createListThunk,
  updateListThunk,
  deleteListThunk,
} from './lists.slice';
import * as listsApi from './lists.api';
import type { TodoList } from '../../types/models';

vi.mock('./lists.api');
const mockedGetLists = vi.mocked(listsApi.getLists);
const mockedCreateList = vi.mocked(listsApi.createList);
const mockedUpdateList = vi.mocked(listsApi.updateList);
const mockedDeleteList = vi.mocked(listsApi.deleteList);

const listFixture: TodoList = {
  id: 'uuid-1',
  title: 'Покупки',
  created_at: '2026-03-02T12:00:00Z',
  updated_at: null,
};

function createStore() {
  return configureStore({ reducer: { lists: listsReducer } });
}

describe('lists.slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('начальное состояние', () => {
    const store = createStore();
    expect(store.getState().lists).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  describe('fetchListsThunk', () => {
    it('при успехе — загружает списки', async () => {
      mockedGetLists.mockResolvedValueOnce([listFixture]);

      const store = createStore();
      await store.dispatch(fetchListsThunk());

      expect(store.getState().lists.items).toEqual([listFixture]);
      expect(store.getState().lists.isLoading).toBe(false);
    });

    it('при ошибке — сохраняет error', async () => {
      mockedGetLists.mockRejectedValueOnce(new Error('Unauthorized'));

      const store = createStore();
      await store.dispatch(fetchListsThunk());

      expect(store.getState().lists.error).toBe('Unauthorized');
      expect(store.getState().lists.items).toEqual([]);
    });

    it('во время загрузки — isLoading: true', () => {
      mockedGetLists.mockReturnValueOnce(new Promise(() => {}));

      const store = createStore();
      store.dispatch(fetchListsThunk());

      expect(store.getState().lists.isLoading).toBe(true);
    });
  });

  describe('createListThunk', () => {
    it('добавляет новый список в items', async () => {
      mockedCreateList.mockResolvedValueOnce(listFixture);

      const store = createStore();
      await store.dispatch(createListThunk('Покупки'));

      expect(store.getState().lists.items).toEqual([listFixture]);
    });
  });

  describe('updateListThunk', () => {
    it('обновляет существующий список', async () => {
      mockedGetLists.mockResolvedValueOnce([listFixture]);
      const updated = { ...listFixture, title: 'Покупки на неделю' };
      mockedUpdateList.mockResolvedValueOnce(updated);

      const store = createStore();
      await store.dispatch(fetchListsThunk());
      await store.dispatch(updateListThunk({ id: 'uuid-1', title: 'Покупки на неделю' }));

      expect(store.getState().lists.items[0].title).toBe('Покупки на неделю');
    });
  });

  describe('deleteListThunk', () => {
    it('удаляет список из items', async () => {
      mockedGetLists.mockResolvedValueOnce([listFixture]);
      mockedDeleteList.mockResolvedValueOnce(undefined);

      const store = createStore();
      await store.dispatch(fetchListsThunk());
      expect(store.getState().lists.items).toHaveLength(1);

      await store.dispatch(deleteListThunk('uuid-1'));

      expect(store.getState().lists.items).toHaveLength(0);
    });
  });
});

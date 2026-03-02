import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLists, createList, updateList, deleteList } from './lists.api';
import type { TodoList } from '../../types/models';

interface ListsState {
  items: TodoList[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchListsThunk = createAsyncThunk('lists/fetchAll', async () => {
  return await getLists();
});

export const createListThunk = createAsyncThunk('lists/create', async (title: string) => {
  return await createList(title);
});

export const updateListThunk = createAsyncThunk(
  'lists/update',
  async ({ id, title }: { id: string; title: string }) => {
    return await updateList(id, title);
  },
);

export const deleteListThunk = createAsyncThunk('lists/delete', async (id: string) => {
  await deleteList(id);
  return id;
});

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchAll
    builder.addCase(fetchListsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchListsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchListsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Failed to fetch lists';
    });

    // create
    builder.addCase(createListThunk.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // update
    builder.addCase(updateListThunk.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // delete
    builder.addCase(deleteListThunk.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
  },
});

export default listsSlice.reducer;

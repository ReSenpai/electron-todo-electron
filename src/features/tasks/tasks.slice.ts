import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as tasksApi from './tasks.api';
import type { Task } from '../../types/models';
import type { TaskStatus } from '../../types/enums';

/* ── State ──────────────────────────────────────── */

interface TasksState {
  items: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  isLoading: false,
  error: null,
};

/* ── Thunks ─────────────────────────────────────── */

export const fetchTasksThunk = createAsyncThunk('tasks/fetchAll', (listId: string) =>
  tasksApi.getTasks(listId),
);

export const createTaskThunk = createAsyncThunk(
  'tasks/create',
  ({ listId, title }: { listId: string; title: string }) => tasksApi.createTask(listId, title),
);

export const updateTaskThunk = createAsyncThunk(
  'tasks/update',
  ({
    listId,
    taskId,
    payload,
  }: {
    listId: string;
    taskId: string;
    payload: { title?: string; status?: TaskStatus };
  }) => tasksApi.updateTask(listId, taskId, payload),
);

export const deleteTaskThunk = createAsyncThunk(
  'tasks/delete',
  async ({ listId, taskId }: { listId: string; taskId: string }) => {
    await tasksApi.deleteTask(listId, taskId);
    return taskId;
  },
);

/* ── Slice ──────────────────────────────────────── */

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetchAll */
      .addCase(fetchTasksThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasksThunk.fulfilled, (state, { payload }) => {
        state.items = payload;
        state.isLoading = false;
      })
      .addCase(fetchTasksThunk.rejected, (state, { error }) => {
        state.error = error.message ?? 'Unknown error';
        state.isLoading = false;
      })

      /* create */
      .addCase(createTaskThunk.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })

      /* update */
      .addCase(updateTaskThunk.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex((t) => t.id === payload.id);
        if (idx !== -1) state.items[idx] = payload;
      })

      /* delete */
      .addCase(deleteTaskThunk.fulfilled, (state, { payload: taskId }) => {
        state.items = state.items.filter((t) => t.id !== taskId);
      });
  },
});

export default tasksSlice.reducer;

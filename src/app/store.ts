import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/auth.slice';
import listsReducer from '../features/lists/lists.slice';
import tasksReducer from '../features/tasks/tasks.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lists: listsReducer,
    tasks: tasksReducer,
  },
});

/* ── Typed hooks ────────────────────────────────── */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

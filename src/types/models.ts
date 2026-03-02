import { TaskStatus } from './enums';

export interface User {
  id: string;
  email: string;
}

export interface TodoList {
  id: string;
  title: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Task {
  id: string;
  list_id: string;
  title: string;
  status: TaskStatus;
  created_at: string | null;
  updated_at: string | null;
}

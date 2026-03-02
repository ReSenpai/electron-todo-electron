import { TaskStatus } from './enums';

export interface User {
  id: string;
  email: string;
}

export interface TodoList {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  listId: string;
}

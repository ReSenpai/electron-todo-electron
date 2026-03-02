import { httpClient, toAppError } from '../../api/http';
import type { Task } from '../../types/models';
import type { TaskStatus } from '../../types/enums';

interface UpdateTaskPayload {
  title: string;
  status: TaskStatus;
}

export async function getTasks(listId: string): Promise<Task[]> {
  try {
    const { data } = await httpClient.get<Task[]>(`/lists/${listId}/tasks`);
    return data;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

export async function createTask(listId: string, title: string): Promise<Task> {
  try {
    const { data } = await httpClient.post<Task>(`/lists/${listId}/tasks`, { title });
    return data;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

export async function updateTask(
  listId: string,
  taskId: string,
  payload: UpdateTaskPayload,
): Promise<Task> {
  try {
    const { data } = await httpClient.put<Task>(`/lists/${listId}/tasks/${taskId}`, payload);
    return data;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

export async function deleteTask(listId: string, taskId: string): Promise<void> {
  try {
    await httpClient.delete(`/lists/${listId}/tasks/${taskId}`);
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

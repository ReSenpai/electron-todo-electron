import { httpClient, toAppError } from '../../api/http';
import type { TodoList } from '../../types/models';

export async function getLists(): Promise<TodoList[]> {
  try {
    const { data } = await httpClient.get<TodoList[]>('/lists');
    return data;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

export async function createList(title: string): Promise<TodoList> {
  try {
    const { data } = await httpClient.post<TodoList>('/lists', { title });
    return data;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

export async function updateList(id: string, title: string): Promise<TodoList> {
  try {
    const { data } = await httpClient.put<TodoList>(`/lists/${id}`, { title });
    return data;
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

export async function deleteList(id: string): Promise<void> {
  try {
    await httpClient.delete(`/lists/${id}`);
  } catch (err: unknown) {
    throw toAppError(err);
  }
}

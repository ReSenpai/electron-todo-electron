import keytar from 'keytar';

const SERVICE = 'todo-desktop';
const ACCOUNT = 'jwt';

export async function getToken(): Promise<string | null> {
  return keytar.getPassword(SERVICE, ACCOUNT);
}

export async function setToken(value: string): Promise<void> {
  await keytar.setPassword(SERVICE, ACCOUNT, value);
}

export async function removeToken(): Promise<void> {
  await keytar.deletePassword(SERVICE, ACCOUNT);
}

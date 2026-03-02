import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getToken: (): Promise<string | null> => ipcRenderer.invoke('token:get'),
  setToken: (token: string): Promise<void> => ipcRenderer.invoke('token:set', token),
  removeToken: (): Promise<void> => ipcRenderer.invoke('token:remove'),
});

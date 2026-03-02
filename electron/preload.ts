import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getToken: (): Promise<string | null> => ipcRenderer.invoke('token:get'),
  setToken: (token: string): Promise<void> => ipcRenderer.invoke('token:set', token),
  removeToken: (): Promise<void> => ipcRenderer.invoke('token:remove'),
  minimize: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
  maximize: (): Promise<void> => ipcRenderer.invoke('window:maximize'),
  close: (): Promise<void> => ipcRenderer.invoke('window:close'),
});

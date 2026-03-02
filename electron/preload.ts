import { contextBridge } from 'electron';

// Пока пустой bridge — IPC-методы будут добавлены в Фазе 4
contextBridge.exposeInMainWorld('electronAPI', {
  // placeholder
});

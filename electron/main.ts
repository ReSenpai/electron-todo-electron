import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import * as tokenStore from './tokenStore';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // В dev-режиме загружаем Vite dev-server, в production — собранный HTML
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/* ── IPC: Token storage ──────────────────────────── */

ipcMain.handle('token:get', () => tokenStore.getToken());
ipcMain.handle('token:set', (_e, token: string) => tokenStore.setToken(token));
ipcMain.handle('token:remove', () => tokenStore.removeToken());

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

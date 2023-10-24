import { CLOSE_APP, MAXIMIZE_APP, MINIMIZE_APP } from './constants';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  "electron", {
    minimizeApp: () => ipcRenderer.send(MINIMIZE_APP),
    closeApp: () => ipcRenderer.send(CLOSE_APP),
    maximizeApp: () => ipcRenderer.send(MAXIMIZE_APP),
  }
);

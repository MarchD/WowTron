import {
  CLOSE_APP,
  MAXIMIZE_APP,
  MINIMIZE_APP,
  IS_WINDOW_MAXIMIZED,
  UNMAXIMIZE_APP,
  WINDOW_STATE,
  OPEN_MAIN_WINDOW,
  DOWNLOAD_FILES,
  DOWNLOAD_FILES_FINISH,
  ERROR_TRIGGER
} from './constants';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron', {
    minimizeApp: () => ipcRenderer.send(MINIMIZE_APP),
    closeApp: () => ipcRenderer.send(CLOSE_APP),
    maximizeApp: () => ipcRenderer.send(MAXIMIZE_APP),
    unmaximizeApp: () => ipcRenderer.send(UNMAXIMIZE_APP),
    addWindowStateListener: (cb: (isMaximized: boolean) => void) => {
      if (typeof cb === 'function') {
        ipcRenderer.on(WINDOW_STATE, (_, isMaximized) => {
          cb(isMaximized);
        });
      }
    },
    isWindowMaximized: () => ipcRenderer.sendSync(IS_WINDOW_MAXIMIZED),
    openMainWindow: () => ipcRenderer.send(OPEN_MAIN_WINDOW),
    downloadFiles: (urls: string[]) =>  ipcRenderer.send(DOWNLOAD_FILES, urls),
    onFinishDownloadFiles: (cb: (isSuccess: boolean) => void) => {
      ipcRenderer.on(DOWNLOAD_FILES_FINISH, (_, isSuccess) => {
        cb(isSuccess)
      })
    },
    onError: (cb: (message: string) => void) => {
      ipcRenderer.on(ERROR_TRIGGER, (_, message) => {
        cb(message)
      })
    }
  }
);

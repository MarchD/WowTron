import { app, BrowserWindow,ipcMain } from 'electron';
import {
  CLOSE_APP,
  IS_WINDOW_MAXIMIZED,
  MAXIMIZE_APP,
  MAXIMIZE_RESTORE_APP,
  MINIMIZE_APP,
  UNMAXIMIZE_APP,
  WINDOW_STATE
} from './constants';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 630,
    width: 465,
    frame: false,
    icon: 'src/assets/icon.ico',
    webPreferences: {
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  ipcMain.on(MAXIMIZE_APP, () => {
    mainWindow.webContents.send(WINDOW_STATE, true);
    mainWindow.maximize()
  });

  ipcMain.on(UNMAXIMIZE_APP, () => {
    mainWindow.webContents.send(WINDOW_STATE, false);
    mainWindow.unmaximize()
  });

  ipcMain.on(IS_WINDOW_MAXIMIZED, (event) => {
    event.returnValue = mainWindow.isMaximized();
  });

  ipcMain.on(MINIMIZE_APP, () => {
    mainWindow.minimize();
  });

  ipcMain.on(CLOSE_APP, () => {
    mainWindow.close();
  });

  ipcMain.on(MAXIMIZE_RESTORE_APP, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (mainWindow.isMaximized()) {
      win.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

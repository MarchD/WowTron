import { app, BrowserWindow,ipcMain, session } from 'electron';
import {
  CLOSE_APP,
  IS_WINDOW_MAXIMIZED,
  MAXIMIZE_APP,
  MAXIMIZE_RESTORE_APP,
  MINIMIZE_APP,
  OPEN_MAIN_WINDOW,
  UNMAXIMIZE_APP,
  WINDOW_STATE
} from './constants';
import { LOGIN, MAIN } from './constants/routes';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let loginWindow;

ipcMain.on(MAXIMIZE_APP, (event) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender);

  event.sender.send(WINDOW_STATE, true);
  senderWindow.maximize()
});


ipcMain.on(UNMAXIMIZE_APP, (event, args) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender);

  event.sender.send(WINDOW_STATE, false);
  senderWindow.unmaximize()
});

ipcMain.on(IS_WINDOW_MAXIMIZED, (event) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender);

  event.returnValue = senderWindow.isMaximized();
});

ipcMain.on(MINIMIZE_APP, (event) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender);

  senderWindow.minimize();
});

ipcMain.on(CLOSE_APP, (event) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender);

  senderWindow.close();
});

ipcMain.on(MAXIMIZE_RESTORE_APP, (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

const createLoginWindow = (): void => {
  // TODO find way how to work with localhost
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    delete responseHeaders['Content-Security-Policy']; // Remove CSP header

    callback({ responseHeaders });
  });

  loginWindow = new BrowserWindow({
    height: 630,
    width: 465,
    frame: false,
    icon: 'src/assets/icon.ico',
    webPreferences: {
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Load the index.html of the app.
  loginWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#${LOGIN}`);

  // Open the DevTools.
  loginWindow.webContents.openDevTools();
};


const createMainWindow = (): void => {
  // TODO find way how to work with localhost
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    delete responseHeaders['Content-Security-Policy']; // Remove CSP header

    callback({ responseHeaders });
  });

  mainWindow = new BrowserWindow({
    height: 630,
    width: 905,
    frame: false,
    icon: 'src/assets/icon.ico',
    webPreferences: {
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createLoginWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on(OPEN_MAIN_WINDOW, () => {
  if (loginWindow) {
    loginWindow.close();
  }

  createMainWindow();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoginWindow();
  }
});

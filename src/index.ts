import { app, BrowserWindow,ipcMain, session,dialog, nativeImage, Tray, Menu } from 'electron';
import {
  CLOSE_APP,
  DOWNLOAD_FILES,
  IS_WINDOW_MAXIMIZED,
  MAXIMIZE_APP,
  MAXIMIZE_RESTORE_APP,
  MINIMIZE_APP,
  OPEN_MAIN_WINDOW,
  UNMAXIMIZE_APP,
  WINDOW_STATE
} from './constants';
import { LOGIN, MAIN } from './constants/routes';
import https from 'https';
import fs from 'fs-extra';
import archiver from 'archiver';
import path from 'path';
import os from 'os';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let loginWindow;
let tray;

function downloadFile(url: string) {
  https.get(url, (response) => {
    const fileName = url.split('/').at(-1);
    const ext = fileName.split('.').at(-1);

    const filePath = dialog.showSaveDialogSync({
      defaultPath: fileName,
      filters: [
        {
          name: ext.toUpperCase(),
          extensions: [ext]
        }
      ]
    });

    if (!filePath) return;

    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
    });
  });
}

function downloadAndZipFiles(urls: string[]) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'download-'));

  const zipPath = dialog.showSaveDialogSync({ defaultPath: 'download', filters: [
      { name: 'ZIP', extensions: [ 'zip' ] },
    ]});

  if (!zipPath) return;

  let downloaded = 0;

  urls.forEach((url: string) => {
    https.get(url, (response) => {
      const fileName = url.split('/').at(-1);

      const tempFilePath = path.join(tempDir, fileName);

      const fileStream = fs.createWriteStream(tempFilePath);

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        if (++downloaded === urls.length) {
          createZipFile(tempDir, zipPath, () => {
            fs.rmdirSync(tempDir, { recursive: true  }); // Cleanup
          });
        }
      });
    });
  });
}

function createZipFile(sourceDir: string, zipPath:string, callback: () => void) {
  const output = fs.createWriteStream(`${zipPath}.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', callback);
  archive.pipe(output);
  archive.directory(sourceDir, false);
  archive.finalize();
}

ipcMain.on(DOWNLOAD_FILES, (event, urls) => {
  if (urls.length === 1) {
    const [firstUrl] = urls;

    downloadFile(firstUrl);
  } else {
    downloadAndZipFiles(urls, event);
  }
});

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

  // hide application
  mainWindow.on('close',event =>  {
    event.preventDefault();
    mainWindow.hide()
  })

  const trayIcon = nativeImage.createFromPath('src/assets/icon.ico');
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));

  tray.setIgnoreDoubleClickEvents(true);

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ]);

  tray.setContextMenu(trayMenu);

  tray.on('click', () => {
    mainWindow.show()
  })

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

app.on('before-quit',  () => {
  tray.destroy();
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

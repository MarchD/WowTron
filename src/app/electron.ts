import { BrowserWindow, ipcMain, dialog } from 'electron';

import {
  CLOSE_APP,
  DOWNLOAD_FILES,
  DOWNLOAD_FILES_FINISH,
  IS_WINDOW_MAXIMIZED,
  MAXIMIZE_APP, MAXIMIZE_RESTORE_APP, MINIMIZE_APP, OPEN_MAIN_WINDOW,
  UNMAXIMIZE_APP,
  WINDOW_STATE
} from '../constants';
import App from './index';
import https from 'https';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import archiver from 'archiver';


export const downloadFile = (url: string, onFinish?: () => void) => {
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
      onFinish?.();
    });
  });
}

export const downloadAndZipFiles = (urls: string[],onFinish?: () => void) => {
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
            onFinish?.()
          });
        }
      });
    });
  });
}

export const createZipFile = (sourceDir: string, zipPath:string, callback: () => void) => {
  const output = fs.createWriteStream(`${zipPath}.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', callback);
  archive.pipe(output);
  archive.directory(sourceDir, false);
  archive.finalize();
}


ipcMain.on(DOWNLOAD_FILES, (event, urls) => {
  const onSuccess = () => event.sender.send(DOWNLOAD_FILES_FINISH, true);

  if (urls.length === 1) {
    const [firstUrl] = urls;

    downloadFile(firstUrl, onSuccess);
  } else {
    downloadAndZipFiles(urls, onSuccess);
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

ipcMain.on(OPEN_MAIN_WINDOW, () => {
  if (App.loginWindow) {
    App.tray.destroy();
    App.loginWindow.close();
  }

  App.openMainWindow()
  App.initTray(App.mainWindow)
})

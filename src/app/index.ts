import { app, BrowserWindow, session, Tray, nativeImage, Menu } from 'electron';
import { LOGIN } from '../constants/routes';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const ICON = 'src/assets/icon.ico';

class App {
  static mainWindow: Electron.BrowserWindow;
  static loginWindow: Electron.BrowserWindow;
  static BrowserWindow: typeof BrowserWindow;
  static application: Electron.App;
  static tray: Electron.Tray;

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private static onReady() {
    App.removeCSPHeader();
    App.initLoginWindow();
    App.loadLoginWindow();
    App.initTray(App.loginWindow)
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.BrowserWindow.getAllWindows().length === 0) {
      App.onReady();
    }
  }

  private static removeCSPHeader() {
    // TODO find way how to work with localhost
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      const responseHeaders = { ...details.responseHeaders };
      delete responseHeaders['Content-Security-Policy']; // Remove CSP header

      callback({ responseHeaders });
    });
  }

  // LOGIN WINDOW
  private static initLoginWindow() {
    App.loginWindow = new BrowserWindow({
      height: 583,
      width: 465,
      minWidth: 330,
      frame: false,
      icon: ICON,
      webPreferences: {
        nodeIntegration: false,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });
  }

  private static loadLoginWindow() {
    App.loginWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#${LOGIN}`);
    App.loginWindow.webContents.openDevTools();
  }

  // MAIN WINDOW
  private static initMainWindow() {
    App.mainWindow = new BrowserWindow({
      height: 630,
      width: 905,
      minWidth: 600,
      frame: false,
      icon: ICON,
      webPreferences: {
        nodeIntegration: false,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });
  }

  private static loadMainWindow() {
    App.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    App.mainWindow.webContents.openDevTools();
  }

  static openMainWindow() {
    App.initMainWindow();
    App.loadMainWindow();
  }

  // TRAY
  static initTray(browserWindow: Electron.BrowserWindow) {
    const trayIcon = nativeImage.createFromPath(ICON);

    App.tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
    App.tray.setIgnoreDoubleClickEvents(true);

    // Should template be here?🤔
    const trayManu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => {
          App.application.quit()
        }
      }
    ]);

    App.tray.setContextMenu(trayManu);
    App.tray.on('click', () => browserWindow.show())
  }

  static onBeforeQuit() {
    App.tray.destroy();
  }

  static initApp(app: Electron.App, browserWindow: typeof BrowserWindow) {
    App.BrowserWindow = browserWindow;
    App.application = app;

    App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on('ready', App.onReady); // App is ready to load data
    App.application.on('activate', App.onActivate);
    App.application.on('before-quit', App.onBeforeQuit)
  }
}

export default App;

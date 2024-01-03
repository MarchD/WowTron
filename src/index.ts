import { app, BrowserWindow } from 'electron';

import App from './app/index';
import './app/electron';
import './app/squirrel';

class Main {
  static bootstrapApp() {
    App.initApp(app, BrowserWindow);
  }
}

Main.bootstrapApp();





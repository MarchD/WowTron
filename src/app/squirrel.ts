import App from './index';

if (require('electron-squirrel-startup')) {
  App.application.quit();
}

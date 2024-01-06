import App from './index';

if (require('electron-squirrel-startup')) {
  if (App.application) {
    App.application.quit();
  }
}

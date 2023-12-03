declare module '*.svg';
declare module '*.css';

interface ElectronBridge {
  minimizeApp: () => void;
  closeApp: () => void;
  maximizeApp: () => void;
  unmaximizeApp: () => void;
  addWindowStateListener: (cb: (isMaximized: boolean) => void) => void;
  isWindowMaximized: () => boolean;
  openMainWindow: () => void;
  navigateTo: (path: string) => void;
  downloadFiles: (urls: string[]) => void;
}

interface Window {
  electron: ElectronBridge;
}

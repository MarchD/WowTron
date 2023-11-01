declare module '*.svg';
declare module '*.css';

interface ElectronBridge {
  minimizeApp: () => void;
  closeApp: () => void;
  maximizeApp: () => void;
  unmaximizeApp: () => void;
  addWindowStateListener: (cb: (isMaximized: boolean) => void) => void;
  isWindowMaximized: () => boolean;
}

interface Window {
  electron: ElectronBridge;
}

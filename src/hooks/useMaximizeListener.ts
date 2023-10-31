import React, { useState, useEffect } from 'react';

export const useMaximizedListener = () => {
  const [isMaximized, setIsMaximized] = useState(window.electron.isWindowMaximized());

  useEffect(() => {
    window.electron.addWindowStateListener((isMaximized: boolean) => {
      console.log(isMaximized,'test')
      setIsMaximized(isMaximized);
    });
  }, []);

  return isMaximized;
}


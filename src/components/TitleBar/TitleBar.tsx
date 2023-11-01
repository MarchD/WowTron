import { HideIcon, FullscreenIcon, CloseIcon, ScreenIcon } from '../icons';
import { memo } from 'react';
import { useMaximizedListener } from '../../hooks/useMaximizeListener';
import styles from './TitleBar.module.css';
import classNames from 'classnames';
const { minimizeApp, closeApp, maximizeApp, unmaximizeApp }  = window.electron;

const TitleBar = () => {
  const isMaximized = useMaximizedListener();

  const buttons = [
    {
      key: 'button-minimize',
      children: <HideIcon />,
      onClick: minimizeApp
    },
    {
      key: 'button-maximized',
      children: isMaximized ? <ScreenIcon/> : <FullscreenIcon/>,
      onClick: isMaximized ? unmaximizeApp : maximizeApp
    },
    {
      key: 'button-close',
      children: <CloseIcon />,
      onClick: closeApp
    },
  ]

  return (
    <div className={classNames('p-2 bg-grey-light flex justify-end gap-x-2', styles.TitleBar)}>
      {
        buttons.map(b => (
          <button
            className="p-1 rounded transition-colors hover:bg-grey/30"
            onClick={minimizeApp}
            {...b}
          />
        ))
      }
    </div>
  );
};

export default memo(TitleBar);

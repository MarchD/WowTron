import { HideIcon, FullscreenIcon, CloseIcon, ScreenIcon } from '../icons';
import { memo } from 'react';
import { useMaximizedListener } from '../../hooks/useMaximizeListener';
import styles from './TitleBar.module.css';
import classNames from 'classnames';
import ButtonIcon from '../ButtonIcon';
const { minimizeApp, closeApp, maximizeApp, unmaximizeApp } = window.electron;

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
    <div className="p-2 h-12 flex justify-end gap-x-2 bg-white border-b border-b-grey-light">
      <div className={classNames('flex-grow', styles.DragArea)}/>
      {buttons.map(b => <ButtonIcon onClick={minimizeApp} {...b}/>)}
    </div>
  );
};

export default memo(TitleBar);

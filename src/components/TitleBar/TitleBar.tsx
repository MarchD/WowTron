import { HideIcon, FullscreenIcon, CloseIcon } from '../icons';
import { memo } from 'react';
// TODO add types
const { minimizeApp, closeApp, maximizeApp }  = window.electron;

const TitleBar = () => {
  const buttons = [
    {
      key: 'button-minimize',
      children: <HideIcon />,
      onClick: minimizeApp
    },{
      key: 'button-1',
      children: <FullscreenIcon />,
      onClick: maximizeApp
    },{
      key: 'button-2',
      children: <CloseIcon />,
      onClick: closeApp
    },
  ]

  return (
    <div className="p-2 bg-grey-light flex justify-end gap-x-2">
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

import { ButtonHTMLAttributes, FC, memo } from 'react';
import classNames from 'classnames';

const ButtonIcon: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className,  ...props }) => (
  <button
    className={classNames(
      'p-1 rounded-md transition-colors',
      'hover:bg-grey/30',
      'disabled:bg-grey text-grey-dark',
      { [className]: className })}
    {...props}
  />
);

export default memo(ButtonIcon);

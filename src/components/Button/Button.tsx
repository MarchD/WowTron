import { ButtonHTMLAttributes, FC, memo } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary'
}

const Button: FC<ButtonProps> = ({ color = 'primary',className,  ...props }) => (
  <button
    className={classNames(
      'px-4',
      'py-2',
      'text-[13px]',
      'rounded-md',
      'disabled:bg-grey text-grey-dark',
      {
        ['text-white bg-purple']: color === 'primary',
        ['text-purple bg-grey-light']: color === 'secondary',
        [className]: className
      })}
    {...props}
  />
);

export default memo(Button);

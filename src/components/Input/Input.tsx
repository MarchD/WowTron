import { FC, InputHTMLAttributes, memo, useId } from 'react';
import classNames from 'classnames';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>{
  error?: boolean;
  helperText?: string;
  label?: string;
}

const Input: FC<InputProps> = ({ error, helperText, label = 'label', className, ...props}) => {
  const id = useId();

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className={classNames('block mb-2 text-[13px] text-purple', error ? 'text-error' : 'text-purple')}
        >
          {label}
        </label>
      )}

      <div className="relative  rounded-md shadow-sm">
        <input
          {...props}
          id={id}
          className={classNames(
            'block w-full py-3 px-4 text-[13px] rounded-md border-0 ring-1 ring-inset focus:ring-2 focus:ring-inset focus-visible:outline-none placeholder:text-gray',
            error ? 'text-error ring-error' : ' text-black ring-grey',
          )}
        />

        {helperText && (
          <p className={classNames('py-1 text-xs', error ? 'text-error' : 'text-grey-dark')}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(Input);

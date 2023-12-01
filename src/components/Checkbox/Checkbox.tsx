import { memo, ComponentProps, FC, useMemo } from 'react';
import { SelectedIcon,PartiallyIcon,UnselectedIcon } from '../icons';

interface CheckboxProps extends Omit<ComponentProps<'input'>,'type'> {
  indeterminate?:boolean;
}

const Checkbox: FC<CheckboxProps> = ({ indeterminate, checked, className, ...props }) => {
  const icon = useMemo(() => [
    checked && <SelectedIcon />,
    indeterminate && !checked && <PartiallyIcon/>,
    !indeterminate && !checked && <UnselectedIcon />
  ], [indeterminate, checked])

  return (
    <label className="cursor-pointer">
      <input className="hidden" type="checkbox"  checked={checked || indeterminate} {...props}/>
      {icon}
    </label>
  );
}

export default memo(Checkbox);

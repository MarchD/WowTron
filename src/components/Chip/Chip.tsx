import { FC, memo } from 'react';

interface ChipProps {
  label: string
}

const Chip: FC<ChipProps> = ({ label }) => (
  <div className="px-2 py-1 text-[10px] text-orange bg-orange/10 rounded-md h-fit">
    {label}
  </div>
);

export default memo(Chip);

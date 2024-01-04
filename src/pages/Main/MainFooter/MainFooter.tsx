import { FC, memo } from 'react';
import Chip from '../../../components/Chip';
import Button from '../../../components/Button';
import { CheckIcon } from '../../../components/icons';

interface MainFooterProps {
  selectedCount: number
  onDownload: () => void;
  isFinishDownload?: boolean;
}

const MainFooter: FC<MainFooterProps> = ({ onDownload, selectedCount, isFinishDownload }) => (
  <div className="flex justify-between items-center h-14 px-3 bg-white">
    <Chip label={`${selectedCount} Selected`}/>

    {
      isFinishDownload ? (
        <p className="flex items-center gap-2 font-bold text-success text-[13px]">
          <CheckIcon/> {selectedCount === 1 ? 'File' : 'Files'} downloaded
        </p>
      ) : (
        <Button disabled={!selectedCount} className="px-5 py-3" onClick={onDownload}>
          Download
        </Button>
      )
    }
  </div>
);

export default memo(MainFooter);

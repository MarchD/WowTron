import { FC, memo } from 'react';
import Chip from '../../../components/Chip';
import Button from '../../../components/Button';

interface MainFooterProps {
  selectedCount: number
  onDownload: () => void;
}

const MainFooter: FC<MainFooterProps> = ({ onDownload, selectedCount }) => (
  <div className="flex justify-between items-center py-2 px-3 bg-white">
    <Chip label={`${selectedCount} Selected`}/>

    <Button disabled={!selectedCount} className="px-5 py-3" onClick={onDownload}>
      Download
    </Button>
  </div>
);

export default memo(MainFooter);

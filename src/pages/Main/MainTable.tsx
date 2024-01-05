import React, { FC, memo, useCallback, useMemo } from 'react';
import Header from '../../components/Header';
import FilesTable from './FilesTable';
import MainFooter from './MainFooter';
import { ItemType } from '../../types';

interface MainTableProps {
  data: ItemType[];
  isLoading?: boolean;
  handleDownload:() => void;
  isFinishDownload?: boolean;
  onLogout: () => void;
  onSelectRow?: () => void;
  onOpenFolder?: (id: number) => void;
  accountInfo: string[];
  onBack?: () => void;
  selectedCount: number
}

const MainTable: FC<MainTableProps> = ({
  onBack,
  accountInfo,
  onLogout,
  onOpenFolder,
  handleDownload,
  isLoading,
  data,
  isFinishDownload,
  onSelectRow,
  selectedCount
}) => (
  <div className="flex flex-col justify-between grow">
    <div>
      <Header accountInfo={accountInfo} onBack={onBack} onLogout={onLogout}/>
      <div className="mx-6 my-3">
        <FilesTable
          isLoading={isLoading}
          data={data}
          onSelectRow={onSelectRow}
          onOpenFolder={onOpenFolder}
        />
      </div>
    </div>

    <MainFooter
      isFinishDownload={isFinishDownload}
      selectedCount={selectedCount}
      onDownload={handleDownload}
    />
  </div>
);

export default memo(MainTable);

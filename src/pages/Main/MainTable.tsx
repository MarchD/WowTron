import React, { FC, memo, useCallback, useMemo } from 'react';
import Header from '../../components/Header';
import FilesTable from './FilesTable';
import MainFooter from './MainFooter';
import { ItemType } from '../../types';
import { useTable } from '../../components/Table/context';

interface MainTableProps {
  data: ItemType[];
  isLoading?: boolean;
  handleDownload:(ids:number[])=>void;
  isFinishDownload?: boolean;
  onSelectRow?: () => void;
  onOpenFolder?: (id: number) => void;
  accountInfo: string[];
}

const MainTable: FC<MainTableProps> = ({ accountInfo, onOpenFolder, handleDownload, isLoading, data, isFinishDownload, onSelectRow }) => {
  const { selectedIds = [] } = useTable();
  const selectedCount = useMemo(() => selectedIds.length, [selectedIds]);

  const onDownload = useCallback(() => {
    handleDownload(selectedIds);
  }, [selectedIds]);

  return (
    <div className="flex flex-col justify-between grow">
      <div>
        <Header accountInfo={accountInfo} />
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
        onDownload={onDownload}
      />
    </div>
  );
};

export default memo(MainTable);

import React, { FC, memo, useCallback, useMemo } from 'react';
import Header from '../../components/Header';
import FilesTable from './FilesTable';
import MainFooter from './MainFooter';
import { FileType } from '../../types';
import { useTable } from '../../components/Table/context';

interface MainTableProps {
  data: FileType[];
  isLoading?: boolean;
  handleDownload:(ids:number[])=>void;
}

const MainTable: FC<MainTableProps> = ({ handleDownload, isLoading, data }) => {
  const { selectedIds = [] } = useTable();
  const selectedCount = useMemo(() => selectedIds.length, [selectedIds]);

  const onDownload = useCallback(() => {
    handleDownload(selectedIds);
  }, [selectedIds]);

  return (
    <div className="flex flex-col justify-between grow">

      <div>
        <Header accountInfo="Account"/>
        <div className="mx-6 my-3">
          <FilesTable isLoading={isLoading} data={data}/>
        </div>
      </div>

      <MainFooter selectedCount={selectedCount} onDownload={onDownload}/>
    </div>
  );
};

export default memo(MainTable);

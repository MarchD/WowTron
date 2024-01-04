import { TableProvider } from '../../components/Table/TableProvider';
import { memo, useCallback, useState } from 'react';
import useFiles from '../../hooks/api/useFiles';
import MainTable from './MainTable';

const { downloadFiles, onFinishDownloadFiles } = window.electron;

const Main = () => {
  const { data, isLoading } = useFiles();
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);

  const handleDownload = useCallback((ids: number[]) => {
    const files = data?.filter(d => ids.includes(d.id))?.map(f => f.uri)
    downloadFiles(files)

    onFinishDownloadFiles(setIsSuccess)
  }, [data]);

  const onSelectRow = () => {
    setIsSuccess(false);
  }

  return (
    <TableProvider>
      <MainTable
        data={data}
        handleDownload={handleDownload}
        isLoading={isLoading}
        onSelectRow={onSelectRow}
        isFinishDownload={isSuccess}
      />
    </TableProvider>
  );
};

export default memo(Main);

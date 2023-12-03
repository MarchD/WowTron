import { TableProvider } from '../../components/Table/TableProvider';
import { memo, useCallback } from 'react';
import useFiles from '../../hooks/api/useFiles';
import MainTable from './MainTable';

const { downloadFiles } = window.electron;

const Main = () => {
  const { data, isLoading } = useFiles();

  const handleDownload = useCallback((ids: number[]) => {
    const files = data?.filter(d => ids.includes(d.id))?.map(f => f.uri)
    downloadFiles(files);
  }, [data]);

  return (
    <TableProvider>
      <MainTable data={data} handleDownload={handleDownload} isLoading={isLoading}/>
    </TableProvider>
  );
};

export default memo(Main);

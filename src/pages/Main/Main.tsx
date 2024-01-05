import { TableProvider } from '../../components/Table/TableProvider';
import { memo, useCallback, useMemo, useState } from 'react';
import useFiles from '../../hooks/api/useFiles';
import MainTable from './MainTable';
import useFolder from '../../hooks/api/useFolder';

const { downloadFiles, onFinishDownloadFiles } = window.electron;

const Main = () => {
  const { data, isLoading } = useFiles();
  const [foldersStack, setFoldersStack] = useState([]);
  const [getFolder, { data: folderData }] = useFolder();
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);

  const handleDownload = useCallback((ids: number[]) => {
    const files = data?.filter(d => ids.includes(d.id))?.map(f => f.uri)
    downloadFiles(files)

    onFinishDownloadFiles(setIsSuccess)
  }, [data]);
  const onSelectRow = () => {
    setIsSuccess(false);
  }

  const onOpenFolder = useCallback((folderId: number) => {
    getFolder({ folderId })
    .then(r => setFoldersStack(current => [...current, r]));
  }, [getFolder]);

  const accountInfo = useMemo(() => {
    return ['Account', ...foldersStack?.map(f => f?.name) ?? []];
  }, [foldersStack]);

  const onBack = useCallback(() => {
    if (!!foldersStack.length) {
      const previousFolder = foldersStack.at(-2);

      if (previousFolder) {
        getFolder({folderId: previousFolder.id});
      }

      setFoldersStack(current => current.splice(0, -1));
    }
  }, [foldersStack])

  return (
    <TableProvider>
      <MainTable
        onBack={onBack}
        accountInfo={accountInfo}
        data={(!!foldersStack.length && folderData?.files) || data}
        handleDownload={handleDownload}
        isLoading={isLoading}
        onSelectRow={onSelectRow}
        isFinishDownload={isSuccess}
        onOpenFolder={onOpenFolder}
      />
    </TableProvider>
  );
};

export default memo(Main);

import { TableProvider } from '../../components/Table/TableProvider';
import { memo, useCallback, useMemo, useState } from 'react';
import useFiles from '../../hooks/api/useFiles';
import MainTable from './MainTable';
import useFolder from '../../hooks/api/useFolder';
import { ItemType } from '../../types';
import { useTable } from '../../components/Table/context';

const { downloadFiles, onFinishDownloadFiles,openLoginWindow } = window.electron;

const findUris = (data: ItemType[], ids: number[])=> data?.filter(d => ids.includes(d.id))?.map(f => f.uri);
const Main = () => {
  const { data, isLoading } = useFiles();
  const [foldersStack, setFoldersStack] = useState([]);
  const [getFolder, { data: folderData }] = useFolder();
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
  const { clearSelectedIds, selectedIds } = useTable();

  const clearSuccessMessage = useCallback(() => {
    setTimeout(() => {
      setIsSuccess(false)
    }, 2000)
  }, [])

  const handleDownload = useCallback(() => {
    const files = foldersStack?.length ? findUris(foldersStack.at(-1)?.files, selectedIds) : findUris(data,selectedIds);

    downloadFiles(files)

    onFinishDownloadFiles((isSuccess) => {
      setIsSuccess(isSuccess);
      clearSelectedIds();
      clearSuccessMessage();
    })
  }, [data, foldersStack, selectedIds]);

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
  }, [foldersStack]);

  const selectedCount = useMemo(() => selectedIds.length, [selectedIds]);

  return (
    <MainTable
      onLogout={openLoginWindow}
      onBack={onBack}
      accountInfo={accountInfo}
      data={(!!foldersStack.length && folderData?.files) || data}
      handleDownload={handleDownload}
      isLoading={isLoading}
      onSelectRow={onSelectRow}
      isFinishDownload={isSuccess}
      onOpenFolder={onOpenFolder}
      selectedCount={selectedCount}
    />
  );
};

const MainPage = () => (
  <TableProvider>
    <Main/>
  </TableProvider>
);

export default memo(MainPage);

import Table from '../../../components/Table';
import { ItemType } from '../../../types';
import { Column } from '../../../components/Table/types';
import { getFileName } from '../../../utils';
import { EmptyFolderIcon, FileIcon, FolderIcon } from '../../../components/icons';
import dayjs from 'dayjs';
import { FC, memo, useMemo } from 'react';
import { isFolder } from '../guards';
import classNames from 'classnames';

interface FilesTableProps {
  isLoading?: boolean;
  data: ItemType[];
  onSelectRow?: () => void;
  onOpenFolder?: (id: number) => void;
}

const FilesTable: FC<FilesTableProps> = ({ data, isLoading, onSelectRow, onOpenFolder }) => {
  const columns: Column<ItemType>[] = useMemo(() => [
    {
      headerName: 'Name',
      field: 'uri',
      width: '100%',
      headerClassName: 'pl-10',
      renderCell: (row) => {
        const isFolderRow = isFolder(row);
        const isEmptyFolder = !!row.files;

        return (
          <div
            {...isFolderRow && { onClick: () => onOpenFolder?.(row.id) }}
            className={classNames("flex gap-2 items-center text-black",{ 'cursor-pointer': isFolderRow})}
          >
            {isFolderRow
              ? <>{isEmptyFolder ? <EmptyFolderIcon className="w-8 h-8"/> : <FolderIcon className="w-8 h-8"/>}</>
              : <FileIcon className="w-8 h-8"/>
            }
            {isFolderRow ? row.name : getFileName(row.uri)}
          </div>
        )
      }
    },
    {
      headerName: 'Size',
      field: 'size',
      width: 204
    },
    {
      headerName: 'Upload Date',
      field: 'created',
      width: 162,
      renderCell: (row) =>  (
        <div>
          {dayjs(row.created).format('DD.MM.YYYY HH:mm')}
        </div>
      )
    },
  ], [onOpenFolder]);

  return (
    <Table<ItemType>
      isLoading={isLoading}
      checkboxSelection
      columns={columns}
      rows={data ?? []}
      onSelectRow={onSelectRow}
    />
  )
};

export default memo(FilesTable);

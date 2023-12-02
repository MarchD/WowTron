import useFiles from '../../../hooks/api/useFiles';
import Table from '../../../components/Table';
import { TableProvider } from '../../../components/Table/TableProvider';
import { FileType } from '../../../types';
import { Column } from '../../../components/Table/types';
import { getFileName } from '../../../utils';
import { FileIcon } from '../../../components/icons';
import dayjs from 'dayjs';

const columns: Column<FileType>[] = [
  {
    headerName: 'Name',
    field: 'uri',
    width: '100%',
    headerClassName: 'pl-10',
    renderCell: (row) => (
      <div className="flex gap-2 items-center text-black">
        <FileIcon className="w-8 h-8"/>
        {getFileName(row.uri)}
      </div>
    )
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
];

const FilesTable = () => {
  const { data, isLoading } = useFiles();

  return (
    <TableProvider>
      <Table<FileType>
        isLoading={isLoading}
        checkboxSelection
        columns={columns}
        rows={data ?? []}
      />
    </TableProvider>
  );
};

export default FilesTable;
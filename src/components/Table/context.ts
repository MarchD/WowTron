import { createContext, useContext } from 'react';

import { Row } from './types';

export const TableContext = createContext<{
  selectedRows: Row<any>[]
  handleRowSelection: (row: Row<any>) => void
  selectAllRows: (rows: Row<any>[]) => void
  selectedIds: number[]
  clearSelectedIds: () => void
}>({
  selectedRows: [],
  handleRowSelection: () => {},
  selectAllRows: () => {},
  selectedIds: [],
  clearSelectedIds: () => {}
})

export const useTable = () => useContext(TableContext)

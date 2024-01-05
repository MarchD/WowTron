import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import { TableContext } from './context';
import { Row } from './types';

export const TableProvider: FC<{children: ReactNode}> = ({children}) => {
  const [selectedRows, setSelectedRows] = useState<Row<any>[]>([])

  const selectedIds = useMemo(() => selectedRows.map(({id}) => id), [selectedRows])

  const handleRowSelection = useCallback((row: Row<any>) => {
    setSelectedRows((current) => {
      if (current.some((selectedRow) => selectedRow.id === row.id)) {
        return current.filter((selectedRow) => selectedRow.id !== row.id)
      }

      return [...current, row]
    })
  }, [])

  const selectAllRows = useCallback((rows: Row<any>[]) => {
    setSelectedRows((current) => (current.length ? [] : rows))
  }, [])

  const clearSelectedIds = useCallback(() => {
    setSelectedRows([])
  }, [])

  const value = useMemo(
    () => ({
      selectedRows,
      handleRowSelection,
      selectAllRows,
      selectedIds,
      clearSelectedIds
    }),
    [selectedRows],
  )

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}

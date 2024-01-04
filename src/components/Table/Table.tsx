import React, { memo, ReactElement, useCallback, useMemo } from 'react';

import { useTable } from './context';
import { Column, DataGridProps, Row } from './types';

import classNames from 'classnames';
import Checkbox from '../Checkbox';

export const TableComponent = <T extends Record<string, any>>({
  columns,
  rows,
  isLoading,
  className,
  checkboxSelection,
  onSelectRow
}: DataGridProps<T>) => {
  const {handleRowSelection, selectedRows, selectAllRows} = useTable()

  const selectAll = useCallback(
    () => selectAllRows(rows),
    [rows, selectAllRows],
  )

  return (
    <div className={classNames({[className!]: className})}>
      <TableHeader
        columns={columns}
        selectAll={checkboxSelection ? selectAll : undefined}
        isSelectedAll={selectedRows.length === rows.length}
        isSomeSelected={Boolean(selectedRows.length)}
      />

      {!rows.length && !isLoading && <p className="my-3 text-center">No data</p>}

      {rows.map((row: Row<T>) => (
        <TableRow
          key={row.id}
          row={row}
          columns={columns}
          checked={selectedRows.some((r) => row.id === r.id)}
          onCheck={() => {
            handleRowSelection(row);
            onSelectRow?.();
          }}
          withCheckbox={checkboxSelection}
        />
      ))}

      {isLoading && (
        <div className="my-3 text-center">
          Loading...
        </div>
      )}
    </div>
  )
}

const TableHeader = memo(
  ({
    columns,
    selectAll,
    isSelectedAll,
    isSomeSelected,
  }: {
    columns: Column<any>[]
    selectAll?: (rows: Row<any>) => void
    isSelectedAll?: boolean
    isSomeSelected?: boolean
  }) => {

    return (
      <div className="flex gap-2 items-center py-0.5 px-3 mb-0.5">
        {selectAll && (
          <Checkbox
            checked={isSelectedAll}
            indeterminate={isSomeSelected}
            onChange={selectAll}
          />
        )}
        {columns.map((column) => (
          <div
            className={classNames("min-w-[150px] max-w-[150px] w-full text-grey-dark text-[10px]", {[column.headerClassName!]: column.headerClassName})}
            key={column.headerName}
            style={{maxWidth: column.width}}
          >
            <p>{column.headerName}</p>
          </div>
        ))}
      </div>
    )
  },
)

const TableRow = memo(
  ({
    withCheckbox,
    checked,
    onCheck,
    columns,
    row,
  }: {
    withCheckbox?: boolean
    checked?: boolean
    onCheck?: () => void
    columns: Column<any>[]
    row: Row<any>
  }) => (
    <div className="flex gap-2 items-center py-0.125 px-3 rounded even:bg-black/5">
      {withCheckbox && <Checkbox checked={checked} onChange={onCheck}/>}

      {columns.map((column, index) => (
        <TableCell
          key={index}
          row={row}
          renderCell={column.renderCell}
          field={column.field}
          width={column.width}
        />
      ))}
    </div>
  ),
)

const TableCell = memo(
  ({
    row,
    field,
    renderCell,
    width = 150,
  }: {
    row: Row<any>
    field: string
    renderCell?: (row: Row<any>) => JSX.Element | null | string
    width?: string | number
  }) => {
    const cellValue = row[field]
    const cellKey = `${row.id}-${field}`
    const style = useMemo(() => ({
      maxWidth: width,
    }), [width])

    return (
      <div
        className="w-full text-grey-dark text-[13px]"
        key={cellKey}
        style={style}
      >
        {renderCell ? renderCell?.(row) : cellValue}
      </div>
    )
  },
)

export const Table = memo(TableComponent) as <T extends Record<string, any>>(
  props: DataGridProps<T>,
) => ReactElement

/**

 @typedef {object} Row - Represents a row in the data grid
 @property {string|number} id - The unique identifier of the row
 */
export type Row<T> = T & {
  id: string | number
}
/**

 @typedef {object} SectionRow - Represents a row in the data grid with a section
 @property {string} section - The name of the section
 */
export type SectionRow<T> = Row<T> & {section: string}

/**

 @typedef {object} Column - Represents a column in the data grid
 @property {string} field - The name of the field to be rendered
 @property {string} headerName - The title of the column
 @property {number|string|undefined} width - The width of the column
 @property {function(Row): (JSX.Element|string|null)|undefined} renderCell - A function to render the cell of the row
 @property {string|undefined} headerClassName - A class name to be added to the header of the column
 */
export interface Column<T> {
  field: string
  headerName: string
  width?: number | string
  renderCell?: (row: Row<T>) => JSX.Element | string | null
  headerClassName?: string
}

/**

 @typedef {object} DataGridBase - Represents the common props of the data grid
 @property {Column[]} columns - An array of Column objects
 @property {string|undefined} sectionName - The name of the section
 @property {boolean|undefined} isLoading - A flag indicating if the grid is loading
 @property {string|undefined} className - A class name to be added to the data grid
 @property {boolean|undefined} checkboxSelection - A flag indicating if the grid has checkbox selection enabled
 */
interface DataGridBase<T> {
  columns: Column<T>[]
  sectionName?: string
  isLoading?: boolean
  className?: string
  checkboxSelection?: boolean
}

/**

 @typedef {object} DataGridDefault - Represents the props of the data grid with no sections
 @property {Row[]} rows - An array of Row objects
 @property {boolean|undefined} withSubheaders - A flag indicating if the grid has subheaders
 */
interface DataGridDefault<T> extends DataGridBase<T> {
  rows: Row<T>[]
  withSubheaders?: never
}

/**

 @typedef {DataGridDefault} DataGridProps - Represents the props of the data grid
 */
export type DataGridProps<T> = DataGridDefault<T>

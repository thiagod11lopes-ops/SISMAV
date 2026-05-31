import type { ReactNode } from 'react'
import './DataTable.css'

export interface Column<T> {
  key: keyof T | string
  header: ReactNode
  render?: (row: T) => ReactNode
}

interface DataTableProps<T extends object> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  wrapperClassName?: string
  tableClassName?: string
  emptyClassName?: string
}

export function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = 'Nenhum registro encontrado.',
  wrapperClassName = '',
  tableClassName = '',
  emptyClassName = '',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <p className={`data-table__empty${emptyClassName ? ` ${emptyClassName}` : ''}`}>
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className={`data-table__wrapper${wrapperClassName ? ` ${wrapperClassName}` : ''}`}>
      <table className={`data-table${tableClassName ? ` ${tableClassName}` : ''}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={'id' in row && row.id ? String(row.id) : i}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

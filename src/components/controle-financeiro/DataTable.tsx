import styles from './DataTable.module.css';
import { ActionButtons } from './ActionButtons';
import type { DataTableColumn } from '../../pages/ControleFinanceiro/types';

interface DataTableProps<T extends { id: string }> {
  id: string;
  columns: DataTableColumn<T>[];
  data: T[];
}

export const DataTable = <T extends { id: string }>({ id, columns, data }: DataTableProps<T>) => {
  return (
    <div className={styles.tableContainer}>
      <table id={id} className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={column.align ? styles[column.align] : ''}
              >
                {column.label}
              </th>
            ))}
            <th>Ações</th> {/* Always add an actions column */}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={column.align ? styles[column.align] : ''}
                >
                  {String(row[column.key])}
                </td>
              ))}
              <td className={styles.actionsCell}>
                <ActionButtons id={row.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className={styles.noData}>Nenhum dado para exibir.</p>}
    </div>
  );
};

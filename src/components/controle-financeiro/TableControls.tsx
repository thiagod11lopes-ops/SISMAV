import React from 'react';
import styles from './TableControls.module.css';
// Assuming you have an Icon for search, e.g., from react-icons
// import { FaSearch } from 'react-icons/fa';

interface TableControlsProps {
  idPrefix: string;
}

export const TableControls: React.FC<TableControlsProps> = ({ idPrefix }) => {
  // Mock data for year and month selects
  const years = ['Todos', '2024', '2025', '2026'];
  const months = [
    'Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  return (
    <div className={styles.controls}>
      <select id={`${idPrefix}Ano`}>
        {years.map((year) => (
          <option key={year} value={year === 'Todos' ? '' : year}>
            {year}
          </option>
        ))}
      </select>

      <select id={`${idPrefix}Mes`}>
        {months.map((month) => (
          <option key={month} value={month === 'Todos' ? '' : month}>
            {month}
          </option>
        ))}
      </select>

      <div className={styles.searchContainer}>
        <input
          type="text"
          id={`${idPrefix}Search`}
          placeholder="Buscar..."
          className={styles.searchInput}
        />
        <button id={`${idPrefix}SearchBtn`} className={styles.searchButton} type="button">
          {/* <FaSearch /> */}
          Buscar
        </button>
      </div>

      <button id={`${idPrefix}ClearBtn`} className={styles.clearButton} type="button">
        Limpar
      </button>
    </div>
  );
};

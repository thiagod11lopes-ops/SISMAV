import React from 'react';
import styles from './ActionButtons.module.css';

interface ActionButtonsProps {
  id: string; // Placeholder for the item ID
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ id }) => {
  return (
    <div className={styles.actions}>
      <button className={`${styles.button} ${styles.edit}`} onClick={() => alert(`Editar item ${id}`)}>
        Editar
      </button>
      <button className={`${styles.button} ${styles.delete}`} onClick={() => alert(`Excluir item ${id}`)}>
        Excluir
      </button>
    </div>
  );
};

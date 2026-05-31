import React from 'react';
import styles from './EditModal.module.css';

interface EditModalProps {
  isOpen: boolean;
  title?: string;
  onClose?: () => void;
  onSave?: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  title = 'Editar',
  onClose = () => {},
  onSave = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 id="editModalTitle" className={styles.title}>{title}</h3>
        <div id="editModalBody" className={styles.body}>
          {/* Mock fields for demonstration */}
          <label className={styles.field}>
            <span>Campo 1</span>
            <input type="text" placeholder="Valor do Campo 1" />
          </label>
          <label className={styles.field}>
            <span>Campo 2</span>
            <input type="text" placeholder="Valor do Campo 2" />
          </label>
        </div>
        <div className={styles.actions}>
          <button id="editModalSave" className={styles.saveButton} onClick={onSave}>
            Salvar
          </button>
          <button id="editModalCancel" className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

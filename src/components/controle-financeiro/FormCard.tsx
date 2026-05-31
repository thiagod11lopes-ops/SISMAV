import React from 'react';
import styles from './FormCard.module.css';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

export const FormCard: React.FC<FormCardProps> = ({ title, children }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </div>
  );
};

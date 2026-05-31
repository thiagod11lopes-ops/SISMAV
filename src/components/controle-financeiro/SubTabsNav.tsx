import React from 'react';
import styles from './SubTabsNav.module.css';
import type { SubTabId } from '../../pages/ControleFinanceiro/types';

interface SubTabsNavProps {
  activeTab: SubTabId;
  onTabChange: (tab: SubTabId) => void;
}

export const SubTabsNav: React.FC<SubTabsNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: SubTabId; label: string }[] = [
    { id: 'controle', label: 'Cadastro de Contrato e Solemp' },
    { id: 'faturamento', label: 'Faturamento de Serviços' },
    { id: 'resumo', label: 'Resumo Financeiro' },
  ];

  return (
    <div className={styles.subTabsContainer}>
      <nav className={styles.subTabsNav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

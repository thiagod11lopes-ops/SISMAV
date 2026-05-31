import React, { useState } from 'react';
import { SubTabsNav } from '../../components/controle-financeiro/SubTabsNav';
import { ContratosSolempTab } from '../../components/controle-financeiro/ContratosSolempTab';
import { FaturamentoServicosTab } from '../../components/controle-financeiro/FaturamentoServicosTab';
import { ResumoFinanceiroTab } from '../../components/controle-financeiro/ResumoFinanceiroTab';
import { EditModal } from '../../components/controle-financeiro/EditModal';
import type { SubTabId } from './types';
import styles from './ControleFinanceiroPage.module.css';

export const ControleFinanceiroPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('controle');

  // For demonstration, EditModal is always closed.
  // In a real scenario, this would be controlled by state.
  const isEditModalOpen = false; 

  return (
    <div className={styles.container}>
      {/* SubTabsNav for switching between sections */}
      <SubTabsNav activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {/* Conditionally render the active sub-tab content */}
      <div className={styles.tabContent}>
        {activeSubTab === 'controle' && <ContratosSolempTab />}
        {activeSubTab === 'faturamento' && <FaturamentoServicosTab />}
        {activeSubTab === 'resumo' && <ResumoFinanceiroTab />}
      </div>

      {/* EditModal, always in DOM but hidden by isOpen prop */}
      <EditModal isOpen={isEditModalOpen} />
    </div>
  );
};

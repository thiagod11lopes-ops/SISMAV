import React from 'react';
import { FormCard } from '../../components/controle-financeiro/FormCard';
import { TableControls } from '../../components/controle-financeiro/TableControls';
import { DataTable } from '../../components/controle-financeiro/DataTable';
import type { Contrato, Solemp, Faturamento, DataTableColumn } from '../../pages/ControleFinanceiro/types';
import { mockEmpenhos, mockSolemps, mockFaturamentos } from '../../pages/ControleFinanceiro/mockData';
import styles from './ResumoFinanceiroTab.module.css';

export const ResumoFinanceiroTab: React.FC = () => {
  // Define columns for Contratos table
  const empenhoColumns: DataTableColumn<Contrato>[] = [
    { key: 'numero', label: 'Número' },
    { key: 'data', label: 'Data' },
    { key: 'valorTotal', label: 'Valor Total', align: 'right' },
    { key: 'valorGasto', label: 'Valor Gasto', align: 'right' },
    { key: 'saldo', label: 'Saldo', align: 'right' },
  ];

  // Define columns for Solemps table
  const solempColumns: DataTableColumn<Solemp>[] = [
    { key: 'numero', label: 'Nº Solemp' },
    { key: 'contratoNumero', label: 'Nº Contrato' },
    { key: 'data', label: 'Data' },
    {
      key: 'valorTotal',
      label: 'Valor Total',
      align: 'right',
    },
    {
      key: 'valorGasto',
      label: 'Valor Gasto',
      align: 'right',
    },
    { key: 'saldo', label: 'Saldo', align: 'right' },
  ];

  // Define columns for Faturamentos table
  const faturamentoColumns: DataTableColumn<Faturamento>[] = [
    { key: 'numero', label: 'Número' },
    { key: 'data', label: 'Data' },
    { key: 'valor', label: 'Valor', align: 'right' },
    { key: 'solempUtilizada', label: 'Solemp Utilizada' },
  ];

  return (
    <div className={styles.container}>
      {/* SUB-ABA 3: Card único — "Resumo Financeiro Completo" */}
      <FormCard title="Resumo Financeiro Completo">
        <div className={styles.section}>
          <h3>Contratos</h3>
          <TableControls idPrefix="empenho" />
          <DataTable id="empenhosTable" columns={empenhoColumns} data={mockEmpenhos} />
        </div>

        <div className={styles.section}>
          <h3>Solemps</h3>
          <TableControls idPrefix="solemp" />
          <DataTable id="solempsTable" columns={solempColumns} data={mockSolemps} />
        </div>

        <div className={styles.section}>
          <h3>Faturamentos</h3>
          <TableControls idPrefix="faturamento" />
          <DataTable id="faturamentosTable" columns={faturamentoColumns} data={mockFaturamentos} />
        </div>
      </FormCard>
    </div>
  );
};

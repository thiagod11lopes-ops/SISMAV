import React from 'react';
import { FormCard } from '../../components/controle-financeiro/FormCard';
import styles from './ContratosSolempTab.module.css';

export const ContratosSolempTab: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* SUB-ABA 1: Card 1 — Formulário "Adicionar Contrato" */}
      <FormCard title="Adicionar Contrato">
        <form id="empenhoForm">
          <label>
            <span>Número do Contrato</span>
            <input type="text" id="empenhoNumero" placeholder="Número do contrato" />
          </label>
          <label>
            <span>Data do Contrato</span>
            <input type="date" id="empenhoData" />
          </label>
          <label>
            <span>Valor Total do Contrato</span>
            <input type="text" id="empenhoValor" placeholder="R$ 0,00" />
          </label>
          <button type="button">Adicionar Contrato</button>
        </form>
      </FormCard>

      {/* SUB-ABA 1: Card 2 — Formulário "Adicionar Solemp" */}
      <FormCard title="Adicionar Solemp">
        <form id="solempForm">
          <label>
            <span>Adicionar Solemp ao Contrato:</span>
            <select id="solempEmpenho">
              <option value="">-- Selecione um contrato --</option>
            </select>
          </label>
          <label>
            <span>Número da Solemp</span>
            <input type="text" id="solempNumero" placeholder="Número da solemp" />
          </label>
          <label>
            <span>Data da Solemp</span>
            <input type="date" id="solempData" />
          </label>
          <label>
            <span>Valor da Solemp</span>
            <input type="text" id="solempValor" placeholder="R$ 0,00" />
          </label>
          <button type="button">Adicionar Solemp</button>
        </form>
      </FormCard>
    </div>
  );
};

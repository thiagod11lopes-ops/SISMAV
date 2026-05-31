import React from 'react';
import { FormCard } from '../../components/controle-financeiro/FormCard';
import styles from './FaturamentoServicosTab.module.css';

// Assuming you have an Icon for check/success, e.g., from react-icons
// import { FaCheckCircle } from 'react-icons/fa';

export const FaturamentoServicosTab: React.FC = () => {
  const faturamentoOptions = Array.from({ length: 10 }, (_, i) => `${i + 1}° Faturamento`);

  return (
    <div className={styles.container}>
      {/* SUB-ABA 2: Card único — "Gerar Faturamento de Serviços" */}
      <FormCard title="Gerar Faturamento de Serviços">
        <form>
          <label>
            <span>Faturamento a ser pago:</span>
            <select id="faturamentoPago">
              <option value="">-- Selecione o faturamento --</option>
              {faturamentoOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="naoAprovados">Não Aprovados</option>
            </select>
          </label>

          <p id="totalPendenteContainer" className={styles.totalPendente}>
            Valor total dos serviços marcados na coluna Faturar:{' '}
            <strong id="totalPendente">Selecione um faturamento acima</strong>
          </p>

          <label>
            <span>Usar saldo da Solemp:</span>
            <select id="faturarSolemp">
              <option value="">-- Selecione a Solemp --</option>
            </select>
          </label>

          <button id="btnGerarFaturamento" type="button" className={styles.successButton}>
            {/* <FaCheckCircle /> */}
            Gerar Faturamento (<span id="proximoFaturamento">—</span>)
          </button>
        </form>
      </FormCard>
    </div>
  );
};

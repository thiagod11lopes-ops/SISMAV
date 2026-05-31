import { useMemo, useState } from 'react'
import type { Column } from '../../components/DataTable'
import { DataTable } from '../../components/DataTable'
import { IconEditar } from '../../components/icons/ManutencaoIcons'
import { SectionCard } from '../../components/SectionCard'
import { formatarValor } from '../manutencao/filterUtils'
import { formatarDataExibir } from '../../utils/formatoBr'
import { formatarLabelFaturamento } from '../manutencao/faturamentoOptions'
import './EditarFinanceiroModal.css'
import { EditarPagamentoResumoModal } from './EditarPagamentoResumoModal'
import './EditarPagamentoResumoModal.css'
import type { PagamentoRegistro } from './pagamentosStorage'
import {
  montarResumoContratos,
  montarResumoSolemps,
} from './saldoFinanceiroUtils'
import { useContratos } from './useContratos'
import { usePagamentos } from './usePagamentos'
import { useSolemps } from './useSolemps'
import './ResumoFinanceiro.css'

interface ResumoFinanceiroProps {
  onConfirmarEdicaoPagamento: (pagamento: PagamentoRegistro) => void
}

interface PagamentoTabelaLinha extends PagamentoRegistro {
  faturamentoLabelExibicao: string
  valorFormatado: string
}

function montarLinhasPagamentos(pagamentos: PagamentoRegistro[]): PagamentoTabelaLinha[] {
  return pagamentos.map((pagamento) => ({
    ...pagamento,
    dataPagamento: formatarDataExibir(pagamento.dataPagamento),
    faturamentoLabelExibicao: formatarLabelFaturamento(
      pagamento.faturamentoLabel || pagamento.faturamento,
    ),
    valorFormatado: formatarValor(pagamento.valor),
  }))
}

export function ResumoFinanceiro({
  onConfirmarEdicaoPagamento,
}: ResumoFinanceiroProps) {
  const contratos = useContratos()
  const solemps = useSolemps()
  const pagamentos = usePagamentos()
  const [pagamentoParaEditar, setPagamentoParaEditar] =
    useState<PagamentoRegistro | null>(null)

  const resumoContratos = useMemo(
    () => montarResumoContratos(contratos, pagamentos),
    [contratos, pagamentos],
  )

  const resumoSolemps = useMemo(
    () => montarResumoSolemps(solemps, pagamentos),
    [solemps, pagamentos],
  )

  const linhasPagamentos = useMemo(
    () => montarLinhasPagamentos(pagamentos),
    [pagamentos],
  )

  const colunasPagamentos: Column<PagamentoTabelaLinha>[] = useMemo(
    () => [
      { key: 'dataPagamento', header: 'Data' },
      { key: 'faturamentoLabelExibicao', header: 'Faturamento' },
      { key: 'numeroContrato', header: 'Contrato' },
      { key: 'numeroSolemp', header: 'Solemp' },
      { key: 'valorFormatado', header: 'Valor pago' },
      {
        key: 'acoes',
        header: '',
        render: (pagamento) => (
          <div className="cadastro-financeiro-table__acoes">
            <button
              type="button"
              className="cadastro-financeiro-table__acao-btn"
              title="Editar faturamento pago"
              aria-label={`Editar faturamento ${pagamento.faturamentoLabel}`}
              onClick={() => setPagamentoParaEditar(pagamento)}
            >
              <IconEditar width={16} height={16} />
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  const handleConfirmarEdicao = () => {
    if (!pagamentoParaEditar) return
    onConfirmarEdicaoPagamento(pagamentoParaEditar)
    setPagamentoParaEditar(null)
  }

  return (
    <div className="resumo-financeiro">
      <SectionCard
        title="Contratos"
        description="Valores totais, utilizados e saldo restante por contrato."
      >
        <DataTable
          columns={[
            { key: 'numeroContrato', header: 'Número do Contrato' },
            { key: 'valorTotal', header: 'Valor total' },
            { key: 'valorUtilizado', header: 'Valor utilizado' },
            { key: 'valorRestante', header: 'Valor restante' },
          ]}
          data={resumoContratos}
          emptyMessage="Nenhum contrato cadastrado."
        />
      </SectionCard>

      <SectionCard
        title="Solemps"
        description="Valores totais, utilizados e saldo restante por Solemp."
      >
        <DataTable
          columns={[
            { key: 'numeroContrato', header: 'Número do Contrato' },
            { key: 'numeroSolemp', header: 'Número da Solemp' },
            { key: 'valorTotal', header: 'Valor total' },
            { key: 'valorUtilizado', header: 'Valor utilizado' },
            { key: 'valorRestante', header: 'Valor restante' },
          ]}
          data={resumoSolemps}
          emptyMessage="Nenhuma solemp cadastrada."
        />
      </SectionCard>

      <SectionCard
        title="Faturamentos pagos"
        description="Histórico de pagamentos com contrato e Solemp utilizados."
      >
        <DataTable
          columns={colunasPagamentos}
          data={linhasPagamentos}
          emptyMessage="Nenhum faturamento pago registrado."
        />
      </SectionCard>

      <EditarPagamentoResumoModal
        aberto={pagamentoParaEditar !== null}
        pagamento={pagamentoParaEditar}
        onFechar={() => setPagamentoParaEditar(null)}
        onConfirmar={handleConfirmarEdicao}
      />
    </div>
  )
}

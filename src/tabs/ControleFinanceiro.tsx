import { useState } from 'react'
import { SubTabs } from '../components/SubTabs'
import { ContratoSolemp } from './financeiro/ContratoSolemp'
import { FaturamentoServicos } from './financeiro/FaturamentoServicos'
import { ResumoFinanceiro } from './financeiro/ResumoFinanceiro'
import './financeiro/ControleFinanceiro.css'
import './financeiro/FaturamentoServicos.css'
import './financeiro/ResumoFinanceiro.css'
import type { PagamentoRegistro } from './financeiro/pagamentosStorage'
import type { FinanceiroSubTabId } from './financeiro/types'
import { FINANCEIRO_SUB_TABS } from './financeiro/types'

export function ControleFinanceiro() {
  const [subTab, setSubTab] = useState<FinanceiroSubTabId>('contrato-solemp')
  const [pagamentoEmEdicao, setPagamentoEmEdicao] = useState<PagamentoRegistro | null>(
    null,
  )

  const handleConfirmarEdicaoPagamento = (pagamento: PagamentoRegistro) => {
    setPagamentoEmEdicao(pagamento)
    setSubTab('faturamento-servicos')
  }

  const handleLimparEdicaoPagamento = () => {
    setPagamentoEmEdicao(null)
  }

  return (
    <div className="controle-financeiro">
      <SubTabs
        tabs={FINANCEIRO_SUB_TABS}
        activeTab={subTab}
        onTabChange={setSubTab}
        ariaLabel="Seções do controle financeiro"
        panelIdPrefix="financeiro"
      />
      <div
        className="sub-tabs-panel"
        role="tabpanel"
        id={`financeiro-panel-${subTab}`}
        aria-labelledby={`financeiro-tab-${subTab}`}
      >
        {subTab === 'contrato-solemp' && <ContratoSolemp />}
        {subTab === 'faturamento-servicos' && (
          <FaturamentoServicos
            pagamentoEmEdicao={pagamentoEmEdicao}
            onLimparEdicaoPagamento={handleLimparEdicaoPagamento}
          />
        )}
        {subTab === 'resumo-financeiro' && (
          <ResumoFinanceiro
            onConfirmarEdicaoPagamento={handleConfirmarEdicaoPagamento}
          />
        )}
      </div>
    </div>
  )
}

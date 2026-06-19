import { useMemo } from 'react'
import { formatarMoeda } from '../../utils/formatoBr'
import { calcularResumoStatusServicos } from './statusResumoUtils'
import type { ServicoRegistro } from './servicoTypes'
import './ManutencaoStatusResumo.css'

interface ManutencaoStatusResumoProps {
  servicos: ServicoRegistro[]
  escopoGeral: boolean
  totalServicos: number
}

export function ManutencaoStatusResumo({
  servicos,
  escopoGeral,
  totalServicos,
}: ManutencaoStatusResumoProps) {
  const resumo = useMemo(
    () => calcularResumoStatusServicos(servicos),
    [servicos],
  )

  const escopoLabel = escopoGeral
    ? 'Total geral do sistema'
    : `${totalServicos} serviço${totalServicos !== 1 ? 's' : ''} no filtro`

  return (
    <section
      className="manutencao-status-resumo"
      aria-label="Resumo financeiro por status dos serviços"
    >
      <div className="manutencao-status-resumo__glow" aria-hidden />

      <header className="manutencao-status-resumo__header">
        <span className="manutencao-status-resumo__badge">
          <span className="manutencao-status-resumo__badge-dot" aria-hidden />
          Resumo
        </span>
        <p className="manutencao-status-resumo__escopo">{escopoLabel}</p>
      </header>

      <div className="manutencao-status-resumo__metrics">
        <article className="manutencao-status-resumo__metric manutencao-status-resumo__metric--faturado">
          <span className="manutencao-status-resumo__metric-label">Faturados</span>
          <strong className="manutencao-status-resumo__metric-value">
            {formatarMoeda(resumo.totalFaturados)}
          </strong>
          <span className="manutencao-status-resumo__metric-meta">
            {resumo.qtdFaturados} serviço{resumo.qtdFaturados !== 1 ? 's' : ''}
          </span>
        </article>

        <article className="manutencao-status-resumo__metric manutencao-status-resumo__metric--pendente">
          <span className="manutencao-status-resumo__metric-label">Pendente</span>
          <strong className="manutencao-status-resumo__metric-value">
            {formatarMoeda(resumo.totalPendentes)}
          </strong>
          <span className="manutencao-status-resumo__metric-meta">
            {resumo.qtdPendentes} serviço{resumo.qtdPendentes !== 1 ? 's' : ''}
          </span>
        </article>

        <article className="manutencao-status-resumo__metric manutencao-status-resumo__metric--nao-aprovado">
          <span className="manutencao-status-resumo__metric-label">Não aprovados</span>
          <strong className="manutencao-status-resumo__metric-value">
            {formatarMoeda(resumo.totalNaoAprovados)}
          </strong>
          <span className="manutencao-status-resumo__metric-meta">
            {resumo.qtdNaoAprovados} serviço{resumo.qtdNaoAprovados !== 1 ? 's' : ''}
          </span>
        </article>
      </div>
    </section>
  )
}

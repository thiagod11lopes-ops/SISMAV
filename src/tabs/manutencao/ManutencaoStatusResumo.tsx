import { useMemo } from 'react'
import { formatarMoeda } from '../../utils/formatoBr'
import {
  calcularResumoStatusServicos,
  type ResumoCardFiltro,
} from './statusResumoUtils'
import type { ServicoRegistro } from './servicoTypes'
import './ManutencaoStatusResumo.css'

interface ManutencaoStatusResumoProps {
  servicos: ServicoRegistro[]
  escopoGeral: boolean
  totalServicos: number
  cardAtivo: ResumoCardFiltro | null
  onCardClick: (card: ResumoCardFiltro) => void
}

const CARDS: Array<{
  id: ResumoCardFiltro
  label: string
  className: string
  qtdKey: 'qtdFaturados' | 'qtdPendentes' | 'qtdNaoAprovados'
  totalKey: 'totalFaturados' | 'totalPendentes' | 'totalNaoAprovados'
}> = [
  {
    id: 'faturado',
    label: 'Faturados',
    className: 'manutencao-status-resumo__metric--faturado',
    qtdKey: 'qtdFaturados',
    totalKey: 'totalFaturados',
  },
  {
    id: 'pendente',
    label: 'Pendente',
    className: 'manutencao-status-resumo__metric--pendente',
    qtdKey: 'qtdPendentes',
    totalKey: 'totalPendentes',
  },
  {
    id: 'nao-aprovado',
    label: 'Não aprovados',
    className: 'manutencao-status-resumo__metric--nao-aprovado',
    qtdKey: 'qtdNaoAprovados',
    totalKey: 'totalNaoAprovados',
  },
]

export function ManutencaoStatusResumo({
  servicos,
  escopoGeral,
  totalServicos,
  cardAtivo,
  onCardClick,
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
        <p className="manutencao-status-resumo__escopo">
          {escopoLabel}
          {cardAtivo && (
            <span className="manutencao-status-resumo__filtro-ativo">
              {' '}
              · filtrando tabelas
            </span>
          )}
        </p>
      </header>

      <div className="manutencao-status-resumo__metrics" role="group" aria-label="Filtrar serviços por status">
        {CARDS.map((card) => {
          const qtd = resumo[card.qtdKey]
          const ativo = cardAtivo === card.id

          return (
            <button
              key={card.id}
              type="button"
              className={`manutencao-status-resumo__metric ${card.className}${
                ativo ? ' manutencao-status-resumo__metric--ativo' : ''
              }`}
              aria-pressed={ativo}
              aria-label={`${card.label}: ${formatarMoeda(resumo[card.totalKey])}, ${qtd} serviço${qtd !== 1 ? 's' : ''}. Clique para filtrar as tabelas.`}
              onClick={() => onCardClick(card.id)}
            >
              <span className="manutencao-status-resumo__metric-label">{card.label}</span>
              <strong className="manutencao-status-resumo__metric-value">
                {formatarMoeda(resumo[card.totalKey])}
              </strong>
              <span className="manutencao-status-resumo__metric-meta">
                {qtd} serviço{qtd !== 1 ? 's' : ''}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

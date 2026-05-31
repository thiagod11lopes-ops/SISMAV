import { useMemo } from 'react'
import { formatarMoeda } from '../../utils/formatoBr'
import { faturamentoFiltroEspecifico } from './aprovacaoOrcamentoPdf'
import { calcularTotaisFaturamentoResumo } from './faturamentoTotaisUtils'
import type { FaturamentoOption } from './faturamentoOptions'
import type { ServicoRegistro } from './servicoTypes'
import './FaturamentoResumoTotais.css'

interface FaturamentoResumoTotaisProps {
  servicosFiltrados: ServicoRegistro[]
  faturamentoAplicado: string
  opcoesFaturamento: FaturamentoOption[]
}

export function FaturamentoResumoTotais({
  servicosFiltrados,
  faturamentoAplicado,
  opcoesFaturamento,
}: FaturamentoResumoTotaisProps) {
  const visivel = faturamentoFiltroEspecifico(faturamentoAplicado)

  const totais = useMemo(
    () => calcularTotaisFaturamentoResumo(servicosFiltrados),
    [servicosFiltrados],
  )

  const labelFaturamento = useMemo(() => {
    return (
      opcoesFaturamento.find((opcao) => opcao.value === faturamentoAplicado)
        ?.label ?? `${faturamentoAplicado}º Faturamento`
    )
  }, [faturamentoAplicado, opcoesFaturamento])

  if (!visivel) return null

  return (
    <section
      className="fat-resumo"
      aria-label={`Resumo financeiro do ${labelFaturamento}`}
    >
      <div className="fat-resumo__glow" aria-hidden />

      <header className="fat-resumo__header">
        <div className="fat-resumo__badge">
          <span className="fat-resumo__badge-dot" aria-hidden />
          Faturamento ativo
        </div>
        <h3 className="fat-resumo__title">{labelFaturamento}</h3>
        <p className="fat-resumo__subtitle">
          {totais.qtdServicos}{' '}
          {totais.qtdServicos === 1 ? 'serviço listado' : 'serviços listados'}{' '}
          após o filtro
        </p>
      </header>

      <div className="fat-resumo__metrics">
        <article className="fat-resumo__metric fat-resumo__metric--total">
          <span className="fat-resumo__metric-icon" aria-hidden>
            Σ
          </span>
          <div className="fat-resumo__metric-body">
            <span className="fat-resumo__metric-label">Total do faturamento</span>
            <strong className="fat-resumo__metric-value">
              {formatarMoeda(totais.totalGeral)}
            </strong>
            <span className="fat-resumo__metric-meta">
              Soma de todos os serviços filtrados
            </span>
          </div>
        </article>

        <div className="fat-resumo__divider" aria-hidden>
          <span className="fat-resumo__divider-line" />
          <span className="fat-resumo__divider-ring">
            <svg viewBox="0 0 36 36" className="fat-resumo__ring">
              <circle
                className="fat-resumo__ring-track"
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                strokeWidth="3"
              />
              <circle
                className="fat-resumo__ring-progress"
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${totais.percentualAprovacao} 100`}
                pathLength={100}
              />
            </svg>
            <span className="fat-resumo__ring-label">
              {Math.round(totais.percentualAprovacao)}%
            </span>
          </span>
          <span className="fat-resumo__divider-line" />
        </div>

        <article className="fat-resumo__metric fat-resumo__metric--aprovacao">
          <span className="fat-resumo__metric-icon fat-resumo__metric-icon--ok" aria-hidden>
            ✓
          </span>
          <div className="fat-resumo__metric-body">
            <span className="fat-resumo__metric-label">
              Aprovados e pré-aprovados
            </span>
            <strong className="fat-resumo__metric-value">
              {formatarMoeda(totais.totalAprovacao)}
            </strong>
            <span className="fat-resumo__metric-meta">
              {totais.qtdAprovado} aprovado
              {totais.qtdAprovado !== 1 ? 's' : ''}
              {totais.qtdPreAprovado > 0 && (
                <>
                  {' · '}
                  {totais.qtdPreAprovado} pré-aprovado
                  {totais.qtdPreAprovado !== 1 ? 's' : ''}
                </>
              )}
              {totais.qtdAprovacao === 0 && ' · nenhum marcado ainda'}
            </span>
          </div>
        </article>
      </div>

      <div className="fat-resumo__bar" aria-hidden>
        <span
          className="fat-resumo__bar-fill"
          style={{ width: `${totais.percentualAprovacao}%` }}
        />
      </div>
    </section>
  )
}

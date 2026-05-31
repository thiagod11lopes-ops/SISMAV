import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { DataInput } from '../../components/inputs/DataInput'
import { IconValor } from '../../components/icons/ManutencaoIcons'
import { formatarData, formatarMoeda, subtrairAnosDataBr } from '../../utils/formatoBr'
import {
  carregarServicos,
  EVENTO_SERVICOS_ATUALIZADOS,
} from '../manutencao/servicosStorage'
import {
  calcularResumoFinanceiroViatura,
  PERCENTUAL_LIMITE_VALOR_MERCADO,
} from './viaturaFinanceiroUtils'
import type { ViaturaLinha } from './types'
import '../../styles/modern-ui.css'
import './ViaturaFinanceiroModal.css'

interface ViaturaFinanceiroModalProps {
  aberto: boolean
  viatura: ViaturaLinha | null
  onFechar: () => void
}

function IconCalendario() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function formatarPercentual(valor: number | null): string {
  if (valor === null) return '—'
  return `${valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`
}

export function ViaturaFinanceiroModal({
  aberto,
  viatura,
  onFechar,
}: ViaturaFinanceiroModalProps) {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [versaoServicos, setVersaoServicos] = useState(0)

  useEffect(() => {
    if (!aberto) return
    const fim = formatarData()
    setDataFim(fim)
    setDataInicio(subtrairAnosDataBr(fim, 1))
  }, [aberto, viatura?.id])

  useEffect(() => {
    if (!aberto) return

    const atualizar = () => setVersaoServicos((v) => v + 1)
    window.addEventListener(EVENTO_SERVICOS_ATUALIZADOS, atualizar)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener(EVENTO_SERVICOS_ATUALIZADOS, atualizar)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [aberto, onFechar])

  const resumo = useMemo(() => {
    if (!viatura) {
      return {
        gastoTotal: 0,
        valorMercado: 0,
        percentualGasto: null,
        quantidadeServicos: 0,
        valorDisponivel: null,
        ultrapassouLimite70: false,
        liberacaoGasto: null,
      }
    }
    void versaoServicos
    return calcularResumoFinanceiroViatura(
      viatura,
      dataInicio,
      dataFim,
      carregarServicos(),
    )
  }, [viatura, dataInicio, dataFim, versaoServicos])

  if (!aberto || !viatura) return null

  const dataFimEhHoje = dataFim === formatarData()

  return (
    <div className="modern-overlay" role="presentation" onClick={onFechar}>
      <div
        className="modern-modal-shell viatura-financeiro-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="viatura-financeiro-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <div className="modern-modal-header__main">
            <span className="modern-modal-header__icon" aria-hidden>
              <IconValor width={20} height={20} />
            </span>
            <div>
              <h2 id="viatura-financeiro-modal-title" className="modern-modal-header__title">
                Informações financeiras
              </h2>
              <p className="modern-modal-header__subtitle">
                {viatura.placa} — {viatura.modelo} ({viatura.ano})
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modern-modal-close"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="modern-modal-body">
          <section className="viatura-financeiro-modal__periodo-card" aria-labelledby="viatura-financeiro-periodo-title">
            <div className="viatura-financeiro-modal__periodo-head">
              <h3 id="viatura-financeiro-periodo-title" className="viatura-financeiro-modal__periodo-title">
                Período de análise
              </h3>
              <p className="viatura-financeiro-modal__periodo-desc">
                Filtra os gastos pela data de saída dos serviços
              </p>
            </div>

            <div className="viatura-financeiro-modal__periodo">
              <label className="viatura-financeiro-modal__field">
                <span className="viatura-financeiro-modal__label">Data início</span>
                <div className="viatura-financeiro-modal__date-control">
                  <span className="viatura-financeiro-modal__date-icon">
                    <IconCalendario />
                  </span>
                  <DataInput
                    className="modern-input viatura-financeiro-modal__date-input"
                    value={dataInicio}
                    onValueChange={setDataInicio}
                    aria-label="Data início"
                  />
                </div>
              </label>

              <span className="viatura-financeiro-modal__periodo-sep" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>

              <label className="viatura-financeiro-modal__field">
                <span className="viatura-financeiro-modal__label">
                  Data fim
                  {dataFimEhHoje ? (
                    <span className="viatura-financeiro-modal__badge-hoje">Hoje</span>
                  ) : null}
                </span>
                <div className="viatura-financeiro-modal__date-control viatura-financeiro-modal__date-control--fim">
                  <span className="viatura-financeiro-modal__date-icon">
                    <IconCalendario />
                  </span>
                  <DataInput
                    className="modern-input viatura-financeiro-modal__date-input"
                    value={dataFim}
                    onValueChange={setDataFim}
                    aria-label="Data fim"
                  />
                </div>
              </label>
            </div>

            <p className="viatura-financeiro-modal__hint">
              Considerando serviços com data de saída entre as datas informadas (padrão: últimos 12 meses até hoje).
            </p>
          </section>

          <div className="modern-stat-grid">
            <div className="modern-stat-card modern-stat-card--highlight">
              <span className="modern-stat-card__label">Gasto no período</span>
              <strong className="modern-stat-card__value">
                {formatarMoeda(resumo.gastoTotal)}
              </strong>
            </div>
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Valor de mercado</span>
              <strong className="modern-stat-card__value">
                {resumo.valorMercado > 0
                  ? formatarMoeda(resumo.valorMercado)
                  : 'Não informado'}
              </strong>
            </div>
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">% em relação ao valor de mercado</span>
              <strong className="modern-stat-card__value viatura-financeiro-modal__percentual">
                {formatarPercentual(resumo.percentualGasto)}
              </strong>
              <span className="viatura-financeiro-modal__percentual-servicos">
                {resumo.quantidadeServicos === 1
                  ? '1 serviço no período'
                  : `${resumo.quantidadeServicos} serviços no período`}
              </span>
            </div>
            <div
              className={[
                'modern-stat-card',
                'viatura-financeiro-modal__disponivel',
                resumo.ultrapassouLimite70
                  ? 'viatura-financeiro-modal__disponivel--excedido'
                  : resumo.valorDisponivel !== null
                    ? 'viatura-financeiro-modal__disponivel--ok'
                    : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="modern-stat-card__label">Teto de Gasto</span>
              <strong className="modern-stat-card__value">
                {resumo.valorDisponivel === null
                  ? '—'
                  : formatarMoeda(resumo.valorDisponivel)}
              </strong>
              {resumo.valorDisponivel !== null ? (
                <span className="viatura-financeiro-modal__disponivel-hint">
                  {resumo.ultrapassouLimite70
                    ? 'Ultrapassou 70% do valor de mercado (janela de 12 meses)'
                    : `Faltam para atingir ${formatarPercentual(PERCENTUAL_LIMITE_VALOR_MERCADO)} em 12 meses`}
                </span>
              ) : null}
            </div>
          </div>

          {resumo.ultrapassouLimite70 ? (
            <div
              className="viatura-financeiro-modal__liberacao"
              role="status"
            >
              {resumo.liberacaoGasto ? (
                <p>
                  Com base na regra de até{' '}
                  <strong>{formatarPercentual(PERCENTUAL_LIMITE_VALOR_MERCADO)}</strong>{' '}
                  do valor de mercado em 12 meses, o gasto estará liberado em{' '}
                  <strong>{resumo.liberacaoGasto.data}</strong>, com{' '}
                  <strong>{formatarMoeda(resumo.liberacaoGasto.valorDisponivel)}</strong>{' '}
                  disponíveis no teto.
                </p>
              ) : (
                <p>
                  O teto de{' '}
                  <strong>{formatarPercentual(PERCENTUAL_LIMITE_VALOR_MERCADO)}</strong>{' '}
                  em 12 meses foi ultrapassado. Não foi possível estimar a data de
                  liberação com os serviços registrados.
                </p>
              )}
            </div>
          ) : null}
        </div>

        <footer className="modern-modal-footer">
          <Button type="button" variant="secondary" onClick={onFechar}>
            Fechar
          </Button>
        </footer>
      </div>
    </div>
  )
}

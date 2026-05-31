import { useEffect } from 'react'
import { Button } from '../../components/Button'
import { formatarLabelFaturamento } from '../manutencao/faturamentoOptions'
import { formatarValor } from '../manutencao/filterUtils'
import '../../styles/modern-ui.css'
import './PagamentoSucessoModal.css'

export interface DadosPagamentoSucesso {
  valor: number
  faturamentoLabel: string
  numeroSolemp: string
  numeroContrato: string
}

interface PagamentoSucessoModalProps {
  aberto: boolean
  dados: DadosPagamentoSucesso | null
  atualizado?: boolean
  onFechar: () => void
}

export function PagamentoSucessoModal({
  aberto,
  dados,
  atualizado = false,
  onFechar,
}: PagamentoSucessoModalProps) {
  useEffect(() => {
    if (!aberto) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [aberto, onFechar])

  if (!aberto || !dados) return null

  return (
    <div className="modern-overlay pagamento-sucesso-modal__overlay" role="presentation" onClick={onFechar}>
      <div
        className="modern-modal-shell pagamento-sucesso-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pagamento-sucesso-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <div className="modern-modal-header__main">
            <span className="modern-modal-header__icon" aria-hidden>
              ✓
            </span>
            <div>
              <h2 id="pagamento-sucesso-modal-title" className="modern-modal-header__title">
                {atualizado ? 'Pagamento atualizado' : 'Pagamento registrado'}
              </h2>
              <p className="modern-modal-header__subtitle">
                {atualizado
                  ? 'O pagamento foi atualizado com sucesso e já está disponível na aba '
                  : 'O pagamento foi registrado com sucesso e já está disponível na aba '}
                <strong>Resumo financeiro</strong>.
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
          <div className="modern-stat-grid">
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Faturamento</span>
              <strong className="modern-stat-card__value">
                {formatarLabelFaturamento(dados.faturamentoLabel)}
              </strong>
            </div>
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Contrato</span>
              <strong className="modern-stat-card__value">{dados.numeroContrato}</strong>
            </div>
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Solemp</span>
              <strong className="modern-stat-card__value">{dados.numeroSolemp}</strong>
            </div>
            <div className="modern-stat-card modern-stat-card--full modern-stat-card--success">
              <span className="modern-stat-card__label">Valor pago</span>
              <strong className="modern-stat-card__value">{formatarValor(dados.valor)}</strong>
            </div>
          </div>
        </div>

        <footer className="modern-modal-footer">
          <Button onClick={onFechar}>Entendi</Button>
        </footer>
      </div>
    </div>
  )
}

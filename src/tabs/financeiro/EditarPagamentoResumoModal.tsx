import { useEffect } from 'react'
import { Button } from '../../components/Button'
import type { PagamentoRegistro } from './pagamentosStorage'
import { formatarLabelFaturamento } from '../manutencao/faturamentoOptions'
import { formatarValor } from '../manutencao/filterUtils'
import '../../styles/modern-ui.css'
import './EditarPagamentoResumoModal.css'

interface EditarPagamentoResumoModalProps {
  aberto: boolean
  pagamento: PagamentoRegistro | null
  onFechar: () => void
  onConfirmar: () => void
}

export function EditarPagamentoResumoModal({
  aberto,
  pagamento,
  onFechar,
  onConfirmar,
}: EditarPagamentoResumoModalProps) {
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

  if (!aberto || !pagamento) return null

  return (
    <div className="modern-overlay" role="presentation" onClick={onFechar}>
      <div
        className="modern-modal-shell editar-pagamento-resumo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-pagamento-resumo-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <div className="modern-modal-header__main">
            <span className="modern-modal-header__icon" aria-hidden>
              ✎
            </span>
            <div>
              <h2 id="editar-pagamento-resumo-modal-title" className="modern-modal-header__title">
                Editar faturamento pago
              </h2>
              <p className="modern-modal-header__subtitle">
                A aba <strong>Faturamento de serviços</strong> será aberta com os dados deste
                faturamento para que você possa revisar e atualizar o pagamento registrado.
              </p>
            </div>
          </div>
          <button type="button" className="modern-modal-close" onClick={onFechar} aria-label="Fechar">
            ×
          </button>
        </header>

        <div className="modern-modal-body">
          <div className="modern-stat-grid">
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Faturamento</span>
              <strong className="modern-stat-card__value">
                {formatarLabelFaturamento(
                  pagamento.faturamentoLabel || pagamento.faturamento,
                )}
              </strong>
            </div>
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Contrato</span>
              <strong className="modern-stat-card__value">{pagamento.numeroContrato}</strong>
            </div>
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Solemp</span>
              <strong className="modern-stat-card__value">{pagamento.numeroSolemp}</strong>
            </div>
            <div className="modern-stat-card modern-stat-card--full">
              <span className="modern-stat-card__label">Valor pago</span>
              <strong className="modern-stat-card__value">{formatarValor(pagamento.valor)}</strong>
            </div>
          </div>
        </div>

        <footer className="modern-modal-footer">
          <Button type="button" variant="secondary" onClick={onFechar}>
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirmar}>
            OK
          </Button>
        </footer>
      </div>
    </div>
  )
}

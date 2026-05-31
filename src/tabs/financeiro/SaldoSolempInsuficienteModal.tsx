import { useEffect } from 'react'
import { Button } from '../../components/Button'
import { formatarValor } from '../manutencao/filterUtils'
import '../../styles/modern-ui.css'
import './SaldoSolempInsuficienteModal.css'

export interface DadosSaldoSolempInsuficiente {
  numeroSolemp: string
  saldoSolemp: number
  valorFaturamento: number
}

interface SaldoSolempInsuficienteModalProps {
  aberto: boolean
  dados: DadosSaldoSolempInsuficiente | null
  onFechar: () => void
}

export function SaldoSolempInsuficienteModal({
  aberto,
  dados,
  onFechar,
}: SaldoSolempInsuficienteModalProps) {
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

  const diferenca = dados.valorFaturamento - dados.saldoSolemp

  return (
    <div className="modern-overlay" role="presentation" onClick={onFechar}>
      <div
        className="modern-modal-shell saldo-solemp-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="saldo-solemp-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <div className="modern-modal-header__main">
            <span className="modern-modal-header__icon" aria-hidden>
              !
            </span>
            <div>
              <h2 id="saldo-solemp-modal-title" className="modern-modal-header__title">
                Saldo da Solemp insuficiente
              </h2>
              <p className="modern-modal-header__subtitle">
                O valor disponível na Solemp selecionada é inferior ao valor total do
                faturamento. Não é possível concluir o pagamento nesta situação.
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
              <span className="modern-stat-card__label">Solemp</span>
              <strong className="modern-stat-card__value">{dados.numeroSolemp}</strong>
            </div>
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Saldo disponível</span>
              <strong className="modern-stat-card__value">
                {formatarValor(dados.saldoSolemp)}
              </strong>
            </div>
            <div className="modern-stat-card">
              <span className="modern-stat-card__label">Valor do faturamento</span>
              <strong className="modern-stat-card__value">
                {formatarValor(dados.valorFaturamento)}
              </strong>
            </div>
            <div className="modern-stat-card modern-stat-card--full modern-stat-card--warning">
              <span className="modern-stat-card__label">Diferença</span>
              <strong className="modern-stat-card__value">{formatarValor(diferenca)}</strong>
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

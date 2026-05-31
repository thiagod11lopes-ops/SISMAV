import { useEffect } from 'react'
import { Button } from '../../components/Button'
import type { FainaItem } from './types'
import '../../styles/modern-ui.css'
import './ExcluirFainaModal.css'

interface ExcluirFainaModalProps {
  faina: FainaItem | null
  onFechar: () => void
  onConfirmar: () => void
}

export function ExcluirFainaModal({
  faina,
  onFechar,
  onConfirmar,
}: ExcluirFainaModalProps) {
  useEffect(() => {
    if (!faina) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [faina, onFechar])

  if (!faina) return null

  return (
    <div className="modern-overlay" role="presentation" onClick={onFechar}>
      <div
        className="modern-modal-shell fainas-excluir-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="fainas-excluir-modal-title"
        aria-describedby="fainas-excluir-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <h2 id="fainas-excluir-modal-title" className="modern-modal-header__title">
            Excluir atividade
          </h2>
        </header>

        <div className="modern-modal-body">
          <p id="fainas-excluir-modal-desc" className="fainas-excluir-modal__text">
            Deseja excluir a atividade{' '}
            <strong>{faina.tituloAtividade}</strong>? Esta ação não pode ser desfeita.
          </p>
        </div>

        <footer className="modern-modal-footer">
          <Button type="button" variant="secondary" onClick={onFechar}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={onConfirmar}>
            Excluir
          </Button>
        </footer>
      </div>
    </div>
  )
}

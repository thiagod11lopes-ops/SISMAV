import { useEffect } from 'react'
import { Button } from '../components/Button'
import '../styles/modern-ui.css'
import './ExcluirTodosDadosModal.css'

interface ExcluirTodosDadosModalProps {
  aberto: boolean
  onFechar: () => void
  onConfirmar: () => void
}

const ITENS_REMOVIDOS = [
  'Serviços de manutenção',
  'Viaturas',
  'Contratos, solemp e pagamentos',
  'Controle de créditos',
  'Fainas e anotações diárias',
  'Período do balanço e preferências de manutenção',
]

export function ExcluirTodosDadosModal({
  aberto,
  onFechar,
  onConfirmar,
}: ExcluirTodosDadosModalProps) {
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

  if (!aberto) return null

  return (
    <div className="modern-overlay" role="presentation" onClick={onFechar}>
      <div
        className="modern-modal-shell configuracoes-limpar-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="configuracoes-limpar-modal-title"
        aria-describedby="configuracoes-limpar-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <h2
            id="configuracoes-limpar-modal-title"
            className="modern-modal-header__title"
          >
            Excluir todos os dados
          </h2>
        </header>

        <div className="modern-modal-body">
          <p id="configuracoes-limpar-modal-desc" className="configuracoes-limpar-modal__text">
            Esta ação apaga permanentemente todos os registros salvos neste
            navegador. <strong>Não pode ser desfeita.</strong> O tema de exibição
            será mantido.
          </p>
          <p className="configuracoes-limpar-modal__subtitulo">Serão removidos:</p>
          <ul className="configuracoes-limpar-modal__lista">
            {ITENS_REMOVIDOS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="configuracoes-limpar-modal__dica">
            Recomendamos baixar um backup antes de continuar.
          </p>
        </div>

        <footer className="modern-modal-footer">
          <Button type="button" variant="secondary" onClick={onFechar}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={onConfirmar}>
            Excluir tudo
          </Button>
        </footer>
      </div>
    </div>
  )
}

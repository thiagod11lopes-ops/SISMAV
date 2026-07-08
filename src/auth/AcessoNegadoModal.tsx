import { useEffect } from 'react'
import { EMAILS_PERMITIDOS } from './authConfig'
import './AcessoNegadoModal.css'

interface AcessoNegadoModalProps {
  email: string
  onFechar: () => void
}

export function AcessoNegadoModal({ email, onFechar }: AcessoNegadoModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onFechar])

  const contato = EMAILS_PERMITIDOS[0] ?? ''

  return (
    <div
      className="acesso-negado__overlay"
      role="presentation"
      onClick={onFechar}
    >
      <section
        className="acesso-negado"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="acesso-negado-titulo"
        aria-describedby="acesso-negado-descricao"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="acesso-negado__glow" aria-hidden />

        <button
          type="button"
          className="acesso-negado__close"
          onClick={onFechar}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="acesso-negado__icone" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 3 6v6c0 5 3.6 8.4 9 10 5.4-1.6 9-5 9-10V6l-9-4Z"
              fill="currentColor"
              opacity="0.16"
            />
            <path
              d="M12 2 3 6v6c0 5 3.6 8.4 9 10 5.4-1.6 9-5 9-10V6l-9-4Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="m9.5 9.5 5 5m0-5-5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 id="acesso-negado-titulo" className="acesso-negado__titulo">
          Acesso não autorizado
        </h2>

        <p id="acesso-negado-descricao" className="acesso-negado__texto">
          O e-mail fornecido não tem acesso ao sistema.
        </p>

        {email && (
          <p className="acesso-negado__email" title={email}>
            {email}
          </p>
        )}

        {contato && (
          <p className="acesso-negado__ajuda">
            Este é um sistema fechado. Em caso de dúvida, entre em contato com o
            administrador.
          </p>
        )}

        <button
          type="button"
          className="acesso-negado__btn"
          onClick={onFechar}
        >
          Tentar com outra conta
        </button>
      </section>
    </div>
  )
}

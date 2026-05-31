import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { IconAprovarOrcamento } from '../../components/icons/ManutencaoIcons'
import { formatarLabelFaturamento } from './faturamentoOptions'
import { formatarValor } from './filterUtils'
import {
  EMPRESA_MANUTENCAO_PADRAO,
  montarTextoDeclaracaoAprovacao,
  obterEmpresaManutencaoSalva,
  salvarEmpresaManutencao,
} from './empresaManutencaoStorage'
import type { ServicoRegistro } from './servicoTypes'
import './AprovarOrcamentoModal.css'

interface AprovarOrcamentoModalProps {
  aberto: boolean
  servicos: ServicoRegistro[]
  faturamentoLabel: string
  onConfirmar: (nomeEmpresa: string) => void
  onFechar: () => void
}

export function AprovarOrcamentoModal({
  aberto,
  servicos,
  faturamentoLabel,
  onConfirmar,
  onFechar,
}: AprovarOrcamentoModalProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [nomeEmpresa, setNomeEmpresa] = useState(EMPRESA_MANUTENCAO_PADRAO)
  const [erro, setErro] = useState('')

  const total = servicos.reduce((acc, s) => acc + s.valor, 0)
  const previewTexto = montarTextoDeclaracaoAprovacao(
    nomeEmpresa.trim() || EMPRESA_MANUTENCAO_PADRAO,
  )

  useEffect(() => {
    if (!aberto) return
    setNomeEmpresa(obterEmpresaManutencaoSalva())
    setErro('')

    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 120)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  const handleConfirmar = () => {
    const valor = nomeEmpresa.trim()
    if (!valor) {
      setErro('Informe o nome da empresa de manutenção.')
      inputRef.current?.focus()
      return
    }

    salvarEmpresaManutencao(valor)
    onConfirmar(valor)
  }

  return (
    <div
      className="aprovar-modal__overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar()
      }}
    >
      <div
        className="aprovar-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aprovar-modal-title"
        aria-describedby="aprovar-modal-desc"
      >
        <div className="aprovar-modal__glow" aria-hidden />

        <header className="aprovar-modal__header">
          <div className="aprovar-modal__header-main">
            <span className="aprovar-modal__icon">
              <IconAprovarOrcamento width={22} height={22} />
            </span>
            <div>
              <p className="aprovar-modal__eyebrow">Documento de aprovação</p>
              <h2 id="aprovar-modal-title" className="aprovar-modal__title">
                Empresa de manutenção
              </h2>
              <p id="aprovar-modal-desc" className="aprovar-modal__subtitle">
                Informe o nome que aparecerá no PDF de aprovação de orçamentos.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="aprovar-modal__close"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="aprovar-modal__body">
          <div className="aprovar-modal__stats">
            <div className="aprovar-modal__stat">
              <span className="aprovar-modal__stat-label">Faturamento</span>
              <strong className="aprovar-modal__stat-value">
                {formatarLabelFaturamento(faturamentoLabel)}
              </strong>
            </div>
            <div className="aprovar-modal__stat">
              <span className="aprovar-modal__stat-label">Serviços</span>
              <strong className="aprovar-modal__stat-value">{servicos.length}</strong>
            </div>
            <div className="aprovar-modal__stat aprovar-modal__stat--highlight">
              <span className="aprovar-modal__stat-label">Total aprovado</span>
              <strong className="aprovar-modal__stat-value">{formatarValor(total)}</strong>
            </div>
          </div>

          <div className="aprovar-modal__field">
            <label className="aprovar-modal__label" htmlFor={inputId}>
              Nome da empresa
            </label>
            <div className={`aprovar-modal__input-wrap${erro ? ' aprovar-modal__input-wrap--error' : ''}`}>
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                className="aprovar-modal__input"
                value={nomeEmpresa}
                onChange={(e) => {
                  setNomeEmpresa(e.target.value)
                  if (erro) setErro('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmar()
                }}
                placeholder="Ex.: PEÇA OIL"
                autoComplete="organization"
                spellCheck={false}
              />
            </div>
            {erro ? (
              <p className="aprovar-modal__erro" role="alert">
                {erro}
              </p>
            ) : (
              <p className="aprovar-modal__hint">
                O último nome informado fica salvo para as próximas gerações.
              </p>
            )}
          </div>

          <div className="aprovar-modal__preview">
            <span className="aprovar-modal__preview-label">Pré-visualização no PDF</span>
            <p className="aprovar-modal__preview-text">{previewTexto}</p>
          </div>
        </div>

        <footer className="aprovar-modal__footer">
          <Button variant="secondary" onClick={onFechar}>
            Cancelar
          </Button>
          <Button className="aprovar-modal__confirm" onClick={handleConfirmar}>
            Gerar PDF
          </Button>
        </footer>
      </div>
    </div>
  )
}

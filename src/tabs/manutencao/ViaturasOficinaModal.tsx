import { useEffect, useMemo } from 'react'
import { IconOficina } from '../../components/icons/ManutencaoIcons'
import {
  calcularDiasNaOficina,
  filtrarViaturasNaOficina,
  formatarValor,
} from './filterUtils'
import type { ServicoRegistro } from './servicoTypes'
import './ViaturasOficinaModal.css'

interface ViaturasOficinaModalProps {
  aberto: boolean
  servicos: ServicoRegistro[]
  onFechar: () => void
}

const LABEL_CATEGORIA = {
  ambulancia: 'Ambulância',
  administrativo: 'Administrativo',
} as const

function ViaturaOficinaCard({ servico }: { servico: ServicoRegistro }) {
  const dias = calcularDiasNaOficina(servico.dataSaida)

  return (
    <article
      className={`oficina-card oficina-card--${servico.categoria}`}
    >
      <div className="oficina-card__top">
        <div className="oficina-card__placa-wrap">
          <span className="oficina-card__placa">{servico.viatura}</span>
          <span
            className={`oficina-card__tipo oficina-card__tipo--${servico.categoria}`}
          >
            {LABEL_CATEGORIA[servico.categoria]}
          </span>
        </div>
        {dias !== null && (
          <span className="oficina-card__dias">
            {dias === 0 ? 'Hoje' : `${dias} dia${dias === 1 ? '' : 's'}`}
          </span>
        )}
      </div>

      <div className="oficina-card__meta">
        <div>
          <span className="oficina-card__label">Modelo</span>
          <span className="oficina-card__value">{servico.modelo}</span>
        </div>
        <div>
          <span className="oficina-card__label">O.S.</span>
          <span className="oficina-card__value oficina-card__value--os">
            {servico.os || '—'}
          </span>
        </div>
        <div>
          <span className="oficina-card__label">Saída</span>
          <span className="oficina-card__value">{servico.dataSaida || '—'}</span>
        </div>
        <div>
          <span className="oficina-card__label">Valor</span>
          <span className="oficina-card__value oficina-card__value--valor">
            {servico.valor > 0 ? formatarValor(servico.valor) : '—'}
          </span>
        </div>
      </div>

      {servico.descricao && (
        <p className="oficina-card__desc" title={servico.descricao}>
          {servico.descricao}
        </p>
      )}
    </article>
  )
}

export function ViaturasOficinaModal({
  aberto,
  servicos,
  onFechar,
}: ViaturasOficinaModalProps) {
  const naOficina = useMemo(() => filtrarViaturasNaOficina(servicos), [servicos])

  const ambulancias = useMemo(
    () => naOficina.filter((s) => s.categoria === 'ambulancia'),
    [naOficina],
  )
  const administrativas = useMemo(
    () => naOficina.filter((s) => s.categoria === 'administrativo'),
    [naOficina],
  )

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
    <div
      className="oficina-modal__overlay"
      role="presentation"
      onClick={onFechar}
    >
      <div
        className="oficina-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="oficina-modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="oficina-modal__header">
          <div className="oficina-modal__header-main">
            <span className="oficina-modal__icon" aria-hidden>
              <IconOficina width={22} height={22} />
            </span>
            <div>
              <h2 id="oficina-modal-titulo" className="oficina-modal__title">
                Viaturas na oficina
              </h2>
              <p className="oficina-modal__subtitle">
                Serviços sem data de retorno registrada
              </p>
            </div>
          </div>

          <div className="oficina-modal__stats">
            <span className="oficina-modal__stat oficina-modal__stat--total">
              {naOficina.length} na oficina
            </span>
            <span className="oficina-modal__stat oficina-modal__stat--amb">
              {ambulancias.length} ambulâncias
            </span>
            <span className="oficina-modal__stat oficina-modal__stat--adm">
              {administrativas.length} administrativas
            </span>
          </div>

          <button
            type="button"
            className="oficina-modal__close"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="oficina-modal__body">
          {naOficina.length === 0 ? (
            <div className="oficina-modal__empty">
              <span className="oficina-modal__empty-icon" aria-hidden>
                ✓
              </span>
              <p>Nenhuma viatura na oficina no momento.</p>
              <span className="oficina-modal__empty-hint">
                Todas as ordens de serviço possuem data de retorno.
              </span>
            </div>
          ) : (
            <div className="oficina-modal__grid">
              {naOficina.map((servico) => (
                <ViaturaOficinaCard key={servico.id} servico={servico} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

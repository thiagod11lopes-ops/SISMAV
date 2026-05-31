import { IconLixeira } from '../../components/icons/ManutencaoIcons'
import { formatarDataExibir } from '../../utils/formatoBr'
import type { FainaItem, FainaStatus } from './types'
import './FainaItemCard.css'

function IconSetaEsquerda() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function IconSetaDireita() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

interface FainaItemCardProps {
  faina: FainaItem
  onMover: (id: string, status: FainaStatus) => void
  onExcluir: (faina: FainaItem) => void
}

export function FainaItemCard({ faina, onMover, onExcluir }: FainaItemCardProps) {
  return (
    <article className="faina-item">
      <div className="faina-item__content">
        <h4 className="faina-item__title">{faina.tituloAtividade}</h4>
        <p className="faina-item__desc">{faina.descricao}</p>
        {faina.dataLimite ? (
          <p className="faina-item__meta">
            Data limite: {formatarDataExibir(faina.dataLimite)}
          </p>
        ) : null}
      </div>

      <div className="faina-item__acoes">
        {faina.status === 'pendente' ? (
          <button
            type="button"
            className="faina-item__acao-btn faina-item__acao-btn--avancar"
            title="Mover para Em andamento"
            aria-label={`Mover "${faina.tituloAtividade}" para Em andamento`}
            onClick={() => onMover(faina.id, 'andamento')}
          >
            <IconSetaDireita />
          </button>
        ) : null}

        {faina.status === 'andamento' ? (
          <>
            <button
              type="button"
              className="faina-item__acao-btn faina-item__acao-btn--voltar"
              title="Retornar para Pendente"
              aria-label={`Retornar "${faina.tituloAtividade}" para Pendente`}
              onClick={() => onMover(faina.id, 'pendente')}
            >
              <IconSetaEsquerda />
            </button>
            <button
              type="button"
              className="faina-item__acao-btn faina-item__acao-btn--avancar"
              title="Mover para Finalizado"
              aria-label={`Mover "${faina.tituloAtividade}" para Finalizado`}
              onClick={() => onMover(faina.id, 'finalizado')}
            >
              <IconSetaDireita />
            </button>
          </>
        ) : null}

        {faina.status === 'finalizado' ? (
          <button
            type="button"
            className="faina-item__acao-btn faina-item__acao-btn--voltar"
            title="Retornar para Em andamento"
            aria-label={`Retornar "${faina.tituloAtividade}" para Em andamento`}
            onClick={() => onMover(faina.id, 'andamento')}
          >
            <IconSetaEsquerda />
          </button>
        ) : null}

        <button
          type="button"
          className="faina-item__acao-btn faina-item__acao-btn--danger"
          title="Excluir atividade"
          aria-label={`Excluir atividade "${faina.tituloAtividade}"`}
          onClick={() => onExcluir(faina)}
        >
          <IconLixeira width={16} height={16} />
        </button>
      </div>
    </article>
  )
}

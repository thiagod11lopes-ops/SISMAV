import { useEffect, useMemo, useState } from 'react'
import { IconSearch } from '../../components/icons/ManutencaoIcons'
import { formatarDataExibir } from '../../utils/formatoBr'
import type { ServicoRegistro } from './servicoTypes'
import './DescricoesServicosModal.css'

interface DescricoesServicosModalProps {
  aberto: boolean
  servicos: ServicoRegistro[]
  onFechar: () => void
}

function highlightText(text: string, searchTerm: string) {
  if (!searchTerm || searchTerm.length < 3) {
    return [text]
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  const lowerText = text.toLowerCase()
  const lowerSearchTerm = searchTerm.toLowerCase()

  let match
  const regex = new RegExp(lowerSearchTerm, 'gi')

  while ((match = regex.exec(lowerText)) !== null) {
    const startIndex = match.index
    const endIndex = regex.lastIndex

    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex))
    }

    parts.push(<strong key={startIndex}>{text.substring(startIndex, endIndex)}</strong>)
    lastIndex = endIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts
}

export function DescricoesServicosModal({
  aberto,
  servicos,
  onFechar,
}: DescricoesServicosModalProps) {
  const [busca, setBusca] = useState('')
  const [placaFiltro, setPlacaFiltro] = useState('')

  const placasDisponiveis = useMemo(() => {
    const set = new Set<string>()
    for (const s of servicos) {
      if (s.viatura?.trim()) set.add(s.viatura.trim().toUpperCase())
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [servicos])

  const termoBuscaFormatado = busca.trim()
  const resultados = useMemo(() => {
    const termo = termoBuscaFormatado.toLowerCase()

    return servicos.filter((s) => {
      if (placaFiltro && s.viatura.toUpperCase() !== placaFiltro) {
        return false
      }
      if (!termo) return true

      return (
        s.descricao.toLowerCase().includes(termo) ||
        s.os.toLowerCase().includes(termo) ||
        s.viatura.toLowerCase().includes(termo) ||
        s.modelo.toLowerCase().includes(termo)
      )
    })
  }, [servicos, busca, placaFiltro])

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

  useEffect(() => {
    if (!aberto) {
      setBusca('')
      setPlacaFiltro('')
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <div
      className="descricoes-modal__overlay"
      role="presentation"
      onClick={onFechar}
    >
      <div
        className="descricoes-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="descricoes-modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="descricoes-modal__header">
          <div>
            <h2 id="descricoes-modal-titulo" className="descricoes-modal__title">
              Descrições dos serviços
            </h2>
            <p className="descricoes-modal__subtitle">
              Pesquise e filtre por placa para localizar descrições
            </p>
          </div>
          <button
            type="button"
            className="descricoes-modal__close"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="descricoes-modal__filters">
          <label className="descricoes-modal__field descricoes-modal__field--busca">
            <span className="descricoes-modal__label">Buscar descrição</span>
            <div className="descricoes-modal__search-row">
              <span className="descricoes-modal__search-icon" aria-hidden>
                <IconSearch width={18} height={18} />
              </span>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digite para localizar na descrição, O.S., placa..."
                autoFocus
              />
            </div>
          </label>

          <label className="descricoes-modal__field">
            <span className="descricoes-modal__label">Filtrar por placa</span>
            <select
              value={placaFiltro}
              onChange={(e) => setPlacaFiltro(e.target.value)}
            >
              <option value="">Todas as placas</option>
              {placasDisponiveis.map((placa) => (
                <option key={placa} value={placa}>
                  {placa}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="descricoes-modal__count">
          {resultados.length} de {servicos.length} registro
          {servicos.length === 1 ? '' : 's'}
        </p>

        <div className="descricoes-modal__lista">
          {resultados.length === 0 ? (
            <p className="descricoes-modal__vazio">
              Nenhuma descrição encontrada com os filtros aplicados.
            </p>
          ) : (
            resultados.map((s) => (
              <article key={s.id} className="descricoes-modal__item">
                <header className="descricoes-modal__item-header">
                  <span className="descricoes-modal__item-placa">
                    {highlightText(s.viatura, termoBuscaFormatado)}
                  </span>
                  <span className="descricoes-modal__item-os">
                    O.S. {highlightText(s.os || '—', termoBuscaFormatado)}
                  </span>
                  <span className="descricoes-modal__item-modelo">
                    {highlightText(s.modelo, termoBuscaFormatado)}
                  </span>
                </header>
                <dl className="descricoes-modal__item-meta">
                  <div className="descricoes-modal__meta-cell">
                    <dt>Data de saída</dt>
                    <dd>
                      {s.dataSaida ? (
                        <time dateTime={s.dataSaida}>
                          {formatarDataExibir(s.dataSaida)}
                        </time>
                      ) : (
                        '—'
                      )}
                    </dd>
                  </div>
                  <div className="descricoes-modal__meta-cell">
                    <dt>Data de retorno</dt>
                    <dd>
                      {!s.dataRetorno?.trim() ? (
                        '—'
                      ) : s.dataRetorno === 'Indeterminado' ? (
                        <span className="descricoes-modal__pill descricoes-modal__pill--warn">
                          Indeterminado
                        </span>
                      ) : (
                        <time dateTime={s.dataRetorno}>
                          {formatarDataExibir(s.dataRetorno)}
                        </time>
                      )}
                    </dd>
                  </div>
                  <div className="descricoes-modal__meta-cell descricoes-modal__meta-cell--aprovado">
                    <dt>Aprovado</dt>
                    <dd>
                      <span
                        className={`descricoes-modal__pill ${
                          s.aprovado
                            ? 'descricoes-modal__pill--sim'
                            : 'descricoes-modal__pill--nao'
                        }`}
                      >
                        <span className="descricoes-modal__pill-dot" aria-hidden />
                        {s.aprovado ? 'Sim' : 'Não'}
                      </span>
                    </dd>
                  </div>
                </dl>
                <p className="descricoes-modal__item-texto">
                  {highlightText(
                    s.descricao.trim() || 'Sem descrição cadastrada.',
                    termoBuscaFormatado,
                  )}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

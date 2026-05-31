import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { IconAnotacoes, IconSearch } from '../../components/icons/ManutencaoIcons'
import {
  carregarAnotacoes,
  listarAnotacoesOrdenadas,
  removerAnotacao,
  salvarAnotacao,
  type AnotacoesPorData,
} from './anotacoesStorage'
import {
  dataParaChave,
  DIAS_SEMANA,
  ehHoje,
  formatarDataCurta,
  formatarDataLonga,
  montarGradeCalendario,
  obterRotuloMes,
} from './anotacoesUtils'
import './AnotacoesModal.css'

interface AnotacoesModalProps {
  aberto: boolean
  onFechar: () => void
}

function resumoAnotacao(texto: string, limite = 110): string {
  const normalizado = texto.replace(/\s+/g, ' ').trim()
  if (normalizado.length <= limite) return normalizado
  return `${normalizado.slice(0, limite).trim()}…`
}

export function AnotacoesModal({ aberto, onFechar }: AnotacoesModalProps) {
  const hoje = useMemo(() => new Date(), [aberto])
  const [anotacoes, setAnotacoes] = useState<AnotacoesPorData>({})
  const [dataSelecionada, setDataSelecionada] = useState(() => dataParaChave(hoje))
  const [mesVisivel, setMesVisivel] = useState(hoje.getMonth())
  const [anoVisivel, setAnoVisivel] = useState(hoje.getFullYear())
  const [textoEdicao, setTextoEdicao] = useState('')
  const [busca, setBusca] = useState('')
  const [feedback, setFeedback] = useState('')

  const grade = useMemo(
    () => montarGradeCalendario(anoVisivel, mesVisivel),
    [anoVisivel, mesVisivel],
  )

  const anotacoesLista = useMemo(
    () => listarAnotacoesOrdenadas(anotacoes),
    [anotacoes],
  )

  const anotacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return anotacoesLista
    return anotacoesLista.filter(
      (item) =>
        item.texto.toLowerCase().includes(termo) ||
        formatarDataCurta(item.dataChave).includes(termo) ||
        formatarDataLonga(item.dataChave).toLowerCase().includes(termo),
    )
  }, [anotacoesLista, busca])

  useEffect(() => {
    if (!aberto) return

    const dados = carregarAnotacoes()
    const chaveHoje = dataParaChave(new Date())
    setAnotacoes(dados)
    setDataSelecionada(chaveHoje)
    setTextoEdicao(dados[chaveHoje] ?? '')
    setMesVisivel(new Date().getMonth())
    setAnoVisivel(new Date().getFullYear())
    setBusca('')
    setFeedback('')

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [aberto, onFechar])

  useEffect(() => {
    if (!aberto) return
    setTextoEdicao(anotacoes[dataSelecionada] ?? '')
  }, [aberto, dataSelecionada, anotacoes])

  if (!aberto) return null

  const selecionarData = (chave: string, mesAtual: boolean) => {
    setDataSelecionada(chave)
    setTextoEdicao(anotacoes[chave] ?? '')
    setFeedback('')

    if (!mesAtual) {
      const date = new Date(`${chave}T12:00:00`)
      setMesVisivel(date.getMonth())
      setAnoVisivel(date.getFullYear())
    }
  }

  const irMesAnterior = () => {
    if (mesVisivel === 0) {
      setMesVisivel(11)
      setAnoVisivel((a) => a - 1)
      return
    }
    setMesVisivel((m) => m - 1)
  }

  const irMesProximo = () => {
    if (mesVisivel === 11) {
      setMesVisivel(0)
      setAnoVisivel((a) => a + 1)
      return
    }
    setMesVisivel((m) => m + 1)
  }

  const irParaHoje = () => {
    const agora = new Date()
    const chave = dataParaChave(agora)
    setMesVisivel(agora.getMonth())
    setAnoVisivel(agora.getFullYear())
    selecionarData(chave, true)
  }

  const handleSalvar = () => {
    const atualizado = salvarAnotacao(dataSelecionada, textoEdicao)
    setAnotacoes(atualizado)
    setFeedback('Anotação salva com sucesso.')
  }

  const handleExcluir = () => {
    const atualizado = removerAnotacao(dataSelecionada)
    setAnotacoes(atualizado)
    setTextoEdicao('')
    setFeedback('Anotação removida.')
  }

  const possuiAnotacaoSelecionada = Boolean(anotacoes[dataSelecionada]?.trim())

  return (
    <div
      className="anotacoes-modal__overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar()
      }}
    >
      <div
        className="anotacoes-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="anotacoes-modal-title"
      >
        <div className="anotacoes-modal__glow" aria-hidden />

        <header className="anotacoes-modal__header">
          <div className="anotacoes-modal__header-main">
            <span className="anotacoes-modal__icon">
              <IconAnotacoes width={22} height={22} />
            </span>
            <div>
              <p className="anotacoes-modal__eyebrow">Registro diário</p>
              <h2 id="anotacoes-modal-title" className="anotacoes-modal__title">
                Anotações
              </h2>
              <p className="anotacoes-modal__subtitle">
                Consulte e registre observações por data no calendário.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="anotacoes-modal__close"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="anotacoes-modal__body">
          <aside className="anotacoes-modal__calendario-panel">
            <div className="anotacoes-calendario">
              <div className="anotacoes-calendario__nav">
                <button
                  type="button"
                  className="anotacoes-calendario__nav-btn"
                  onClick={irMesAnterior}
                  aria-label="Mês anterior"
                >
                  ‹
                </button>
                <div className="anotacoes-calendario__mes">
                  <strong>{obterRotuloMes(anoVisivel, mesVisivel)}</strong>
                  <button
                    type="button"
                    className="anotacoes-calendario__hoje"
                    onClick={irParaHoje}
                  >
                    Hoje
                  </button>
                </div>
                <button
                  type="button"
                  className="anotacoes-calendario__nav-btn"
                  onClick={irMesProximo}
                  aria-label="Próximo mês"
                >
                  ›
                </button>
              </div>

              <div className="anotacoes-calendario__weekdays">
                {DIAS_SEMANA.map((dia) => (
                  <span key={dia} className="anotacoes-calendario__weekday">
                    {dia}
                  </span>
                ))}
              </div>

              <div className="anotacoes-calendario__grid">
                {grade.map((celula) => {
                  const selecionada = celula.chave === dataSelecionada
                  const comAnotacao = Boolean(anotacoes[celula.chave]?.trim())
                  const hojeMarcado = ehHoje(celula.chave)

                  return (
                    <button
                      key={`${celula.chave}-${celula.mesAtual ? 'atual' : 'outro'}`}
                      type="button"
                      className={[
                        'anotacoes-calendario__dia',
                        !celula.mesAtual && 'anotacoes-calendario__dia--fora',
                        selecionada && 'anotacoes-calendario__dia--selecionada',
                        hojeMarcado && 'anotacoes-calendario__dia--hoje',
                        comAnotacao && 'anotacoes-calendario__dia--com-nota',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => selecionarData(celula.chave, celula.mesAtual)}
                      aria-label={`${formatarDataCurta(celula.chave)}${comAnotacao ? ', com anotação' : ''}`}
                      aria-pressed={selecionada}
                    >
                      <span>{celula.dia}</span>
                      {comAnotacao && (
                        <span className="anotacoes-calendario__marcador" aria-hidden />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="anotacoes-modal__lista">
              <div className="anotacoes-modal__lista-header">
                <h3 className="anotacoes-modal__lista-title">Anotações salvas</h3>
                <span className="anotacoes-modal__lista-count">
                  {anotacoesLista.length}
                </span>
              </div>

              <label className="anotacoes-modal__busca">
                <IconSearch width={16} height={16} />
                <input
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por data ou conteúdo..."
                  aria-label="Buscar anotações"
                />
              </label>

              <ul className="anotacoes-modal__lista-itens">
                {anotacoesFiltradas.length === 0 ? (
                  <li className="anotacoes-modal__lista-vazia">
                    {busca.trim()
                      ? 'Nenhuma anotação encontrada para esta busca.'
                      : 'Nenhuma anotação salva ainda.'}
                  </li>
                ) : (
                  anotacoesFiltradas.map((item) => (
                    <li key={item.dataChave}>
                      <button
                        type="button"
                        className={`anotacoes-modal__lista-item${
                          item.dataChave === dataSelecionada
                            ? ' anotacoes-modal__lista-item--ativa'
                            : ''
                        }`}
                        onClick={() => selecionarData(item.dataChave, true)}
                      >
                        <span className="anotacoes-modal__lista-data">
                          {formatarDataCurta(item.dataChave)}
                        </span>
                        <span className="anotacoes-modal__lista-texto">
                          {resumoAnotacao(item.texto)}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </aside>

          <section className="anotacoes-modal__editor">
            <div className="anotacoes-modal__editor-header">
              <div>
                <p className="anotacoes-modal__editor-label">Data selecionada</p>
                <h3 className="anotacoes-modal__editor-data">
                  {formatarDataLonga(dataSelecionada)}
                </h3>
              </div>
              {ehHoje(dataSelecionada) && (
                <span className="anotacoes-modal__badge-hoje">Hoje</span>
              )}
            </div>

            <label className="anotacoes-modal__campo" htmlFor="anotacao-texto">
              <span className="anotacoes-modal__campo-label">Anotação do dia</span>
              <textarea
                id="anotacao-texto"
                className="anotacoes-modal__textarea"
                value={textoEdicao}
                onChange={(e) => {
                  setTextoEdicao(e.target.value)
                  if (feedback) setFeedback('')
                }}
                placeholder="Escreva aqui lembretes, ocorrências, pendências ou observações do dia..."
                rows={12}
              />
            </label>

            {feedback && (
              <p className="anotacoes-modal__feedback" role="status">
                {feedback}
              </p>
            )}

            <div className="anotacoes-modal__acoes">
              <Button variant="secondary" onClick={onFechar}>
                Fechar
              </Button>
              {possuiAnotacaoSelecionada && (
                <Button variant="danger" onClick={handleExcluir}>
                  Excluir
                </Button>
              )}
              <Button onClick={handleSalvar}>Salvar anotação</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

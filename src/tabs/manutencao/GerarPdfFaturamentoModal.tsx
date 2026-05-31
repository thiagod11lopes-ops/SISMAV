import { useEffect, useId, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { IconRelatorios } from '../../components/icons/ManutencaoIcons'
import {
  formatarLabelFaturamento,
  montarOpcoesFaturamentoSistema,
  type FaturamentoOption,
} from './faturamentoOptions'
import { formatarValor } from './filterUtils'
import {
  gerarPdfFaturamentoDetalhado,
  obterServicosDoFaturamento,
} from './faturamentoDetalhadoPdf'
import type { ServicoRegistro } from './servicoTypes'
import './AprovarOrcamentoModal.css'

interface GerarPdfFaturamentoModalProps {
  aberto: boolean
  servicos: ServicoRegistro[]
  opcoesFaturamento: FaturamentoOption[]
  onFechar: () => void
}

export function GerarPdfFaturamentoModal({
  aberto,
  servicos,
  opcoesFaturamento,
  onFechar,
}: GerarPdfFaturamentoModalProps) {
  const selectId = useId()
  const opcoes = useMemo(
    () =>
      opcoesFaturamento.length > 0
        ? opcoesFaturamento.filter((o) => o.value !== 'todos')
        : montarOpcoesFaturamentoSistema(servicos),
    [opcoesFaturamento, servicos],
  )

  const [faturamento, setFaturamento] = useState('')
  const [erro, setErro] = useState('')

  const servicosSelecionados = useMemo(
    () => (faturamento ? obterServicosDoFaturamento(servicos, faturamento) : []),
    [servicos, faturamento],
  )

  const placasUnicas = useMemo(() => {
    const set = new Set(servicosSelecionados.map((s) => s.viatura))
    return set.size
  }, [servicosSelecionados])

  const total = servicosSelecionados.reduce((acc, s) => acc + s.valor, 0)

  useEffect(() => {
    if (!aberto) return
    setErro('')
    setFaturamento((atual) => {
      if (atual && opcoes.some((o) => o.value === atual)) return atual
      return opcoes[0]?.value ?? ''
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [aberto, opcoes, onFechar])

  if (!aberto) return null

  const handleGerar = () => {
    if (!faturamento) {
      setErro('Selecione um faturamento.')
      return
    }
    if (servicosSelecionados.length === 0) {
      setErro('Não há serviços cadastrados neste faturamento.')
      return
    }

    try {
      gerarPdfFaturamentoDetalhado(servicosSelecionados, faturamento)
      onFechar()
    } catch {
      setErro('Não foi possível gerar o PDF. Tente novamente.')
    }
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
        aria-labelledby="gerar-pdf-faturamento-title"
      >
        <div className="aprovar-modal__glow" aria-hidden />

        <header className="aprovar-modal__header">
          <div className="aprovar-modal__header-main">
            <span className="aprovar-modal__icon">
              <IconRelatorios width={22} height={22} />
            </span>
            <div>
              <p className="aprovar-modal__eyebrow">Relatório detalhado</p>
              <h2 id="gerar-pdf-faturamento-title" className="aprovar-modal__title">
                Gerar PDF do faturamento
              </h2>
              <p className="aprovar-modal__subtitle">
                Selecione o faturamento para exportar placas, quantidades e descrições
                dos serviços com datas de saída e retorno.
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
          <div className="aprovar-modal__field">
            <label className="aprovar-modal__label" htmlFor={selectId}>
              Faturamento
            </label>
            <div className="aprovar-modal__input-wrap">
              <select
                id={selectId}
                className="aprovar-modal__input"
                value={faturamento}
                onChange={(e) => {
                  setFaturamento(e.target.value)
                  if (erro) setErro('')
                }}
              >
                {opcoes.length === 0 ? (
                  <option value="">Nenhum faturamento cadastrado</option>
                ) : (
                  opcoes.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {faturamento && servicosSelecionados.length > 0 && (
            <div className="aprovar-modal__stats">
              <div className="aprovar-modal__stat">
                <span className="aprovar-modal__stat-label">Serviços</span>
                <strong className="aprovar-modal__stat-value">
                  {servicosSelecionados.length}
                </strong>
              </div>
              <div className="aprovar-modal__stat">
                <span className="aprovar-modal__stat-label">Viaturas</span>
                <strong className="aprovar-modal__stat-value">{placasUnicas}</strong>
              </div>
              <div className="aprovar-modal__stat aprovar-modal__stat--highlight">
                <span className="aprovar-modal__stat-label">Valor total</span>
                <strong className="aprovar-modal__stat-value">
                  {formatarValor(total)}
                </strong>
              </div>
            </div>
          )}

          {faturamento && (
            <div className="aprovar-modal__preview">
              <span className="aprovar-modal__preview-label">Conteúdo do PDF</span>
              <p className="aprovar-modal__preview-text">
                Resumo por placa ({placasUnicas} viatura
                {placasUnicas === 1 ? '' : 's'}) e detalhamento de{' '}
                {servicosSelecionados.length} serviço
                {servicosSelecionados.length === 1 ? '' : 's'} do{' '}
                {formatarLabelFaturamento(faturamento)}, incluindo peças
                utilizadas (quando houver), descrição, data de saída e retorno da
                oficina por ordem de serviço.
              </p>
            </div>
          )}

          {erro && (
            <p className="aprovar-modal__erro" role="alert">
              {erro}
            </p>
          )}
        </div>

        <footer className="aprovar-modal__footer">
          <Button variant="secondary" onClick={onFechar}>
            Cancelar
          </Button>
          <Button
            className="aprovar-modal__confirm"
            onClick={handleGerar}
            disabled={opcoes.length === 0}
          >
            Gerar PDF
          </Button>
        </footer>
      </div>
    </div>
  )
}

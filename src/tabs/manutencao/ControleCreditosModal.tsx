import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import {
  IconControleCreditos,
  IconEditar,
  IconItensLancados,
  IconLixeira,
} from '../../components/icons/ManutencaoIcons'
import { DataInput } from '../../components/inputs/DataInput'
import { MoedaInput } from '../../components/inputs/MoedaInput'
import {
  formatarMoeda,
  normalizarDataBr,
  parseValorMoeda,
} from '../../utils/formatoBr'
import type { FaturamentoOption } from './faturamentoOptions'
import { formatarLabelFaturamento } from './faturamentoOptions'
import {
  carregarControleCreditos,
  salvarControleCreditos,
  type ControleCreditosDados,
  type CreditoCompra,
  type CreditoPagamento,
} from './controleCreditosStorage'
import '../../styles/modern-ui.css'
import './ControleCreditosModal.css'

interface ControleCreditosPanelProps {
  aberto: boolean
  opcoesFaturamento: FaturamentoOption[]
  onFechar: () => void
}

function novoId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface ControleCreditosItensModalProps {
  aberto: boolean
  dados: ControleCreditosDados
  onFechar: () => void
  onEditarPagamento: (pagamento: CreditoPagamento) => void
  onEditarCompra: (compra: CreditoCompra) => void
  onRemoverPagamento: (id: string) => void
  onRemoverCompra: (id: string) => void
}

function ControleCreditosItensModal({
  aberto,
  dados,
  onFechar,
  onEditarPagamento,
  onEditarCompra,
  onRemoverPagamento,
  onRemoverCompra,
}: ControleCreditosItensModalProps) {
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
        className="modern-modal-shell controle-creditos-itens-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="controle-creditos-itens-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <div className="modern-modal-header__main">
            <div>
              <h2
                id="controle-creditos-itens-title"
                className="modern-modal-header__title"
              >
                Itens lançados
              </h2>
              <p className="modern-modal-header__subtitle">
                {dados.pagamentos.length} pagamento(s) · {dados.compras.length}{' '}
                compra(s)
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modern-modal-close"
            aria-label="Fechar"
            onClick={onFechar}
          >
            ×
          </button>
        </header>

        <div className="modern-modal-body">
          <div className="controle-creditos-itens-modal__grid">
            <section className="controle-creditos-itens-modal__secao">
              <h3 className="controle-creditos-itens-modal__secao-titulo controle-creditos-itens-modal__secao-titulo--pagamentos">
                Pagamentos
              </h3>
              {dados.pagamentos.length === 0 ? (
                <p className="controle-creditos-modal__lista-vazia">
                  Nenhum pagamento
                </p>
              ) : (
                <ul className="controle-creditos-modal__lista controle-creditos-modal__lista--modal">
                  {dados.pagamentos.map((p) => (
                    <li key={p.id} className="controle-creditos-modal__item">
                      <div className="controle-creditos-modal__item-info">
                        <span className="controle-creditos-modal__item-titulo">
                          {formatarLabelFaturamento(p.faturamento)}
                        </span>
                        <span className="controle-creditos-modal__item-detalhe">
                          {p.data}
                        </span>
                      </div>
                      <span className="controle-creditos-modal__item-valor">
                        {formatarMoeda(p.valor)}
                      </span>
                      <div className="controle-creditos-modal__item-acoes">
                        <button
                          type="button"
                          className="controle-creditos-modal__item-editar"
                          aria-label="Editar pagamento"
                          title="Editar pagamento"
                          onClick={() => onEditarPagamento(p)}
                        >
                          <IconEditar width={14} height={14} />
                        </button>
                        <button
                          type="button"
                          className="controle-creditos-modal__item-remover"
                          aria-label="Remover pagamento"
                          onClick={() => onRemoverPagamento(p.id)}
                        >
                          <IconLixeira width={14} height={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="controle-creditos-itens-modal__secao">
              <h3 className="controle-creditos-itens-modal__secao-titulo controle-creditos-itens-modal__secao-titulo--compras">
                Compras
              </h3>
              {dados.compras.length === 0 ? (
                <p className="controle-creditos-modal__lista-vazia">
                  Nenhuma compra
                </p>
              ) : (
                <ul className="controle-creditos-modal__lista controle-creditos-modal__lista--modal">
                  {dados.compras.map((c) => (
                    <li key={c.id} className="controle-creditos-modal__item">
                      <div className="controle-creditos-modal__item-info">
                        <span className="controle-creditos-modal__item-titulo">
                          {c.item}
                        </span>
                      </div>
                      <span className="controle-creditos-modal__item-valor">
                        {formatarMoeda(c.valor)}
                      </span>
                      <div className="controle-creditos-modal__item-acoes">
                        <button
                          type="button"
                          className="controle-creditos-modal__item-editar"
                          aria-label={`Editar ${c.item}`}
                          title="Editar compra"
                          onClick={() => onEditarCompra(c)}
                        >
                          <IconEditar width={14} height={14} />
                        </button>
                        <button
                          type="button"
                          className="controle-creditos-modal__item-remover"
                          aria-label={`Remover ${c.item}`}
                          onClick={() => onRemoverCompra(c.id)}
                        >
                          <IconLixeira width={14} height={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>

        <footer className="modern-modal-footer">
          <Button type="button" variant="secondary" onClick={onFechar}>
            Fechar
          </Button>
        </footer>
      </div>
    </div>
  )
}

export function ControleCreditosPanel({
  aberto,
  opcoesFaturamento,
  onFechar,
}: ControleCreditosPanelProps) {
  const [dados, setDados] = useState<ControleCreditosDados>(() =>
    carregarControleCreditos(),
  )
  const [modalItensAberto, setModalItensAberto] = useState(false)
  const modalItensAbertoRef = useRef(false)
  modalItensAbertoRef.current = modalItensAberto

  const [faturamento, setFaturamento] = useState('')
  const [dataPagamento, setDataPagamento] = useState('')
  const [valorPagamento, setValorPagamento] = useState('')

  const [itemCompra, setItemCompra] = useState('')
  const [valorCompra, setValorCompra] = useState('')

  const [editandoPagamentoId, setEditandoPagamentoId] = useState<string | null>(
    null,
  )
  const [editandoCompraId, setEditandoCompraId] = useState<string | null>(null)

  const opcoesFaturamentoCadastro = useMemo(
    () => opcoesFaturamento.filter((o) => o.value !== 'todos'),
    [opcoesFaturamento],
  )

  const totalPagamentos = useMemo(
    () => dados.pagamentos.reduce((s, p) => s + p.valor, 0),
    [dados.pagamentos],
  )

  const totalCompras = useMemo(
    () => dados.compras.reduce((s, c) => s + c.valor, 0),
    [dados.compras],
  )

  const totalItens = dados.pagamentos.length + dados.compras.length

  const balanco = totalPagamentos - totalCompras

  useEffect(() => {
    if (!aberto) return

    setDados(carregarControleCreditos())
    setModalItensAberto(false)
    setFaturamento('')
    setDataPagamento('')
    setValorPagamento('')
    setItemCompra('')
    setValorCompra('')
    setEditandoPagamentoId(null)
    setEditandoCompraId(null)
  }, [aberto])

  useEffect(() => {
    if (!aberto) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (modalItensAbertoRef.current) setModalItensAberto(false)
      else onFechar()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [aberto, onFechar])

  useEffect(() => {
    if (!aberto) return
    salvarControleCreditos(dados)
  }, [aberto, dados])

  const persistir = (proximo: ControleCreditosDados) => {
    setDados(proximo)
  }

  const limparFormularioPagamento = () => {
    setFaturamento('')
    setDataPagamento('')
    setValorPagamento('')
    setEditandoPagamentoId(null)
  }

  const limparFormularioCompra = () => {
    setItemCompra('')
    setValorCompra('')
    setEditandoCompraId(null)
  }

  const salvarPagamento = () => {
    const fat = faturamento.trim()
    const data = normalizarDataBr(dataPagamento)
    const valor = parseValorMoeda(valorPagamento)
    if (!fat || !data || valor <= 0) return

    const registro: CreditoPagamento = {
      id: editandoPagamentoId ?? novoId(),
      faturamento: fat,
      data,
      valor,
    }
    persistir({ ...dados, pagamentos: [registro, ...dados.pagamentos] })
    limparFormularioPagamento()
  }

  const salvarCompra = () => {
    const item = itemCompra.trim()
    const valor = parseValorMoeda(valorCompra)
    if (!item || valor <= 0) return

    const registro: CreditoCompra = {
      id: editandoCompraId ?? novoId(),
      item,
      valor,
    }
    persistir({ ...dados, compras: [registro, ...dados.compras] })
    limparFormularioCompra()
  }

  const editarPagamento = (pagamento: CreditoPagamento) => {
    limparFormularioCompra()
    persistir({
      ...dados,
      pagamentos: dados.pagamentos.filter((p) => p.id !== pagamento.id),
    })
    setFaturamento(pagamento.faturamento)
    setDataPagamento(pagamento.data)
    setValorPagamento(formatarMoeda(pagamento.valor))
    setEditandoPagamentoId(pagamento.id)
    setModalItensAberto(false)
  }

  const editarCompra = (compra: CreditoCompra) => {
    limparFormularioPagamento()
    persistir({
      ...dados,
      compras: dados.compras.filter((c) => c.id !== compra.id),
    })
    setItemCompra(compra.item)
    setValorCompra(formatarMoeda(compra.valor))
    setEditandoCompraId(compra.id)
    setModalItensAberto(false)
  }

  const removerPagamento = (id: string) => {
    persistir({
      ...dados,
      pagamentos: dados.pagamentos.filter((p) => p.id !== id),
    })
  }

  const removerCompra = (id: string) => {
    persistir({
      ...dados,
      compras: dados.compras.filter((c) => c.id !== id),
    })
  }

  if (!aberto) return null

  const classeBalanco =
    balanco > 0
      ? 'controle-creditos-modal__balanco-valor--positivo'
      : balanco < 0
        ? 'controle-creditos-modal__balanco-valor--negativo'
        : 'controle-creditos-modal__balanco-valor--zero'

  return (
    <>
      <section
        className="controle-creditos-panel"
        aria-labelledby="controle-creditos-title"
      >
        <header className="controle-creditos-panel__header">
          <div className="controle-creditos-panel__header-main">
            <span className="controle-creditos-panel__icone" aria-hidden>
              <IconControleCreditos width={20} height={20} />
            </span>
            <div>
              <h2
                id="controle-creditos-title"
                className="controle-creditos-panel__titulo"
              >
                Controle de créditos
              </h2>
              <p className="controle-creditos-panel__subtitulo">
                Registre entradas (pagamentos) e saídas (compras)
              </p>
            </div>
          </div>
          <div className="controle-creditos-panel__header-acoes">
            <button
              type="button"
              className="controle-creditos-panel__btn-itens"
              aria-label="Ver itens lançados"
              title="Ver itens lançados"
              onClick={() => setModalItensAberto(true)}
            >
              <IconItensLancados width={18} height={18} />
              {totalItens > 0 && (
                <span className="controle-creditos-panel__btn-itens-badge">
                  {totalItens}
                </span>
              )}
            </button>
            <Button type="button" variant="ghost" onClick={onFechar}>
              Fechar
            </Button>
          </div>
        </header>

        <div className="controle-creditos-panel__corpo">
          <div className="controle-creditos-modal__grid">
            <section
              className={`controle-creditos-modal__card controle-creditos-modal__card--pagamentos${
                editandoPagamentoId ? ' controle-creditos-modal__card--editando' : ''
              }`}
            >
              <h3 className="controle-creditos-modal__card-titulo">Pagamentos</h3>
              <form
                className="controle-creditos-modal__form"
                onSubmit={(e) => {
                  e.preventDefault()
                  salvarPagamento()
                }}
              >
                <label className="controle-creditos-modal__campo">
                  <span className="controle-creditos-modal__label">Faturamento</span>
                  {opcoesFaturamentoCadastro.length > 0 ? (
                    <select
                      value={faturamento}
                      onChange={(e) => setFaturamento(e.target.value)}
                    >
                      <option value="">Selecione…</option>
                      {opcoesFaturamentoCadastro.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={faturamento}
                      onChange={(e) => setFaturamento(e.target.value)}
                      placeholder="Ex.: 15º Faturamento"
                    />
                  )}
                </label>
                <label className="controle-creditos-modal__campo">
                  <span className="controle-creditos-modal__label">Data</span>
                  <DataInput value={dataPagamento} onValueChange={setDataPagamento} />
                </label>
                <label className="controle-creditos-modal__campo">
                  <span className="controle-creditos-modal__label">Valor</span>
                  <MoedaInput
                    value={valorPagamento}
                    onValueChange={setValorPagamento}
                  />
                </label>
                <Button type="submit" variant="primary">
                  {editandoPagamentoId ? 'Salvar alterações' : 'Adicionar pagamento'}
                </Button>
                {editandoPagamentoId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={limparFormularioPagamento}
                  >
                    Cancelar edição
                  </Button>
                )}
              </form>
            </section>

            <section
              className={`controle-creditos-modal__card controle-creditos-modal__card--compras${
                editandoCompraId ? ' controle-creditos-modal__card--editando' : ''
              }`}
            >
              <h3 className="controle-creditos-modal__card-titulo">Compras</h3>
              <form
                className="controle-creditos-modal__form"
                onSubmit={(e) => {
                  e.preventDefault()
                  salvarCompra()
                }}
              >
                <label className="controle-creditos-modal__campo">
                  <span className="controle-creditos-modal__label">Item</span>
                  <input
                    type="text"
                    value={itemCompra}
                    onChange={(e) => setItemCompra(e.target.value)}
                    placeholder="Descrição da compra"
                  />
                </label>
                <label className="controle-creditos-modal__campo">
                  <span className="controle-creditos-modal__label">Valor</span>
                  <MoedaInput value={valorCompra} onValueChange={setValorCompra} />
                </label>
                <Button type="submit" variant="secondary">
                  {editandoCompraId ? 'Salvar alterações' : 'Adicionar compra'}
                </Button>
                {editandoCompraId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={limparFormularioCompra}
                  >
                    Cancelar edição
                  </Button>
                )}
              </form>
            </section>
          </div>

          <div className="controle-creditos-modal__balanco">
            <p className="controle-creditos-modal__balanco-label">Balanço</p>
            <p className={`controle-creditos-modal__balanco-valor ${classeBalanco}`}>
              {formatarMoeda(balanco)}
            </p>
            <p className="controle-creditos-modal__balanco-detalhe">
              Pagamentos {formatarMoeda(totalPagamentos)} − Compras{' '}
              {formatarMoeda(totalCompras)}
            </p>
          </div>
        </div>
      </section>

      <ControleCreditosItensModal
        aberto={modalItensAberto}
        dados={dados}
        onFechar={() => setModalItensAberto(false)}
        onEditarPagamento={editarPagamento}
        onEditarCompra={editarCompra}
        onRemoverPagamento={removerPagamento}
        onRemoverCompra={removerCompra}
      />
    </>
  )
}

/** @deprecated Use ControleCreditosPanel */
export const ControleCreditosModal = ControleCreditosPanel

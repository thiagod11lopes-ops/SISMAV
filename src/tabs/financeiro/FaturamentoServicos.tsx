import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { SectionCard } from '../../components/SectionCard'
import { formatarValor } from '../manutencao/filterUtils'
import {
  formatarLabelFaturamento,
  montarOpcoesFaturamentoSistema,
} from '../manutencao/faturamentoOptions'
import { useServicos } from '../manutencao/useServicos'
import { calcularTotalFaturarPorFaturamento } from './faturamentoServicosUtils'
import {
  carregarPagamentos,
  salvarPagamentos,
  type PagamentoRegistro,
} from './pagamentosStorage'
import {
  calcularSaldoContrato,
  calcularSaldoContratoParaEdicao,
  calcularSaldoSolemp,
  calcularSaldoSolempParaEdicao,
  faturamentoJaPago,
} from './saldoFinanceiroUtils'
import { useContratos } from './useContratos'
import { usePagamentos } from './usePagamentos'
import { useSolemps } from './useSolemps'
import { formatarDataPagamento, formatarValorMoeda } from './valorUtils'
import {
  PagamentoSucessoModal,
  type DadosPagamentoSucesso,
} from './PagamentoSucessoModal'
import './PagamentoSucessoModal.css'
import {
  SaldoSolempInsuficienteModal,
  type DadosSaldoSolempInsuficiente,
} from './SaldoSolempInsuficienteModal'
import './SaldoSolempInsuficienteModal.css'
import '../../styles/modern-ui.css'
import './FaturamentoServicos.css'

type MensagemPagamento = {
  tipo: 'erro'
  texto: string
}

interface FaturamentoServicosProps {
  pagamentoEmEdicao?: PagamentoRegistro | null
  onLimparEdicaoPagamento?: () => void
}

export function FaturamentoServicos({
  pagamentoEmEdicao = null,
  onLimparEdicaoPagamento,
}: FaturamentoServicosProps) {
  const servicos = useServicos()
  const solempCadastradas = useSolemps()
  const contratos = useContratos()
  const pagamentos = usePagamentos()
  const [faturamentoSelecionado, setFaturamentoSelecionado] = useState('')
  const [solempSelecionada, setSolempSelecionada] = useState('')
  const [mensagem, setMensagem] = useState<MensagemPagamento | null>(null)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [dadosPagamentoSucesso, setDadosPagamentoSucesso] =
    useState<DadosPagamentoSucesso | null>(null)
  const [sucessoAtualizacao, setSucessoAtualizacao] = useState(false)
  const [modalSaldoInsuficienteAberto, setModalSaldoInsuficienteAberto] = useState(false)
  const [dadosSaldoInsuficiente, setDadosSaldoInsuficiente] =
    useState<DadosSaldoSolempInsuficiente | null>(null)

  const modoEdicao = pagamentoEmEdicao !== null
  const pagamentoEdicaoId = pagamentoEmEdicao?.id

  useEffect(() => {
    if (!pagamentoEmEdicao) return
    setFaturamentoSelecionado(pagamentoEmEdicao.faturamento)
    setSolempSelecionada(pagamentoEmEdicao.solempId)
    setMensagem(null)
  }, [pagamentoEmEdicao])

  const opcoesFaturamento = useMemo(
    () => montarOpcoesFaturamentoSistema(servicos),
    [servicos],
  )

  const { total, quantidade } = useMemo(
    () => calcularTotalFaturarPorFaturamento(servicos, faturamentoSelecionado),
    [servicos, faturamentoSelecionado],
  )

  const solempAtual = useMemo(
    () => solempCadastradas.find((solemp) => solemp.id === solempSelecionada),
    [solempCadastradas, solempSelecionada],
  )

  const calcularSaldoSolempAtual = (solempId: string) => {
    const solemp = solempCadastradas.find((item) => item.id === solempId)
    if (!solemp) return 0
    if (modoEdicao) {
      return calcularSaldoSolempParaEdicao(solemp, pagamentos, pagamentoEdicaoId)
    }
    return calcularSaldoSolemp(solemp, pagamentos)
  }

  const saldoSolemp = solempAtual ? calcularSaldoSolempAtual(solempAtual.id) : 0

  const saldoContrato = useMemo(() => {
    if (!solempAtual) return 0
    const contrato = contratos.find((item) => item.id === solempAtual.contratoId)
    if (!contrato) return 0
    if (modoEdicao) {
      return calcularSaldoContratoParaEdicao(contrato, pagamentos, pagamentoEdicaoId)
    }
    return calcularSaldoContrato(contrato, pagamentos)
  }, [solempAtual, contratos, pagamentos, modoEdicao, pagamentoEdicaoId])

  const faturamentoPago = faturamentoSelecionado
    ? faturamentoJaPago(faturamentoSelecionado, pagamentos, pagamentoEdicaoId)
    : false

  const podeConfirmarPagamento =
    Boolean(faturamentoSelecionado) &&
    Boolean(solempSelecionada) &&
    total > 0 &&
    quantidade > 0 &&
    !faturamentoPago

  const abrirModalSaldoInsuficiente = (
    numeroSolemp: string,
    saldo: number,
    valorFaturamento: number,
  ) => {
    setDadosSaldoInsuficiente({
      numeroSolemp,
      saldoSolemp: saldo,
      valorFaturamento,
    })
    setModalSaldoInsuficienteAberto(true)
  }

  const abrirModalSucesso = (
    dados: DadosPagamentoSucesso,
    atualizacao: boolean,
  ) => {
    setDadosPagamentoSucesso(dados)
    setSucessoAtualizacao(atualizacao)
    setModalSucessoAberto(true)
  }

  const handleConfirmarPagamento = () => {
    setMensagem(null)

    if (!faturamentoSelecionado || !solempAtual) {
      setMensagem({
        tipo: 'erro',
        texto: 'Selecione o faturamento e a Solemp para gerar o pagamento.',
      })
      return
    }

    if (total <= 0 || quantidade <= 0) {
      setMensagem({
        tipo: 'erro',
        texto: 'Não há serviços marcados para faturar neste faturamento.',
      })
      return
    }

    if (faturamentoJaPago(faturamentoSelecionado, pagamentos, pagamentoEdicaoId)) {
      setMensagem({
        tipo: 'erro',
        texto: 'Este faturamento já foi pago anteriormente.',
      })
      return
    }

    const contrato = contratos.find((item) => item.id === solempAtual.contratoId)
    if (!contrato) {
      setMensagem({
        tipo: 'erro',
        texto: 'Contrato vinculado à Solemp não foi encontrado.',
      })
      return
    }

    const saldoSolempValidacao = calcularSaldoSolempAtual(solempAtual.id)
    if (saldoSolempValidacao < total) {
      abrirModalSaldoInsuficiente(
        solempAtual.numeroSolemp,
        saldoSolempValidacao,
        total,
      )
      return
    }

    const saldoContratoValidacao = modoEdicao
      ? calcularSaldoContratoParaEdicao(contrato, pagamentos, pagamentoEdicaoId)
      : calcularSaldoContrato(contrato, pagamentos)

    if (saldoContratoValidacao < total) {
      setMensagem({
        tipo: 'erro',
        texto: `Saldo insuficiente no contrato. Disponível: ${formatarValorMoeda(saldoContratoValidacao)}.`,
      })
      return
    }

    const faturamentoLabel = formatarLabelFaturamento(
      opcoesFaturamento.find((opcao) => opcao.value === faturamentoSelecionado)
        ?.label ?? faturamentoSelecionado,
    )

    const dadosSucesso: DadosPagamentoSucesso = {
      valor: total,
      faturamentoLabel,
      numeroSolemp: solempAtual.numeroSolemp,
      numeroContrato: contrato.numeroContrato,
    }

    if (modoEdicao && pagamentoEmEdicao) {
      const pagamentosAtualizados = carregarPagamentos().map((pagamento) =>
        pagamento.id === pagamentoEmEdicao.id
          ? {
              ...pagamento,
              dataPagamento: formatarDataPagamento(),
              faturamento: faturamentoSelecionado,
              faturamentoLabel,
              valor: total,
              quantidadeServicos: quantidade,
              solempId: solempAtual.id,
              numeroSolemp: solempAtual.numeroSolemp,
              contratoId: contrato.id,
              numeroContrato: contrato.numeroContrato,
            }
          : pagamento,
      )
      salvarPagamentos(pagamentosAtualizados)
      onLimparEdicaoPagamento?.()
      abrirModalSucesso(dadosSucesso, true)
      return
    }

    const novoPagamento: PagamentoRegistro = {
      id: String(Date.now()),
      dataPagamento: formatarDataPagamento(),
      faturamento: faturamentoSelecionado,
      faturamentoLabel,
      valor: total,
      quantidadeServicos: quantidade,
      solempId: solempAtual.id,
      numeroSolemp: solempAtual.numeroSolemp,
      contratoId: contrato.id,
      numeroContrato: contrato.numeroContrato,
    }

    salvarPagamentos([novoPagamento, ...carregarPagamentos()])
    abrirModalSucesso(dadosSucesso, false)
  }

  const handleFecharModalSaldoInsuficiente = () => {
    setModalSaldoInsuficienteAberto(false)
    setDadosSaldoInsuficiente(null)
  }

  const handleFecharModalSucesso = () => {
    setModalSucessoAberto(false)
    setDadosPagamentoSucesso(null)
    setSucessoAtualizacao(false)
  }

  const handleCancelarEdicao = () => {
    setFaturamentoSelecionado('')
    setSolempSelecionada('')
    setMensagem(null)
    onLimparEdicaoPagamento?.()
  }

  return (
    <div className="faturamento-servicos">
      <SectionCard title="Gerar Faturamento de Serviços">
        <form
          className="faturamento-servicos__form"
          onSubmit={(e) => e.preventDefault()}
        >
          {modoEdicao && pagamentoEmEdicao && (
            <div className="modern-banner" role="status">
              Editando pagamento do faturamento{' '}
              <strong>
                {formatarLabelFaturamento(pagamentoEmEdicao.faturamentoLabel)}
              </strong>
              .
            </div>
          )}

          <label className="faturamento-servicos__field" htmlFor="faturamento-pago">
            <span className="faturamento-servicos__label">Faturamento a ser pago</span>
            <select
              id="faturamento-pago"
              className="faturamento-servicos__select"
              value={faturamentoSelecionado}
              onChange={(e) => {
                setFaturamentoSelecionado(e.target.value)
                setMensagem(null)
              }}
            >
              <option value="">Selecione o faturamento</option>
              {opcoesFaturamento.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                  {faturamentoJaPago(opcao.value, pagamentos, pagamentoEdicaoId)
                    ? ' (pago)'
                    : ''}
                </option>
              ))}
            </select>
          </label>

          <div className="faturamento-servicos__total-card">
            <span className="faturamento-servicos__total-label">
              Valor total dos serviços marcados na coluna Faturar
            </span>
            <strong className="faturamento-servicos__total-valor">
              {faturamentoSelecionado
                ? formatarValor(total)
                : 'Selecione um faturamento acima'}
            </strong>
            {faturamentoSelecionado && (
              <span className="faturamento-servicos__total-detalhe">
                {quantidade} serviço{quantidade === 1 ? '' : 's'} marcado
                {quantidade === 1 ? '' : 's'} para faturar
                {faturamentoPago && ' · Faturamento já pago'}
              </span>
            )}
          </div>

          <label className="faturamento-servicos__field" htmlFor="solemp-saldo">
            <span className="faturamento-servicos__label">Usar saldo da Solemp</span>
            <select
              id="solemp-saldo"
              className="faturamento-servicos__select"
              value={solempSelecionada}
              onChange={(e) => {
                setSolempSelecionada(e.target.value)
                setMensagem(null)
              }}
            >
              <option value="">Selecione a Solemp</option>
              {solempCadastradas.map((solemp) => {
                const saldo = calcularSaldoSolempAtual(solemp.id)
                return (
                  <option key={solemp.id} value={solemp.id}>
                    {solemp.numeroSolemp}
                    {solemp.numeroContrato && solemp.numeroContrato !== '—'
                      ? ` — Contrato ${solemp.numeroContrato}`
                      : ''}
                    {' — Saldo '}
                    {formatarValorMoeda(saldo)}
                  </option>
                )
              })}
            </select>
          </label>

          {solempAtual && (
            <div className="faturamento-servicos__saldo-info">
              <span>
                Saldo da Solemp: <strong>{formatarValorMoeda(saldoSolemp)}</strong>
              </span>
              <span>
                Saldo do contrato {solempAtual.numeroContrato}:{' '}
                <strong>{formatarValorMoeda(saldoContrato)}</strong>
              </span>
            </div>
          )}

          {mensagem && (
            <p
              className="faturamento-servicos__mensagem faturamento-servicos__mensagem--erro"
              role="alert"
            >
              {mensagem.texto}
            </p>
          )}

          <div className="faturamento-servicos__actions">
            <Button
              type="button"
              onClick={handleConfirmarPagamento}
              disabled={!podeConfirmarPagamento}
            >
              {modoEdicao ? 'Atualizar Pagamento' : 'Gerar Pagamento'}
            </Button>
            {modoEdicao && (
              <Button type="button" variant="secondary" onClick={handleCancelarEdicao}>
                Cancelar edição
              </Button>
            )}
          </div>
        </form>
      </SectionCard>

      <PagamentoSucessoModal
        aberto={modalSucessoAberto}
        dados={dadosPagamentoSucesso}
        atualizado={sucessoAtualizacao}
        onFechar={handleFecharModalSucesso}
      />

      <SaldoSolempInsuficienteModal
        aberto={modalSaldoInsuficienteAberto}
        dados={dadosSaldoInsuficiente}
        onFechar={handleFecharModalSaldoInsuficiente}
      />
    </div>
  )
}

import {
  formatarData,
  formatarMoeda,
  parseDataBr,
  parseValorMoeda,
  subtrairAnosDataBr,
} from '../../utils/formatoBr'
import type { PagamentoRegistro } from '../financeiro/pagamentosStorage'
import type { AnotacoesPorData } from '../manutencao/anotacoesStorage'
import { carregarAnotacoes } from '../manutencao/anotacoesStorage'
import {
  getAprovacaoServico,
  type ServicoRegistro,
} from '../manutencao/servicoTypes'
import { servicosParaCalculosGlobais } from '../manutencao/faturamentoOptions'
import { carregarServicos } from '../manutencao/servicosStorage'
import { carregarContratos } from '../financeiro/contratoStorage'
import { carregarPagamentos } from '../financeiro/pagamentosStorage'
import {
  calcularSaldoContrato,
  calcularSaldoSolemp,
  calcularValorUtilizadoContrato,
} from '../financeiro/saldoFinanceiroUtils'
import { carregarSolemps } from '../financeiro/solempStorage'
import type { TipoViatura } from '../viaturas/CadastrarViaturaCard'
import { carregarViaturas } from '../viaturas/viaturasStorage'
import { VIATURAS_INICIAIS } from '../viaturas/viaturasData'
import type { ViaturaLinha } from '../viaturas/types'

const MESES_CURTOS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const

export interface PeriodoBalanco {
  dataInicio: string
  dataFim: string
}

export function periodoPadraoBalanco(): PeriodoBalanco {
  const dataFim = formatarData()
  return {
    dataInicio: subtrairAnosDataBr(dataFim, 1),
    dataFim,
  }
}

function limitesPeriodo(dataInicio: string, dataFim: string) {
  const inicio = dataInicio.trim() ? parseDataBr(dataInicio) : null
  const fim = dataFim.trim() ? parseDataBr(dataFim) : null
  if (inicio) inicio.setHours(0, 0, 0, 0)
  if (fim) fim.setHours(23, 59, 59, 999)
  return { inicio, fim }
}

export function dataNoPeriodo(
  dataBr: string,
  dataInicio: string,
  dataFim: string,
): boolean {
  const data = parseDataBr(dataBr)
  if (!data) return false
  const { inicio, fim } = limitesPeriodo(dataInicio, dataFim)
  if (inicio && data < inicio) return false
  if (fim && data > fim) return false
  return true
}

function dataChaveNoPeriodo(
  dataChave: string,
  dataInicio: string,
  dataFim: string,
): boolean {
  const data = new Date(`${dataChave}T12:00:00`)
  if (Number.isNaN(data.getTime())) return false
  const { inicio, fim } = limitesPeriodo(dataInicio, dataFim)
  if (inicio && data < inicio) return false
  if (fim && data > fim) return false
  return true
}

function filtrarServicosPorPeriodo(
  servicos: ServicoRegistro[],
  dataInicio: string,
  dataFim: string,
): ServicoRegistro[] {
  return servicos.filter((servico) =>
    dataNoPeriodo(servico.dataSaida, dataInicio, dataFim),
  )
}

function filtrarPagamentosPorPeriodo(
  pagamentos: PagamentoRegistro[],
  dataInicio: string,
  dataFim: string,
): PagamentoRegistro[] {
  return pagamentos.filter((pagamento) =>
    dataNoPeriodo(pagamento.dataPagamento, dataInicio, dataFim),
  )
}

function contarAnotacoesNoPeriodo(
  anotacoes: AnotacoesPorData,
  dataInicio: string,
  dataFim: string,
): number {
  return Object.entries(anotacoes).filter(
    ([chave, texto]) => texto.trim() && dataChaveNoPeriodo(chave, dataInicio, dataFim),
  ).length
}

function referenciaMesServico(servico: ServicoRegistro): {
  ano: number
  mes: number
} | null {
  const dataSaida = parseDataBr(servico.dataSaida)
  if (dataSaida) {
    return { ano: dataSaida.getFullYear(), mes: dataSaida.getMonth() + 1 }
  }
  if (servico.ano && servico.mes) {
    return { ano: servico.ano, mes: servico.mes }
  }
  return null
}

export function labelMesAno(ano: number, mes: number): string {
  const indice = Math.min(Math.max(mes, 1), 12) - 1
  return `${MESES_CURTOS[indice]}/${String(ano).slice(-2)}`
}

export interface BalancoKpis {
  totalServicos: number
  valorServicos: number
  servicosFaturados: number
  servicosPendentes: number
  totalViaturas: number
  patrimonioViaturas: number
  totalContratos: number
  valorContratos: number
  saldoContratos: number
  totalSolemps: number
  valorSolemps: number
  saldoSolemps: number
  totalPagamentos: number
  valorPagamentos: number
  diasComAnotacao: number
}

export interface SerieMes {
  chave: string
  label: string
  valor: number
  quantidade: number
}

export interface SerieNomeValor {
  name: string
  value: number
  quantidade?: number
}

export interface SerieModulo {
  modulo: string
  quantidade: number
}

export interface SerieContratoFinanceiro {
  name: string
  utilizado: number
  restante: number
}

export interface GastosViaturasPorTipo {
  ambulancia: number
  administrativo: number
  total: number
  servicosAmbulancia: number
  servicosAdministrativo: number
}

export interface BalancoSistema {
  kpis: BalancoKpis
  gastosViaturas: GastosViaturasPorTipo
  servicosPorMes: SerieMes[]
  pagamentosPorMes: SerieMes[]
  servicosPorCategoria: SerieNomeValor[]
  servicosPorStatus: SerieNomeValor[]
  servicosPorAprovacao: SerieNomeValor[]
  registrosPorModulo: SerieModulo[]
  gastoPorViatura: SerieNomeValor[]
  contratosFinanceiro: SerieContratoFinanceiro[]
}

function somarPorChaveMes(
  itens: Array<{ ano: number; mes: number; valor: number }>,
): SerieMes[] {
  const mapa = new Map<string, { ano: number; mes: number; valor: number; quantidade: number }>()

  for (const item of itens) {
    const chave = `${item.ano}-${String(item.mes).padStart(2, '0')}`
    const atual = mapa.get(chave) ?? {
      ano: item.ano,
      mes: item.mes,
      valor: 0,
      quantidade: 0,
    }
    atual.valor += item.valor
    atual.quantidade += 1
    mapa.set(chave, atual)
  }

  return [...mapa.values()]
    .sort((a, b) => a.ano * 100 + a.mes - (b.ano * 100 + b.mes))
    .map((item) => ({
      chave: `${item.ano}-${String(item.mes).padStart(2, '0')}`,
      label: labelMesAno(item.ano, item.mes),
      valor: item.valor,
      quantidade: item.quantidade,
    }))
}

function labelAprovacao(status: ReturnType<typeof getAprovacaoServico>): string {
  if (status === 'aprovado') return 'Aprovado'
  if (status === 'pre-aprovado') return 'Pré-aprovado'
  return 'Não aprovado'
}

function labelCategoria(categoria: string): string {
  return categoria === 'ambulancia' ? 'Ambulância' : 'Administrativo'
}

function normalizarPlaca(placa: string): string {
  return placa.trim().toUpperCase()
}

function resolverTipoViaturaServico(
  servico: ServicoRegistro,
  tipoPorPlaca: Map<string, TipoViatura>,
): TipoViatura {
  const placa = normalizarPlaca(servico.viatura)
  if (placa && tipoPorPlaca.has(placa)) {
    return tipoPorPlaca.get(placa)!
  }
  return servico.categoria
}

export function calcularGastosViaturasPorTipo(
  servicos: ServicoRegistro[],
  viaturas: ViaturaLinha[],
): GastosViaturasPorTipo {
  servicos = servicosParaCalculosGlobais(servicos)
  const tipoPorPlaca = new Map<string, TipoViatura>()
  for (const viatura of viaturas) {
    tipoPorPlaca.set(normalizarPlaca(viatura.placa), viatura.tipo)
  }

  let ambulancia = 0
  let administrativo = 0
  let servicosAmbulancia = 0
  let servicosAdministrativo = 0

  for (const servico of servicos) {
    const valor = Number(servico.valor) || 0
    const tipo = resolverTipoViaturaServico(servico, tipoPorPlaca)
    if (tipo === 'ambulancia') {
      ambulancia += valor
      servicosAmbulancia += 1
    } else {
      administrativo += valor
      servicosAdministrativo += 1
    }
  }

  return {
    ambulancia,
    administrativo,
    total: ambulancia + administrativo,
    servicosAmbulancia,
    servicosAdministrativo,
  }
}

export function calcularBalancoSistema(
  dataInicio: string,
  dataFim: string,
): BalancoSistema {
  const servicos = servicosParaCalculosGlobais(
    filtrarServicosPorPeriodo(carregarServicos(), dataInicio, dataFim),
  )
  const viaturas = carregarViaturas(VIATURAS_INICIAIS)
  const contratos = carregarContratos()
  const solemps = carregarSolemps()
  const pagamentosTodos = carregarPagamentos()
  const pagamentos = filtrarPagamentosPorPeriodo(
    pagamentosTodos,
    dataInicio,
    dataFim,
  )
  const anotacoes = carregarAnotacoes()
  const diasComAnotacao = contarAnotacoesNoPeriodo(
    anotacoes,
    dataInicio,
    dataFim,
  )

  const valorServicos = servicos.reduce(
    (acc, servico) => acc + (Number(servico.valor) || 0),
    0,
  )

  const patrimonioViaturas = viaturas.reduce(
    (acc, viatura) => acc + parseValorMoeda(viatura.valorFipe),
    0,
  )

  const valorContratos = contratos.reduce(
    (acc, contrato) => acc + parseValorMoeda(contrato.valorTotal),
    0,
  )
  const saldoContratos = contratos.reduce(
    (acc, contrato) => acc + calcularSaldoContrato(contrato, pagamentosTodos),
    0,
  )

  const valorSolemps = solemps.reduce(
    (acc, solemp) => acc + parseValorMoeda(solemp.valorSolemp),
    0,
  )
  const saldoSolemps = solemps.reduce(
    (acc, solemp) => acc + calcularSaldoSolemp(solemp, pagamentosTodos),
    0,
  )

  const valorPagamentos = pagamentos.reduce(
    (acc, pagamento) => acc + pagamento.valor,
    0,
  )

  const servicosPorMes = somarPorChaveMes(
    servicos
      .map((servico) => {
        const ref = referenciaMesServico(servico)
        if (!ref) return null
        return {
          ano: ref.ano,
          mes: ref.mes,
          valor: Number(servico.valor) || 0,
        }
      })
      .filter(
        (item): item is { ano: number; mes: number; valor: number } =>
          item !== null,
      ),
  )

  const pagamentosPorMes = somarPorChaveMes(
    pagamentos
      .map((pagamento) => {
        const data = parseDataBr(pagamento.dataPagamento)
        if (!data) return null
        return {
          ano: data.getFullYear(),
          mes: data.getMonth() + 1,
          valor: pagamento.valor,
        }
      })
      .filter((item): item is { ano: number; mes: number; valor: number } => item !== null),
  )

  const categoriaMap = new Map<string, { value: number; quantidade: number }>()
  for (const servico of servicos) {
    const nome = labelCategoria(servico.categoria)
    const atual = categoriaMap.get(nome) ?? { value: 0, quantidade: 0 }
    atual.value += Number(servico.valor) || 0
    atual.quantidade += 1
    categoriaMap.set(nome, atual)
  }

  const statusMap = new Map<string, number>()
  for (const servico of servicos) {
    const nome = servico.status === 'faturado' ? 'Faturado' : 'Pendente'
    statusMap.set(nome, (statusMap.get(nome) ?? 0) + 1)
  }

  const aprovacaoMap = new Map<string, number>()
  for (const servico of servicos) {
    const nome = labelAprovacao(getAprovacaoServico(servico))
    aprovacaoMap.set(nome, (aprovacaoMap.get(nome) ?? 0) + 1)
  }

  const gastoViaturaMap = new Map<string, number>()
  for (const servico of servicos) {
    const placa = servico.viatura.trim() || 'Sem placa'
    gastoViaturaMap.set(
      placa,
      (gastoViaturaMap.get(placa) ?? 0) + (Number(servico.valor) || 0),
    )
  }

  const gastosViaturas = calcularGastosViaturasPorTipo(servicos, viaturas)

  const contratosFinanceiro = contratos
    .map((contrato) => {
      const utilizado = calcularValorUtilizadoContrato(contrato.id, pagamentos)
      return {
        name: contrato.numeroContrato || 'Contrato',
        utilizado,
        restante: Math.max(
          0,
          calcularSaldoContrato(contrato, pagamentosTodos),
        ),
      }
    })
    .filter((item) => item.utilizado > 0)
    .sort((a, b) => b.utilizado - a.utilizado)
    .slice(0, 6)

  return {
    kpis: {
      totalServicos: servicos.length,
      valorServicos,
      servicosFaturados: servicos.filter((s) => s.status === 'faturado').length,
      servicosPendentes: servicos.filter((s) => s.status === 'pendente').length,
      totalViaturas: viaturas.length,
      patrimonioViaturas,
      totalContratos: contratos.length,
      valorContratos,
      saldoContratos,
      totalSolemps: solemps.length,
      valorSolemps,
      saldoSolemps,
      totalPagamentos: pagamentos.length,
      valorPagamentos,
      diasComAnotacao,
    },
    gastosViaturas,
    servicosPorMes,
    pagamentosPorMes,
    servicosPorCategoria: [...categoriaMap.entries()].map(([name, dados]) => ({
      name,
      value: dados.value,
      quantidade: dados.quantidade,
    })),
    servicosPorStatus: [...statusMap.entries()].map(([name, value]) => ({
      name,
      value,
    })),
    servicosPorAprovacao: [...aprovacaoMap.entries()].map(([name, value]) => ({
      name,
      value,
    })),
    registrosPorModulo: [
      { modulo: 'Serviços', quantidade: servicos.length },
      { modulo: 'Pagamentos', quantidade: pagamentos.length },
      { modulo: 'Anotações', quantidade: diasComAnotacao },
      { modulo: 'Viaturas', quantidade: viaturas.length },
      { modulo: 'Contratos', quantidade: contratos.length },
      { modulo: 'Solemps', quantidade: solemps.length },
    ],
    gastoPorViatura: [...gastoViaturaMap.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
    contratosFinanceiro,
  }
}

export function formatarMoedaBalanco(valor: number): string {
  return formatarMoeda(valor)
}

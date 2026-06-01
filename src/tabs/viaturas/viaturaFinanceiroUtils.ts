import { formatarData, parseDataBr, parseValorMoeda } from '../../utils/formatoBr'
import { servicosParaCalculosGlobais } from '../manutencao/faturamentoOptions'
import { carregarServicos } from '../manutencao/servicosStorage'
import type { ServicoRegistro } from '../manutencao/servicoTypes'
import type { ViaturaLinha } from './types'

export const PERCENTUAL_LIMITE_VALOR_MERCADO = 70

export interface LiberacaoGastoViatura {
  data: string
  valorDisponivel: number
}

export interface ResumoFinanceiroViatura {
  gastoTotal: number
  valorMercado: number
  percentualGasto: number | null
  quantidadeServicos: number
  /** Restante até 70% do valor de mercado (janela de 12 meses), ou valor excedido. */
  valorDisponivel: number | null
  ultrapassouLimite70: boolean
  liberacaoGasto: LiberacaoGastoViatura | null
}

function placasIguais(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase()
}

function inicioDoDia(data: Date): Date {
  const dia = new Date(data)
  dia.setHours(0, 0, 0, 0)
  return dia
}

function fimDoDia(data: Date): Date {
  const dia = new Date(data)
  dia.setHours(23, 59, 59, 999)
  return dia
}

/** Início da janela móvel de 12 meses (mesma regra de subtrair 1 ano da data fim). */
function inicioJanelaAnual(dataFim: Date): Date {
  const inicio = new Date(dataFim)
  inicio.setFullYear(inicio.getFullYear() - 1)
  inicio.setHours(0, 0, 0, 0)
  return inicio
}

function servicoNaJanelaAnual(servico: ServicoRegistro, dataFim: Date): boolean {
  const dataSaida = parseDataBr(servico.dataSaida)
  if (!dataSaida) return false
  const inicio = inicioJanelaAnual(dataFim)
  return dataSaida >= inicio && dataSaida <= fimDoDia(dataFim)
}

function gastoJanelaAnualViatura(
  servicos: ServicoRegistro[],
  placa: string,
  dataFim: Date,
): number {
  return servicos
    .filter((servico) => placasIguais(servico.viatura, placa))
    .filter((servico) => servicoNaJanelaAnual(servico, dataFim))
    .reduce((acc, servico) => acc + (Number(servico.valor) || 0), 0)
}

/** Primeiro dia após 12 meses em que o serviço deixa de contar na janela móvel. */
function dataSaidaDaJanelaAnual(dataSaida: Date): Date {
  const liberacao = new Date(dataSaida)
  liberacao.setFullYear(liberacao.getFullYear() + 1)
  liberacao.setDate(liberacao.getDate() + 1)
  liberacao.setHours(0, 0, 0, 0)
  return liberacao
}

function servicoNoPeriodo(
  servico: ServicoRegistro,
  dataInicio: Date | null,
  dataFim: Date | null,
): boolean {
  if (!dataInicio && !dataFim) return true

  const dataReferencia = parseDataBr(servico.dataSaida)
  if (!dataReferencia) return false

  if (dataInicio) {
    const inicio = new Date(dataInicio)
    inicio.setHours(0, 0, 0, 0)
    if (dataReferencia < inicio) return false
  }

  if (dataFim) {
    const fim = new Date(dataFim)
    fim.setHours(23, 59, 59, 999)
    if (dataReferencia > fim) return false
  }

  return true
}

/** Serviços da viatura no período (exclui Não aprovados), ordenados por data de saída decrescente. */
export function listarServicosGastoPeriodoViatura(
  viatura: ViaturaLinha,
  dataInicio: string,
  dataFim: string,
  servicos = carregarServicos(),
): ServicoRegistro[] {
  servicos = servicosParaCalculosGlobais(servicos)
  const inicio = dataInicio.trim() ? parseDataBr(dataInicio) : null
  const fim = dataFim.trim() ? parseDataBr(dataFim) : null

  return servicos
    .filter(
      (servico) =>
        placasIguais(servico.viatura, viatura.placa) &&
        servicoNoPeriodo(servico, inicio, fim),
    )
    .sort((a, b) => {
      const ta = parseDataBr(a.dataSaida)?.getTime() ?? 0
      const tb = parseDataBr(b.dataSaida)?.getTime() ?? 0
      return tb - ta
    })
}

export function calcularLiberacaoGastoViatura(
  placa: string,
  dataFim: Date,
  valorMercado: number,
  servicos: ServicoRegistro[],
): LiberacaoGastoViatura | null {
  const limite70 =
    valorMercado * (PERCENTUAL_LIMITE_VALOR_MERCADO / 100)

  const gastoAtual = gastoJanelaAnualViatura(servicos, placa, dataFim)
  if (gastoAtual <= limite70) return null

  const refDia = inicioDoDia(dataFim).getTime()
  const candidatos = new Set<number>()

  for (const servico of servicos) {
    if (!placasIguais(servico.viatura, placa)) continue
    if (!servicoNaJanelaAnual(servico, dataFim)) continue
    const dataSaida = parseDataBr(servico.dataSaida)
    if (!dataSaida) continue
    const diaLiberacao = dataSaidaDaJanelaAnual(dataSaida)
    if (inicioDoDia(diaLiberacao).getTime() > refDia) {
      candidatos.add(inicioDoDia(diaLiberacao).getTime())
    }
  }

  const datasOrdenadas = [...candidatos].sort((a, b) => a - b)

  for (const timestamp of datasOrdenadas) {
    const dia = new Date(timestamp)
    const gasto = gastoJanelaAnualViatura(servicos, placa, dia)
    if (gasto <= limite70) {
      return {
        data: formatarData(dia),
        valorDisponivel: Math.max(0, limite70 - gasto),
      }
    }
  }

  return null
}

export function calcularResumoFinanceiroViatura(
  viatura: ViaturaLinha,
  dataInicio: string,
  dataFim: string,
  servicos = carregarServicos(),
): ResumoFinanceiroViatura {
  servicos = servicosParaCalculosGlobais(servicos)
  const inicio = dataInicio.trim() ? parseDataBr(dataInicio) : null
  const fim = dataFim.trim() ? parseDataBr(dataFim) : null
  const fimJanelaAnual = fim ?? new Date()

  const servicosViatura = servicos.filter(
    (servico) =>
      placasIguais(servico.viatura, viatura.placa) &&
      servicoNoPeriodo(servico, inicio, fim),
  )

  const gastoTotal = servicosViatura.reduce(
    (acc, servico) => acc + (Number(servico.valor) || 0),
    0,
  )

  const valorMercado = parseValorMoeda(viatura.valorFipe)
  const percentualGasto =
    valorMercado > 0 ? (gastoTotal / valorMercado) * 100 : null

  const limite70 =
    valorMercado > 0
      ? valorMercado * (PERCENTUAL_LIMITE_VALOR_MERCADO / 100)
      : null

  const gastoAnual = gastoJanelaAnualViatura(
    servicos,
    viatura.placa,
    fimJanelaAnual,
  )

  let valorDisponivel: number | null = null
  let ultrapassouLimite70 = false
  let liberacaoGasto: LiberacaoGastoViatura | null = null

  if (limite70 !== null) {
    const diferenca = limite70 - gastoAnual
    if (diferenca >= 0) {
      valorDisponivel = diferenca
    } else {
      valorDisponivel = Math.abs(diferenca)
      ultrapassouLimite70 = true
      liberacaoGasto = calcularLiberacaoGastoViatura(
        viatura.placa,
        fimJanelaAnual,
        valorMercado,
        servicos,
      )
    }
  }

  return {
    gastoTotal,
    valorMercado,
    percentualGasto,
    quantidadeServicos: servicosViatura.length,
    valorDisponivel,
    ultrapassouLimite70,
    liberacaoGasto,
  }
}

export interface MargemGastoViaturaItem {
  id: string
  placa: string
  modelo: string
  tipo: ViaturaLinha['tipo']
  valorMercado: number
  gastoAnual12Meses: number
  limite70: number
  /** Quanto ainda pode gastar sem ultrapassar 70% na janela móvel de 12 meses. */
  margemDisponivel: number
  ultrapassouLimite70: boolean
  semValorMercado: boolean
}

export interface ResumoMargemGastoFrota {
  dataReferenciaJanela: string
  totalMargemDisponivel: number
  margemAmbulancias: number
  margemAdministrativas: number
  rankingAmbulancias: MargemGastoViaturaItem[]
  rankingAdministrativas: MargemGastoViaturaItem[]
  viaturasUltrapassaram: number
  viaturasSemValorMercado: number
  viaturasAcimaLimite70: ViaturaAcimaLimite70Item[]
}

export interface ViaturaAcimaLimite70Item {
  id: string
  placa: string
  modelo: string
  tipo: ViaturaLinha['tipo']
  gastoAnual12Meses: number
  limite70: number
  valorExcedido: number
  liberacaoGasto: LiberacaoGastoViatura | null
}

/** Soma da margem até 70% do FIPE por viatura (janela de 12 meses até dataFimReferencia). */
export function calcularMargemGastoFrota(
  viaturas: ViaturaLinha[],
  dataFimReferencia: string,
  servicos = carregarServicos(),
): ResumoMargemGastoFrota {
  servicos = servicosParaCalculosGlobais(servicos)
  const fimJanela = dataFimReferencia.trim()
    ? (parseDataBr(dataFimReferencia) ?? new Date())
    : new Date()

  const itens: MargemGastoViaturaItem[] = []
  const viaturasAcimaLimite70: ViaturaAcimaLimite70Item[] = []

  for (const viatura of viaturas) {
    const valorMercado = parseValorMoeda(viatura.valorFipe)
    const semValorMercado = valorMercado <= 0
    const limite70 = semValorMercado
      ? 0
      : valorMercado * (PERCENTUAL_LIMITE_VALOR_MERCADO / 100)
    const gastoAnual12Meses = gastoJanelaAnualViatura(
      servicos,
      viatura.placa,
      fimJanela,
    )
    const ultrapassouLimite70 =
      !semValorMercado && gastoAnual12Meses > limite70
    const margemDisponivel =
      semValorMercado || ultrapassouLimite70
        ? 0
        : Math.max(0, limite70 - gastoAnual12Meses)

    if (ultrapassouLimite70) {
      viaturasAcimaLimite70.push({
        id: viatura.id,
        placa: viatura.placa,
        modelo: viatura.modelo,
        tipo: viatura.tipo,
        gastoAnual12Meses,
        limite70,
        valorExcedido: gastoAnual12Meses - limite70,
        liberacaoGasto: calcularLiberacaoGastoViatura(
          viatura.placa,
          fimJanela,
          valorMercado,
          servicos,
        ),
      })
    }

    itens.push({
      id: viatura.id,
      placa: viatura.placa,
      modelo: viatura.modelo,
      tipo: viatura.tipo,
      valorMercado,
      gastoAnual12Meses,
      limite70,
      margemDisponivel,
      ultrapassouLimite70,
      semValorMercado,
    })
  }

  const ordenarPorMargem = (
    a: MargemGastoViaturaItem,
    b: MargemGastoViaturaItem,
  ) =>
    b.margemDisponivel - a.margemDisponivel ||
    a.placa.localeCompare(b.placa, 'pt-BR')

  const rankingAmbulancias = itens
    .filter((v) => v.tipo === 'ambulancia')
    .sort(ordenarPorMargem)
  const rankingAdministrativas = itens
    .filter((v) => v.tipo === 'administrativo')
    .sort(ordenarPorMargem)

  viaturasAcimaLimite70.sort((a, b) => {
    const dataA = a.liberacaoGasto
      ? (parseDataBr(a.liberacaoGasto.data)?.getTime() ?? Number.MAX_SAFE_INTEGER)
      : Number.MAX_SAFE_INTEGER
    const dataB = b.liberacaoGasto
      ? (parseDataBr(b.liberacaoGasto.data)?.getTime() ?? Number.MAX_SAFE_INTEGER)
      : Number.MAX_SAFE_INTEGER
    return dataA - dataB || a.placa.localeCompare(b.placa, 'pt-BR')
  })

  return {
    dataReferenciaJanela: formatarData(fimJanela),
    totalMargemDisponivel: itens.reduce(
      (acc, v) => acc + v.margemDisponivel,
      0,
    ),
    margemAmbulancias: rankingAmbulancias.reduce(
      (acc, v) => acc + v.margemDisponivel,
      0,
    ),
    margemAdministrativas: rankingAdministrativas.reduce(
      (acc, v) => acc + v.margemDisponivel,
      0,
    ),
    rankingAmbulancias,
    rankingAdministrativas,
    viaturasUltrapassaram: itens.filter((v) => v.ultrapassouLimite70).length,
    viaturasSemValorMercado: itens.filter((v) => v.semValorMercado).length,
    viaturasAcimaLimite70,
  }
}

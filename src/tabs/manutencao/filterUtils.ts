import { dataBrNoPeriodo, formatarMoeda, parseDataBr } from '../../utils/formatoBr'
import type { ManutencaoFiltros } from './types'
import type { ServicoRegistro } from './servicoTypes'
import { getAprovacaoServico } from './servicoTypes'

export { parseDataBr } from '../../utils/formatoBr'

function temFiltroPeriodoSaida(filtros: ManutencaoFiltros): boolean {
  return Boolean(filtros.dataInicio.trim() || filtros.dataFim.trim())
}

function referenciaAnoMesServico(
  registro: ServicoRegistro,
): { ano: number; mes: number } | null {
  const dataSaida = parseDataBr(registro.dataSaida)
  if (dataSaida) {
    return { ano: dataSaida.getFullYear(), mes: dataSaida.getMonth() + 1 }
  }
  if (registro.ano && registro.mes) {
    return { ano: registro.ano, mes: registro.mes }
  }
  return null
}

export function buscarServicos(
  registros: ServicoRegistro[],
  termo: string,
): ServicoRegistro[] {
  const t = termo.trim().toLowerCase()
  if (!t) return registros

  return registros.filter(
    (r) =>
      r.id.toLowerCase().includes(t) ||
      r.os.toLowerCase().includes(t) ||
      r.viatura.toLowerCase().includes(t) ||
      r.modelo.toLowerCase().includes(t) ||
      r.descricao.toLowerCase().includes(t),
  )
}

export function filtrarServicos(
  registros: ServicoRegistro[],
  filtros: ManutencaoFiltros,
): ServicoRegistro[] {
  const filtroPeriodoSaida = temFiltroPeriodoSaida(filtros)

  return registros.filter((r) => {
    if (filtroPeriodoSaida) {
      if (!dataBrNoPeriodo(r.dataSaida, filtros.dataInicio, filtros.dataFim)) {
        return false
      }
    } else {
      const referencia = referenciaAnoMesServico(r)
      if (filtros.ano !== 'todos') {
        if (!referencia || referencia.ano !== Number(filtros.ano)) return false
      }
      if (filtros.mes !== 'todos') {
        if (!referencia || referencia.mes !== Number(filtros.mes)) return false
      }
    }

    if (filtros.tipo !== 'todos' && r.categoria !== filtros.tipo) return false
    if (
      filtros.tipoFaturamento !== 'todos' &&
      r.faturamento !== filtros.tipoFaturamento
    )
      return false

    if (filtros.viatura !== 'todos' && filtros.viatura.trim()) {
      const placaFiltro = filtros.viatura.trim().toUpperCase()
      if (r.viatura.toUpperCase() !== placaFiltro) return false
    }

    if (
      filtros.aprovacao !== 'todos' &&
      getAprovacaoServico(r) !== filtros.aprovacao
    )
      return false
    if (filtros.singra2 !== 'todos' && r.singra2 !== filtros.singra2) return false
    if (filtros.status !== 'todos' && r.status !== filtros.status) return false

    return true
  })
}

export const LABEL_SINGRA2: Record<ServicoRegistro['singra2'], string> = {
  lancado: 'Lançado',
  pendante: 'Pendente',
}

export const LABEL_STATUS: Record<ServicoRegistro['status'], string> = {
  faturado: 'Faturado',
  pendente: 'Pendente',
}

export function formatarValor(valor: number): string {
  return formatarMoeda(valor)
}

export function servicoSemDataRetorno(registro: ServicoRegistro): boolean {
  const retorno = registro.dataRetorno?.trim()
  return !retorno || retorno === 'Indeterminado'
}

export function filtrarViaturasNaOficina(
  registros: ServicoRegistro[],
): ServicoRegistro[] {
  return registros.filter(servicoSemDataRetorno)
}

export function calcularDiasNaOficina(dataSaida: string): number | null {
  const entrada = parseDataBr(dataSaida)
  if (!entrada) return null

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  entrada.setHours(0, 0, 0, 0)

  const diffMs = hoje.getTime() - entrada.getTime()
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return dias >= 0 ? dias : 0
}

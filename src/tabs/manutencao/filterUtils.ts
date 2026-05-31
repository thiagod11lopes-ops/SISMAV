import { formatarMoeda, parseDataBr } from '../../utils/formatoBr'
import type { ManutencaoFiltros } from './types'
import type { ServicoRegistro } from './servicoTypes'
import { getAprovacaoServico } from './servicoTypes'

export { parseDataBr } from '../../utils/formatoBr'

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
  const inicio = filtros.dataInicio ? parseDataBr(filtros.dataInicio) : null
  const fim = filtros.dataFim ? parseDataBr(filtros.dataFim) : null

  return registros.filter((r) => {
    if (filtros.ano !== 'todos' && r.ano !== Number(filtros.ano)) return false
    if (filtros.mes !== 'todos' && r.mes !== Number(filtros.mes)) return false

    const dataRegistro = parseDataBr(r.dataSaida)
    if (inicio && dataRegistro && dataRegistro < inicio) return false
    if (fim && dataRegistro && dataRegistro > fim) return false

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

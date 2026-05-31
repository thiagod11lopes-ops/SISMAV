import type { ContratoRegistro } from './contratoStorage'
import type { PagamentoRegistro } from './pagamentosStorage'
import type { SolempRegistro } from './solempStorage'
import { formatarValorReais } from './valorUtils'

interface LegacyEmpenho {
  id: string
  numero?: string
  data?: string
  valorTotal?: number
}

interface LegacySolemp {
  id: string
  empenhoId?: string
  numero?: string
  data?: string
  valorTotal?: number
}

interface LegacyFaturamento {
  id: string
  numero?: string
  data?: string
  valor?: number
  solempId?: string
  servicosIds?: string[]
}

interface LegacyFinanceiroDados {
  empenhos?: LegacyEmpenho[]
  solemps?: LegacySolemp[]
  faturamentos?: LegacyFaturamento[]
}

export interface FinanceiroLegadoConvertido {
  contratos: ContratoRegistro[]
  solemps: SolempRegistro[]
  pagamentos: PagamentoRegistro[]
}

function isoParaDataBr(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!match) return iso
  return `${match[3]}/${match[2]}/${match[1]}`
}

export function parseFaturamentoNumeroLegado(numero: string): string {
  const match = /^(\d+)\s*[°º]?\s*\/?\s*\d*$/i.exec(numero.trim())
  return match ? match[1] : numero.trim()
}

export function converterFinanceiroLegado(
  dados: LegacyFinanceiroDados,
): FinanceiroLegadoConvertido {
  const empenhos = dados.empenhos ?? []
  const solempsLegado = dados.solemps ?? []
  const faturamentos = dados.faturamentos ?? []

  const empenhoPorId = new Map(empenhos.map((e) => [e.id, e]))
  const solempPorId = new Map(solempsLegado.map((s) => [s.id, s]))

  const contratos: ContratoRegistro[] = empenhos.map((empenho) => ({
    id: empenho.id,
    numeroContrato: String(empenho.numero ?? '').trim(),
    vigencia: `${isoParaDataBr(empenho.data ?? '')} — —`,
    valorTotal: formatarValorReais(String(empenho.valorTotal ?? 0)),
  }))

  const solemps: SolempRegistro[] = solempsLegado.map((solemp) => {
    const empenho = empenhoPorId.get(solemp.empenhoId ?? '')
    return {
      id: solemp.id,
      contratoId: solemp.empenhoId ?? '',
      numeroContrato: String(empenho?.numero ?? '—').trim(),
      numeroSolemp: String(solemp.numero ?? '').trim(),
      dataSolemp: isoParaDataBr(solemp.data ?? ''),
      valorSolemp: formatarValorReais(String(solemp.valorTotal ?? 0)),
    }
  })

  const pagamentos: PagamentoRegistro[] = faturamentos.map((fat) => {
    const solemp = solempPorId.get(fat.solempId ?? '')
    const empenho = solemp ? empenhoPorId.get(solemp.empenhoId ?? '') : undefined
    const numeroFat = String(fat.numero ?? '').trim()

    return {
      id: fat.id,
      dataPagamento: isoParaDataBr(fat.data ?? ''),
      faturamento: parseFaturamentoNumeroLegado(numeroFat),
      faturamentoLabel: numeroFat,
      valor: Number(fat.valor) || 0,
      quantidadeServicos: Array.isArray(fat.servicosIds)
        ? fat.servicosIds.length
        : 0,
      solempId: fat.solempId ?? '',
      numeroSolemp: String(solemp?.numero ?? '').trim(),
      contratoId: solemp?.empenhoId ?? '',
      numeroContrato: String(empenho?.numero ?? '').trim(),
    }
  })

  return { contratos, solemps, pagamentos }
}

export function extrairFinanceiroDeBackupJson(
  bruto: unknown,
): LegacyFinanceiroDados | null {
  if (!bruto || typeof bruto !== 'object') return null
  const raiz = bruto as { dados?: LegacyFinanceiroDados }
  if (!raiz.dados || typeof raiz.dados !== 'object') return null
  const { empenhos, solemps, faturamentos } = raiz.dados
  if (
    !Array.isArray(empenhos) &&
    !Array.isArray(solemps) &&
    !Array.isArray(faturamentos)
  ) {
    return null
  }
  return raiz.dados
}

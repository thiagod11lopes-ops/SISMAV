import type {
  ControleCreditosDados,
  CreditoCompra,
  CreditoPagamento,
} from './controleCreditosTypes'

interface LegacyOrcamentoPagamento {
  id: string
  os: string
  data: string
  valor: number
}

interface LegacyOrcamentoCompra {
  id: string
  item: string
  valor: number
}

interface LegacyManutencao {
  ordemServico?: string
  faturamento?: string
}

interface LegacyOrcamentosDados {
  manutencoesCadastradas?: LegacyManutencao[]
  orcamentos_pagamentos?: LegacyOrcamentoPagamento[]
  orcamentos_compras?: LegacyOrcamentoCompra[]
}

function isoParaDataBr(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!match) return iso
  return `${match[3]}/${match[2]}/${match[1]}`
}

function extrairNumeroFaturamento(texto: string): string | null {
  const t = texto.trim()
  const fa = /^(\d+)\s*[°º]?\s*Fa$/i.exec(t)
  if (fa) return fa[1]
  const fat = /^(\d+)\s*[°º]\s*Faturamento$/i.exec(t)
  if (fat) return fat[1]
  return null
}

export function parseFaturamentoLegado(faturamento: string): string {
  const trimmed = faturamento.trim()
  if (!trimmed) return ''
  if (/não aprovados/i.test(trimmed)) return 'Não aprovados'
  const num = extrairNumeroFaturamento(trimmed)
  if (num) return num
  const match = trimmed.match(/(\d+)/)
  return match ? match[1] : trimmed
}

function montarMapaOsFaturamento(
  manutencoes: LegacyManutencao[] | undefined,
): Map<string, string> {
  const mapa = new Map<string, string>()
  for (const m of manutencoes ?? []) {
    const os = String(m.ordemServico ?? '').trim()
    const fat = String(m.faturamento ?? '').trim()
    if (os && fat) mapa.set(os, fat)
  }
  return mapa
}

export function osLegadoParaFaturamento(
  os: string,
  mapaOsFaturamento: Map<string, string>,
): string {
  const mapped = mapaOsFaturamento.get(os)
  if (mapped) {
    const num = parseFaturamentoLegado(mapped)
    if (num) return num
    return mapped
  }

  const num = extrairNumeroFaturamento(os)
  if (num) return num

  if (/^\d+$/.test(os)) return `OS ${os}`

  return os
}

export function converterOrcamentosLegado(
  dados: LegacyOrcamentosDados,
): ControleCreditosDados {
  const mapaOs = montarMapaOsFaturamento(dados.manutencoesCadastradas)

  const pagamentos: CreditoPagamento[] = (dados.orcamentos_pagamentos ?? []).map(
    (p) => ({
      id: p.id,
      faturamento: osLegadoParaFaturamento(String(p.os ?? ''), mapaOs),
      data: isoParaDataBr(p.data),
      valor: Number(p.valor) || 0,
    }),
  )

  const compras: CreditoCompra[] = (dados.orcamentos_compras ?? []).map((c) => ({
    id: c.id,
    item: String(c.item ?? '').trim(),
    valor: Number(c.valor) || 0,
  }))

  return { pagamentos, compras }
}

export function extrairOrcamentosDeBackupJson(
  bruto: unknown,
): LegacyOrcamentosDados | null {
  if (!bruto || typeof bruto !== 'object') return null
  const raiz = bruto as { dados?: LegacyOrcamentosDados }
  if (!raiz.dados || typeof raiz.dados !== 'object') return null
  const { orcamentos_pagamentos, orcamentos_compras } = raiz.dados
  if (!Array.isArray(orcamentos_pagamentos) && !Array.isArray(orcamentos_compras)) {
    return null
  }
  return raiz.dados
}

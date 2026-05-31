import type { ServicoRegistro } from './servicoTypes'

export interface FaturamentoOption {
  value: string
  label: string
}

/** Ex.: "15" ou "15º" → "15º Faturamento"; textos livres permanecem iguais. */
export function formatarLabelFaturamento(valor: string): string {
  const trimmed = valor.trim()
  if (!trimmed) return trimmed

  if (/^\d+º\s+Faturamento$/i.test(trimmed)) {
    const numero = trimmed.match(/^(\d+)/)?.[1] ?? trimmed
    return `${numero}º Faturamento`
  }

  if (/^\d+$/.test(trimmed)) {
    return `${trimmed}º Faturamento`
  }

  const somenteOrdinal = /^(\d+)º$/i.exec(trimmed)
  if (somenteOrdinal) {
    return `${somenteOrdinal[1]}º Faturamento`
  }

  const estiloFaturamentoNumero = /^faturamento\s*(\d+)\s*º?$/i.exec(trimmed)
  if (estiloFaturamentoNumero) {
    return `${estiloFaturamentoNumero[1]}º Faturamento`
  }

  return trimmed
}

export function montarOpcoesFaturamento(
  servicos: ServicoRegistro[],
): FaturamentoOption[] {
  const valores = new Set(
    servicos.map((s) => s.faturamento.trim()).filter(Boolean),
  )

  const numericos = [...valores]
    .filter((v) => /^\d+$/.test(v))
    .sort((a, b) => Number(a) - Number(b))

  const outros = [...valores]
    .filter((v) => !/^\d+$/.test(v))
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))

  return [
    { value: 'todos', label: 'Todos' },
    ...numericos.map((v) => ({
      value: v,
      label: formatarLabelFaturamento(v),
    })),
    ...outros.map((v) => ({ value: v, label: formatarLabelFaturamento(v) })),
  ]
}

export function montarOpcoesFaturamentoSistema(
  servicos: ServicoRegistro[],
): FaturamentoOption[] {
  return montarOpcoesFaturamento(servicos).filter(
    (opcao) => opcao.value !== 'todos',
  )
}

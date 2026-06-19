import type { ServicoRegistro } from './servicoTypes'

export interface FaturamentoOption {
  value: string
  label: string
}

/** Valor canônico do faturamento de consulta (não entra em balanço nem gastos). */
export const FATURAMENTO_NAO_APROVADOS = 'Não aprovados'

/** Faturamento de serviços arquivados (consulta / card de resumo). */
export const FATURAMENTO_ARQUIVADOS = 'Arquivados'

function normalizarTextoFaturamento(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Serviços com faturamento Arquivados (coluna Faturamento). */
export function ehFaturamentoArquivados(faturamento: string): boolean {
  return normalizarTextoFaturamento(faturamento) === 'arquivados'
}

/** Serviços deste faturamento são só para consulta (filtro Tipo faturamento). */
export function ehFaturamentoNaoAprovados(faturamento: string): boolean {
  const t = normalizarTextoFaturamento(faturamento)
  return t === 'nao aprovados' || t === 'nao aprovado'
}

/** Exclui faturamento "Não aprovados" de totais, balanço e gastos por viatura. */
export function servicosParaCalculosGlobais(
  servicos: ServicoRegistro[],
): ServicoRegistro[] {
  return servicos.filter((s) => !ehFaturamentoNaoAprovados(s.faturamento))
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

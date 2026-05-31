const STORAGE_KEY = 'sismav.anotacoes-diarias'

export type AnotacoesPorData = Record<string, string>

export function carregarAnotacoes(): AnotacoesPorData {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return {}
    const parsed = JSON.parse(bruto) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as AnotacoesPorData
  } catch {
    return {}
  }
}

export function persistirAnotacoes(anotacoes: AnotacoesPorData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(anotacoes))
  } catch {
    /* ignore quota / private mode */
  }
}

export function salvarAnotacao(dataChave: string, texto: string): AnotacoesPorData {
  const anotacoes = carregarAnotacoes()
  const valor = texto.trim()

  if (!valor) {
    delete anotacoes[dataChave]
  } else {
    anotacoes[dataChave] = valor
  }

  persistirAnotacoes(anotacoes)
  return { ...anotacoes }
}

export function removerAnotacao(dataChave: string): AnotacoesPorData {
  const anotacoes = carregarAnotacoes()
  delete anotacoes[dataChave]
  persistirAnotacoes(anotacoes)
  return { ...anotacoes }
}

export interface AnotacaoItem {
  dataChave: string
  texto: string
}

export function listarAnotacoesOrdenadas(
  anotacoes: AnotacoesPorData,
): AnotacaoItem[] {
  return Object.entries(anotacoes)
    .filter(([, texto]) => texto.trim())
    .map(([dataChave, texto]) => ({ dataChave, texto: texto.trim() }))
    .sort((a, b) => b.dataChave.localeCompare(a.dataChave))
}

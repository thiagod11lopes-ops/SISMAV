const STORAGE_KEY = 'sismav.empresa-manutencao-aprovacao'
export const EMPRESA_MANUTENCAO_PADRAO = 'PEÇA OIL'

export function obterEmpresaManutencaoSalva(): string {
  try {
    const valor = localStorage.getItem(STORAGE_KEY)?.trim()
    return valor || EMPRESA_MANUTENCAO_PADRAO
  } catch {
    return EMPRESA_MANUTENCAO_PADRAO
  }
}

export function salvarEmpresaManutencao(nome: string): void {
  const valor = nome.trim()
  if (!valor) return

  try {
    localStorage.setItem(STORAGE_KEY, valor)
  } catch {
    /* ignore quota / private mode */
  }
}

/** Valor literal no localStorage (sem fallback padrão), para backup. */
export function lerEmpresaManutencaoParaBackup(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? ''
  } catch {
    return ''
  }
}

/** Restaura exatamente o valor do backup (vazio remove a chave). */
export function restaurarEmpresaManutencao(nome: string): void {
  const valor = nome.trim()
  try {
    if (!valor) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, valor)
  } catch {
    /* ignore quota / private mode */
  }
}

export function montarTextoDeclaracaoAprovacao(nomeEmpresa: string): string {
  const empresa = nomeEmpresa.trim() || EMPRESA_MANUTENCAO_PADRAO
  return (
    `Declaramos, para os devidos fins, que aprovo os orçamentos de manutenção abaixo relacionados, ` +
    `apresentados pela empresa de manutenção responsável, ${empresa}, autorizando a execução e/ou ` +
    `faturamento dos serviços conforme os valores individuais discriminados.`
  )
}

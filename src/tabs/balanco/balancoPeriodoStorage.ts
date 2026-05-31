import type { PeriodoBalanco } from './balancoData'

const STORAGE_KEY = 'sismav.balanco-periodo'

export function carregarBalancoPeriodoSalvo(): PeriodoBalanco | null {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return null
    const parsed = JSON.parse(bruto) as Partial<PeriodoBalanco>
    if (!parsed || typeof parsed !== 'object') return null
    const dataInicio = parsed.dataInicio?.trim() ?? ''
    const dataFim = parsed.dataFim?.trim() ?? ''
    if (!dataInicio || !dataFim) return null
    return { dataInicio, dataFim }
  } catch {
    return null
  }
}

export function salvarBalancoPeriodo(periodo: PeriodoBalanco): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(periodo))
  } catch {
    /* ignore quota / private mode */
  }
}

export function limparBalancoPeriodo(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

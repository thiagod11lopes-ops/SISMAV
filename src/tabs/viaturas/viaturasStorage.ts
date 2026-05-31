import type { ViaturaLinha } from './types'

const STORAGE_KEY = 'sismav.viaturas'
export const EVENTO_VIATURAS_ATUALIZADOS = 'sismav:viaturas-atualizados'

export function carregarViaturas(fallback: ViaturaLinha[]): ViaturaLinha[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return fallback
    const parsed = JSON.parse(bruto) as unknown
    if (!Array.isArray(parsed)) return fallback
    return parsed as ViaturaLinha[]
  } catch {
    return fallback
  }
}

export function salvarViaturas(viaturas: ViaturaLinha[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viaturas))
    window.dispatchEvent(new CustomEvent(EVENTO_VIATURAS_ATUALIZADOS))
  } catch {
    /* ignore quota / private mode */
  }
}

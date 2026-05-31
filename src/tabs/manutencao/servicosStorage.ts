import { SERVICOS } from './servicosData'
import type { ServicoRegistro } from './servicoTypes'

const STORAGE_KEY = 'sismav.servicos'
export const EVENTO_SERVICOS_ATUALIZADOS = 'sismav:servicos-atualizados'

export function carregarServicos(): ServicoRegistro[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return SERVICOS
    const parsed = JSON.parse(bruto) as unknown
    if (!Array.isArray(parsed)) return SERVICOS
    return parsed as ServicoRegistro[]
  } catch {
    return SERVICOS
  }
}

export function salvarServicos(servicos: ServicoRegistro[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos))
    window.dispatchEvent(new CustomEvent(EVENTO_SERVICOS_ATUALIZADOS))
  } catch {
    /* ignore quota / private mode */
  }
}

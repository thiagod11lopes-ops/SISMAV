import type { SaidaAdministrativa } from './types'

const STORAGE_KEY = 'sismav.saidas-administrativas'
export const EVENTO_SAIDAS_ADMIN_ATUALIZADAS =
  'sismav:saidas-administrativas-atualizadas'

function dadosPadrao(): SaidaAdministrativa[] {
  return []
}

export function carregarSaidasAdministrativas(): SaidaAdministrativa[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return dadosPadrao()
    const parsed = JSON.parse(bruto) as unknown
    if (!Array.isArray(parsed)) return dadosPadrao()
    return parsed as SaidaAdministrativa[]
  } catch {
    return dadosPadrao()
  }
}

export function salvarSaidasAdministrativas(dados: SaidaAdministrativa[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados))
    window.dispatchEvent(
      new CustomEvent(EVENTO_SAIDAS_ADMIN_ATUALIZADAS, { detail: { dados } }),
    )
  } catch {
    /* ignore quota / private mode */
  }
}


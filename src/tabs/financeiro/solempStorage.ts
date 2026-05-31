export interface SolempRegistro {
  id: string
  contratoId: string
  numeroContrato: string
  numeroSolemp: string
  dataSolemp: string
  valorSolemp: string
}

import { SOLEMPS } from './financeiroData'

const STORAGE_KEY = 'sismav.solemps'
export const EVENTO_SOLEMPS_ATUALIZADOS = 'sismav:solemps-atualizados'

function solempsPadrao(): SolempRegistro[] {
  return [...SOLEMPS]
}

export function carregarSolemps(): SolempRegistro[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return solempsPadrao()
    const parsed = JSON.parse(bruto) as unknown
    if (!Array.isArray(parsed)) return solempsPadrao()
    return parsed.map((item) => {
      const registro = item as Partial<SolempRegistro>
      return {
        id: registro.id ?? String(Date.now()),
        contratoId: registro.contratoId ?? '',
        numeroContrato: registro.numeroContrato ?? '—',
        numeroSolemp: registro.numeroSolemp ?? '',
        dataSolemp: registro.dataSolemp ?? '',
        valorSolemp: registro.valorSolemp ?? '',
      }
    })
  } catch {
    return solempsPadrao()
  }
}

export function salvarSolemps(solemps: SolempRegistro[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solemps))
    window.dispatchEvent(new CustomEvent(EVENTO_SOLEMPS_ATUALIZADOS))
  } catch {
    /* ignore quota / private mode */
  }
}

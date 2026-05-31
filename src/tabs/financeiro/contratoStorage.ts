export interface ContratoRegistro {
  id: string
  numeroContrato: string
  vigencia: string
  valorTotal: string
}

import { CONTRATOS } from './financeiroData'

const STORAGE_KEY = 'sismav.contratos'
export const EVENTO_CONTRATOS_ATUALIZADOS = 'sismav:contratos-atualizados'

function contratosPadrao(): ContratoRegistro[] {
  return [...CONTRATOS]
}

export function carregarContratos(): ContratoRegistro[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return contratosPadrao()
    const parsed = JSON.parse(bruto) as unknown
    if (!Array.isArray(parsed)) return contratosPadrao()
    return parsed as ContratoRegistro[]
  } catch {
    return contratosPadrao()
  }
}

export function salvarContratos(contratos: ContratoRegistro[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contratos))
    window.dispatchEvent(new CustomEvent(EVENTO_CONTRATOS_ATUALIZADOS))
  } catch {
    /* ignore quota / private mode */
  }
}

export type {
  ControleCreditosDados,
  CreditoCompra,
  CreditoPagamento,
} from './controleCreditosTypes'

import type { ControleCreditosDados } from './controleCreditosTypes'
import { CONTROLE_CREDITOS } from './controleCreditosData'

const STORAGE_KEY = 'sismav.controle-creditos'
export const EVENTO_CONTROLE_CREDITOS_ATUALIZADO = 'sismav:controle-creditos-atualizado'

function dadosPadrao(): ControleCreditosDados {
  return {
    pagamentos: [...CONTROLE_CREDITOS.pagamentos],
    compras: [...CONTROLE_CREDITOS.compras],
  }
}

export function carregarControleCreditos(): ControleCreditosDados {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return dadosPadrao()
    const parsed = JSON.parse(bruto) as unknown
    if (!parsed || typeof parsed !== 'object') return dadosPadrao()
    const o = parsed as Partial<ControleCreditosDados>
    const pagamentos = Array.isArray(o.pagamentos) ? o.pagamentos : []
    const compras = Array.isArray(o.compras) ? o.compras : []
    return { pagamentos, compras }
  } catch {
    return dadosPadrao()
  }
}

export function salvarControleCreditos(dados: ControleCreditosDados): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados))
    window.dispatchEvent(new CustomEvent(EVENTO_CONTROLE_CREDITOS_ATUALIZADO))
  } catch {
    /* ignore quota / private mode */
  }
}

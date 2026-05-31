import { salvarContratos } from './contratoStorage'
import {
  CONTRATOS,
  PAGAMENTOS_FATURAMENTO,
  SOLEMPS,
} from './financeiroData'
import { salvarPagamentos } from './pagamentosStorage'
import { salvarSolemps } from './solempStorage'

const CHAVE_CONTRATOS = 'sismav.contratos'
const CHAVE_SOLEMPS = 'sismav.solemps'
const CHAVE_PAGAMENTOS = 'sismav.pagamentos-faturamento'

/**
 * Preenche dados financeiros iniciais apenas quando nunca houve persistência
 * neste navegador (instalação nova). Não sobrescreve backup importado ou dados
 * salvos pelo usuário.
 */
export function garantirFinanceiroDoBackup(): void {
  try {
    const temAlgumFinanceiro =
      localStorage.getItem(CHAVE_CONTRATOS) !== null ||
      localStorage.getItem(CHAVE_SOLEMPS) !== null ||
      localStorage.getItem(CHAVE_PAGAMENTOS) !== null

    if (temAlgumFinanceiro) return

    salvarContratos([...CONTRATOS])
    salvarSolemps([...SOLEMPS])
    salvarPagamentos([...PAGAMENTOS_FATURAMENTO])
  } catch {
    /* ignore quota / private mode */
  }
}

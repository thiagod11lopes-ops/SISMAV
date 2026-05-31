export interface PagamentoRegistro {
  id: string
  dataPagamento: string
  faturamento: string
  faturamentoLabel: string
  valor: number
  quantidadeServicos: number
  solempId: string
  numeroSolemp: string
  contratoId: string
  numeroContrato: string
}

import { PAGAMENTOS_FATURAMENTO } from './financeiroData'

const STORAGE_KEY = 'sismav.pagamentos-faturamento'
export const EVENTO_PAGAMENTOS_ATUALIZADOS = 'sismav:pagamentos-atualizados'

function pagamentosPadrao(): PagamentoRegistro[] {
  return [...PAGAMENTOS_FATURAMENTO]
}

export function carregarPagamentos(): PagamentoRegistro[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return pagamentosPadrao()
    const parsed = JSON.parse(bruto) as unknown
    if (!Array.isArray(parsed)) return pagamentosPadrao()
    return parsed.map((item) => {
      const registro = item as Partial<PagamentoRegistro>
      return {
        id: registro.id ?? String(Date.now()),
        dataPagamento: registro.dataPagamento ?? '',
        faturamento: registro.faturamento ?? '',
        faturamentoLabel: registro.faturamentoLabel ?? registro.faturamento ?? '',
        valor: typeof registro.valor === 'number' ? registro.valor : 0,
        quantidadeServicos: registro.quantidadeServicos ?? 0,
        solempId: registro.solempId ?? '',
        numeroSolemp: registro.numeroSolemp ?? '',
        contratoId: registro.contratoId ?? '',
        numeroContrato: registro.numeroContrato ?? '',
      }
    })
  } catch {
    return pagamentosPadrao()
  }
}

export function salvarPagamentos(pagamentos: PagamentoRegistro[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pagamentos))
    window.dispatchEvent(new CustomEvent(EVENTO_PAGAMENTOS_ATUALIZADOS))
  } catch {
    /* ignore quota / private mode */
  }
}

export function atualizarReferenciasContrato(
  contratoId: string,
  numeroContrato: string,
): void {
  const pagamentos = carregarPagamentos()
  const atualizados = pagamentos.map((pagamento) =>
    pagamento.contratoId === contratoId
      ? { ...pagamento, numeroContrato }
      : pagamento,
  )
  salvarPagamentos(atualizados)
}

export function atualizarReferenciasSolemp(
  solempId: string,
  dados: {
    numeroSolemp: string
    contratoId: string
    numeroContrato: string
  },
): void {
  const pagamentos = carregarPagamentos()
  const atualizados = pagamentos.map((pagamento) =>
    pagamento.solempId === solempId
      ? {
          ...pagamento,
          numeroSolemp: dados.numeroSolemp,
          contratoId: dados.contratoId,
          numeroContrato: dados.numeroContrato,
        }
      : pagamento,
  )
  salvarPagamentos(atualizados)
}

import type { ServicoRegistro } from '../manutencao/servicoTypes'

export interface TotalFaturamentoFaturar {
  total: number
  quantidade: number
}

export function calcularTotalFaturarPorFaturamento(
  servicos: ServicoRegistro[],
  faturamento: string,
): TotalFaturamentoFaturar {
  if (!faturamento.trim()) {
    return { total: 0, quantidade: 0 }
  }

  const selecionados = servicos.filter(
    (servico) => servico.faturamento === faturamento && servico.faturar,
  )

  return {
    total: selecionados.reduce((acc, servico) => acc + servico.valor, 0),
    quantidade: selecionados.length,
  }
}

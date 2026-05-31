import type { ServicoRegistro } from './servicoTypes'

export interface TotaisFaturamentoResumo {
  totalGeral: number
  totalAprovacao: number
  totalAprovado: number
  totalPreAprovado: number
  qtdServicos: number
  qtdAprovacao: number
  qtdAprovado: number
  qtdPreAprovado: number
  percentualAprovacao: number
}

export function calcularTotaisFaturamentoResumo(
  servicos: ServicoRegistro[],
): TotaisFaturamentoResumo {
  const totalGeral = servicos.reduce((acc, s) => acc + s.valor, 0)

  const aprovados = servicos.filter((s) => s.aprovado)
  const preAprovados = servicos.filter((s) => s.preAprovado && !s.aprovado)
  const emAprovacao = servicos.filter((s) => s.aprovado || s.preAprovado)

  const totalAprovado = aprovados.reduce((acc, s) => acc + s.valor, 0)
  const totalPreAprovado = preAprovados.reduce((acc, s) => acc + s.valor, 0)
  const totalAprovacao = emAprovacao.reduce((acc, s) => acc + s.valor, 0)

  const percentualAprovacao =
    totalGeral > 0 ? Math.min(100, (totalAprovacao / totalGeral) * 100) : 0

  return {
    totalGeral,
    totalAprovacao,
    totalAprovado,
    totalPreAprovado,
    qtdServicos: servicos.length,
    qtdAprovacao: emAprovacao.length,
    qtdAprovado: aprovados.length,
    qtdPreAprovado: preAprovados.length,
    percentualAprovacao,
  }
}

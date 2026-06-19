import type { ManutencaoFiltros } from './types'
import { ehFaturamentoArquivados } from './faturamentoOptions'
import type { ServicoRegistro } from './servicoTypes'

export type ResumoCardFiltro = 'faturado' | 'pendente' | 'arquivados'

export interface ResumoStatusServicos {
  totalFaturados: number
  totalPendentes: number
  totalArquivados: number
  qtdFaturados: number
  qtdPendentes: number
  qtdArquivados: number
}

export function servicoPertenceAoResumoCard(
  servico: ServicoRegistro,
  card: ResumoCardFiltro,
): boolean {
  switch (card) {
    case 'faturado':
      return servico.status === 'faturado'
    case 'pendente':
      return (
        servico.status === 'pendente' &&
        !ehFaturamentoArquivados(servico.faturamento)
      )
    case 'arquivados':
      return ehFaturamentoArquivados(servico.faturamento)
  }
}

export function filtrarPorResumoCard(
  servicos: ServicoRegistro[],
  card: ResumoCardFiltro | null,
): ServicoRegistro[] {
  if (!card) return servicos
  return servicos.filter((servico) => servicoPertenceAoResumoCard(servico, card))
}

export function filtrosEstaoVazios(
  filtros: ManutencaoFiltros,
  busca: string,
): boolean {
  if (busca.trim()) return false
  return (
    filtros.ano === 'todos' &&
    filtros.mes === 'todos' &&
    !filtros.dataInicio &&
    !filtros.dataFim &&
    filtros.tipo === 'todos' &&
    filtros.tipoFaturamento === 'todos' &&
    filtros.viatura === 'todos' &&
    filtros.aprovacao === 'todos' &&
    filtros.singra2 === 'todos' &&
    filtros.status === 'todos'
  )
}

export function calcularResumoStatusServicos(
  servicos: ServicoRegistro[],
): ResumoStatusServicos {
  let totalFaturados = 0
  let totalPendentes = 0
  let totalArquivados = 0
  let qtdFaturados = 0
  let qtdPendentes = 0
  let qtdArquivados = 0

  for (const servico of servicos) {
    if (servicoPertenceAoResumoCard(servico, 'faturado')) {
      totalFaturados += servico.valor
      qtdFaturados += 1
    }
    if (servicoPertenceAoResumoCard(servico, 'pendente')) {
      totalPendentes += servico.valor
      qtdPendentes += 1
    }
    if (servicoPertenceAoResumoCard(servico, 'arquivados')) {
      totalArquivados += servico.valor
      qtdArquivados += 1
    }
  }

  return {
    totalFaturados,
    totalPendentes,
    totalArquivados,
    qtdFaturados,
    qtdPendentes,
    qtdArquivados,
  }
}

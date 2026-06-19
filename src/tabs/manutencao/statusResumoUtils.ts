import type { ManutencaoFiltros } from './types'
import { getAprovacaoServico, type ServicoRegistro } from './servicoTypes'

export interface ResumoStatusServicos {
  totalFaturados: number
  totalPendentes: number
  totalNaoAprovados: number
  qtdFaturados: number
  qtdPendentes: number
  qtdNaoAprovados: number
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
  let totalNaoAprovados = 0
  let qtdFaturados = 0
  let qtdPendentes = 0
  let qtdNaoAprovados = 0

  for (const servico of servicos) {
    const aprovacao = getAprovacaoServico(servico)

    if (servico.status === 'faturado') {
      totalFaturados += servico.valor
      qtdFaturados += 1
    }
    if (servico.status === 'pendente' && aprovacao !== 'nao-aprovado') {
      totalPendentes += servico.valor
      qtdPendentes += 1
    }
    if (aprovacao === 'nao-aprovado') {
      totalNaoAprovados += servico.valor
      qtdNaoAprovados += 1
    }
  }

  return {
    totalFaturados,
    totalPendentes,
    totalNaoAprovados,
    qtdFaturados,
    qtdPendentes,
    qtdNaoAprovados,
  }
}

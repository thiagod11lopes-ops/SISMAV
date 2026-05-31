export interface ManutencaoFiltros {
  ano: string
  mes: string
  dataInicio: string
  dataFim: string
  tipo: string
  tipoFaturamento: string
  viatura: string
  aprovacao: string
  singra2: string
  status: string
}

export const FILTROS_INICIAIS: ManutencaoFiltros = {
  ano: 'todos',
  mes: 'todos',
  dataInicio: '',
  dataFim: '',
  tipo: 'todos',
  tipoFaturamento: 'todos',
  viatura: 'todos',
  aprovacao: 'todos',
  singra2: 'todos',
  status: 'todos',
}

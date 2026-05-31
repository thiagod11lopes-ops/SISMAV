export type CategoriaServico = 'ambulancia' | 'administrativo'

export type Singra2Status = 'lancado' | 'pendante'

export type StatusServico = 'faturado' | 'pendente'

export interface ServicoRegistro {
  id: string
  categoria: CategoriaServico
  faturamento: string
  faturar: boolean
  modelo: string
  viatura: string
  os: string
  dataSaida: string
  dataRetorno: string
  nfPeca: string
  nfServico: string
  singra2: Singra2Status
  preAprovado: boolean
  aprovado: boolean
  valor: number
  status: StatusServico
  descricao: string
  ano: number
  mes: number
}

export function getAprovacaoServico(
  r: ServicoRegistro,
): 'aprovado' | 'nao-aprovado' | 'pre-aprovado' {
  if (r.aprovado) return 'aprovado'
  if (r.preAprovado) return 'pre-aprovado'
  return 'nao-aprovado'
}

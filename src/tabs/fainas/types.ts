export type FainaSubTabId = 'pendente' | 'andamento' | 'finalizados'

export type FainaStatus = 'pendente' | 'andamento' | 'finalizado'

export interface FainaItem {
  id: string
  tituloAtividade: string
  descricao: string
  dataLimite?: string
  ano: number
  mes: number
  status: FainaStatus
}

export interface FainaSubTabItem {
  id: FainaSubTabId
  label: string
  icon: React.ReactNode
}

export const FAINAS_SUB_TABS: FainaSubTabItem[] = [
  {
    id: 'pendente',
    label: 'Pendente',
    icon: null,
  },
  {
    id: 'andamento',
    label: 'Andamento',
    icon: null,
  },
  {
    id: 'finalizados',
    label: 'Finalizados',
    icon: null,
  },
]

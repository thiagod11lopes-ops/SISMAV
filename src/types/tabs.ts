export type TabId =
  | 'manutencao'
  | 'controle-financeiro'
  | 'viaturas'
  | 'fainas'
  | 'balanco'
  | 'configuracoes'

export interface TabItem {
  id: TabId
  label: string
}

export const TABS: TabItem[] = [
  { id: 'manutencao', label: 'Manutenção' },
  { id: 'controle-financeiro', label: 'Controle Financeiro' },
  { id: 'viaturas', label: 'Viaturas' },
  { id: 'fainas', label: 'Fainas' },
  { id: 'balanco', label: 'Balanço' },
  { id: 'configuracoes', label: 'Configurações' },
]

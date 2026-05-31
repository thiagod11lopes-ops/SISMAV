export type FinanceiroSubTabId =
  | 'contrato-solemp'
  | 'faturamento-servicos'
  | 'resumo-financeiro'

export const FINANCEIRO_SUB_TABS = [
  {
    id: 'contrato-solemp' as const,
    label: 'Cadastro de Contrato e Solemp',
  },
  {
    id: 'faturamento-servicos' as const,
    label: 'Faturamento de serviços',
  },
  {
    id: 'resumo-financeiro' as const,
    label: 'Resumo financeiro',
  },
]

import type { TabId } from '../types/tabs'
import { Balanco } from './Balanco'
import { Configuracoes } from './Configuracoes'
import { ControleFinanceiro } from './ControleFinanceiro'
import { Fainas } from './Fainas'
import { Manutencao } from './Manutencao'
import { Viaturas } from './Viaturas'

const TAB_PANELS: Record<TabId, () => React.ReactNode> = {
  manutencao: () => <Manutencao />,
  'controle-financeiro': () => <ControleFinanceiro />,
  viaturas: () => <Viaturas />,
  fainas: () => <Fainas />,
  balanco: () => <Balanco />,
  configuracoes: () => <Configuracoes />,
}

export function TabPanel({ tabId }: { tabId: TabId }) {
  const Panel = TAB_PANELS[tabId]
  return <>{Panel()}</>
}

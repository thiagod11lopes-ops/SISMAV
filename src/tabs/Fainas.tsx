import { useState } from 'react'
import { SubTabs } from '../components/SubTabs'
import { IconAndamento, IconFinalizados, IconPendente } from '../components/icons/FainasIcons'
import { Andamento } from './fainas/Andamento'
import { Finalizados } from './fainas/Finalizados'
import { FainasProvider } from './fainas/FainasContext'
import { Pendente } from './fainas/Pendente'
import type { FainaSubTabId } from './fainas/types'
import { FAINAS_SUB_TABS } from './fainas/types'
import './fainas/Fainas.css'

const SUB_TAB_PANELS: Record<FainaSubTabId, () => React.ReactNode> = {
  pendente: () => <Pendente />,
  andamento: () => <Andamento />,
  finalizados: () => <Finalizados />,
}

function FainasConteudo() {
  const [subTab, setSubTab] = useState<FainaSubTabId>('pendente')
  const Panel = SUB_TAB_PANELS[subTab]

  FAINAS_SUB_TABS[0].icon = <IconPendente />
  FAINAS_SUB_TABS[1].icon = <IconAndamento />
  FAINAS_SUB_TABS[2].icon = <IconFinalizados />

  return (
    <div className="fainas-page">
      <SubTabs
        tabs={FAINAS_SUB_TABS}
        activeTab={subTab}
        onTabChange={setSubTab}
        ariaLabel="Seções das Fainas"
        panelIdPrefix="fainas"
      />

      <div
        className="sub-tabs-panel"
        role="tabpanel"
        id={`fainas-panel-${subTab}`}
        aria-labelledby={`fainas-tab-${subTab}`}
      >
        <Panel />
      </div>
    </div>
  )
}

export function Fainas() {
  return (
    <FainasProvider>
      <FainasConteudo />
    </FainasProvider>
  )
}

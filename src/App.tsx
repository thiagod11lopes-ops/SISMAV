import { useState } from 'react'
import { Header } from './components/Header'
import { Tabs } from './components/Tabs'
import { TabPanel } from './tabs'
import type { TabId } from './types/tabs'
import './App.css'

const ABAS_LARGURA_TOTAL: TabId[] = ['manutencao', 'viaturas']

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('manutencao')

  return (
    <div className="app">
      <aside className="app-sidebar" aria-label="Navegação principal">
        <Header />
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      <div className="app-body">
        <main
          className={`app-main${ABAS_LARGURA_TOTAL.includes(activeTab) ? ' app-main--full' : ''}`}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <TabPanel tabId={activeTab} />
        </main>
        <footer className="app-footer">
          <span>SISMAV 2.0</span>
          <span>{new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  )
}

export default App

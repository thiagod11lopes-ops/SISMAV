import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Tabs } from './components/Tabs'
import { TabPanel } from './tabs'
import type { TabId } from './types/tabs'
import './App.css'
import { SaidasAdministrativasPage } from './pages/SaidasAdministrativas/SaidasAdministrativasPage'

const ABAS_LARGURA_TOTAL: TabId[] = ['manutencao', 'viaturas']

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('manutencao')
  const SAIDAS_ADMIN_HASH_ROUTE = '#/saidas-administrativas'
  const [hashRoute, setHashRoute] = useState<string>(() => window.location.hash || '')

  useEffect(() => {
    const onHashChange = () => setHashRoute(window.location.hash || '')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const isSaidasAdminRoute = hashRoute === SAIDAS_ADMIN_HASH_ROUTE

  const isFullWidth =
    ABAS_LARGURA_TOTAL.includes(activeTab) || isSaidasAdminRoute

  return (
    <div className="app">
      <aside className="app-sidebar" aria-label="Navegação principal">
        <Header />
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      <div className="app-body">
        <main
          className={`app-main${isFullWidth ? ' app-main--full' : ''}`}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {isSaidasAdminRoute ? (
            <SaidasAdministrativasPage />
          ) : (
            <TabPanel tabId={activeTab} />
          )}
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

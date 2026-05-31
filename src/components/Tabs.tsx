import type { TabId } from '../types/tabs'
import { TABS } from '../types/tabs'
import './Tabs.css'

interface TabsProps {
  activeTab: TabId
  onTabChange: (id: TabId) => void
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <nav className="tabs" aria-label="Módulos do sistema">
      <ul className="tabs__list" role="tablist">
        {TABS.map((tab) => (
          <li key={tab.id} role="presentation">
            <button
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`tabs__button${activeTab === tab.id ? ' tabs__button--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

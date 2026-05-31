import './SubTabs.css'

export interface SubTabItem<T extends string> {
  id: T
  label: string
  icon?: React.ReactNode
}

interface SubTabsProps<T extends string> {
  tabs: SubTabItem<T>[]
  activeTab: T
  onTabChange: (id: T) => void
  ariaLabel: string
  panelIdPrefix: string
}

export function SubTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  panelIdPrefix,
}: SubTabsProps<T>) {
  return (
    <nav className="sub-tabs" aria-label={ariaLabel}>
      <ul className="sub-tabs__list" role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id} role="presentation">
            <button
              type="button"
              role="tab"
              id={`${panelIdPrefix}-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`${panelIdPrefix}-panel-${tab.id}`}
              className={`sub-tabs__button${activeTab === tab.id ? ' sub-tabs__button--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.icon && <span className="sub-tabs__icon">{tab.icon}</span>}
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

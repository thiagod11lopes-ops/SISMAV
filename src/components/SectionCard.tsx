import type { ReactNode } from 'react'
import './SectionCard.css'

interface SectionCardProps {
  title: string
  description?: string
  children?: ReactNode
  actions?: ReactNode
  fullWidth?: boolean
  hideHeader?: boolean
}

export function SectionCard({
  title,
  description,
  children,
  actions,
  fullWidth = false,
  hideHeader = false,
}: SectionCardProps) {
  return (
    <section
      className={`section-card${fullWidth ? ' section-card--full' : ''}`}
    >
      {!hideHeader && (
        <header className="section-card__header">
          <div>
            <h2 className="section-card__title">{title}</h2>
            {description && (
              <p className="section-card__description">{description}</p>
            )}
          </div>
          {actions && <div className="section-card__actions">{actions}</div>}
        </header>
      )}
      {children && <div className="section-card__body">{children}</div>}
    </section>
  )
}

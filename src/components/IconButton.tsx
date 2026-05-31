import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './IconButton.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  iconOnly?: boolean
}

export function IconButton({
  icon,
  children,
  variant = 'secondary',
  iconOnly = false,
  className = '',
  ...props
}: IconButtonProps) {
  const somenteIcone = iconOnly || children == null || children === false

  return (
    <button
      type="button"
      className={`icon-btn icon-btn--${variant}${
        somenteIcone ? ' icon-btn--icon-only' : ''
      }${className ? ` ${className}` : ''}`}
      {...props}
    >
      <span className="icon-btn__icon">{icon}</span>
      {!somenteIcone && <span className="icon-btn__label">{children}</span>}
    </button>
  )
}

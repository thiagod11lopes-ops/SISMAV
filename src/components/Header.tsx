import './Header.css'

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h1 className="app-header__title">SISMAV</h1>
        <span className="app-header__rule" aria-hidden="true" />
        <p className="app-header__subtitle">
          Sistema de Manutenção de Viaturas
        </p>
      </div>
    </header>
  )
}

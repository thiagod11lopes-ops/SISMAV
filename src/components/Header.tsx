import { useAuth } from '../auth/AuthContext'
import './Header.css'

export function Header() {
  const { user, authEnabled, logout } = useAuth()

  const nomeUsuario =
    user?.displayName?.trim() || user?.email?.split('@')[0] || 'Usuário'
  const fotoUsuario = user?.photoURL?.trim() || ''

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h1 className="app-header__title">SISMAV</h1>
        <span className="app-header__rule" aria-hidden="true" />
        <p className="app-header__subtitle">
          Sistema de Manutenção de Viaturas
        </p>
      </div>

      {authEnabled && user && (
        <div className="app-header__user">
          {fotoUsuario ? (
            <img
              className="app-header__avatar"
              src={fotoUsuario}
              alt=""
              width={32}
              height={32}
            />
          ) : (
            <span className="app-header__avatar app-header__avatar--fallback" aria-hidden>
              {nomeUsuario.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="app-header__user-info">
            <span className="app-header__user-name">{nomeUsuario}</span>
            <button
              type="button"
              className="app-header__logout"
              onClick={() => void logout()}
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

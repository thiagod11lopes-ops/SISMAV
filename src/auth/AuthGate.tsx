import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { LoginPage } from './LoginPage'
import './AuthGate.css'

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, authEnabled } = useAuth()

  if (!authEnabled) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="auth-gate-loading" role="status" aria-live="polite">
        <div className="auth-gate-loading__spinner" aria-hidden />
        <p>Verificando sessão…</p>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <>{children}</>
}

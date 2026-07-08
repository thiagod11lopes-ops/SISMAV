import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from '../firebase/config'
import { emailTemAcesso } from './authConfig'

interface AuthContextValue {
  user: User | null
  loading: boolean
  authEnabled: boolean
  acessoNegado: string | null
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  limparAcessoNegado: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }: { children: ReactNode }) {
  const authEnabled = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(authEnabled)
  const [acessoNegado, setAcessoNegado] = useState<string | null>(null)

  useEffect(() => {
    if (!authEnabled) {
      setLoading(false)
      return
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !emailTemAcesso(firebaseUser.email)) {
        setAcessoNegado(firebaseUser.email ?? '')
        setUser(null)
        setLoading(false)
        void signOut(auth)
        return
      }

      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [authEnabled])

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth()
    if (!auth) {
      throw new Error('Firebase não configurado. Preencha o arquivo .env.')
    }

    setAcessoNegado(null)
    const resultado = await signInWithPopup(auth, googleProvider)

    if (!emailTemAcesso(resultado.user.email)) {
      setAcessoNegado(resultado.user.email ?? '')
      setUser(null)
      await signOut(auth)
    }
  }, [])

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth()
    if (!auth) return
    await signOut(auth)
  }, [])

  const limparAcessoNegado = useCallback(() => setAcessoNegado(null), [])

  const value = useMemo(
    () => ({
      user,
      loading,
      authEnabled,
      acessoNegado,
      signInWithGoogle,
      logout,
      limparAcessoNegado,
    }),
    [
      user,
      loading,
      authEnabled,
      acessoNegado,
      signInWithGoogle,
      logout,
      limparAcessoNegado,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}

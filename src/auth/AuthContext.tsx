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

interface AuthContextValue {
  user: User | null
  loading: boolean
  authEnabled: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }: { children: ReactNode }) {
  const authEnabled = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(authEnabled)

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

    await signInWithPopup(auth, googleProvider)
  }, [])

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth()
    if (!auth) return
    await signOut(auth)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      authEnabled,
      signInWithGoogle,
      logout,
    }),
    [user, loading, authEnabled, signInWithGoogle, logout],
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

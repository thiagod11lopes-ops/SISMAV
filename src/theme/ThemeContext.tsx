import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  aplicarTemaNoDocumento,
  carregarTemaSalvo,
  salvarTema,
  type TemaId,
} from './themeStorage'

interface ThemeContextValue {
  tema: TemaId
  setTema: (tema: TemaId) => void
  alternarTema: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTemaState] = useState<TemaId>(() => carregarTemaSalvo())

  const setTema = useCallback((novo: TemaId) => {
    setTemaState(novo)
    salvarTema(novo)
    aplicarTemaNoDocumento(novo)
  }, [])

  const alternarTema = useCallback(() => {
    setTema(tema === 'dark' ? 'light' : 'dark')
  }, [setTema, tema])

  const value = useMemo(
    () => ({
      tema,
      setTema,
      alternarTema,
      isDark: tema === 'dark',
    }),
    [tema, setTema, alternarTema],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  }
  return ctx
}

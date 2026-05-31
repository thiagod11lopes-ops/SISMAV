import { createContext, useContext, useState, type ReactNode } from 'react'
import { ExcluirFainaModal } from './ExcluirFainaModal'
import { useFainas, type UseFainasReturn } from './useFainas'
import type { FainaItem } from './types'

interface FainasContextValue extends UseFainasReturn {
  solicitarExclusao: (faina: FainaItem) => void
}

const FainasContext = createContext<FainasContextValue | null>(null)

export function FainasProvider({ children }: { children: ReactNode }) {
  const fainasApi = useFainas()
  const [fainaParaExcluir, setFainaParaExcluir] = useState<FainaItem | null>(null)

  const confirmarExclusao = () => {
    if (!fainaParaExcluir) return
    fainasApi.excluir(fainaParaExcluir.id)
    setFainaParaExcluir(null)
  }

  return (
    <FainasContext.Provider
      value={{
        ...fainasApi,
        solicitarExclusao: setFainaParaExcluir,
      }}
    >
      {children}
      <ExcluirFainaModal
        faina={fainaParaExcluir}
        onFechar={() => setFainaParaExcluir(null)}
        onConfirmar={confirmarExclusao}
      />
    </FainasContext.Provider>
  )
}

export function useFainasContext(): FainasContextValue {
  const ctx = useContext(FainasContext)
  if (!ctx) {
    throw new Error('useFainasContext deve ser usado dentro de FainasProvider')
  }
  return ctx
}

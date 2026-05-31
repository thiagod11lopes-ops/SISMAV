import { useEffect, useState } from 'react'
import {
  carregarContratos,
  EVENTO_CONTRATOS_ATUALIZADOS,
  type ContratoRegistro,
} from './contratoStorage'

export function useContratos(): ContratoRegistro[] {
  const [contratos, setContratos] = useState<ContratoRegistro[]>(() =>
    carregarContratos(),
  )

  useEffect(() => {
    const atualizar = () => setContratos(carregarContratos())

    window.addEventListener(EVENTO_CONTRATOS_ATUALIZADOS, atualizar)
    window.addEventListener('storage', atualizar)

    return () => {
      window.removeEventListener(EVENTO_CONTRATOS_ATUALIZADOS, atualizar)
      window.removeEventListener('storage', atualizar)
    }
  }, [])

  return contratos
}

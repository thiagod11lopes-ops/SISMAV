import { useEffect, useState } from 'react'
import {
  carregarSolemps,
  EVENTO_SOLEMPS_ATUALIZADOS,
  type SolempRegistro,
} from './solempStorage'

export function useSolemps(): SolempRegistro[] {
  const [solemps, setSolemps] = useState<SolempRegistro[]>(() => carregarSolemps())

  useEffect(() => {
    const atualizar = () => setSolemps(carregarSolemps())

    window.addEventListener(EVENTO_SOLEMPS_ATUALIZADOS, atualizar)
    window.addEventListener('storage', atualizar)

    return () => {
      window.removeEventListener(EVENTO_SOLEMPS_ATUALIZADOS, atualizar)
      window.removeEventListener('storage', atualizar)
    }
  }, [])

  return solemps
}

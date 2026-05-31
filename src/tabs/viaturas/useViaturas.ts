import { useEffect, useState } from 'react'
import { VIATURAS_INICIAIS } from '../Viaturas'
import type { ViaturaLinha } from './types'
import {
  carregarViaturas,
  EVENTO_VIATURAS_ATUALIZADOS,
} from './viaturasStorage'

export function useViaturas(): ViaturaLinha[] {
  const [viaturas, setViaturas] = useState<ViaturaLinha[]>(() =>
    carregarViaturas(VIATURAS_INICIAIS),
  )

  useEffect(() => {
    const atualizar = () => setViaturas(carregarViaturas(VIATURAS_INICIAIS))
    window.addEventListener(EVENTO_VIATURAS_ATUALIZADOS, atualizar)
    return () => window.removeEventListener(EVENTO_VIATURAS_ATUALIZADOS, atualizar)
  }, [])

  return viaturas
}

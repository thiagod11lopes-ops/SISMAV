import { useEffect, useState } from 'react'
import {
  carregarServicos,
  EVENTO_SERVICOS_ATUALIZADOS,
} from './servicosStorage'
import type { ServicoRegistro } from './servicoTypes'

export function useServicos(): ServicoRegistro[] {
  const [servicos, setServicos] = useState<ServicoRegistro[]>(() =>
    carregarServicos(),
  )

  useEffect(() => {
    const atualizar = () => setServicos(carregarServicos())

    window.addEventListener(EVENTO_SERVICOS_ATUALIZADOS, atualizar)
    window.addEventListener('storage', atualizar)

    return () => {
      window.removeEventListener(EVENTO_SERVICOS_ATUALIZADOS, atualizar)
      window.removeEventListener('storage', atualizar)
    }
  }, [])

  return servicos
}

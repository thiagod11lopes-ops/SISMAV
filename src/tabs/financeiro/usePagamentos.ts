import { useEffect, useState } from 'react'
import {
  carregarPagamentos,
  EVENTO_PAGAMENTOS_ATUALIZADOS,
  type PagamentoRegistro,
} from './pagamentosStorage'

export function usePagamentos(): PagamentoRegistro[] {
  const [pagamentos, setPagamentos] = useState<PagamentoRegistro[]>(() =>
    carregarPagamentos(),
  )

  useEffect(() => {
    const atualizar = () => setPagamentos(carregarPagamentos())

    window.addEventListener(EVENTO_PAGAMENTOS_ATUALIZADOS, atualizar)
    window.addEventListener('storage', atualizar)

    return () => {
      window.removeEventListener(EVENTO_PAGAMENTOS_ATUALIZADOS, atualizar)
      window.removeEventListener('storage', atualizar)
    }
  }, [])

  return pagamentos
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { parseDataBr } from '../../utils/formatoBr'
import { carregarFainas, salvarFainas } from './fainasStorage'
import type { FainaItem, FainaStatus } from './types'
import type { NovaAtividade } from './AdicionarAtividadeCard'

function novoIdFaina(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useFainas() {
  const [fainas, setFainas] = useState<FainaItem[]>(() => carregarFainas())
  const ignorarProximaPersistencia = useRef(true)

  useEffect(() => {
    if (ignorarProximaPersistencia.current) {
      ignorarProximaPersistencia.current = false
      return
    }
    salvarFainas(fainas)
  }, [fainas])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sismav.fainas') {
        ignorarProximaPersistencia.current = true
        setFainas(carregarFainas())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const atualizar = useCallback((updater: (prev: FainaItem[]) => FainaItem[]) => {
    setFainas(updater)
  }, [])

  const adicionar = useCallback(
    (atividade: NovaAtividade) => {
      const dataLimiteDate = atividade.dataLimite
        ? parseDataBr(atividade.dataLimite)
        : null
      const nova: FainaItem = {
        id: novoIdFaina(),
        tituloAtividade: atividade.tituloAtividade,
        descricao: atividade.descricao,
        dataLimite: atividade.dataLimite,
        ano: dataLimiteDate ? dataLimiteDate.getFullYear() : 0,
        mes: dataLimiteDate ? dataLimiteDate.getMonth() + 1 : 0,
        status: 'pendente',
      }
      atualizar((prev) => [nova, ...prev])
    },
    [atualizar],
  )

  const moverStatus = useCallback(
    (id: string, status: FainaStatus) => {
      atualizar((prev) =>
        prev.map((faina) => (faina.id === id ? { ...faina, status } : faina)),
      )
    },
    [atualizar],
  )

  const excluir = useCallback(
    (id: string) => {
      atualizar((prev) => prev.filter((faina) => faina.id !== id))
    },
    [atualizar],
  )

  const porStatus = useCallback(
    (status: FainaStatus) => fainas.filter((faina) => faina.status === status),
    [fainas],
  )

  return {
    fainas,
    adicionar,
    moverStatus,
    excluir,
    pendentes: porStatus('pendente'),
    emAndamento: porStatus('andamento'),
    finalizadas: porStatus('finalizado'),
  }
}

export type UseFainasReturn = ReturnType<typeof useFainas>

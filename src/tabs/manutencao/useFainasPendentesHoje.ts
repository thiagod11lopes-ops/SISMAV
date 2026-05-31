import { useCallback, useEffect, useMemo, useState } from 'react'
import { EVENTO_AVISO_FAINAS_DISPENSADO } from '../fainas/avisoFainasDismissStorage'
import { dispensarAvisoFainasHoje } from '../fainas/avisoFainasDismissStorage'
import { listarFainasPendentesAlarmeVisivel } from '../fainas/fainasPendentesHoje'
import { EVENTO_FAINAS_ATUALIZADAS } from '../fainas/fainasStorage'
import type { FainaItem } from '../fainas/types'

export function useFainasPendentesHoje(): {
  fainas: FainaItem[]
  dispensarAviso: () => void
} {
  const [versao, setVersao] = useState(0)

  const atualizar = useCallback(() => setVersao((v) => v + 1), [])

  const fainas = useMemo(() => {
    void versao
    return listarFainasPendentesAlarmeVisivel()
  }, [versao])

  useEffect(() => {
    window.addEventListener(EVENTO_FAINAS_ATUALIZADAS, atualizar)
    window.addEventListener(EVENTO_AVISO_FAINAS_DISPENSADO, atualizar)
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === 'sismav.fainas' ||
        e.key === 'sismav.aviso-fainas-dispensado-dia'
      ) {
        atualizar()
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener(EVENTO_FAINAS_ATUALIZADAS, atualizar)
      window.removeEventListener(EVENTO_AVISO_FAINAS_DISPENSADO, atualizar)
      window.removeEventListener('storage', onStorage)
    }
  }, [atualizar])

  const dispensarAviso = useCallback(() => {
    dispensarAvisoFainasHoje()
    atualizar()
  }, [atualizar])

  return { fainas, dispensarAviso }
}

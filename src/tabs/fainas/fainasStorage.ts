import type { FainaItem, FainaStatus } from './types'

const STORAGE_KEY = 'sismav.fainas'
export const EVENTO_FAINAS_ATUALIZADAS = 'sismav:fainas-atualizadas'

function normalizarStatus(valor: unknown): FainaStatus {
  if (valor === 'andamento' || valor === 'finalizado') return valor
  return 'pendente'
}

export function carregarFainas(): FainaItem[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return []
    const parsed = JSON.parse(bruto) as unknown
    if (!Array.isArray(parsed)) return []
    const vistos = new Set<string>()
    const lista: FainaItem[] = []
    for (const item of parsed) {
      const registro = item as Partial<FainaItem>
      const id = registro.id ?? String(Date.now())
      if (vistos.has(id)) continue
      vistos.add(id)
      lista.push({
        id,
        tituloAtividade: registro.tituloAtividade ?? '',
        descricao: registro.descricao ?? '',
        dataLimite: registro.dataLimite,
        ano: registro.ano ?? 0,
        mes: registro.mes ?? 0,
        status: normalizarStatus(registro.status),
      })
    }
    return lista
  } catch {
    return []
  }
}

export function salvarFainas(fainas: FainaItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fainas))
    window.dispatchEvent(new CustomEvent(EVENTO_FAINAS_ATUALIZADAS))
  } catch {
    /* ignore quota / private mode */
  }
}

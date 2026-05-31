import { formatarData } from '../../utils/formatoBr'

const STORAGE_KEY = 'sismav.aviso-fainas-dispensado-dia'
export const EVENTO_AVISO_FAINAS_DISPENSADO = 'sismav:aviso-fainas-dispensado'

export function avisoFainasDispensadoHoje(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === formatarData()
  } catch {
    return false
  }
}

export function dispensarAvisoFainasHoje(): void {
  try {
    localStorage.setItem(STORAGE_KEY, formatarData())
    window.dispatchEvent(new CustomEvent(EVENTO_AVISO_FAINAS_DISPENSADO))
  } catch {
    /* ignore quota / private mode */
  }
}

export function lerAvisoFainasDispensadoParaBackup(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? ''
  } catch {
    return ''
  }
}

export function restaurarAvisoFainasDispensado(dia: string): void {
  const valor = dia.trim()
  try {
    if (!valor) {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, valor)
    }
    window.dispatchEvent(new CustomEvent(EVENTO_AVISO_FAINAS_DISPENSADO))
  } catch {
    /* ignore quota / private mode */
  }
}

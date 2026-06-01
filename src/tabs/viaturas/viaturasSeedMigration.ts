import { VIATURAS_INICIAIS } from './viaturasData'
import { salvarViaturas } from './viaturasStorage'

const CHAVE_VIATURAS = 'sismav.viaturas'

/**
 * Preenche viaturas iniciais quando nunca houve persistência neste navegador.
 * Garante que a aba Viaturas (e balanço) tenham os dados do backup embutido.
 */
export function garantirViaturasIniciais(): void {
  try {
    const bruto = localStorage.getItem(CHAVE_VIATURAS)
    if (bruto === null) {
      salvarViaturas([...VIATURAS_INICIAIS])
      return
    }
    const parsed = JSON.parse(bruto) as unknown
    if (Array.isArray(parsed) && parsed.length === 0) {
      salvarViaturas([...VIATURAS_INICIAIS])
    }
  } catch {
    /* ignore quota / private mode */
  }
}

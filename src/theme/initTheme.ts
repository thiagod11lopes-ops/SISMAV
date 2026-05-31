import { aplicarTemaNoDocumento, carregarTemaSalvo } from './themeStorage'

export function initTheme(): void {
  aplicarTemaNoDocumento(carregarTemaSalvo())
}

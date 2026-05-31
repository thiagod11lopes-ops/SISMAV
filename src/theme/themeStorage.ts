export type TemaId = 'light' | 'dark'

const STORAGE_KEY = 'sismav.tema'

export function carregarTemaSalvo(): TemaId {
  try {
    const valor = localStorage.getItem(STORAGE_KEY)
    return valor === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function salvarTema(tema: TemaId): void {
  try {
    localStorage.setItem(STORAGE_KEY, tema)
  } catch {
    /* ignore */
  }
}

export function aplicarTemaNoDocumento(tema: TemaId): void {
  document.documentElement.dataset.theme = tema
  document.documentElement.style.colorScheme = tema
}

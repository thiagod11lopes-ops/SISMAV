/** Escapa valor para célula CSV (RFC 4180). */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const texto = String(value)
  if (/[",\r\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`
  }
  return texto
}

export function linhasParaCsv(
  cabecalhos: string[],
  linhas: Record<string, unknown>[],
): string {
  const header = cabecalhos.map(escapeCsvCell).join(',')
  const corpo = linhas.map((linha) =>
    cabecalhos.map((col) => escapeCsvCell(linha[col])).join(','),
  )
  return [header, ...corpo].join('\r\n')
}

export function baixarTextoComoArquivo(
  nomeArquivo: string,
  conteudo: string,
  mime = 'text/csv;charset=utf-8',
  incluirBom = mime.startsWith('text/csv'),
): void {
  const blob = new Blob([incluirBom ? '\uFEFF' : '', conteudo], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

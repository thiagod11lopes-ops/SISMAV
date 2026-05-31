/** Parseia conteúdo CSV (RFC 4180) em matriz de células. */
export function parseCsvLinhas(conteudo: string): string[][] {
  const linhas: string[][] = []
  let linhaAtual: string[] = []
  let celula = ''
  let dentroAspas = false

  for (let i = 0; i < conteudo.length; i++) {
    const char = conteudo[i]
    const proximo = conteudo[i + 1]

    if (dentroAspas) {
      if (char === '"' && proximo === '"') {
        celula += '"'
        i++
      } else if (char === '"') {
        dentroAspas = false
      } else {
        celula += char
      }
      continue
    }

    if (char === '"') {
      dentroAspas = true
      continue
    }

    if (char === ',') {
      linhaAtual.push(celula)
      celula = ''
      continue
    }

    if (char === '\r' && proximo === '\n') {
      linhaAtual.push(celula)
      linhas.push(linhaAtual)
      linhaAtual = []
      celula = ''
      i++
      continue
    }

    if (char === '\n' || char === '\r') {
      linhaAtual.push(celula)
      linhas.push(linhaAtual)
      linhaAtual = []
      celula = ''
      continue
    }

    celula += char
  }

  if (celula.length > 0 || linhaAtual.length > 0) {
    linhaAtual.push(celula)
    linhas.push(linhaAtual)
  }

  return linhas.filter((linha) => linha.some((c) => c.trim() !== ''))
}

export function parseCsvRegistros(
  conteudo: string,
): Record<string, string>[] {
  const matriz = parseCsvLinhas(conteudo.trim())
  if (matriz.length === 0) return []

  const cabecalhos = matriz[0]
  return matriz.slice(1).map((celulas) => {
    const registro: Record<string, string> = {}
    cabecalhos.forEach((coluna, indice) => {
      registro[coluna] = celulas[indice] ?? ''
    })
    return registro
  })
}

/** Extrai blocos CSV gerados pelo exportador SISMAV (`[TABELA];nome`). */
export function extrairTabelasBackupCsv(
  conteudo: string,
): Map<string, Record<string, string>[]> {
  const texto = conteudo.replace(/^\uFEFF/, '')
  const linhas = texto.split(/\r?\n/)
  const resultado = new Map<string, Record<string, string>[]>()
  let tabelaAtual: string | null = null
  let blocoLinhas: string[] = []

  const finalizarBloco = () => {
    if (!tabelaAtual || blocoLinhas.length === 0) return
    resultado.set(tabelaAtual, parseCsvRegistros(blocoLinhas.join('\n')))
    blocoLinhas = []
  }

  for (const linha of linhas) {
    const trimmed = linha.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const marcador = /^\[TABELA];(.+)$/i.exec(trimmed)
    if (marcador) {
      finalizarBloco()
      tabelaAtual = marcador[1].trim()
      continue
    }

    if (!tabelaAtual) continue
    blocoLinhas.push(linha)
  }

  finalizarBloco()
  return resultado
}

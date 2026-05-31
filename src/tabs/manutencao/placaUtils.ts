import type { ViaturaLinha } from '../viaturas/types'

/** Remove espaços, hífens e padroniza para comparação (ex.: "TTP 2G26" → "TTP2G26"). */
export function normalizarPlaca(placa: string): string {
  return placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

/** Tenta extrair placa do texto do PDF com vários padrões (antigo e Mercosul). */
export function extrairPlacaDoTexto(texto: string): string {
  const t = texto.replace(/\s+/g, ' ')

  const padroes = [
    /Placa\.*:\s*([A-Z]{3}[\s-]?[0-9][A-Z0-9]{2,3})/i,
    /Placa\.*:\s*([A-Z]{3}[\s-]?[0-9]{4})/i,
    /Placa\.*:\s*([A-Z]{3}[\s-]?[A-Z0-9]{4})/i,
    /\bPlaca\s+([A-Z]{3}\s?[0-9][A-Z0-9]{2,3})\b/i,
    /\b([A-Z]{3}\s[0-9][A-Z0-9]{2})\b/,
    /\b([A-Z]{3}-[0-9]{4})\b/,
    /\b([A-Z]{3}-[0-9][A-Z0-9]{3})\b/,
  ]

  for (const padrao of padroes) {
    const match = t.match(padrao)
    if (match?.[1]) {
      return match[1].replace(/\s+/g, ' ').trim().toUpperCase()
    }
  }

  return ''
}

/** Ex.: "181179 - TTP 2G26.pdf" → "TTP 2G26" */
export function extrairPlacaDoNomeArquivo(nomeArquivo: string): string {
  const base = nomeArquivo.replace(/\.pdf$/i, '').trim()
  const padroes = [
    /-\s*([A-Z]{3}[\s-]?[0-9][A-Z0-9]{2,3})\s*$/i,
    /-\s*([A-Z]{3}[\s-]?[0-9]{4})\s*$/i,
    /\b([A-Z]{3}\s[0-9][A-Z0-9]{2})\b/i,
    /\b([A-Z]{3}-[0-9A-Z]{4,5})\b/i,
  ]

  for (const padrao of padroes) {
    const match = base.match(padrao)
    if (match?.[1]) {
      return match[1].replace(/\s+/g, ' ').trim().toUpperCase()
    }
  }

  return ''
}

/** Último recurso: qualquer sequência com formato de placa no texto. */
export function extrairQualquerPlacaCandidata(texto: string): string {
  const t = texto.toUpperCase()
  const match =
    t.match(/[A-Z]{3}[\s-][0-9][A-Z0-9]{2}/) ??
    t.match(/[A-Z]{3}-[0-9]{4}/) ??
    t.match(/[A-Z]{3}-[0-9][A-Z0-9]{3}/) ??
    t.match(/[A-Z]{3}[0-9][A-Z0-9]{3}/)
  return match?.[0]?.replace(/\s+/g, ' ').trim() ?? ''
}

/** Procura placas cadastradas que aparecem no texto do PDF. */
export function buscarPlacaCadastradaNoTexto(
  texto: string,
  viaturas: ViaturaLinha[],
): ViaturaLinha | null {
  const blob = texto.toUpperCase().replace(/[^A-Z0-9]/g, '')

  for (const viatura of viaturas) {
    const norm = normalizarPlaca(viatura.placa)
    if (norm.length >= 6 && blob.includes(norm)) {
      return viatura
    }
  }

  return null
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const linhas: number[] = Array.from({ length: b.length + 1 }, (_, i) => i)

  for (let i = 1; i <= a.length; i += 1) {
    let anterior = i - 1
    linhas[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const temp = linhas[j]
      const custo = a[i - 1] === b[j - 1] ? 0 : 1
      linhas[j] = Math.min(linhas[j] + 1, linhas[j - 1] + 1, anterior + custo)
      anterior = temp
    }
  }

  return linhas[b.length]
}

export interface ResultadoPlacaViatura {
  viatura: ViaturaLinha
  exata: boolean
  distancia: number
  placaExtraida: string
}

/**
 * Compara a placa do PDF com a frota cadastrada e retorna a mais próxima.
 * Sempre retorna a melhor correspondência quando houver candidato válido.
 */
export function encontrarViaturaPorPlaca(
  placaExtraida: string,
  viaturas: ViaturaLinha[],
): ResultadoPlacaViatura | null {
  const alvo = normalizarPlaca(placaExtraida)
  if (!alvo || alvo.length < 6) return null

  let melhor: ViaturaLinha | null = null
  let menorDistancia = Infinity

  for (const viatura of viaturas) {
    const norm = normalizarPlaca(viatura.placa)
    if (!norm) continue

    const distancia = levenshtein(alvo, norm)
    if (distancia < menorDistancia) {
      menorDistancia = distancia
      melhor = viatura
    }
  }

  if (!melhor) return null

  return {
    viatura: melhor,
    exata: menorDistancia === 0,
    distancia: menorDistancia,
    placaExtraida: placaExtraida.trim().toUpperCase(),
  }
}

/**
 * Resolve viatura a partir do PDF: texto, nome do arquivo e busca no conteúdo.
 */
export function resolverViaturaDoPdf(
  textoPdf: string,
  nomeArquivo: string,
  viaturas: ViaturaLinha[],
): ResultadoPlacaViatura | null {
  const noTexto = buscarPlacaCadastradaNoTexto(textoPdf, viaturas)
  if (noTexto) {
    return {
      viatura: noTexto,
      exata: true,
      distancia: 0,
      placaExtraida: noTexto.placa,
    }
  }

  const candidatos = [
    extrairPlacaDoTexto(textoPdf),
    extrairPlacaDoNomeArquivo(nomeArquivo),
    extrairQualquerPlacaCandidata(textoPdf),
  ].filter((p, i, arr) => p && arr.indexOf(p) === i)

  for (const placa of candidatos) {
    const resultado = encontrarViaturaPorPlaca(placa, viaturas)
    if (resultado) return resultado
  }

  return null
}

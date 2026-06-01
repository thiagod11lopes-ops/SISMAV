import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const csvPath =
  process.argv[2] ||
  'C:/Users/anamr/Downloads/sismav-backup-2026-05-31_22-18.csv'

function parseCsvLinhas(conteudo) {
  const linhas = []
  let linhaAtual = []
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

function extrairTabelaViaturas(conteudo) {
  const linhas = conteudo.replace(/^\uFEFF/, '').split(/\r?\n/)
  let capturando = false
  const bloco = []
  for (const linha of linhas) {
    const trimmed = linha.trim()
    if (/^\[TABELA\];viaturas$/i.test(trimmed)) {
      capturando = true
      continue
    }
    if (capturando && /^\[TABELA\];/i.test(trimmed)) break
    if (capturando && trimmed && !trimmed.startsWith('#')) bloco.push(linha)
  }
  const matriz = parseCsvLinhas(bloco.join('\n'))
  if (matriz.length < 2) return []
  const cabecalhos = matriz[0]
  return matriz.slice(1).map((celulas) => {
    const row = {}
    cabecalhos.forEach((col, i) => {
      row[col] = celulas[i] ?? ''
    })
    return {
      id: String(row.id ?? ''),
      tipo: row.tipo === 'administrativo' ? 'administrativo' : 'ambulancia',
      placa: row.placa ?? '',
      modelo: row.modelo ?? '',
      ano: String(row.ano ?? ''),
      valorFipe: row.valorFipe ?? '',
      km: String(row.km ?? '0'),
      situacao: row.situacao ?? 'Operacional',
    }
  })
}

const csv = readFileSync(csvPath, 'utf8')
const viaturas = extrairTabelaViaturas(csv)

if (viaturas.length === 0) {
  console.error('Nenhuma viatura encontrada no CSV:', csvPath)
  process.exit(1)
}

const outPath = join(root, 'src/tabs/viaturas/viaturasData.ts')
const conteudo = `import type { ViaturaLinha } from './types'

/** Importado de ${csvPath.split(/[/\\\\]/).pop()} (${viaturas.length} viaturas) */
export const VIATURAS_INICIAIS: ViaturaLinha[] = ${JSON.stringify(viaturas, null, 2)
  .replace(/"([^"]+)":/g, '$1:')
  .replace(/"/g, "'")}
`

writeFileSync(outPath, conteudo, 'utf8')
console.log(`Gerado ${outPath} com ${viaturas.length} viaturas.`)

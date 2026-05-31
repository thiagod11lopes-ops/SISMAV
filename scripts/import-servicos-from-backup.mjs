import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const backupPath =
  process.argv[2] ||
  'C:/Users/DELL/Downloads/SISMAV_Backup_2026-05-28T15-59-44.json'

const backup = JSON.parse(readFileSync(backupPath, 'utf8'))
const manutencoes = backup.dados.manutencoesCadastradas

const MODELO_POR_PLACA = {
  'RIV-9I01': 'Sprinter',
  'RKK-9I27': 'Sprinter',
  'TTD-1A38': 'Master',
  'KPK-6H03': 'Sprinter',
  'KVZ-8089': 'Sprinter',
  'KVZ-8A91': 'Sprinter',
  'KPH-9E52': 'Ducato',
  'KPH-9E53': 'Ducato',
  'KPH-9E54': 'Ducato',
  'TTP-2G26': 'Master',
  'KZT-1560': 'Honda',
  'LPE-6G44': 'Ducato',
  'LPE-2A05': 'Ducato',
  'KPG-9A79': 'Doblô',
  'LQS-1F32': 'Doblô',
  'NVT-8G55': 'Doblô',
  'RJN-4J27': 'Ka',
  'KRQ-0G70': 'Clio',
  'KVZ-7A70': 'Iveco',
  'LTI-2281': 'Corolla',
  'LSB-8C53': '408',
  'LNC-1A94': 'Santana',
  'KZV-8G41': 'Ducato',
  'LKL-8D08': 'Ford Cargo',
}

function isoToBr(iso) {
  if (!iso || typeof iso !== 'string') return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return ''
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

function parseValor(valor) {
  if (!valor) return 0
  const n = Number(
    String(valor)
      .replace(/R\$\s?/gi, '')
      .replace(/\./g, '')
      .replace(',', '.'),
  )
  return Number.isNaN(n) ? 0 : n
}

function parseFaturamento(faturamento) {
  if (!faturamento) return '1'
  if (/não aprovados/i.test(faturamento)) return 'Não aprovados'
  const match = faturamento.match(/(\d+)/)
  return match ? match[1] : faturamento
}

function mapCategoria(tipo) {
  if (/ambul/i.test(tipo)) return 'ambulancia'
  return 'administrativo'
}

function mapSingra2(singra2) {
  if (!singra2) return 'pendante'
  if (/lançado/i.test(singra2)) return 'lancado'
  return 'pendante'
}

function mapRegistro(item) {
  const placa = (item.viatura || '').trim().toUpperCase()
  const dataRef = item.dataEntrada || item.dataSaida || ''
  const [anoStr, mesStr] = dataRef.split('-')
  const ano = Number(anoStr) || 0
  const mes = Number(mesStr) || 0

  return {
    id: item.id,
    categoria: mapCategoria(item.tipo),
    faturamento: parseFaturamento(item.faturamento),
    faturar: Boolean(item.selecionadoParaFaturar),
    modelo: MODELO_POR_PLACA[placa] || '—',
    viatura: placa,
    os: String(item.ordemServico || ''),
    dataSaida: isoToBr(item.dataEntrada),
    dataRetorno: item.dataSaidaIndeterminada
      ? 'Indeterminado'
      : isoToBr(item.dataSaida),
    nfPeca: item.nfPeca || '',
    nfServico: item.nfServico || '',
    singra2: mapSingra2(item.singra2),
    preAprovado: Boolean(item.preAprovado),
    aprovado: Boolean(item.aprovado),
    valor: parseValor(item.valor),
    status: item.faturado ? 'faturado' : 'pendente',
    descricao: item.descricao || '',
    ano,
    mes,
  }
}

const servicos = manutencoes.map(mapRegistro)

const amb = servicos.filter((s) => s.categoria === 'ambulancia').length
const adm = servicos.filter((s) => s.categoria === 'administrativo').length

const out = `import type { ServicoRegistro } from './servicoTypes'

/** Importado de SISMAV_Backup_2026-05-28T15-59-44.json (${servicos.length} registros) */
export const SERVICOS: ServicoRegistro[] = ${JSON.stringify(servicos, null, 2)}
`

writeFileSync(join(root, 'src/tabs/manutencao/servicosData.ts'), out, 'utf8')

console.log(`Importados ${servicos.length} serviços (${amb} ambulâncias, ${adm} administrativas)`)

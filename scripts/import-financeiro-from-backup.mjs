import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const backupPath =
  process.argv[2] ||
  'd:/sismav/SISMAV_Backup_2026-05-29T14-32-29.json'

const backup = JSON.parse(readFileSync(backupPath, 'utf8'))
const nomeBackup = backupPath.split(/[/\\]/).pop()
const dados = backup.dados ?? {}

function isoToBr(iso) {
  if (!iso || typeof iso !== 'string') return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

function formatarValorReais(valor) {
  const n = Number(valor)
  if (!Number.isFinite(n)) return 'R$0,00'
  const negativo = n < 0
  const valorAbs = Math.abs(n)
  const [inteiro, centavos] = valorAbs.toFixed(2).split('.')
  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const formatado = `R$${inteiroFormatado},${centavos}`
  return negativo ? `-${formatado}` : formatado
}

function parseFaturamentoNumero(numero) {
  const match = /^(\d+)\s*[°º]?\s*\/?\s*\d*$/i.exec(String(numero ?? '').trim())
  return match ? match[1] : String(numero ?? '').trim()
}

const empenhos = dados.empenhos ?? []
const solempsLegado = dados.solemps ?? []
const faturamentos = dados.faturamentos ?? []

const empenhoPorId = new Map(empenhos.map((e) => [e.id, e]))
const solempPorId = new Map(solempsLegado.map((s) => [s.id, s]))

const contratos = empenhos.map((empenho) => ({
  id: empenho.id,
  numeroContrato: String(empenho.numero ?? '').trim(),
  vigencia: `${isoToBr(empenho.data)} — —`,
  valorTotal: formatarValorReais(empenho.valorTotal),
}))

const solemps = solempsLegado.map((solemp) => {
  const empenho = empenhoPorId.get(solemp.empenhoId)
  return {
    id: solemp.id,
    contratoId: solemp.empenhoId ?? '',
    numeroContrato: String(empenho?.numero ?? '—').trim(),
    numeroSolemp: String(solemp.numero ?? '').trim(),
    dataSolemp: isoToBr(solemp.data),
    valorSolemp: formatarValorReais(solemp.valorTotal),
  }
})

const pagamentos = faturamentos.map((fat) => {
  const solemp = solempPorId.get(fat.solempId)
  const empenho = solemp ? empenhoPorId.get(solemp.empenhoId) : undefined
  const numeroFat = String(fat.numero ?? '').trim()

  return {
    id: fat.id,
    dataPagamento: isoToBr(fat.data),
    faturamento: parseFaturamentoNumero(numeroFat),
    faturamentoLabel: numeroFat,
    valor: Number(fat.valor) || 0,
    quantidadeServicos: Array.isArray(fat.servicosIds) ? fat.servicosIds.length : 0,
    solempId: fat.solempId ?? '',
    numeroSolemp: String(solemp?.numero ?? '').trim(),
    contratoId: solemp?.empenhoId ?? '',
    numeroContrato: String(empenho?.numero ?? '').trim(),
  }
})

const out = `import type { ContratoRegistro } from './contratoStorage'
import type { PagamentoRegistro } from './pagamentosStorage'
import type { SolempRegistro } from './solempStorage'

/** Importado de ${nomeBackup} — ${contratos.length} contrato(s), ${solemps.length} solemp(s), ${pagamentos.length} faturamento(s) pago(s) */
export const CONTRATOS: ContratoRegistro[] = ${JSON.stringify(contratos, null, 2)}

export const SOLEMPS: SolempRegistro[] = ${JSON.stringify(solemps, null, 2)}

export const PAGAMENTOS_FATURAMENTO: PagamentoRegistro[] = ${JSON.stringify(pagamentos, null, 2)}
`

writeFileSync(join(root, 'src/tabs/financeiro/financeiroData.ts'), out, 'utf8')

const totalPago = pagamentos.reduce((s, p) => s + p.valor, 0)
console.log(
  `Importados ${contratos.length} contrato(s), ${solemps.length} solemp(s), ${pagamentos.length} pagamento(s)`,
)
console.log(`Total faturamentos pagos: ${formatarValorReais(totalPago)}`)

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

function isoToBr(iso) {
  if (!iso || typeof iso !== 'string') return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

/** Converte rótulos do sistema legado (Orçamentos) para faturamento do SISMAV 2.0. */
function extrairNumeroFaturamento(texto) {
  const t = texto.trim()
  let m = /^(\d+)\s*[°º]?\s*Fa$/i.exec(t)
  if (m) return m[1]
  m = /^(\d+)\s*[°º]\s*Faturamento$/i.exec(t)
  if (m) return m[1]
  return null
}

function parseFaturamentoLegado(faturamento) {
  if (!faturamento) return ''
  if (/não aprovados/i.test(faturamento)) return 'Não aprovados'
  const num = extrairNumeroFaturamento(faturamento)
  if (num) return num
  const match = faturamento.match(/(\d+)/)
  return match ? match[1] : faturamento
}

function osParaFaturamento(os, mapaOsFaturamento) {
  const mapped = mapaOsFaturamento.get(os)
  if (mapped) {
    const num = parseFaturamentoLegado(mapped)
    if (num) return num
    return mapped
  }

  const num = extrairNumeroFaturamento(os)
  if (num) return num

  if (/^\d+$/.test(os)) return `OS ${os}`

  return os
}

function montarMapaOsFaturamento(manutencoes) {
  const mapa = new Map()
  for (const m of manutencoes ?? []) {
    const os = String(m.ordemServico ?? '').trim()
    const fat = String(m.faturamento ?? '').trim()
    if (os && fat) mapa.set(os, fat)
  }
  return mapa
}

function converterOrcamentosLegado(dados) {
  const mapaOs = montarMapaOsFaturamento(dados.manutencoesCadastradas)

  const pagamentos = (dados.orcamentos_pagamentos ?? []).map((p) => ({
    id: p.id,
    faturamento: osParaFaturamento(String(p.os ?? ''), mapaOs),
    data: isoToBr(p.data),
    valor: Number(p.valor) || 0,
  }))

  const compras = (dados.orcamentos_compras ?? []).map((c) => ({
    id: c.id,
    item: String(c.item ?? '').trim(),
    valor: Number(c.valor) || 0,
  }))

  return { pagamentos, compras }
}

const { pagamentos, compras } = converterOrcamentosLegado(backup.dados)
const totalPag = pagamentos.reduce((s, p) => s + p.valor, 0)
const totalComp = compras.reduce((s, c) => s + c.valor, 0)

const out = `import type { ControleCreditosDados } from './controleCreditosTypes'

/** Importado de ${nomeBackup} — Orçamentos: ${pagamentos.length} pagamentos, ${compras.length} compras */
export const CONTROLE_CREDITOS: ControleCreditosDados = ${JSON.stringify({ pagamentos, compras }, null, 2)}
`

writeFileSync(join(root, 'src/tabs/manutencao/controleCreditosData.ts'), out, 'utf8')

console.log(
  `Importados ${pagamentos.length} pagamentos e ${compras.length} compras`,
)
console.log(
  `Totais: pagamentos R$ ${totalPag.toFixed(2)} | compras R$ ${totalComp.toFixed(2)} | balanço R$ ${(totalPag - totalComp).toFixed(2)}`,
)

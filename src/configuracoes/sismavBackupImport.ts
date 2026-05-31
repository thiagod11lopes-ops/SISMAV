import type { FainaItem, FainaStatus } from '../tabs/fainas/types'
import { restaurarAvisoFainasDispensado } from '../tabs/fainas/avisoFainasDismissStorage'
import { salvarFainas } from '../tabs/fainas/fainasStorage'
import type { ContratoRegistro } from '../tabs/financeiro/contratoStorage'
import { salvarContratos } from '../tabs/financeiro/contratoStorage'
import type { PagamentoRegistro } from '../tabs/financeiro/pagamentosStorage'
import { salvarPagamentos } from '../tabs/financeiro/pagamentosStorage'
import type { SolempRegistro } from '../tabs/financeiro/solempStorage'
import { salvarSolemps } from '../tabs/financeiro/solempStorage'
import type { AnotacoesPorData } from '../tabs/manutencao/anotacoesStorage'
import { persistirAnotacoes } from '../tabs/manutencao/anotacoesStorage'
import { restaurarEmpresaManutencao } from '../tabs/manutencao/empresaManutencaoStorage'
import { salvarControleCreditos } from '../tabs/manutencao/controleCreditosStorage'
import type {
  CreditoCompra,
  CreditoPagamento,
} from '../tabs/manutencao/controleCreditosTypes'
import type {
  CategoriaServico,
  ServicoRegistro,
  Singra2Status,
  StatusServico,
} from '../tabs/manutencao/servicoTypes'
import { salvarServicos } from '../tabs/manutencao/servicosStorage'
import type { ViaturaLinha } from '../tabs/viaturas/types'
import type { TipoViatura } from '../tabs/viaturas/CadastrarViaturaCard'
import { salvarViaturas } from '../tabs/viaturas/viaturasStorage'
import {
  aplicarTemaNoDocumento,
  salvarTema,
  type TemaId,
} from '../theme/themeStorage'
import {
  limparBalancoPeriodo,
  salvarBalancoPeriodo,
} from '../tabs/balanco/balancoPeriodoStorage'
import { restaurarBackupAutomaticoUltimoDia } from './backupAutomaticoStorage'
import { extrairTabelasBackupCsv } from '../utils/csvImport'
import { formatarData } from '../utils/formatoBr'
import type { SismavBackupPayload } from './sismavBackupExport'

export interface OpcoesAplicarBackup {
  onTemaImportado?: (tema: TemaId) => void
}

function parseBool(valor: string): boolean {
  const v = valor.trim().toLowerCase()
  return v === 'true' || v === '1' || v === 'sim' || v === 'yes'
}

function parseNumero(valor: string): number {
  const n = Number(valor)
  return Number.isFinite(n) ? n : 0
}

function rowToServico(row: Record<string, string>): ServicoRegistro {
  const categoria: CategoriaServico =
    row.categoria === 'administrativo' ? 'administrativo' : 'ambulancia'
  const singra2: Singra2Status = row.singra2 === 'lancado' ? 'lancado' : 'pendante'
  const status: StatusServico = row.status === 'faturado' ? 'faturado' : 'pendente'

  return {
    id: row.id ?? '',
    categoria,
    faturamento: row.faturamento ?? '',
    faturar: parseBool(row.faturar),
    modelo: row.modelo ?? '',
    viatura: row.viatura ?? '',
    os: row.os ?? '',
    dataSaida: row.dataSaida ?? '',
    dataRetorno: row.dataRetorno ?? '',
    nfPeca: row.nfPeca ?? '',
    nfServico: row.nfServico ?? '',
    singra2,
    preAprovado: parseBool(row.preAprovado),
    aprovado: parseBool(row.aprovado),
    valor: parseNumero(row.valor),
    status,
    descricao: row.descricao ?? '',
    ano: parseNumero(row.ano),
    mes: parseNumero(row.mes),
  }
}

function rowToViatura(row: Record<string, string>): ViaturaLinha {
  const tipo: TipoViatura =
    row.tipo === 'administrativo' ? 'administrativo' : 'ambulancia'
  return {
    id: row.id ?? '',
    tipo,
    placa: row.placa ?? '',
    modelo: row.modelo ?? '',
    ano: row.ano ?? '',
    valorFipe: row.valorFipe ?? '',
    km: row.km ?? '',
    situacao: row.situacao ?? '',
  }
}

function rowToContrato(row: Record<string, string>): ContratoRegistro {
  return {
    id: row.id ?? '',
    numeroContrato: row.numeroContrato ?? '',
    vigencia: row.vigencia ?? '',
    valorTotal: row.valorTotal ?? '',
  }
}

function rowToSolemp(row: Record<string, string>): SolempRegistro {
  return {
    id: row.id ?? '',
    contratoId: row.contratoId ?? '',
    numeroContrato: row.numeroContrato ?? '',
    numeroSolemp: row.numeroSolemp ?? '',
    dataSolemp: row.dataSolemp ?? '',
    valorSolemp: row.valorSolemp ?? '',
  }
}

function rowToPagamento(row: Record<string, string>): PagamentoRegistro {
  return {
    id: row.id ?? '',
    dataPagamento: row.dataPagamento ?? '',
    faturamento: row.faturamento ?? '',
    faturamentoLabel: row.faturamentoLabel ?? '',
    valor: parseNumero(row.valor),
    quantidadeServicos: parseNumero(row.quantidadeServicos),
    solempId: row.solempId ?? '',
    numeroSolemp: row.numeroSolemp ?? '',
    contratoId: row.contratoId ?? '',
    numeroContrato: row.numeroContrato ?? '',
  }
}

function rowToFaina(row: Record<string, string>): FainaItem {
  const statusRaw = row.status?.trim()
  const status: FainaStatus =
    statusRaw === 'andamento' || statusRaw === 'finalizado'
      ? statusRaw
      : 'pendente'
  const dataLimite = row.dataLimite?.trim()

  return {
    id: row.id ?? '',
    tituloAtividade: row.tituloAtividade ?? '',
    descricao: row.descricao ?? '',
    dataLimite: dataLimite || undefined,
    ano: parseNumero(row.ano),
    mes: parseNumero(row.mes),
    status,
  }
}

function rowToCreditoPagamento(row: Record<string, string>): CreditoPagamento {
  return {
    id: row.id ?? '',
    faturamento: row.faturamento ?? '',
    data: row.data ?? '',
    valor: parseNumero(row.valor),
  }
}

function rowToCreditoCompra(row: Record<string, string>): CreditoCompra {
  return {
    id: row.id ?? '',
    item: row.item ?? '',
    valor: parseNumero(row.valor),
  }
}

export function payloadDeBackupCsv(conteudo: string): SismavBackupPayload | null {
  const tabelas = extrairTabelasBackupCsv(conteudo)
  if (tabelas.size === 0) return null

  const configuracoesRows = tabelas.get('configuracoes') ?? []
  const configMap = new Map(
    configuracoesRows.map((r) => [r.chave, r.valor]),
  )

  const anotacoesDiarias: AnotacoesPorData = {}
  for (const row of tabelas.get('anotacoes-diarias') ?? []) {
    if (row.dataChave?.trim()) {
      anotacoesDiarias[row.dataChave] = row.texto ?? ''
    }
  }

  const balancoDataInicio = configMap.get('balanco-data-inicio') ?? ''
  const balancoDataFim = configMap.get('balanco-data-fim') ?? ''

  return {
    versao: '2.0',
    exportadoEm: formatarData(new Date()),
    servicos: (tabelas.get('servicos') ?? []).map(rowToServico),
    viaturas: (tabelas.get('viaturas') ?? []).map(rowToViatura),
    contratos: (tabelas.get('contratos') ?? []).map(rowToContrato),
    solemps: (tabelas.get('solemps') ?? []).map(rowToSolemp),
    pagamentos: (tabelas.get('pagamentos') ?? []).map(rowToPagamento),
    fainas: (tabelas.get('fainas') ?? []).map(rowToFaina),
    anotacoesDiarias,
    controleCreditos: {
      pagamentos: (tabelas.get('controle-creditos-pagamentos') ?? []).map(
        rowToCreditoPagamento,
      ),
      compras: (tabelas.get('controle-creditos-compras') ?? []).map(
        rowToCreditoCompra,
      ),
    },
    configuracoes: {
      empresaManutencaoAprovacao:
        configMap.get('empresa-manutencao-aprovacao') ?? '',
      tema: configMap.get('tema') === 'dark' ? 'dark' : 'light',
      avisoFainasDispensadoDia: configMap.get('aviso-fainas-dispensado-dia') ?? '',
      backupAutomaticoUltimoDia:
        configMap.get('backup-automatico-ultimo-dia') ?? '',
      balancoDataInicio,
      balancoDataFim,
    },
  }
}

export function aplicarDadosBackup(
  dados: SismavBackupPayload,
  opcoes?: OpcoesAplicarBackup,
): void {
  salvarServicos(dados.servicos)
  salvarViaturas(dados.viaturas)
  salvarContratos(dados.contratos)
  salvarSolemps(dados.solemps)
  salvarPagamentos(dados.pagamentos)
  salvarFainas(dados.fainas)
  persistirAnotacoes(dados.anotacoesDiarias)
  salvarControleCreditos(dados.controleCreditos)

  restaurarEmpresaManutencao(dados.configuracoes.empresaManutencaoAprovacao)
  restaurarAvisoFainasDispensado(dados.configuracoes.avisoFainasDispensadoDia)
  restaurarBackupAutomaticoUltimoDia(
    dados.configuracoes.backupAutomaticoUltimoDia,
  )

  const { balancoDataInicio, balancoDataFim } = dados.configuracoes
  if (balancoDataInicio.trim() && balancoDataFim.trim()) {
    salvarBalancoPeriodo({
      dataInicio: balancoDataInicio.trim(),
      dataFim: balancoDataFim.trim(),
    })
  } else {
    limparBalancoPeriodo()
  }

  const tema = dados.configuracoes.tema === 'dark' ? 'dark' : 'light'
  if (opcoes?.onTemaImportado) {
    opcoes.onTemaImportado(tema)
  } else {
    salvarTema(tema)
    aplicarTemaNoDocumento(tema)
  }
}

export type ResultadoLeituraBackupCsv =
  | { sucesso: true; dados: SismavBackupPayload; nomeArquivo: string }
  | { sucesso: false; erro: string }

export async function lerBackupCsvDeArquivo(
  arquivo: File,
): Promise<ResultadoLeituraBackupCsv> {
  if (!arquivo.name.toLowerCase().endsWith('.csv')) {
    return { sucesso: false, erro: 'Selecione um arquivo .csv de backup do SISMAV.' }
  }

  const dados = payloadDeBackupCsv(await arquivo.text())
  if (!dados) {
    return {
      sucesso: false,
      erro: 'Não foi possível ler o backup CSV. Use um arquivo exportado por este sistema.',
    }
  }

  return { sucesso: true, dados, nomeArquivo: arquivo.name }
}

export function importarBackupCsvDados(
  dados: SismavBackupPayload,
  opcoes?: OpcoesAplicarBackup,
): void {
  aplicarDadosBackup(dados, opcoes)
}

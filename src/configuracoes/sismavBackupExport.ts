import type { FainaItem } from '../tabs/fainas/types'
import { lerAvisoFainasDispensadoParaBackup } from '../tabs/fainas/avisoFainasDismissStorage'
import { carregarFainas } from '../tabs/fainas/fainasStorage'
import type { ContratoRegistro } from '../tabs/financeiro/contratoStorage'
import { carregarContratos } from '../tabs/financeiro/contratoStorage'
import type { PagamentoRegistro } from '../tabs/financeiro/pagamentosStorage'
import { carregarPagamentos } from '../tabs/financeiro/pagamentosStorage'
import type { SolempRegistro } from '../tabs/financeiro/solempStorage'
import { carregarSolemps } from '../tabs/financeiro/solempStorage'
import type { AnotacoesPorData } from '../tabs/manutencao/anotacoesStorage'
import { carregarAnotacoes } from '../tabs/manutencao/anotacoesStorage'
import { carregarControleCreditos } from '../tabs/manutencao/controleCreditosStorage'
import type { ControleCreditosDados } from '../tabs/manutencao/controleCreditosTypes'
import { lerEmpresaManutencaoParaBackup } from '../tabs/manutencao/empresaManutencaoStorage'
import type { ServicoRegistro } from '../tabs/manutencao/servicoTypes'
import { carregarServicos } from '../tabs/manutencao/servicosStorage'
import type { ViaturaLinha } from '../tabs/viaturas/types'
import { carregarViaturas } from '../tabs/viaturas/viaturasStorage'
import { VIATURAS_INICIAIS } from '../tabs/viaturas/viaturasData'
import type { TemaId } from '../theme/themeStorage'
import { carregarTemaSalvo } from '../theme/themeStorage'
import { carregarBalancoPeriodoSalvo } from '../tabs/balanco/balancoPeriodoStorage'
import { lerBackupAutomaticoUltimoDiaParaBackup } from './backupAutomaticoStorage'
import { formatarData } from '../utils/formatoBr'
import { baixarTextoComoArquivo, linhasParaCsv } from '../utils/csvExport'

export interface SismavBackupConfiguracoes {
  empresaManutencaoAprovacao: string
  tema: TemaId
  avisoFainasDispensadoDia: string
  backupAutomaticoUltimoDia: string
  balancoDataInicio: string
  balancoDataFim: string
}

export interface SismavBackupPayload {
  versao: '2.0'
  exportadoEm: string
  servicos: ServicoRegistro[]
  viaturas: ViaturaLinha[]
  contratos: ContratoRegistro[]
  solemps: SolempRegistro[]
  pagamentos: PagamentoRegistro[]
  fainas: FainaItem[]
  anotacoesDiarias: AnotacoesPorData
  controleCreditos: ControleCreditosDados
  configuracoes: SismavBackupConfiguracoes
}

interface TabelaBackup {
  nome: string
  csv: string
}

function stampArquivo(): string {
  const agora = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}_${pad(agora.getHours())}-${pad(agora.getMinutes())}`
}

export function coletarDadosBackup(): SismavBackupPayload {
  const periodoBalanco = carregarBalancoPeriodoSalvo()

  return {
    versao: '2.0',
    exportadoEm: formatarData(new Date()),
    servicos: carregarServicos(),
    viaturas: carregarViaturas(VIATURAS_INICIAIS),
    contratos: carregarContratos(),
    solemps: carregarSolemps(),
    pagamentos: carregarPagamentos(),
    fainas: carregarFainas(),
    anotacoesDiarias: carregarAnotacoes(),
    controleCreditos: carregarControleCreditos(),
    configuracoes: {
      empresaManutencaoAprovacao: lerEmpresaManutencaoParaBackup(),
      tema: carregarTemaSalvo(),
      avisoFainasDispensadoDia: lerAvisoFainasDispensadoParaBackup(),
      backupAutomaticoUltimoDia: lerBackupAutomaticoUltimoDiaParaBackup(),
      balancoDataInicio: periodoBalanco?.dataInicio ?? '',
      balancoDataFim: periodoBalanco?.dataFim ?? '',
    },
  }
}

function coletarTabelasBackup(dados: SismavBackupPayload): TabelaBackup[] {
  const { configuracoes } = dados

  return [
    {
      nome: 'servicos',
      csv: linhasParaCsv(
        [
          'id',
          'categoria',
          'faturamento',
          'faturar',
          'modelo',
          'viatura',
          'os',
          'dataSaida',
          'dataRetorno',
          'nfPeca',
          'nfServico',
          'singra2',
          'preAprovado',
          'aprovado',
          'valor',
          'status',
          'descricao',
          'ano',
          'mes',
        ],
        dados.servicos.map((s) => ({ ...s })),
      ),
    },
    {
      nome: 'viaturas',
      csv: linhasParaCsv(
        ['id', 'tipo', 'placa', 'modelo', 'ano', 'valorFipe', 'km', 'situacao'],
        dados.viaturas.map((v) => ({ ...v })),
      ),
    },
    {
      nome: 'contratos',
      csv: linhasParaCsv(
        ['id', 'numeroContrato', 'vigencia', 'valorTotal'],
        dados.contratos.map((c) => ({ ...c })),
      ),
    },
    {
      nome: 'solemps',
      csv: linhasParaCsv(
        [
          'id',
          'contratoId',
          'numeroContrato',
          'numeroSolemp',
          'dataSolemp',
          'valorSolemp',
        ],
        dados.solemps.map((s) => ({ ...s })),
      ),
    },
    {
      nome: 'pagamentos',
      csv: linhasParaCsv(
        [
          'id',
          'dataPagamento',
          'faturamento',
          'faturamentoLabel',
          'valor',
          'quantidadeServicos',
          'solempId',
          'numeroSolemp',
          'contratoId',
          'numeroContrato',
        ],
        dados.pagamentos.map((p) => ({ ...p })),
      ),
    },
    {
      nome: 'fainas',
      csv: linhasParaCsv(
        [
          'id',
          'tituloAtividade',
          'descricao',
          'dataLimite',
          'ano',
          'mes',
          'status',
        ],
        dados.fainas.map((f) => ({
          ...f,
          dataLimite: f.dataLimite ?? '',
        })),
      ),
    },
    {
      nome: 'anotacoes-diarias',
      csv: linhasParaCsv(
        ['dataChave', 'texto'],
        Object.entries(dados.anotacoesDiarias).map(([dataChave, texto]) => ({
          dataChave,
          texto,
        })),
      ),
    },
    {
      nome: 'controle-creditos-pagamentos',
      csv: linhasParaCsv(
        ['id', 'faturamento', 'data', 'valor'],
        dados.controleCreditos.pagamentos.map((p) => ({ ...p })),
      ),
    },
    {
      nome: 'controle-creditos-compras',
      csv: linhasParaCsv(
        ['id', 'item', 'valor'],
        dados.controleCreditos.compras.map((c) => ({ ...c })),
      ),
    },
    {
      nome: 'configuracoes',
      csv: linhasParaCsv(['chave', 'valor'], [
        {
          chave: 'empresa-manutencao-aprovacao',
          valor: configuracoes.empresaManutencaoAprovacao,
        },
        { chave: 'tema', valor: configuracoes.tema },
        {
          chave: 'aviso-fainas-dispensado-dia',
          valor: configuracoes.avisoFainasDispensadoDia,
        },
        {
          chave: 'backup-automatico-ultimo-dia',
          valor: configuracoes.backupAutomaticoUltimoDia,
        },
        {
          chave: 'balanco-data-inicio',
          valor: configuracoes.balancoDataInicio,
        },
        {
          chave: 'balanco-data-fim',
          valor: configuracoes.balancoDataFim,
        },
      ]),
    },
  ]
}

export interface OpcoesExportarBackupCsv {
  /** Nome do arquivo com prefixo de backup automático diário. */
  automatico?: boolean
}

/** Gera um único CSV com todas as tabelas do sistema e inicia o download. */
export function exportarBackupSismavCsv(opcoes?: OpcoesExportarBackupCsv): void {
  const dados = coletarDadosBackup()
  const tabelas = coletarTabelasBackup(dados)
  const partes: string[] = [
    `# SISMAV 2.0 — Backup`,
    `# Exportado em: ${dados.exportadoEm}`,
    '',
  ]

  if (opcoes?.automatico) {
    partes.unshift('# Tipo: backup automático diário')
  }

  for (const tabela of tabelas) {
    partes.push(`[TABELA];${tabela.nome}`)
    partes.push(tabela.csv)
    partes.push('')
  }

  const stamp = stampArquivo()
  const prefixo = opcoes?.automatico ? 'sismav-backup-automatico' : 'sismav-backup'
  baixarTextoComoArquivo(`${prefixo}-${stamp}.csv`, partes.join('\r\n'))
}

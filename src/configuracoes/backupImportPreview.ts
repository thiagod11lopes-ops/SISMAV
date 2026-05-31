import type { SismavBackupPayload } from './sismavBackupExport'

export interface ResumoImportacaoSecao {
  id: string
  titulo: string
  quantidade: number
}

export function montarResumoImportacaoBackup(
  dados: SismavBackupPayload,
): ResumoImportacaoSecao[] {
  const qtdAnotacoes = Object.keys(dados.anotacoesDiarias).length
  const qtdConfiguracoes =
    1 +
    (dados.configuracoes.empresaManutencaoAprovacao.trim() ? 1 : 0) +
    (dados.configuracoes.avisoFainasDispensadoDia.trim() ? 1 : 0) +
    (dados.configuracoes.backupAutomaticoUltimoDia.trim() ? 1 : 0) +
    (dados.configuracoes.balancoDataInicio.trim() &&
    dados.configuracoes.balancoDataFim.trim()
      ? 1
      : 0)

  return [
    { id: 'servicos', titulo: 'Serviços de manutenção', quantidade: dados.servicos.length },
    { id: 'viaturas', titulo: 'Viaturas', quantidade: dados.viaturas.length },
    { id: 'contratos', titulo: 'Contratos', quantidade: dados.contratos.length },
    { id: 'solemps', titulo: 'Solemp', quantidade: dados.solemps.length },
    { id: 'pagamentos', titulo: 'Pagamentos', quantidade: dados.pagamentos.length },
    {
      id: 'controle-creditos-pagamentos',
      titulo: 'Controle de créditos — pagamentos',
      quantidade: dados.controleCreditos.pagamentos.length,
    },
    {
      id: 'controle-creditos-compras',
      titulo: 'Controle de créditos — compras',
      quantidade: dados.controleCreditos.compras.length,
    },
    { id: 'fainas', titulo: 'Fainas', quantidade: dados.fainas.length },
    {
      id: 'anotacoes',
      titulo: 'Anotações diárias',
      quantidade: qtdAnotacoes,
    },
    {
      id: 'configuracoes',
      titulo: 'Configurações e preferências',
      quantidade: qtdConfiguracoes,
    },
  ]
}

export function contarRegistrosImportacao(dados: SismavBackupPayload): number {
  return montarResumoImportacaoBackup(dados).reduce(
    (total, secao) => total + secao.quantidade,
    0,
  )
}

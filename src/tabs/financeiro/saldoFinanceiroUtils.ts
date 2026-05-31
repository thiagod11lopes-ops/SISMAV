import type { ContratoRegistro } from './contratoStorage'
import type { PagamentoRegistro } from './pagamentosStorage'
import type { SolempRegistro } from './solempStorage'
import { formatarValorMoeda, parseValorMoeda } from './valorUtils'

export function calcularValorUtilizadoSolemp(
  solempId: string,
  pagamentos: PagamentoRegistro[],
): number {
  return pagamentos
    .filter((pagamento) => pagamento.solempId === solempId)
    .reduce((acc, pagamento) => acc + pagamento.valor, 0)
}

export function calcularValorUtilizadoContrato(
  contratoId: string,
  pagamentos: PagamentoRegistro[],
): number {
  return pagamentos
    .filter((pagamento) => pagamento.contratoId === contratoId)
    .reduce((acc, pagamento) => acc + pagamento.valor, 0)
}

export function calcularSaldoSolemp(
  solemp: SolempRegistro,
  pagamentos: PagamentoRegistro[],
): number {
  const total = parseValorMoeda(solemp.valorSolemp)
  return total - calcularValorUtilizadoSolemp(solemp.id, pagamentos)
}

export function calcularSaldoContrato(
  contrato: ContratoRegistro,
  pagamentos: PagamentoRegistro[],
): number {
  const total = parseValorMoeda(contrato.valorTotal)
  return total - calcularValorUtilizadoContrato(contrato.id, pagamentos)
}

export function faturamentoJaPago(
  faturamento: string,
  pagamentos: PagamentoRegistro[],
  excluirPagamentoId?: string,
): boolean {
  return pagamentos.some(
    (pagamento) =>
      pagamento.faturamento === faturamento && pagamento.id !== excluirPagamentoId,
  )
}

export function calcularSaldoSolempParaEdicao(
  solemp: SolempRegistro,
  pagamentos: PagamentoRegistro[],
  pagamentoEmEdicaoId?: string,
): number {
  const total = parseValorMoeda(solemp.valorSolemp)
  const utilizado = pagamentos
    .filter(
      (pagamento) =>
        pagamento.solempId === solemp.id && pagamento.id !== pagamentoEmEdicaoId,
    )
    .reduce((acc, pagamento) => acc + pagamento.valor, 0)
  return total - utilizado
}

export function calcularSaldoContratoParaEdicao(
  contrato: ContratoRegistro,
  pagamentos: PagamentoRegistro[],
  pagamentoEmEdicaoId?: string,
): number {
  const total = parseValorMoeda(contrato.valorTotal)
  const utilizado = pagamentos
    .filter(
      (pagamento) =>
        pagamento.contratoId === contrato.id && pagamento.id !== pagamentoEmEdicaoId,
    )
    .reduce((acc, pagamento) => acc + pagamento.valor, 0)
  return total - utilizado
}

export interface ResumoContratoLinha {
  id: string
  numeroContrato: string
  valorTotal: string
  valorUtilizado: string
  valorRestante: string
}

export interface ResumoSolempLinha {
  id: string
  numeroContrato: string
  numeroSolemp: string
  valorTotal: string
  valorUtilizado: string
  valorRestante: string
}

export function montarResumoContratos(
  contratos: ContratoRegistro[],
  pagamentos: PagamentoRegistro[],
): ResumoContratoLinha[] {
  return contratos.map((contrato) => {
    const utilizado = calcularValorUtilizadoContrato(contrato.id, pagamentos)
    const restante = calcularSaldoContrato(contrato, pagamentos)
    return {
      id: contrato.id,
      numeroContrato: contrato.numeroContrato,
      valorTotal: contrato.valorTotal,
      valorUtilizado: formatarValorMoeda(utilizado),
      valorRestante: formatarValorMoeda(restante),
    }
  })
}

export function montarResumoSolemps(
  solemps: SolempRegistro[],
  pagamentos: PagamentoRegistro[],
): ResumoSolempLinha[] {
  return solemps.map((solemp) => {
    const utilizado = calcularValorUtilizadoSolemp(solemp.id, pagamentos)
    const restante = calcularSaldoSolemp(solemp, pagamentos)
    return {
      id: solemp.id,
      numeroContrato: solemp.numeroContrato,
      numeroSolemp: solemp.numeroSolemp,
      valorTotal: solemp.valorSolemp,
      valorUtilizado: formatarValorMoeda(utilizado),
      valorRestante: formatarValorMoeda(restante),
    }
  })
}

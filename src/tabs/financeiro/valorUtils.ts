export {
  formatarMoeda as formatarValorMoeda,
  formatarMoedaArmazenamento as formatarValorReais,
  formatarData as formatarDataPagamento,
  parseValorMoeda,
  valorMoedaParaEdicao,
} from '../../utils/formatoBr'

export function parseVigenciaContrato(vigencia: string): {
  dataInicio: string
  dataFim: string
} {
  const partes = vigencia.split(' — ')
  return {
    dataInicio: partes[0]?.trim() ?? '',
    dataFim: partes[1]?.trim() ?? '',
  }
}

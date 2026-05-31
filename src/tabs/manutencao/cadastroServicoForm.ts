import {
  formatarMoeda,
  normalizarDataBr,
  parseValorMoeda,
  valorMoedaParaEdicao,
} from '../../utils/formatoBr'
import { formatarLabelFaturamento } from './faturamentoOptions'
import type { CategoriaServico, ServicoRegistro } from './servicoTypes'

export interface DadosFormularioServico {
  faturamento: string
  os: string
  categoria: CategoriaServico
  viatura: string
  modelo: string
  dataSaida: string
  dataRetorno: string
  nfPeca: string
  nfServico: string
  valor: string
  descricao: string
}

export function valorFaturamentoFromInput(texto: string): {
  value: string
  label: string
} {
  const label = formatarLabelFaturamento(texto.trim())
  if (!label) return { value: '', label: '' }
  const numMatch = /^(\d+)º Faturamento$/i.exec(label)
  const value = numMatch ? numMatch[1] : label
  return { value, label }
}

export function servicoParaFormulario(registro: ServicoRegistro): DadosFormularioServico {
  return {
    faturamento: registro.faturamento,
    os: registro.os,
    categoria: registro.categoria,
    viatura: registro.viatura,
    modelo: registro.modelo,
    dataSaida: registro.dataSaida,
    dataRetorno: registro.dataRetorno,
    nfPeca: registro.nfPeca,
    nfServico: registro.nfServico,
    valor: valorMoedaParaEdicao(formatarMoeda(registro.valor)),
    descricao: registro.descricao,
  }
}

export function formularioVazio(): DadosFormularioServico {
  return {
    faturamento: '',
    os: '',
    categoria: 'administrativo',
    viatura: '',
    modelo: '',
    dataSaida: '',
    dataRetorno: '',
    nfPeca: '',
    nfServico: '',
    valor: '',
    descricao: '',
  }
}

function extrairAnoMes(dataBr: string): { ano: number; mes: number } {
  const data = dataBr.trim()
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data)
  if (!match) return { ano: 0, mes: 0 }
  return { ano: Number(match[3]), mes: Number(match[2]) }
}

export function montarRegistroServicoFromFormulario(
  form: DadosFormularioServico,
  base: ServicoRegistro | null,
): ServicoRegistro {
  const os = form.os.trim()
  const faturamento = form.faturamento.trim()
  const viatura = form.viatura.trim()
  const dataSaida = form.dataSaida.trim() ? normalizarDataBr(form.dataSaida) : ''
  const dataRetorno = form.dataRetorno.trim()
    ? normalizarDataBr(form.dataRetorno)
    : ''
  const valor = parseValorMoeda(form.valor)
  const descricao = form.descricao.trim()
  const { ano, mes } = extrairAnoMes(dataSaida)

  if (base) {
    return {
      ...base,
      faturamento,
      os,
      categoria: form.categoria,
      viatura,
      modelo: form.modelo.trim() || base.modelo,
      dataSaida,
      dataRetorno,
      nfPeca: form.nfPeca.trim(),
      nfServico: form.nfServico.trim(),
      valor,
      descricao,
      ano,
      mes,
    }
  }

  return {
    id: `man_${Date.now()}`,
    categoria: form.categoria,
    faturamento,
    faturar: false,
    modelo: form.modelo.trim() || '—',
    viatura,
    os,
    dataSaida,
    dataRetorno,
    nfPeca: form.nfPeca.trim(),
    nfServico: form.nfServico.trim(),
    singra2: 'pendante',
    preAprovado: false,
    aprovado: false,
    valor,
    status: 'pendente',
    descricao,
    ano,
    mes,
  }
}

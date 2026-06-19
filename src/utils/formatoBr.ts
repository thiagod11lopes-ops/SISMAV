/** Formato de moeda: R$1.000,00 (sem espaço após R$). */
export function formatarMoeda(valor: number): string {
  if (!Number.isFinite(valor)) return 'R$0,00'
  const negativo = valor < 0
  const valorAbs = Math.abs(valor)
  const [inteiro, centavos] = valorAbs.toFixed(2).split('.')
  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const formatado = `R$${inteiroFormatado},${centavos}`
  return negativo ? `-${formatado}` : formatado
}

export function parseValorMoeda(valor: string | number): number {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
  const limpo = valor
    .replace(/R\$\s*/gi, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()
  const numero = Number(limpo)
  return Number.isNaN(numero) ? 0 : numero
}

/** Máscara enquanto o usuário digita (centavos à direita). */
export function mascaraMoeda(valor: string): string {
  const digitos = valor.replace(/\D/g, '')
  if (!digitos) return ''
  return formatarMoeda(Number(digitos) / 100)
}

export function formatarMoedaTexto(valor: string): string {
  if (!valor.trim()) return ''
  return formatarMoeda(parseValorMoeda(valor))
}

export function formatarMoedaArmazenamento(valor: string): string {
  if (!valor.trim()) return ''
  return formatarMoeda(parseValorMoeda(valor))
}

export function valorMoedaParaEdicao(valor: string): string {
  if (!valor.trim()) return ''
  return formatarMoeda(parseValorMoeda(valor))
}

/** Data no formato dd/mm/aaaa. */
export function formatarData(data: Date = new Date()): string {
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  return `${dia}/${mes}/${ano}`
}

export function mascaraData(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 8)
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`
}

export function normalizarDataBr(valor: string): string {
  const trimmed = valor.trim()
  if (!trimmed || trimmed === 'Indeterminado') return trimmed
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (!match) return trimmed
  return `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}/${match[3]}`
}

export function formatarDataExibir(valor: string): string {
  if (!valor.trim()) return ''
  return normalizarDataBr(valor)
}

/** Retorna dd/mm/aaaa subtraindo anos da data informada (inválida → usa hoje). */
export function subtrairAnosDataBr(dataBr: string, anos: number): string {
  const base = parseDataBr(dataBr) ?? new Date()
  const resultado = new Date(base)
  resultado.setFullYear(resultado.getFullYear() - anos)
  return formatarData(resultado)
}

export function parseDataBr(data: string): Date | null {
  const trimmed = data.trim()
  if (!trimmed || trimmed === 'Indeterminado') return null

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (iso) {
    const [, ano, mes, dia] = iso
    const date = new Date(Number(ano), Number(mes) - 1, Number(dia))
    if (
      date.getFullYear() !== Number(ano) ||
      date.getMonth() !== Number(mes) - 1 ||
      date.getDate() !== Number(dia)
    ) {
      return null
    }
    return date
  }

  const normalizada = normalizarDataBr(trimmed)
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalizada)
  if (!match) return null
  const [, dia, mes, ano] = match
  const date = new Date(Number(ano), Number(mes) - 1, Number(dia))
  if (
    date.getFullYear() !== Number(ano) ||
    date.getMonth() !== Number(mes) - 1 ||
    date.getDate() !== Number(dia)
  ) {
    return null
  }
  return date
}

function inicioDoDia(data: Date): Date {
  const copia = new Date(data)
  copia.setHours(0, 0, 0, 0)
  return copia
}

function fimDoDia(data: Date): Date {
  const copia = new Date(data)
  copia.setHours(23, 59, 59, 999)
  return copia
}

/** Verifica se uma data (dd/mm/aaaa ou yyyy-mm-dd) está no intervalo informado. */
export function dataBrNoPeriodo(
  dataBr: string,
  dataInicio: string,
  dataFim: string,
): boolean {
  const data = parseDataBr(dataBr)
  if (!data) return false

  const inicio = dataInicio.trim() ? parseDataBr(dataInicio) : null
  const fim = dataFim.trim() ? parseDataBr(dataFim) : null
  const dataComparacao = inicioDoDia(data)

  if (inicio && dataComparacao < inicioDoDia(inicio)) return false
  if (fim && dataComparacao > fimDoDia(fim)) return false
  return true
}

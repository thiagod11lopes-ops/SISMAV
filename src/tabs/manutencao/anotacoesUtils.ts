const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const

const DIAS_SEMANA_LONGOS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const

export function dataParaChave(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function chaveParaDate(dataChave: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataChave)
  if (!match) return null
  const [, ano, mes, dia] = match
  const date = new Date(Number(ano), Number(mes) - 1, Number(dia))
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function formatarDataCurta(dataChave: string): string {
  const date = chaveParaDate(dataChave)
  if (!date) return dataChave
  const dia = String(date.getDate()).padStart(2, '0')
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}/${date.getFullYear()}`
}

export function formatarDataLonga(dataChave: string): string {
  const date = chaveParaDate(dataChave)
  if (!date) return dataChave
  const diaSemana = DIAS_SEMANA_LONGOS[date.getDay()]
  const dia = date.getDate()
  const mes = MESES[date.getMonth()]
  return `${diaSemana}, ${dia} de ${mes} de ${date.getFullYear()}`
}

export function ehHoje(dataChave: string): boolean {
  return dataChave === dataParaChave(new Date())
}

export function obterRotuloMes(ano: number, mes: number): string {
  return `${MESES[mes]} ${ano}`
}

export interface CelulaCalendario {
  chave: string
  dia: number
  mesAtual: boolean
}

export function montarGradeCalendario(ano: number, mes: number): CelulaCalendario[] {
  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  const inicioSemana = primeiroDia.getDay()
  const diasNoMes = ultimoDia.getDate()
  const celulas: CelulaCalendario[] = []

  const diasMesAnterior = new Date(ano, mes, 0).getDate()
  for (let i = inicioSemana - 1; i >= 0; i -= 1) {
    const dia = diasMesAnterior - i
    const data = new Date(ano, mes - 1, dia)
    celulas.push({
      chave: dataParaChave(data),
      dia,
      mesAtual: false,
    })
  }

  for (let dia = 1; dia <= diasNoMes; dia += 1) {
    const data = new Date(ano, mes, dia)
    celulas.push({
      chave: dataParaChave(data),
      dia,
      mesAtual: true,
    })
  }

  let diaProximo = 1
  while (celulas.length % 7 !== 0) {
    const data = new Date(ano, mes + 1, diaProximo)
    celulas.push({
      chave: dataParaChave(data),
      dia: diaProximo,
      mesAtual: false,
    })
    diaProximo += 1
  }

  return celulas
}

export { DIAS_SEMANA, MESES }

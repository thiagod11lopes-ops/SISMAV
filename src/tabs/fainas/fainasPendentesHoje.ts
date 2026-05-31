import {
  formatarData,
  formatarDataExibir,
  normalizarDataBr,
  parseDataBr,
} from '../../utils/formatoBr'
import { avisoFainasDispensadoHoje } from './avisoFainasDismissStorage'
import { carregarFainas } from './fainasStorage'
import type { FainaItem } from './types'

/** Data limite hoje ou já passada (não inclui datas futuras). */
export function dataLimiteEmAlerta(dataLimite: string | undefined): boolean {
  if (!dataLimite?.trim()) return false

  const data = parseDataBr(dataLimite)
  if (!data) return false

  const limite = new Date(data)
  limite.setHours(0, 0, 0, 0)

  const hojeFim = new Date()
  hojeFim.setHours(23, 59, 59, 999)

  return limite.getTime() <= hojeFim.getTime()
}

export function dataLimiteEhHoje(dataLimite: string | undefined): boolean {
  if (!dataLimite?.trim()) return false
  return normalizarDataBr(dataLimite) === formatarData()
}

export function rotuloDataLimiteAlerta(dataLimite: string): string {
  const exibicao = formatarDataExibir(dataLimite)
  if (dataLimiteEhHoje(dataLimite)) {
    return `limite hoje (${exibicao})`
  }
  return `vencida em ${exibicao}`
}

export function listarFainasPendentesParaAlarme(
  fainas = carregarFainas(),
): FainaItem[] {
  return fainas
    .filter(
      (faina) =>
        faina.status === 'pendente' && dataLimiteEmAlerta(faina.dataLimite),
    )
    .sort((a, b) => {
      const dataA = parseDataBr(a.dataLimite ?? '')?.getTime() ?? 0
      const dataB = parseDataBr(b.dataLimite ?? '')?.getTime() ?? 0
      return dataA - dataB
    })
}

/** Lista visível na aba Manutenção (respeita ocultação só no dia atual). */
export function listarFainasPendentesAlarmeVisivel(
  fainas = carregarFainas(),
): FainaItem[] {
  if (avisoFainasDispensadoHoje()) return []
  return listarFainasPendentesParaAlarme(fainas)
}

/** @deprecated Use listarFainasPendentesParaAlarme */
export function listarFainasPendentesComDataHoje(
  fainas = carregarFainas(),
): FainaItem[] {
  return listarFainasPendentesParaAlarme(fainas)
}

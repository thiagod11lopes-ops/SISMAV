import type { TipoViatura } from './CadastrarViaturaCard'

export interface ViaturaLinha {
  id: string
  tipo: TipoViatura
  placa: string
  modelo: string
  ano: string
  valorFipe: string
  km: string
  situacao: string
}

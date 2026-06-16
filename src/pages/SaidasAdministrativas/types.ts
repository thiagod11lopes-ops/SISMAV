export interface SaidaAdministrativa {
  id: string
  data: string // YYYY-MM-DD
  setor: 'SIAD'
  endereco: string
  numeroPassageiros: number
  criadoEm: number // epoch ms
}


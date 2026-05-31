export interface CreditoPagamento {
  id: string
  faturamento: string
  data: string
  valor: number
}

export interface CreditoCompra {
  id: string
  item: string
  valor: number
}

export interface ControleCreditosDados {
  pagamentos: CreditoPagamento[]
  compras: CreditoCompra[]
}

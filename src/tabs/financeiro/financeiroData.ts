import type { ContratoRegistro } from './contratoStorage'
import type { PagamentoRegistro } from './pagamentosStorage'
import type { SolempRegistro } from './solempStorage'

/** Importado de SISMAV_Backup_2026-05-29T14-32-29.json — 1 contrato(s), 4 solemp(s), 10 faturamento(s) pago(s) */
export const CONTRATOS: ContratoRegistro[] = [
  {
    "id": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04",
    "vigencia": "20/10/2025 — —",
    "valorTotal": "R$844.525,00"
  }
]

export const SOLEMPS: SolempRegistro[] = [
  {
    "id": "sol_1771114485861",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04",
    "numeroSolemp": "2026NE537",
    "dataSolemp": "12/02/2026",
    "valorSolemp": "R$100.000,00"
  },
  {
    "id": "sol_1774265671962",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04",
    "numeroSolemp": "NE861",
    "dataSolemp": "25/03/2025",
    "valorSolemp": "R$2.959,76"
  },
  {
    "id": "sol_1774265749652",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04",
    "numeroSolemp": "NE4957",
    "dataSolemp": "14/11/2025",
    "valorSolemp": "R$6.519,85"
  },
  {
    "id": "sol_1780064106604",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04",
    "numeroSolemp": "NE 1743",
    "dataSolemp": "04/05/2026",
    "valorSolemp": "R$100.000,00"
  }
]

export const PAGAMENTOS_FATURAMENTO: PagamentoRegistro[] = [
  {
    "id": "fat_1774265792220",
    "dataPagamento": "23/03/2026",
    "faturamento": "10",
    "faturamentoLabel": "10°/2026",
    "valor": 2762.21,
    "quantidadeServicos": 3,
    "solempId": "sol_1774265671962",
    "numeroSolemp": "NE861",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1774265926836",
    "dataPagamento": "23/03/2026",
    "faturamento": "10",
    "faturamentoLabel": "10°/2026",
    "valor": 6316.2,
    "quantidadeServicos": 2,
    "solempId": "sol_1774265749652",
    "numeroSolemp": "NE4957",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1774266055044",
    "dataPagamento": "23/03/2026",
    "faturamento": "10",
    "faturamentoLabel": "10°/2026",
    "valor": 24802.91,
    "quantidadeServicos": 3,
    "solempId": "sol_1771114485861",
    "numeroSolemp": "2026NE537",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1774266303085",
    "dataPagamento": "23/03/2026",
    "faturamento": "11",
    "faturamentoLabel": "11°/2026",
    "valor": 166.75,
    "quantidadeServicos": 2,
    "solempId": "sol_1774265671962",
    "numeroSolemp": "NE861",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1774266343461",
    "dataPagamento": "23/03/2026",
    "faturamento": "11",
    "faturamentoLabel": "11°/2026",
    "valor": 201.25,
    "quantidadeServicos": 1,
    "solempId": "sol_1774265749652",
    "numeroSolemp": "NE4957",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1774266452579",
    "dataPagamento": "23/03/2026",
    "faturamento": "11",
    "faturamentoLabel": "11°/2026",
    "valor": 20737.699999999997,
    "quantidadeServicos": 11,
    "solempId": "sol_1771114485861",
    "numeroSolemp": "2026NE537",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1776076997517",
    "dataPagamento": "13/04/2026",
    "faturamento": "12",
    "faturamentoLabel": "12°/2026",
    "valor": 29629.67,
    "quantidadeServicos": 6,
    "solempId": "sol_1771114485861",
    "numeroSolemp": "2026NE537",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1779708087260",
    "dataPagamento": "25/05/2026",
    "faturamento": "13",
    "faturamentoLabel": "13°/2026",
    "valor": 24269.68,
    "quantidadeServicos": 11,
    "solempId": "sol_1771114485861",
    "numeroSolemp": "2026NE537",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1780064124896",
    "dataPagamento": "29/05/2026",
    "faturamento": "14",
    "faturamentoLabel": "14°/2026",
    "valor": 17307.18,
    "quantidadeServicos": 5,
    "solempId": "sol_1780064106604",
    "numeroSolemp": "NE 1743",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  },
  {
    "id": "fat_1780064169711",
    "dataPagamento": "29/05/2026",
    "faturamento": "15",
    "faturamentoLabel": "15°/2026",
    "valor": 23418.02,
    "quantidadeServicos": 7,
    "solempId": "sol_1780064106604",
    "numeroSolemp": "NE 1743",
    "contratoId": "emp_1771113445813",
    "numeroContrato": "65720/2021-56/04"
  }
]

export interface Contrato {
  id: string;
  numero: string;
  data: string;
  valorTotal: string;
  valorGasto: string;
  saldo: string;
}

export interface Solemp {
  id: string;
  numero: string;
  contratoNumero: string;
  data: string;
  valorTotal: string;
  valorGasto: string;
  saldo: string;
}

export interface Faturamento {
  id: string;
  numero: string;
  data: string;
  valor: string;
  solempUtilizada: string;
}

export type SubTabId = 'controle' | 'faturamento' | 'resumo';

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  align?: 'left' | 'center' | 'right';
}

import { useMemo } from 'react'
import type { Column } from '../../components/DataTable'
import { DataTable } from '../../components/DataTable'
import { IconEditar, IconLixeira, IconValor } from '../../components/icons/ManutencaoIcons'
import type { TipoViatura } from './CadastrarViaturaCard'
import { formatarMoedaTexto } from '../../utils/formatoBr'
import type { ViaturaLinha } from './types'
import './ViaturasGrupoTable.css'

interface ViaturasGrupoTableProps {
  titulo: string
  tipo: TipoViatura
  viaturas: ViaturaLinha[]
  onEditar: (viatura: ViaturaLinha) => void
  onVerFinanceiro: (viatura: ViaturaLinha) => void
  onExcluir: (viatura: ViaturaLinha) => void
}

export function ViaturasGrupoTable({
  titulo,
  tipo,
  viaturas,
  onEditar,
  onVerFinanceiro,
  onExcluir,
}: ViaturasGrupoTableProps) {
  const lista = useMemo(
    () => viaturas.filter((v) => v.tipo === tipo),
    [viaturas, tipo],
  )

  const colunas: Column<ViaturaLinha>[] = useMemo(
    () => [
      { key: 'modelo', header: 'Modelo' },
      { key: 'ano', header: 'Ano' },
      { key: 'placa', header: 'Placa' },
      {
        key: 'valorFipe',
        header: 'Valor de Mercado',
        render: (r) => (r.valorFipe ? formatarMoedaTexto(r.valorFipe) : '—'),
      },
      {
        key: 'acoes',
        header: 'Ações',
        render: (r) => (
          <div className="viaturas-table__acoes">
            <button
              type="button"
              className="viaturas-table__acao-btn viaturas-table__acao-btn--valor"
              title="Informações financeiras"
              aria-label={`Informações financeiras da viatura ${r.placa}`}
              onClick={() => onVerFinanceiro(r)}
            >
              <IconValor width={16} height={16} />
            </button>
            <button
              type="button"
              className="viaturas-table__acao-btn"
              title="Editar"
              onClick={() => onEditar(r)}
            >
              <IconEditar width={16} height={16} />
            </button>
            <button
              type="button"
              className="viaturas-table__acao-btn viaturas-table__acao-btn--danger"
              title="Excluir"
              onClick={() => onExcluir(r)}
            >
              <IconLixeira width={16} height={16} />
            </button>
          </div>
        ),
      },
    ],
    [onEditar, onVerFinanceiro, onExcluir],
  )

  const vazio =
    tipo === 'ambulancia'
      ? 'Nenhuma ambulância cadastrada.'
      : 'Nenhuma viatura administrativa cadastrada.'

  return (
    <section className="viaturas-grupo">
      <h3 className="viaturas-grupo__title">
        {titulo}
        <span className="viaturas-grupo__count">({lista.length})</span>
      </h3>
      <div className="viaturas-grupo__table">
        <DataTable columns={colunas} data={lista} emptyMessage={vazio} />
      </div>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { DescricoesServicosModal } from './DescricoesServicosModal'
import { getServicosColumns } from './servicosColumns'
import type { ServicoRegistro, Singra2Status, StatusServico } from './servicoTypes'
import './ServicosTable.css'

type CampoCheckboxServico = 'faturar' | 'preAprovado' | 'aprovado'

interface ServicosTabelasProps {
  servicos: ServicoRegistro[]
  exibirColunasDetalhadas: boolean
  onEditar: (registro: ServicoRegistro) => void
  onExcluir: (registro: ServicoRegistro) => void
  onVer: (registro: ServicoRegistro) => void
  onSingra2Change: (id: string, valor: Singra2Status) => void
  onCheckboxChange: (
    id: string,
    campo: CampoCheckboxServico,
    valor: boolean,
  ) => void
  onStatusChange: (id: string, valor: StatusServico) => void
}

type GrupoVariant = 'ambulancia' | 'administrativo'

function ServicosGrupo({
  titulo,
  servicos,
  onEditar,
  onExcluir,
  onVer,
  onSingra2Change,
  onCheckboxChange,
  onStatusChange,
  onAbrirDescricoes,
  exibirColunasDetalhadas,
  variant,
}: {
  titulo: string
  servicos: ServicoRegistro[]
  exibirColunasDetalhadas: boolean
  onEditar: ServicosTabelasProps['onEditar']
  onExcluir: ServicosTabelasProps['onExcluir']
  onVer: ServicosTabelasProps['onVer']
  onSingra2Change: ServicosTabelasProps['onSingra2Change']
  onCheckboxChange: ServicosTabelasProps['onCheckboxChange']
  onStatusChange: ServicosTabelasProps['onStatusChange']
  onAbrirDescricoes: () => void
  variant: GrupoVariant
}) {
  const colunas = useMemo(
    () =>
      getServicosColumns(
        onEditar,
        onExcluir,
        onVer,
        onSingra2Change,
        onCheckboxChange,
        onStatusChange,
        onAbrirDescricoes,
        exibirColunasDetalhadas,
      ),
    [
      onEditar,
      onExcluir,
      onVer,
      onSingra2Change,
      onCheckboxChange,
      onStatusChange,
      onAbrirDescricoes,
      exibirColunasDetalhadas,
    ],
  )

  return (
    <section className={`servicos-grupo servicos-grupo--${variant}`}>
      <header className="servicos-grupo__header">
        <div className="servicos-grupo__heading">
          <span className="servicos-grupo__accent" aria-hidden />
          <h3 className="servicos-grupo__title">{titulo}</h3>
        </div>
        <span className="servicos-grupo__count">{servicos.length} registros</span>
      </header>

      <div className="servicos-table-card">
        <DataTable
          columns={colunas}
          data={servicos}
          emptyMessage="Nenhum serviço encontrado para os filtros aplicados."
          wrapperClassName="servicos-table__scroll"
          tableClassName="servicos-table"
          emptyClassName="servicos-table__empty"
        />
      </div>
    </section>
  )
}

export function ServicosTabelas({
  servicos,
  exibirColunasDetalhadas,
  onEditar,
  onExcluir,
  onVer,
  onSingra2Change,
  onCheckboxChange,
  onStatusChange,
}: ServicosTabelasProps) {
  const [modalDescricoesAberto, setModalDescricoesAberto] = useState(false)

  const abrirDescricoes = () => setModalDescricoesAberto(true)

  const ambulancias = useMemo(
    () => servicos.filter((s) => s.categoria === 'ambulancia'),
    [servicos],
  )
  const administrativas = useMemo(
    () => servicos.filter((s) => s.categoria === 'administrativo'),
    [servicos],
  )

  return (
    <>
      <div className="servicos-tabelas">
        <ServicosGrupo
          titulo="Serviços em ambulâncias"
          servicos={ambulancias}
          onEditar={onEditar}
          onExcluir={onExcluir}
          onVer={onVer}
          onSingra2Change={onSingra2Change}
          onCheckboxChange={onCheckboxChange}
          onStatusChange={onStatusChange}
          onAbrirDescricoes={abrirDescricoes}
          exibirColunasDetalhadas={exibirColunasDetalhadas}
          variant="ambulancia"
        />
        <ServicosGrupo
          titulo="Serviços em administrativas"
          servicos={administrativas}
          onEditar={onEditar}
          onExcluir={onExcluir}
          onVer={onVer}
          onSingra2Change={onSingra2Change}
          onCheckboxChange={onCheckboxChange}
          onStatusChange={onStatusChange}
          onAbrirDescricoes={abrirDescricoes}
          exibirColunasDetalhadas={exibirColunasDetalhadas}
          variant="administrativo"
        />
      </div>

      <DescricoesServicosModal
        aberto={modalDescricoesAberto}
        servicos={servicos}
        onFechar={() => setModalDescricoesAberto(false)}
      />
    </>
  )
}

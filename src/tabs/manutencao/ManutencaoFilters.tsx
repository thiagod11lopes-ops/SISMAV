import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Button } from '../../components/Button'
import { IconGerarPdf, IconVisualizar } from '../../components/icons/ManutencaoIcons'
import type { FaturamentoOption } from './faturamentoOptions'
import { DataInput } from '../../components/inputs/DataInput'
import type { ViaturaLinha } from '../viaturas/types'
import type { ManutencaoFiltros } from './types'
import './ManutencaoFilters.css'

const MESES = [
  { value: 'todos', label: 'Todos' },
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

interface ManutencaoFiltersProps {
  opcoesFaturamento: FaturamentoOption[]
  viaturasCadastradas: ViaturaLinha[]
  filtros: ManutencaoFiltros
  busca: string
  onBuscaChange: (valor: string) => void
  onBuscar: () => void
  onChange: (filtros: ManutencaoFiltros) => void
  onAplicar: () => void
  onLimpar: () => void
  exibirColunasDetalhadas: boolean
  onAlternarColunasDetalhadas: () => void
  onGerarPdfFaturamento: () => void
  totalFiltrado: number
  totalGeral: number
}

function atualizar(
  filtros: ManutencaoFiltros,
  campo: keyof ManutencaoFiltros,
  valor: string,
): ManutencaoFiltros {
  return { ...filtros, [campo]: valor }
}

export function ManutencaoFilters({
  opcoesFaturamento,
  viaturasCadastradas,
  filtros,
  busca,
  onBuscaChange,
  onBuscar,
  onChange,
  onAplicar,
  onLimpar,
  exibirColunasDetalhadas,
  onAlternarColunasDetalhadas,
  onGerarPdfFaturamento,
  totalFiltrado,
  totalGeral,
}: ManutencaoFiltersProps) {
  const [expandido, setExpandido] = useState(false)

  const set = (campo: keyof ManutencaoFiltros, valor: string) =>
    onChange(atualizar(filtros, campo, valor))

  const handleTipoChange = (valor: string) => {
    onChange({
      ...filtros,
      tipo: valor,
      viatura: 'todos',
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onBuscar()
  }

  const viaturasVisiveis = useMemo(() => {
    let lista = viaturasCadastradas
    if (filtros.tipo !== 'todos') {
      lista = lista.filter((viatura) => viatura.tipo === filtros.tipo)
    }
    return [...lista].sort((a, b) => a.placa.localeCompare(b.placa, 'pt-BR'))
  }, [viaturasCadastradas, filtros.tipo])

  const viaturaSelecionadaValida =
    filtros.viatura === 'todos' ||
    viaturasVisiveis.some((viatura) => viatura.placa === filtros.viatura)

  const valorViaturaSelect = viaturaSelecionadaValida ? filtros.viatura : 'todos'

  useEffect(() => {
    if (filtros.viatura === 'todos') return
    if (!viaturasVisiveis.some((viatura) => viatura.placa === filtros.viatura)) {
      onChange({ ...filtros, viatura: 'todos' })
    }
  }, [filtros.tipo, viaturasVisiveis])

  return (
    <div
      className={`manutencao-filtros${expandido ? ' manutencao-filtros--expandido' : ''}`}
    >
      <div className="manutencao-filtros__header">
        <button
          type="button"
          className="manutencao-filtros__expand"
          onClick={() => setExpandido((prev) => !prev)}
          aria-expanded={expandido}
          aria-controls="manutencao-filtros-corpo"
        >
          <span className="manutencao-filtros__expand-icon" aria-hidden>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
          <span className="manutencao-filtros__title">Filtros</span>
        </button>
        <span className="manutencao-filtros__count">
          {totalFiltrado} de {totalGeral} registro(s)
        </span>
      </div>

      <div
        id="manutencao-filtros-corpo"
        className="manutencao-filtros__corpo"
        hidden={!expandido}
      >
      <div className="manutencao-filtros__grid">
        <div className="manutencao-filtros__linha">
        <label className="filtro-field">
          <span className="filtro-field__label">Ano</span>
          <select
            value={filtros.ano}
            onChange={(e) => set('ano', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </label>

        <label className="filtro-field">
          <span className="filtro-field__label">Mês</span>
          <select
            value={filtros.mes}
            onChange={(e) => set('mes', e.target.value)}
          >
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filtro-field">
          <span className="filtro-field__label">Tipo faturamento</span>
          <select
            value={filtros.tipoFaturamento}
            onChange={(e) => set('tipoFaturamento', e.target.value)}
          >
            {opcoesFaturamento.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filtro-field">
          <span className="filtro-field__label">Data fim</span>
          <DataInput
            value={filtros.dataFim}
            onValueChange={(valor) => set('dataFim', valor)}
          />
        </label>

        <label className="filtro-field">
          <span className="filtro-field__label">Data início</span>
          <DataInput
            value={filtros.dataInicio}
            onValueChange={(valor) => set('dataInicio', valor)}
          />
        </label>
        </div>

        <div className="manutencao-filtros__linha">
        <label className="filtro-field">
          <span className="filtro-field__label">Tipo</span>
          <select
            value={filtros.tipo}
            onChange={(e) => handleTipoChange(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ambulancia">Ambulância</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </label>

        <label className="filtro-field">
          <span className="filtro-field__label">Viaturas</span>
          <select
            value={valorViaturaSelect}
            onChange={(e) => set('viatura', e.target.value)}
            disabled={filtros.tipo !== 'todos' && viaturasVisiveis.length === 0}
          >
            <option value="todos">Todas</option>
            {viaturasVisiveis.length === 0 ? (
              <option value="" disabled>
                {filtros.tipo === 'todos'
                  ? 'Nenhuma viatura cadastrada'
                  : 'Nenhuma viatura deste tipo'}
              </option>
            ) : (
              viaturasVisiveis.map((viatura) => (
                <option key={viatura.id} value={viatura.placa}>
                  {viatura.placa} — {viatura.modelo}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="filtro-field">
          <span className="filtro-field__label">Aprovação</span>
          <select
            value={filtros.aprovacao}
            onChange={(e) => set('aprovacao', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="aprovado">Aprovado</option>
            <option value="nao-aprovado">Não aprovado</option>
            <option value="pre-aprovado">Pré-aprovado</option>
          </select>
        </label>

        <label className="filtro-field">
          <span className="filtro-field__label">SINGRA 2</span>
          <select
            value={filtros.singra2}
            onChange={(e) => set('singra2', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="lancado">Lançado</option>
            <option value="pendante">Pendente</option>
          </select>
        </label>

        <label className="filtro-field">
          <span className="filtro-field__label">Status</span>
          <select
            value={filtros.status}
            onChange={(e) => set('status', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="faturado">Faturado</option>
            <option value="pendente">Pendente</option>
          </select>
        </label>
        </div>
      </div>

      <div className="manutencao-filtros__actions">
        <Button onClick={onAplicar}>Aplicar filtro</Button>
        <Button variant="secondary" onClick={onLimpar}>
          Limpar filtro
        </Button>
        <div className="manutencao-filtros__search-row">
          <input
            className="manutencao-filtros__search-input"
            type="search"
            placeholder="OS, viatura, descrição..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Busca"
          />
          <Button onClick={onBuscar}>Buscar</Button>
          <button
            type="button"
            className="manutencao-filtros__toggle-colunas manutencao-filtros__gerar-pdf"
            onClick={onGerarPdfFaturamento}
            title="Gerar PDF detalhado do faturamento"
            aria-label="Gerar PDF detalhado do faturamento"
          >
            <IconGerarPdf width={18} height={18} />
          </button>
          <button
            type="button"
            className={`manutencao-filtros__toggle-colunas${exibirColunasDetalhadas ? ' manutencao-filtros__toggle-colunas--ativo' : ''}`}
            onClick={onAlternarColunasDetalhadas}
            aria-pressed={exibirColunasDetalhadas}
            title={
              exibirColunasDetalhadas
                ? 'Ocultar Modelo, NF de peça, NF de serviço e SINGRA 2'
                : 'Exibir Modelo, NF de peça, NF de serviço e SINGRA 2'
            }
            aria-label={
              exibirColunasDetalhadas
                ? 'Ocultar colunas Modelo, NF de peça, NF de serviço e SINGRA 2'
                : 'Exibir colunas Modelo, NF de peça, NF de serviço e SINGRA 2'
            }
          >
            <IconVisualizar width={18} height={18} />
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

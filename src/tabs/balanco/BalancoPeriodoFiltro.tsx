import { DataInput } from '../../components/inputs/DataInput'
import { formatarData } from '../../utils/formatoBr'

interface BalancoPeriodoFiltroProps {
  dataInicio: string
  dataFim: string
  onDataInicioChange: (valor: string) => void
  onDataFimChange: (valor: string) => void
}

function IconCalendario() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

export function BalancoPeriodoFiltro({
  dataInicio,
  dataFim,
  onDataInicioChange,
  onDataFimChange,
}: BalancoPeriodoFiltroProps) {
  const dataFimEhHoje = dataFim === formatarData()

  return (
    <section
      className="balanco-periodo"
      aria-labelledby="balanco-periodo-title"
    >
      <div className="balanco-periodo__head">
        <h3 id="balanco-periodo-title" className="balanco-periodo__title">
          Período do balanço
        </h3>
        <p className="balanco-periodo__desc">
          Filtra serviços (data de saída), pagamentos e anotações no intervalo
          selecionado.
        </p>
      </div>

      <div className="balanco-periodo__grid">
        <label className="balanco-periodo__field">
          <span className="balanco-periodo__label">Data início</span>
          <div className="balanco-periodo__date-control">
            <span className="balanco-periodo__date-icon">
              <IconCalendario />
            </span>
            <DataInput
              className="modern-input balanco-periodo__date-input"
              value={dataInicio}
              onValueChange={onDataInicioChange}
              aria-label="Data início do balanço"
            />
          </div>
        </label>

        <span className="balanco-periodo__sep" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>

        <label className="balanco-periodo__field">
          <span className="balanco-periodo__label">
            Data fim
            {dataFimEhHoje ? (
              <span className="balanco-periodo__badge-hoje">Hoje</span>
            ) : null}
          </span>
          <div className="balanco-periodo__date-control balanco-periodo__date-control--fim">
            <span className="balanco-periodo__date-icon">
              <IconCalendario />
            </span>
            <DataInput
              className="modern-input balanco-periodo__date-input"
              value={dataFim}
              onValueChange={onDataFimChange}
              aria-label="Data fim do balanço"
            />
          </div>
        </label>
      </div>
    </section>
  )
}

import {
  createContext,
  useContext,
  useId,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { ResponsiveContainer } from 'recharts'
import './chart.css'

export type ChartConfig = Record<
  string,
  {
    label?: string
    color?: string
  }
>

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextValue | null>(null)

export function useChartConfig() {
  const ctx = useContext(ChartContext)
  if (!ctx) {
    throw new Error('useChartConfig deve ser usado dentro de ChartContainer')
  }
  return ctx.config
}

interface ChartContainerProps {
  config: ChartConfig
  children: ReactNode
  className?: string
  compact?: boolean
}

export function ChartContainer({
  config,
  children,
  className = '',
  compact = false,
}: ChartContainerProps) {
  const id = useId().replace(/:/g, '')
  const style = useMemo(() => {
    const vars: Record<string, string> = {}
    Object.entries(config).forEach(([key, item]) => {
      if (item.color) vars[`--color-${key}`] = item.color
    })
    return vars as CSSProperties
  }, [config])

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={id}
        className={`chart-container${compact ? ' chart-container--compact' : ''} ${className}`.trim()}
        style={style}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    dataKey?: string
    color?: string
    payload?: Record<string, unknown>
  }>
  label?: string
  labelFormatter?: (label: string) => string
  valueFormatter?: (value: number, key: string) => string
  hideLabel?: boolean
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  hideLabel = false,
}: ChartTooltipContentProps) {
  const config = useChartConfig()

  if (!active || !payload?.length) return null

  const titulo = label && labelFormatter ? labelFormatter(String(label)) : label

  return (
    <div className="chart-tooltip">
      {!hideLabel && titulo ? (
        <p className="chart-tooltip__label">{titulo}</p>
      ) : null}
      <div className="chart-tooltip__items">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? '')
          const cfg = config[key]
          const nome = cfg?.label ?? item.name ?? key
          const valor = Number(item.value ?? 0)
          const textoValor = valueFormatter
            ? valueFormatter(valor, key)
            : String(valor)

          return (
            <div key={key} className="chart-tooltip__item">
              <span className="chart-tooltip__item-label">
                <span
                  className="chart-tooltip__dot"
                  style={{ background: item.color ?? cfg?.color ?? 'var(--chart-1)' }}
                />
                {nome}
              </span>
              <span className="chart-tooltip__item-value">{textoValor}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ChartLegendContentProps {
  payload?: Array<{ value?: string; color?: string; dataKey?: string }>
}

export function ChartLegendContent({ payload }: ChartLegendContentProps) {
  const config = useChartConfig()
  if (!payload?.length) return null

  return (
    <div className="chart-legend">
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.value ?? '')
        const cfg = config[key]
        const nome = cfg?.label ?? item.value ?? key
        return (
          <span key={key} className="chart-legend__item">
            <span
              className="chart-legend__dot"
              style={{ background: item.color ?? cfg?.color ?? 'var(--chart-1)' }}
            />
            {nome}
          </span>
        )
      })}
    </div>
  )
}

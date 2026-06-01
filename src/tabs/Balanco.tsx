import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
  type ChartConfig,
} from '../components/charts/Chart'
import { EVENTO_CONTRATOS_ATUALIZADOS } from './financeiro/contratoStorage'
import { EVENTO_PAGAMENTOS_ATUALIZADOS } from './financeiro/pagamentosStorage'
import { EVENTO_SOLEMPS_ATUALIZADOS } from './financeiro/solempStorage'
import { EVENTO_SERVICOS_ATUALIZADOS } from './manutencao/servicosStorage'
import { EVENTO_VIATURAS_ATUALIZADOS } from './viaturas/viaturasStorage'
import { BalancoPeriodoFiltro } from './balanco/BalancoPeriodoFiltro'
import {
  calcularBalancoSistema,
  formatarMoedaBalanco,
  periodoPadraoBalanco,
} from './balanco/balancoData'
import {
  carregarBalancoPeriodoSalvo,
  salvarBalancoPeriodo,
} from './balanco/balancoPeriodoStorage'
import '../styles/modern-ui.css'
import './Balanco.css'

const EVENTOS_ATUALIZACAO = [
  EVENTO_SERVICOS_ATUALIZADOS,
  EVENTO_VIATURAS_ATUALIZADOS,
  EVENTO_CONTRATOS_ATUALIZADOS,
  EVENTO_SOLEMPS_ATUALIZADOS,
  EVENTO_PAGAMENTOS_ATUALIZADOS,
]

const CHART_GASTOS_MES: ChartConfig = {
  valor: { label: 'Gasto', color: 'var(--chart-1)' },
  quantidade: { label: 'Serviços', color: 'var(--chart-2)' },
}

const CHART_PAGAMENTOS: ChartConfig = {
  valor: { label: 'Pago', color: 'var(--chart-2)' },
}

const CHART_CATEGORIA: ChartConfig = {
  ambulancia: { label: 'Ambulância', color: 'var(--chart-1)' },
  administrativo: { label: 'Administrativo', color: 'var(--chart-3)' },
  Ambulância: { label: 'Ambulância', color: 'var(--chart-1)' },
  Administrativo: { label: 'Administrativo', color: 'var(--chart-3)' },
}

const CHART_STATUS: ChartConfig = {
  Faturado: { label: 'Faturado', color: 'var(--chart-2)' },
  Pendente: { label: 'Pendente', color: 'var(--chart-3)' },
}

const CHART_APROVACAO: ChartConfig = {
  Aprovado: { label: 'Aprovado', color: 'var(--chart-2)' },
  'Pré-aprovado': { label: 'Pré-aprovado', color: 'var(--chart-4)' },
  'Não aprovado': { label: 'Não aprovado', color: 'var(--chart-5)' },
}

const CHART_MODULOS: ChartConfig = {
  quantidade: { label: 'Registros', color: 'var(--chart-1)' },
}

const CHART_VIATURAS: ChartConfig = {
  value: { label: 'Gasto', color: 'var(--chart-4)' },
}

const CHART_CONTRATOS: ChartConfig = {
  utilizado: { label: 'Utilizado', color: 'var(--chart-3)' },
  restante: { label: 'Saldo', color: 'var(--chart-2)' },
}

const CORES_PIZZA = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

function corPizza(indice: number): string {
  return CORES_PIZZA[indice % CORES_PIZZA.length]
}

interface BalancoChartCardProps {
  title: string
  subtitle?: string
  wide?: boolean
  empty?: boolean
  emptyMessage?: string
  children: React.ReactNode
}

function BalancoChartCard({
  title,
  subtitle,
  wide = false,
  empty = false,
  emptyMessage = 'Sem dados para exibir.',
  children,
}: BalancoChartCardProps) {
  return (
    <article
      className={`balanco-chart-card${wide ? ' balanco-chart-card--wide' : ''}`}
    >
      <header className="balanco-chart-card__header">
        <h3 className="balanco-chart-card__title">{title}</h3>
        {subtitle ? (
          <p className="balanco-chart-card__subtitle">{subtitle}</p>
        ) : null}
      </header>
      {empty ? <p className="balanco-chart-card__empty">{emptyMessage}</p> : children}
    </article>
  )
}

export function Balanco() {
  const [versao, setVersao] = useState(0)
  const periodoInicial = useMemo(
    () => carregarBalancoPeriodoSalvo() ?? periodoPadraoBalanco(),
    [],
  )
  const [dataInicio, setDataInicio] = useState(periodoInicial.dataInicio)
  const [dataFim, setDataFim] = useState(periodoInicial.dataFim)

  useEffect(() => {
    if (dataInicio.trim() && dataFim.trim()) {
      salvarBalancoPeriodo({ dataInicio, dataFim })
    }
  }, [dataInicio, dataFim])

  useEffect(() => {
    const atualizar = () => setVersao((v) => v + 1)
    for (const evento of EVENTOS_ATUALIZACAO) {
      window.addEventListener(evento, atualizar)
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('sismav.')) atualizar()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      for (const evento of EVENTOS_ATUALIZACAO) {
        window.removeEventListener(evento, atualizar)
      }
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const dados = useMemo(() => {
    void versao
    return calcularBalancoSistema(dataInicio, dataFim)
  }, [versao, dataInicio, dataFim])

  const { kpis, gastosViaturas } = dados
  const tooltipMoeda = (valor: number) => formatarMoedaBalanco(valor)

  const dadosCategoriaPie = dados.servicosPorCategoria.map((item, i) => ({
    ...item,
    fill: corPizza(i),
  }))

  const dadosStatusPie = dados.servicosPorStatus.map((item, i) => ({
    ...item,
    fill: corPizza(i),
  }))

  const dadosAprovacaoPie = dados.servicosPorAprovacao.map((item, i) => ({
    ...item,
    fill: corPizza(i),
  }))

  return (
    <div className="balanco-page">
      <header className="balanco-page__header">
        <h2 className="balanco-page__title">Balanço do sistema</h2>
        <p className="balanco-page__description">
          Consolidação em tempo real dos dados do SISMAV. Ajuste o período abaixo
          para filtrar serviços, pagamentos e anotações (padrão: últimos 12 meses).
          Serviços do faturamento <strong>Não aprovados</strong> não entram nos totais
          — use o filtro Tipo faturamento na aba Manutenção apenas para consulta.
        </p>
      </header>

      <BalancoPeriodoFiltro
        dataInicio={dataInicio}
        dataFim={dataFim}
        onDataInicioChange={setDataInicio}
        onDataFimChange={setDataFim}
      />

      <section className="balanco-kpis" aria-label="Indicadores principais">
        <article className="balanco-kpi balanco-kpi--primary">
          <span className="balanco-kpi__label">Gasto em serviços</span>
          <strong className="balanco-kpi__value">
            {formatarMoedaBalanco(kpis.valorServicos)}
          </strong>
          <span className="balanco-kpi__meta">
            {kpis.totalServicos} serviços no período
          </span>
        </article>
        <article className="balanco-kpi">
          <span className="balanco-kpi__label">Patrimônio (viaturas)</span>
          <strong className="balanco-kpi__value">
            {formatarMoedaBalanco(kpis.patrimonioViaturas)}
          </strong>
          <span className="balanco-kpi__meta">{kpis.totalViaturas} viaturas</span>
        </article>
        <article className="balanco-kpi balanco-kpi--success">
          <span className="balanco-kpi__label">Pagamentos realizados</span>
          <strong className="balanco-kpi__value">
            {formatarMoedaBalanco(kpis.valorPagamentos)}
          </strong>
          <span className="balanco-kpi__meta">
            {kpis.totalPagamentos} pagamentos no período
          </span>
        </article>
        <article className="balanco-kpi">
          <span className="balanco-kpi__label">Saldo em contratos</span>
          <strong className="balanco-kpi__value">
            {formatarMoedaBalanco(kpis.saldoContratos)}
          </strong>
          <span className="balanco-kpi__meta">
            {formatarMoedaBalanco(kpis.valorContratos)} em {kpis.totalContratos}{' '}
            contratos · {kpis.totalSolemps} solemps
          </span>
        </article>
      </section>

      <section
        className="balanco-gastos-viaturas"
        aria-labelledby="balanco-gastos-viaturas-title"
      >
        <h3 id="balanco-gastos-viaturas-title" className="balanco-gastos-viaturas__title">
          Gastos com viaturas
        </h3>
        <p className="balanco-gastos-viaturas__desc">
          Soma dos serviços no período por tipo de viatura (placa cadastrada ou categoria do
          serviço). Exclui o faturamento <strong>Não aprovados</strong>.
        </p>
        <div className="balanco-gastos-viaturas__grid">
          <article className="balanco-gastos-viaturas__card">
            <span className="balanco-gastos-viaturas__label">Ambulâncias</span>
            <strong className="balanco-gastos-viaturas__value">
              {formatarMoedaBalanco(gastosViaturas.ambulancia)}
            </strong>
            <span className="balanco-gastos-viaturas__meta">
              {gastosViaturas.servicosAmbulancia} serviço
              {gastosViaturas.servicosAmbulancia === 1 ? '' : 's'}
            </span>
          </article>
          <article className="balanco-gastos-viaturas__card">
            <span className="balanco-gastos-viaturas__label">Administrativas</span>
            <strong className="balanco-gastos-viaturas__value">
              {formatarMoedaBalanco(gastosViaturas.administrativo)}
            </strong>
            <span className="balanco-gastos-viaturas__meta">
              {gastosViaturas.servicosAdministrativo} serviço
              {gastosViaturas.servicosAdministrativo === 1 ? '' : 's'}
            </span>
          </article>
          <article className="balanco-gastos-viaturas__card balanco-gastos-viaturas__card--total">
            <span className="balanco-gastos-viaturas__label">Valor total gasto</span>
            <strong className="balanco-gastos-viaturas__value">
              {formatarMoedaBalanco(gastosViaturas.total)}
            </strong>
            <span className="balanco-gastos-viaturas__meta">
              {gastosViaturas.servicosAmbulancia + gastosViaturas.servicosAdministrativo}{' '}
              serviços no total
            </span>
          </article>
        </div>
      </section>

      <section className="balanco-charts">
        <BalancoChartCard
          title="Gastos em serviços por mês"
          subtitle="Serviços no período (data de saída)"
          wide
          empty={dados.servicosPorMes.length === 0}
        >
          <ChartContainer
            config={CHART_GASTOS_MES}
            className="chart-container--low"
          >
            <LineChart data={dados.servicosPorMes} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                }
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(v, key) =>
                      key === 'quantidade' ? String(v) : tooltipMoeda(v)
                    }
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="var(--color-valor)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: 'var(--color-valor)' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </BalancoChartCard>

        <BalancoChartCard
          title="Pagamentos por mês"
          subtitle="Pagamentos registrados no período"
          empty={dados.pagamentosPorMes.length === 0}
        >
          <ChartContainer config={CHART_PAGAMENTOS}>
            <BarChart data={dados.pagamentosPorMes} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={48} />
              <Tooltip
                content={
                  <ChartTooltipContent valueFormatter={(v) => tooltipMoeda(v)} />
                }
              />
              <Bar
                dataKey="valor"
                fill="var(--color-valor)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ChartContainer>
        </BalancoChartCard>

        <BalancoChartCard
          title="Registros por módulo"
          subtitle="Quantidade de itens cadastrados em cada área"
        >
          <ChartContainer config={CHART_MODULOS}>
            <BarChart
              data={dados.registrosPorModulo}
              layout="vertical"
              margin={{ left: 8, right: 16, top: 8 }}
            >
              <CartesianGrid strokeDasharray="4 4" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="modulo"
                tickLine={false}
                axisLine={false}
                width={88}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(v) => `${v} registro${v === 1 ? '' : 's'}`}
                  />
                }
              />
              <Bar
                dataKey="quantidade"
                fill="var(--color-quantidade)"
                radius={[0, 6, 6, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        </BalancoChartCard>

        <BalancoChartCard
          title="Gastos por categoria"
          subtitle="Distribuição do valor em serviços"
          empty={dados.servicosPorCategoria.length === 0}
        >
          <ChartContainer config={CHART_CATEGORIA} compact>
            <PieChart>
              <Tooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(v) => tooltipMoeda(v)}
                  />
                }
              />
              <Pie
                data={dadosCategoriaPie}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
              >
                {dadosCategoriaPie.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.fill ?? corPizza(index)} />
                ))}
              </Pie>
              <Legend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </BalancoChartCard>

        <BalancoChartCard
          title="Status dos serviços"
          empty={dados.servicosPorStatus.length === 0}
        >
          <ChartContainer config={CHART_STATUS} compact>
            <PieChart>
              <Tooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(v) => `${v} serviço${v === 1 ? '' : 's'}`}
                  />
                }
              />
              <Pie
                data={dadosStatusPie}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={76}
                paddingAngle={2}
              >
                {dadosStatusPie.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.fill ?? corPizza(index)} />
                ))}
              </Pie>
              <Legend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </BalancoChartCard>

        <BalancoChartCard
          title="Aprovação de orçamentos"
          empty={dados.servicosPorAprovacao.length === 0}
        >
          <ChartContainer config={CHART_APROVACAO} compact>
            <PieChart>
              <Tooltip
                content={
                  <ChartTooltipContent
                    valueFormatter={(v) => `${v} serviço${v === 1 ? '' : 's'}`}
                  />
                }
              />
              <Pie
                data={dadosAprovacaoPie}
                dataKey="value"
                nameKey="name"
                outerRadius={78}
                paddingAngle={2}
              >
                {dadosAprovacaoPie.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.fill ?? corPizza(index)} />
                ))}
              </Pie>
              <Legend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </BalancoChartCard>

        <BalancoChartCard
          title="Maiores gastos por viatura"
          subtitle="Top 8 placas no período registrado"
          empty={dados.gastoPorViatura.length === 0}
        >
          <ChartContainer config={CHART_VIATURAS}>
            <BarChart
              data={dados.gastoPorViatura}
              layout="vertical"
              margin={{ left: 4, right: 16, top: 8 }}
            >
              <CartesianGrid strokeDasharray="4 4" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip
                content={
                  <ChartTooltipContent valueFormatter={(v) => tooltipMoeda(v)} />
                }
              />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={[0, 6, 6, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ChartContainer>
        </BalancoChartCard>

        <BalancoChartCard
          title="Execução financeira dos contratos"
          subtitle="Pagamentos do período por contrato"
          wide
          empty={dados.contratosFinanceiro.length === 0}
          emptyMessage="Nenhum contrato cadastrado."
        >
          <ChartContainer config={CHART_CONTRATOS}>
            <BarChart
              data={dados.contratosFinanceiro}
              margin={{ left: 4, right: 8, top: 8 }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={56} />
              <Tooltip
                content={
                  <ChartTooltipContent valueFormatter={(v) => tooltipMoeda(v)} />
                }
              />
              <Legend content={<ChartLegendContent />} />
              <Bar
                dataKey="utilizado"
                stackId="contrato"
                fill="var(--color-utilizado)"
                radius={[0, 0, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="restante"
                stackId="contrato"
                fill="var(--color-restante)"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        </BalancoChartCard>
      </section>
    </div>
  )
}

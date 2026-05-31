import type { Column } from '../../components/DataTable'
import {
  IconEditar,
  IconLixeira,
  IconVisualizar,
} from '../../components/icons/ManutencaoIcons'
import { formatarDataExibir } from '../../utils/formatoBr'
import { formatarLabelFaturamento } from './faturamentoOptions'
import { formatarValor } from './filterUtils'
import type { ServicoRegistro, Singra2Status, StatusServico } from './servicoTypes'
import './ServicosTable.css'

type CampoCheckboxServico = 'faturar' | 'preAprovado' | 'aprovado'

function ServicosCheckbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  ariaLabel: string
}) {
  const alternar = () => onChange(!checked)

  return (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={0}
      className="servicos-checkbox"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault()
        alternar()
      }}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          alternar()
        }
      }}
    >
      <input
        type="checkbox"
        className="servicos-checkbox__input"
        checked={checked}
        readOnly
        tabIndex={-1}
        aria-hidden
      />
      <span className="servicos-checkbox__box" aria-hidden />
    </span>
  )
}

function CelulaVazia() {
  return <span className="servicos-cell-muted">—</span>
}

const OPCOES_SINGRA2: { value: Singra2Status; label: string }[] = [
  { value: 'lancado', label: 'Lançado' },
  { value: 'pendante', label: 'Pendente' },
]

const OPCOES_STATUS: { value: StatusServico; label: string }[] = [
  { value: 'faturado', label: 'Faturado' },
  { value: 'pendente', label: 'Pendente' },
]

const COLUNAS_DETALHADAS = new Set([
  'modelo',
  'nfPeca',
  'nfServico',
  'singra2',
])

export function getServicosColumns(
  onEditar: (registro: ServicoRegistro) => void,
  onExcluir: (registro: ServicoRegistro) => void,
  onVer: (registro: ServicoRegistro) => void,
  onSingra2Change: (id: string, valor: Singra2Status) => void,
  onCheckboxChange: (
    id: string,
    campo: CampoCheckboxServico,
    valor: boolean,
  ) => void,
  onStatusChange: (id: string, valor: StatusServico) => void,
  onAbrirDescricoes: () => void,
  exibirColunasDetalhadas: boolean,
): Column<ServicoRegistro>[] {
  const colunas: Column<ServicoRegistro>[] = [
    {
      key: 'faturamento',
      header: 'Faturamento',
      render: (r) => (
        <span className="servicos-cell-faturamento">
          {formatarLabelFaturamento(r.faturamento)}
        </span>
      ),
    },
    {
      key: 'faturar',
      header: 'Faturar',
      render: (r) => (
        <ServicosCheckbox
          checked={r.faturar}
          onChange={(valor) => onCheckboxChange(r.id, 'faturar', valor)}
          ariaLabel={`Faturar OS ${r.os}`}
        />
      ),
    },
    {
      key: 'modelo',
      header: 'Modelo',
      render: (r) => <span className="servicos-cell-modelo">{r.modelo}</span>,
    },
    {
      key: 'viatura',
      header: 'Viatura',
      render: (r) => <span className="servicos-cell-placa">{r.viatura}</span>,
    },
    {
      key: 'os',
      header: 'O.S.',
      render: (r) => <span className="servicos-cell-os">{r.os}</span>,
    },
    {
      key: 'dataSaida',
      header: 'Data de saída',
      render: (r) => (
        <time className="servicos-cell-data" dateTime={r.dataSaida}>
          {formatarDataExibir(r.dataSaida)}
        </time>
      ),
    },
    {
      key: 'dataRetorno',
      header: 'Data de retorno',
      render: (r) =>
        r.dataRetorno ? (
          r.dataRetorno === 'Indeterminado' ? (
            <span className="servicos-pill servicos-pill--warn">Indeterminado</span>
          ) : (
            <time className="servicos-cell-data" dateTime={r.dataRetorno}>
              {formatarDataExibir(r.dataRetorno)}
            </time>
          )
        ) : (
          <CelulaVazia />
        ),
    },
    {
      key: 'nfPeca',
      header: 'NF de peça',
      render: (r) =>
        r.nfPeca ? (
          <span className="servicos-cell-nf">{r.nfPeca}</span>
        ) : (
          <CelulaVazia />
        ),
    },
    {
      key: 'nfServico',
      header: 'NF de serviço',
      render: (r) =>
        r.nfServico ? (
          <span className="servicos-cell-nf">{r.nfServico}</span>
        ) : (
          <CelulaVazia />
        ),
    },
    {
      key: 'singra2',
      header: 'SINGRA 2',
      render: (r) => (
        <select
          className={`servicos-singra-select servicos-singra-select--${r.singra2}`}
          value={r.singra2}
          onChange={(e) =>
            onSingra2Change(r.id, e.target.value as Singra2Status)
          }
          aria-label={`SINGRA 2 da OS ${r.os}`}
        >
          {OPCOES_SINGRA2.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'preAprovado',
      header: 'Pré aprovado',
      render: (r) => (
        <ServicosCheckbox
          checked={r.preAprovado}
          onChange={(valor) => onCheckboxChange(r.id, 'preAprovado', valor)}
          ariaLabel={`Pré aprovado OS ${r.os}`}
        />
      ),
    },
    {
      key: 'aprovado',
      header: 'Aprovado',
      render: (r) => (
        <ServicosCheckbox
          checked={r.aprovado}
          onChange={(valor) => onCheckboxChange(r.id, 'aprovado', valor)}
          ariaLabel={`Aprovado OS ${r.os}`}
        />
      ),
    },
    {
      key: 'valor',
      header: 'Valor',
      render: (r) => (
        <span className="servicos-cell-valor">{formatarValor(r.valor)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <select
          className={`servicos-status-select servicos-status-select--${r.status}`}
          value={r.status}
          onChange={(e) =>
            onStatusChange(r.id, e.target.value as StatusServico)
          }
          aria-label={`Status da OS ${r.os}`}
        >
          {OPCOES_STATUS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'descricao',
      header: (
        <button
          type="button"
          className="servicos-table__header-descricao"
          onClick={onAbrirDescricoes}
          title="Buscar descrições dos serviços"
        >
          Descrição
        </button>
      ),
      render: (r) => (
        <p className="servicos-cell-desc" title={r.descricao}>
          {r.descricao}
        </p>
      ),
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: (r) => (
        <div className="servicos-table__acoes">
          <button
            type="button"
            className="servicos-table__acao-btn"
            title="Editar"
            aria-label={`Editar OS ${r.os}`}
            onClick={() => onEditar(r)}
          >
            <IconEditar width={16} height={16} />
          </button>
          <button
            type="button"
            className="servicos-table__acao-btn servicos-table__acao-btn--excluir"
            title="Excluir"
            aria-label={`Excluir OS ${r.os}`}
            onClick={() => onExcluir(r)}
          >
            <IconLixeira width={16} height={16} />
          </button>
          <button
            type="button"
            className="servicos-table__acao-btn"
            title="Visualizar"
            aria-label={`Visualizar OS ${r.os}`}
            onClick={() => onVer(r)}
          >
            <IconVisualizar width={16} height={16} />
          </button>
        </div>
      ),
    },
  ]

  if (exibirColunasDetalhadas) return colunas

  return colunas.filter(
    (coluna) => !COLUNAS_DETALHADAS.has(String(coluna.key)),
  )
}

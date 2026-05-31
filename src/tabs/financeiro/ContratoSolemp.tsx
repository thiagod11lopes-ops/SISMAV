import { useEffect, useMemo, useState } from 'react'
import type { Column } from '../../components/DataTable'
import { DataTable } from '../../components/DataTable'
import { IconEditar } from '../../components/icons/ManutencaoIcons'
import { SectionCard } from '../../components/SectionCard'
import {
  AdicionarContratoCard,
  type NovoContrato,
} from './AdicionarContratoCard'
import './AdicionarContratoCard.css'
import {
  AdicionarSolempCard,
  type NovaSolemp,
} from './AdicionarSolempCard'
import './AdicionarSolempCard.css'
import {
  carregarContratos,
  salvarContratos,
  type ContratoRegistro,
} from './contratoStorage'
import { EditarContratoModal } from './EditarContratoModal'
import { EditarSolempModal } from './EditarSolempModal'
import './EditarFinanceiroModal.css'
import {
  atualizarReferenciasContrato,
  atualizarReferenciasSolemp,
} from './pagamentosStorage'
import {
  carregarSolemps,
  salvarSolemps,
  type SolempRegistro,
} from './solempStorage'
import {
  formatarDataExibir,
  formatarMoedaTexto,
  normalizarDataBr,
} from '../../utils/formatoBr'
import { formatarValorReais, parseVigenciaContrato } from './valorUtils'

export function ContratoSolemp() {
  const [contratos, setContratos] = useState<ContratoRegistro[]>(() =>
    carregarContratos(),
  )
  const [solemps, setSolemps] = useState<SolempRegistro[]>(() => carregarSolemps())
  const [contratoEmEdicao, setContratoEmEdicao] = useState<ContratoRegistro | null>(
    null,
  )
  const [solempEmEdicao, setSolempEmEdicao] = useState<SolempRegistro | null>(null)

  useEffect(() => {
    salvarContratos(contratos)
  }, [contratos])

  useEffect(() => {
    salvarSolemps(solemps)
  }, [solemps])

  const handleAdicionarContrato = (novo: NovoContrato) => {
    const registro: ContratoRegistro = {
      id: String(Date.now()),
      numeroContrato: novo.numeroContrato.trim(),
      vigencia: `${normalizarDataBr(novo.dataInicio)} — ${normalizarDataBr(novo.dataFim)}`,
      valorTotal: formatarValorReais(novo.valorTotal),
    }
    setContratos((prev) => [registro, ...prev])
  }

  const handleAdicionarSolemp = (nova: NovaSolemp) => {
    const contrato = contratos.find((item) => item.id === nova.contratoId)
    if (!contrato) return

    const registro: SolempRegistro = {
      id: String(Date.now()),
      contratoId: contrato.id,
      numeroContrato: contrato.numeroContrato,
      numeroSolemp: nova.numeroSolemp,
      dataSolemp: normalizarDataBr(nova.dataSolemp),
      valorSolemp: formatarValorReais(nova.valorSolemp),
    }
    setSolemps((prev) => [registro, ...prev])
  }

  const handleSalvarContrato = (id: string, dados: NovoContrato) => {
    const numeroContrato = dados.numeroContrato.trim()
    const vigencia = `${normalizarDataBr(dados.dataInicio)} — ${normalizarDataBr(dados.dataFim)}`
    const valorTotal = formatarValorReais(dados.valorTotal)

    setContratos((prev) =>
      prev.map((contrato) =>
        contrato.id === id
          ? { ...contrato, numeroContrato, vigencia, valorTotal }
          : contrato,
      ),
    )

    setSolemps((prev) =>
      prev.map((solemp) =>
        solemp.contratoId === id ? { ...solemp, numeroContrato } : solemp,
      ),
    )

    atualizarReferenciasContrato(id, numeroContrato)
    setContratoEmEdicao(null)
  }

  const handleSalvarSolemp = (id: string, dados: NovaSolemp) => {
    const contrato = contratos.find((item) => item.id === dados.contratoId)
    if (!contrato) return

    const numeroSolemp = dados.numeroSolemp.trim()
    const registroAtualizado: Pick<
      SolempRegistro,
      'contratoId' | 'numeroContrato' | 'numeroSolemp' | 'dataSolemp' | 'valorSolemp'
    > = {
      contratoId: contrato.id,
      numeroContrato: contrato.numeroContrato,
      numeroSolemp,
      dataSolemp: normalizarDataBr(dados.dataSolemp),
      valorSolemp: formatarValorReais(dados.valorSolemp),
    }

    setSolemps((prev) =>
      prev.map((solemp) =>
        solemp.id === id ? { ...solemp, ...registroAtualizado } : solemp,
      ),
    )

    atualizarReferenciasSolemp(id, {
      numeroSolemp,
      contratoId: contrato.id,
      numeroContrato: contrato.numeroContrato,
    })
    setSolempEmEdicao(null)
  }

  const colunasContratos: Column<ContratoRegistro>[] = useMemo(
    () => [
      { key: 'numeroContrato', header: 'Número do Contrato' },
      {
        key: 'vigencia',
        header: 'Vigência',
        render: (contrato) => {
          const { dataInicio, dataFim } = parseVigenciaContrato(contrato.vigencia)
          return `${formatarDataExibir(dataInicio)} — ${formatarDataExibir(dataFim)}`
        },
      },
      {
        key: 'valorTotal',
        header: 'Valor total',
        render: (contrato) => formatarMoedaTexto(contrato.valorTotal),
      },
      {
        key: 'acoes',
        header: '',
        render: (contrato) => (
          <div className="cadastro-financeiro-table__acoes">
            <button
              type="button"
              className="cadastro-financeiro-table__acao-btn"
              title="Editar contrato"
              aria-label={`Editar contrato ${contrato.numeroContrato}`}
              onClick={() => setContratoEmEdicao(contrato)}
            >
              <IconEditar width={16} height={16} />
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  const colunasSolemps: Column<SolempRegistro>[] = useMemo(
    () => [
      { key: 'numeroContrato', header: 'Número do Contrato' },
      { key: 'numeroSolemp', header: 'Número da Solemp' },
      {
        key: 'dataSolemp',
        header: 'Data da Solemp',
        render: (solemp) => formatarDataExibir(solemp.dataSolemp),
      },
      {
        key: 'valorSolemp',
        header: 'Valor da Solemp',
        render: (solemp) => formatarMoedaTexto(solemp.valorSolemp),
      },
      {
        key: 'acoes',
        header: '',
        render: (solemp) => (
          <div className="cadastro-financeiro-table__acoes">
            <button
              type="button"
              className="cadastro-financeiro-table__acao-btn"
              title="Editar Solemp"
              aria-label={`Editar Solemp ${solemp.numeroSolemp}`}
              onClick={() => setSolempEmEdicao(solemp)}
            >
              <IconEditar width={16} height={16} />
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="cadastro-contrato-solemp">
      <div className="cadastro-contrato-solemp__forms">
        <AdicionarContratoCard onAdicionar={handleAdicionarContrato} />
        <AdicionarSolempCard contratos={contratos} onAdicionar={handleAdicionarSolemp} />
      </div>

      <SectionCard
        title="Contratos cadastrados"
        description="Consulta dos contratos registrados no sistema."
      >
        <DataTable
          columns={colunasContratos}
          data={contratos}
          emptyMessage="Nenhum contrato cadastrado."
        />
      </SectionCard>

      <SectionCard
        title="Solemps cadastradas"
        description="Consulta das Solemps registradas no sistema."
      >
        <DataTable
          columns={colunasSolemps}
          data={solemps}
          emptyMessage="Nenhuma solemp cadastrada."
        />
      </SectionCard>

      <EditarContratoModal
        aberto={contratoEmEdicao !== null}
        contrato={contratoEmEdicao}
        onFechar={() => setContratoEmEdicao(null)}
        onSalvar={handleSalvarContrato}
      />

      <EditarSolempModal
        aberto={solempEmEdicao !== null}
        solemp={solempEmEdicao}
        contratos={contratos}
        onFechar={() => setSolempEmEdicao(null)}
        onSalvar={handleSalvarSolemp}
      />
    </div>
  )
}

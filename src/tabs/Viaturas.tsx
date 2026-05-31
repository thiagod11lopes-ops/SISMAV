import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { SectionCard } from '../components/SectionCard'
import {
  CadastrarViaturaForm,
  type NovaViatura,
  type ViaturaEdicao,
} from './viaturas/CadastrarViaturaCard'
import { ViaturaFinanceiroModal } from './viaturas/ViaturaFinanceiroModal'
import { ViaturasGrupoTable } from './viaturas/ViaturasGrupoTable'
import type { ViaturaLinha } from './viaturas/types'
import { valorMoedaParaEdicao } from '../utils/formatoBr'
import { formatarValorReais } from './financeiro/valorUtils'
import { carregarViaturas, salvarViaturas } from './viaturas/viaturasStorage'
import './viaturas/Viaturas.css'

export const VIATURAS_INICIAIS: ViaturaLinha[] = [
  {
    id: '1',
    tipo: 'ambulancia',
    placa: 'RIV-9I01',
    modelo: 'Sprinter',
    ano: '2021',
    valorFipe: '',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '2',
    tipo: 'ambulancia',
    placa: 'RKK-9I27',
    modelo: 'Sprinter',
    ano: '2021',
    valorFipe: '',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '3',
    tipo: 'ambulancia',
    placa: 'TTD-1A38',
    modelo: 'Master',
    ano: '2024',
    valorFipe: '',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '4',
    tipo: 'ambulancia',
    placa: 'KPK-6H03',
    modelo: 'Sprinter',
    ano: '2012',
    valorFipe: 'R$79.666,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '5',
    tipo: 'ambulancia',
    placa: 'KVZ-8089',
    modelo: 'Sprinter',
    ano: '2012',
    valorFipe: 'R$79.666,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '6',
    tipo: 'ambulancia',
    placa: 'KVZ-8A91',
    modelo: 'Sprinter',
    ano: '2012',
    valorFipe: 'R$79.666,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '7',
    tipo: 'ambulancia',
    placa: 'KPH-9E52',
    modelo: 'Ducato',
    ano: '2012',
    valorFipe: 'R$54.952,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '8',
    tipo: 'ambulancia',
    placa: 'KPH-9E53',
    modelo: 'Ducato',
    ano: '2012',
    valorFipe: 'R$54.952,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '9',
    tipo: 'ambulancia',
    placa: 'KPH-9E54',
    modelo: 'Ducato',
    ano: '2012',
    valorFipe: 'R$54.952,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '10',
    tipo: 'ambulancia',
    placa: 'TTP-2G26',
    modelo: 'Master',
    ano: '2024',
    valorFipe: '',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '11',
    tipo: 'administrativo',
    placa: 'KZT-1560',
    modelo: 'Honda',
    ano: '2005',
    valorFipe: 'R$0,01',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '12',
    tipo: 'administrativo',
    placa: 'LPE-6G44',
    modelo: 'Ducato',
    ano: '2008',
    valorFipe: 'R$55.163,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '13',
    tipo: 'administrativo',
    placa: 'LPE-2A05',
    modelo: 'Ducato',
    ano: '2008',
    valorFipe: 'R$55.163,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '14',
    tipo: 'administrativo',
    placa: 'KPG-9A79',
    modelo: 'Doblô',
    ano: '2012',
    valorFipe: 'R$37.920,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '15',
    tipo: 'administrativo',
    placa: 'LQS-1F32',
    modelo: 'Doblô',
    ano: '2012',
    valorFipe: 'R$41.018,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '16',
    tipo: 'administrativo',
    placa: 'NVT-8G55',
    modelo: 'Doblô',
    ano: '2011',
    valorFipe: 'R$30.981,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '17',
    tipo: 'administrativo',
    placa: 'RJN-4J27',
    modelo: 'Ka',
    ano: '2020',
    valorFipe: '',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '18',
    tipo: 'administrativo',
    placa: 'KRQ-0G70',
    modelo: 'Clio',
    ano: '2007',
    valorFipe: 'R$14.800,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '19',
    tipo: 'administrativo',
    placa: 'KVZ-7A70',
    modelo: 'Iveco',
    ano: '2012',
    valorFipe: 'R$84.788,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '20',
    tipo: 'administrativo',
    placa: 'LTI-2281',
    modelo: 'Corolla',
    ano: '2017',
    valorFipe: 'R$76.900,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '21',
    tipo: 'administrativo',
    placa: 'LSB-8C53',
    modelo: '408',
    ano: '2014',
    valorFipe: 'R$39.439,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '22',
    tipo: 'administrativo',
    placa: 'LNC-1A94',
    modelo: 'Santana',
    ano: '2000',
    valorFipe: '',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '23',
    tipo: 'administrativo',
    placa: 'KZV-8G41',
    modelo: 'Ducato',
    ano: '2006',
    valorFipe: 'R$41.900,00',
    km: '0',
    situacao: 'Operacional',
  },
  {
    id: '24',
    tipo: 'administrativo',
    placa: 'LKL-8D08',
    modelo: 'Ford Cargo',
    ano: '2007',
    valorFipe: 'R$79.888,00',
    km: '0',
    situacao: 'Operacional',
  },
]

export function Viaturas() {
  const [viaturas, setViaturas] = useState(() => carregarViaturas(VIATURAS_INICIAIS))

  useEffect(() => {
    salvarViaturas(viaturas)
  }, [viaturas])
  const [exibirFormulario, setExibirFormulario] = useState(false)
  const [viaturaEdicao, setViaturaEdicao] = useState<ViaturaEdicao | null>(null)
  const [viaturaParaExcluir, setViaturaParaExcluir] = useState<ViaturaLinha | null>(
    null,
  )
  const [viaturaFinanceiro, setViaturaFinanceiro] = useState<ViaturaLinha | null>(
    null,
  )

  const fecharFormulario = () => {
    setExibirFormulario(false)
    setViaturaEdicao(null)
  }

  const handleCadastrar = (nova: NovaViatura) => {
    const linha: ViaturaLinha = {
      id: String(Date.now()),
      tipo: nova.tipo,
      placa: nova.placa,
      modelo: nova.modelo,
      ano: nova.ano,
      valorFipe: formatarValorReais(nova.valorFipe),
      km: '0',
      situacao: 'Operacional',
    }
    setViaturas((prev) => [linha, ...prev])
    fecharFormulario()
  }

  const handleSalvar = (id: string, dados: NovaViatura) => {
    setViaturas((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              tipo: dados.tipo,
              placa: dados.placa,
              modelo: dados.modelo,
              ano: dados.ano,
              valorFipe: formatarValorReais(dados.valorFipe),
            }
          : v,
      ),
    )
    fecharFormulario()
  }

  const handleEditar = (viatura: ViaturaLinha) => {
    setViaturaEdicao({
      id: viatura.id,
      tipo: viatura.tipo,
      modelo: viatura.modelo,
      ano: viatura.ano,
      placa: viatura.placa,
      valorFipe: valorMoedaParaEdicao(viatura.valorFipe),
    })
    setExibirFormulario(true)
  }

  const handleConfirmarExclusao = () => {
    if (!viaturaParaExcluir) return
    setViaturas((prev) => prev.filter((v) => v.id !== viaturaParaExcluir.id))
    if (viaturaEdicao?.id === viaturaParaExcluir.id) {
      fecharFormulario()
    }
    setViaturaParaExcluir(null)
  }

  return (
    <div className="viaturas-page viaturas-page--col">
      <SectionCard
        title="Cadastro de viaturas"
        description="Inclua novas viaturas na frota."
        actions={
          <Button
            onClick={() => {
              if (exibirFormulario) {
                fecharFormulario()
              } else {
                setViaturaEdicao(null)
                setExibirFormulario(true)
              }
            }}
          >
            {exibirFormulario ? 'Fechar cadastro' : 'Cadastrar nova viatura'}
          </Button>
        }
      >
        {exibirFormulario ? (
          <CadastrarViaturaForm
            viaturaEdicao={viaturaEdicao}
            onCadastrar={handleCadastrar}
            onSalvar={handleSalvar}
            onCancelar={fecharFormulario}
          />
        ) : (
          <p className="viaturas-cadastro__hint">
            Clique em &quot;Cadastrar nova viatura&quot; para abrir o formulário.
          </p>
        )}
      </SectionCard>

      <SectionCard
        title="Viaturas cadastradas"
        description="Consulta da frota por tipo de viatura."
        actions={<Button variant="secondary">Buscar</Button>}
      >
        <div className="viaturas-layout">
          <ViaturasGrupoTable
            titulo="Ambulâncias"
            tipo="ambulancia"
            viaturas={viaturas}
            onEditar={handleEditar}
            onVerFinanceiro={setViaturaFinanceiro}
            onExcluir={setViaturaParaExcluir}
          />
          <ViaturasGrupoTable
            titulo="Administrativas"
            tipo="administrativo"
            viaturas={viaturas}
            onEditar={handleEditar}
            onVerFinanceiro={setViaturaFinanceiro}
            onExcluir={setViaturaParaExcluir}
          />
        </div>
      </SectionCard>

      <ViaturaFinanceiroModal
        aberto={viaturaFinanceiro !== null}
        viatura={viaturaFinanceiro}
        onFechar={() => setViaturaFinanceiro(null)}
      />

      {viaturaParaExcluir && (
        <div
          className="viaturas-modal__overlay"
          role="presentation"
          onClick={() => setViaturaParaExcluir(null)}
        >
          <div
            className="viaturas-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="viaturas-modal-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 id="viaturas-modal-titulo" className="viaturas-modal__title">
              Excluir viatura
            </h4>
            <p className="viaturas-modal__text">
              Deseja excluir a viatura{' '}
              <strong>
                {viaturaParaExcluir.placa} — {viaturaParaExcluir.modelo}
              </strong>
              ? Esta ação não pode ser desfeita.
            </p>
            <div className="viaturas-modal__actions">
              <Button variant="secondary" onClick={() => setViaturaParaExcluir(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleConfirmarExclusao}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

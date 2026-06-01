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
import { VIATURAS_INICIAIS } from './viaturas/viaturasData'
import './viaturas/Viaturas.css'

export { VIATURAS_INICIAIS } from './viaturas/viaturasData'

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

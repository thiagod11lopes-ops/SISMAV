import { useState } from 'react'
import { Button } from '../../components/Button'
import { SectionCard } from '../../components/SectionCard'
import { AdicionarAtividadeCard } from './AdicionarAtividadeCard'
import { FainaItemCard } from './FainaItemCard'
import { useFainasContext } from './FainasContext'
import './FainaItemCard.css'

export function Pendente() {
  const { pendentes, adicionar, moverStatus, reordenarPendente, solicitarExclusao } =
    useFainasContext()
  const [showAddActivity, setShowAddActivity] = useState(false)

  return (
    <SectionCard
      title="Atividades Pendentes"
      description="Gerencie as fainas pendentes. Use as setas verticais para alterar a ordem e a seta à direita para enviar à aba Em andamento."
      actions={
        <Button onClick={() => setShowAddActivity((prev) => !prev)}>
          {showAddActivity ? 'Ocultar formulário' : 'Adicionar nova atividade'}
        </Button>
      }
    >
      {showAddActivity && (
        <AdicionarAtividadeCard
          onAdicionar={(atividade) => {
            adicionar(atividade)
            setShowAddActivity(false)
          }}
          onCancelar={() => setShowAddActivity(false)}
        />
      )}

      {!showAddActivity && pendentes.length === 0 && (
        <p className="panel-placeholder">
          Nenhuma faina pendente. Clique em "Adicionar nova atividade" para começar.
        </p>
      )}

      {!showAddActivity && pendentes.length > 0 && (
        <div className="fainas-list">
          {pendentes.map((faina, indice) => (
            <FainaItemCard
              key={faina.id}
              faina={faina}
              onMover={moverStatus}
              onExcluir={solicitarExclusao}
              onReordenar={reordenarPendente}
              podeSubir={indice > 0}
              podeDescer={indice < pendentes.length - 1}
            />
          ))}
        </div>
      )}
    </SectionCard>
  )
}

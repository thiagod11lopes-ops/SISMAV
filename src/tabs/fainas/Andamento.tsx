import { SectionCard } from '../../components/SectionCard'
import { FainaItemCard } from './FainaItemCard'
import { useFainasContext } from './FainasContext'
import './FainaItemCard.css'

export function Andamento() {
  const { emAndamento, moverStatus, solicitarExclusao } = useFainasContext()

  return (
    <SectionCard
      title="Fainas em Andamento"
      description="Retorne para Pendente ou avance para Finalizado usando as setas."
    >
      {emAndamento.length === 0 ? (
        <p className="panel-placeholder">Nenhuma faina em andamento.</p>
      ) : (
        <div className="fainas-list">
          {emAndamento.map((faina) => (
            <FainaItemCard
              key={faina.id}
              faina={faina}
              onMover={moverStatus}
              onExcluir={solicitarExclusao}
            />
          ))}
        </div>
      )}
    </SectionCard>
  )
}

import { SectionCard } from '../../components/SectionCard'
import { FainaItemCard } from './FainaItemCard'
import { useFainasContext } from './FainasContext'
import './FainaItemCard.css'

export function Finalizados() {
  const { finalizadas, moverStatus, solicitarExclusao } = useFainasContext()

  return (
    <SectionCard
      title="Fainas Finalizadas"
      description="Use a seta para retornar uma faina à aba Em andamento."
    >
      {finalizadas.length === 0 ? (
        <p className="panel-placeholder">Nenhuma faina finalizada.</p>
      ) : (
        <div className="fainas-list">
          {finalizadas.map((faina) => (
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

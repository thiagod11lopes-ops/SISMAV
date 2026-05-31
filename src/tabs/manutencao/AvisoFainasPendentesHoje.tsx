import { IconLixeira } from '../../components/icons/ManutencaoIcons'
import {
  dataLimiteEhHoje,
  rotuloDataLimiteAlerta,
} from '../fainas/fainasPendentesHoje'
import type { FainaItem } from '../fainas/types'
import './AvisoFainasPendentesHoje.css'

interface AvisoFainasPendentesHojeProps {
  fainas: FainaItem[]
  onDispensar: () => void
}

export function AvisoFainasPendentesHoje({
  fainas,
  onDispensar,
}: AvisoFainasPendentesHojeProps) {
  if (fainas.length === 0) return null

  const temVencida = fainas.some(
    (f) => f.dataLimite && !dataLimiteEhHoje(f.dataLimite),
  )

  const tituloLista =
    fainas.length === 1
      ? '1 faina pendente com prazo em alerta'
      : `${fainas.length} fainas pendentes com prazo em alerta`

  return (
    <div className="manutencao-aviso-fainas" role="alert">
      <div className="manutencao-aviso-fainas__icon" aria-hidden>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      </div>
      <div className="manutencao-aviso-fainas__content">
        <p className="manutencao-aviso-fainas__title">{tituloLista}</p>
        <p className="manutencao-aviso-fainas__desc">
          {temVencida
            ? 'Inclui atividades com data limite vencida ou para hoje. O aviso volta amanhã se ainda estiverem pendentes.'
            : 'Atividades pendentes na aba Fainas com data limite para hoje. O aviso volta amanhã se ainda estiverem pendentes.'}
        </p>
        <ul className="manutencao-aviso-fainas__lista">
          {fainas.map((faina) => (
            <li key={faina.id}>
              <strong>{faina.tituloAtividade}</strong>
              {faina.dataLimite ? (
                <span> — {rotuloDataLimiteAlerta(faina.dataLimite)}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="manutencao-aviso-fainas__dispensar"
        onClick={onDispensar}
        title="Ocultar aviso até amanhã"
        aria-label="Ocultar aviso de fainas pendentes por hoje"
      >
        <IconLixeira width={18} height={18} />
      </button>
    </div>
  )
}

import { IconButton } from '../../components/IconButton'
import {
  IconAnotacoes,
  IconAprovarOrcamento,
  IconControleCreditos,
  IconOficina,
  IconRelatorios,
} from '../../components/icons/ManutencaoIcons'
import './ManutencaoToolbar.css'

interface ManutencaoToolbarProps {
  onViaturasOficina: () => void
  onRelatorios: () => void
  onAprovarOrcamento: () => void
  onAnotacoes: () => void
  onControleCreditos: () => void
  controleCreditosAtivo?: boolean
  aprovarOrcamentoDesabilitado?: boolean
  tituloAprovarOrcamento?: string
}

export function ManutencaoToolbar({
  onViaturasOficina,
  onRelatorios,
  onAprovarOrcamento,
  onAnotacoes,
  onControleCreditos,
  controleCreditosAtivo = false,
  aprovarOrcamentoDesabilitado = false,
  tituloAprovarOrcamento,
}: ManutencaoToolbarProps) {
  return (
    <div className="manutencao-toolbar">
      <div className="manutencao-toolbar__acoes">
        <IconButton icon={<IconOficina />} onClick={onViaturasOficina}>
          Viaturas na oficina
        </IconButton>
        <IconButton icon={<IconRelatorios />} onClick={onRelatorios}>
          Relatórios
        </IconButton>
        <IconButton
          icon={<IconAprovarOrcamento />}
          onClick={onAprovarOrcamento}
          disabled={aprovarOrcamentoDesabilitado}
          title={tituloAprovarOrcamento}
        >
          Aprovar orçamento
        </IconButton>
        <IconButton icon={<IconAnotacoes />} onClick={onAnotacoes}>
          Anotações
        </IconButton>
        <IconButton
          icon={<IconControleCreditos />}
          onClick={onControleCreditos}
          variant={controleCreditosAtivo ? 'primary' : 'secondary'}
          iconOnly
          title="Controle de créditos"
          aria-label="Controle de créditos"
          aria-pressed={controleCreditosAtivo}
        />
      </div>
    </div>
  )
}

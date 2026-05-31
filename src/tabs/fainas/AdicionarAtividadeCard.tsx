import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { DataInput } from '../../components/inputs/DataInput'
import { SectionCard } from '../../components/SectionCard'
import { normalizarDataBr } from '../../utils/formatoBr'
import '../financeiro/AdicionarContratoCard.css' // Reutilizando estilos de formulário

export interface NovaAtividade {
  tituloAtividade: string
  descricao: string
  dataLimite?: string // Opcional
}

interface AdicionarAtividadeCardProps {
  onAdicionar: (atividade: NovaAtividade) => void
  onCancelar: () => void
}

const FORM_INICIAL: NovaAtividade = {
  tituloAtividade: '',
  descricao: '',
  dataLimite: '',
}

export function AdicionarAtividadeCard({
  onAdicionar,
  onCancelar,
}: AdicionarAtividadeCardProps) {
  const [form, setForm] = useState<NovaAtividade>(FORM_INICIAL)

  const setCampo = <K extends keyof NovaAtividade>(campo: K, valor: NovaAtividade[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const limpar = () => setForm(FORM_INICIAL)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.tituloAtividade.trim() || !form.descricao.trim()) {
      return
    }
    onAdicionar({
      ...form,
      tituloAtividade: form.tituloAtividade.trim(),
      descricao: form.descricao.trim(),
      dataLimite: form.dataLimite?.trim()
        ? normalizarDataBr(form.dataLimite.trim())
        : undefined,
    })
    limpar()
  }

  return (
    <SectionCard title="Adicionar nova atividade">
      <form className="form-contrato" onSubmit={handleSubmit}>
        <div className="form-contrato__grid">
          <label className="form-contrato__field">
            <span className="form-contrato__label">Título da atividade</span>
            <input
              type="text"
              value={form.tituloAtividade}
              onChange={(e) => setCampo('tituloAtividade', e.target.value)}
              placeholder="Ex: Vistoria da viatura AMB-1234"
              required
            />
          </label>

          <label className="form-contrato__field">
            <span className="form-contrato__label">Descrição</span>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => setCampo('descricao', e.target.value)}
              placeholder="Ex: Verificar freios e suspensão"
              required
            />
          </label>

          <label className="form-contrato__field">
            <span className="form-contrato__label">Data limite (opcional)</span>
            <DataInput
              value={form.dataLimite ?? ''}
              onValueChange={(valor) => setCampo('dataLimite', valor)}
            />
          </label>
        </div>

        <div className="form-contrato__actions">
          <Button type="submit">Salvar atividade</Button>
          <Button type="button" variant="secondary" onClick={limpar}>
            Limpar
          </Button>
          <Button type="button" variant="ghost" onClick={onCancelar}>
            Cancelar
          </Button>
        </div>
      </form>
    </SectionCard>
  )
}

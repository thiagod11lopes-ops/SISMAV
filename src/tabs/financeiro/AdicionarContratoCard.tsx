import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { DataInput } from '../../components/inputs/DataInput'
import { MoedaInput } from '../../components/inputs/MoedaInput'
import { SectionCard } from '../../components/SectionCard'
import './AdicionarContratoCard.css'

export interface NovoContrato {
  numeroContrato: string
  dataInicio: string
  dataFim: string
  valorTotal: string
}

interface AdicionarContratoCardProps {
  onAdicionar: (contrato: NovoContrato) => void
}

const FORM_INICIAL: NovoContrato = {
  numeroContrato: '',
  dataInicio: '',
  dataFim: '',
  valorTotal: '',
}

export function AdicionarContratoCard({ onAdicionar }: AdicionarContratoCardProps) {
  const [form, setForm] = useState<NovoContrato>(FORM_INICIAL)

  const setCampo = (campo: keyof NovoContrato, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (
      !form.numeroContrato.trim() ||
      !form.dataInicio.trim() ||
      !form.dataFim.trim() ||
      !form.valorTotal.trim()
    ) {
      return
    }
    onAdicionar(form)
    setForm(FORM_INICIAL)
  }

  return (
    <SectionCard title="Adicionar Contrato">
      <form className="form-contrato" onSubmit={handleSubmit}>
        <div className="form-contrato__grid">
          <label className="form-contrato__field">
            <span className="form-contrato__label">Número do Contrato</span>
            <input
              type="text"
              value={form.numeroContrato}
              onChange={(e) => setCampo('numeroContrato', e.target.value)}
              placeholder="Número do contrato"
              required
            />
          </label>

          <label className="form-contrato__field">
            <span className="form-contrato__label">Data do início do contrato</span>
            <DataInput
              value={form.dataInicio}
              onValueChange={(valor) => setCampo('dataInicio', valor)}
              required
            />
          </label>

          <label className="form-contrato__field">
            <span className="form-contrato__label">Data do fim do contrato</span>
            <DataInput
              value={form.dataFim}
              onValueChange={(valor) => setCampo('dataFim', valor)}
              required
            />
          </label>

          <label className="form-contrato__field">
            <span className="form-contrato__label">Valor total do contrato</span>
            <MoedaInput
              value={form.valorTotal}
              onValueChange={(valor) => setCampo('valorTotal', valor)}
              required
            />
          </label>
        </div>

        <div className="form-contrato__actions">
          <Button type="submit">Adicionar Contrato</Button>
          <Button type="button" variant="secondary" onClick={() => setForm(FORM_INICIAL)}>
            Limpar
          </Button>
        </div>
      </form>
    </SectionCard>
  )
}

import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { DataInput } from '../../components/inputs/DataInput'
import { MoedaInput } from '../../components/inputs/MoedaInput'
import { SectionCard } from '../../components/SectionCard'
import type { ContratoRegistro } from './contratoStorage'
import './AdicionarSolempCard.css'

export interface NovaSolemp {
  contratoId: string
  numeroSolemp: string
  dataSolemp: string
  valorSolemp: string
}

interface AdicionarSolempCardProps {
  contratos: ContratoRegistro[]
  onAdicionar: (solemp: NovaSolemp) => void
}

const FORM_INICIAL: NovaSolemp = {
  contratoId: '',
  numeroSolemp: '',
  dataSolemp: '',
  valorSolemp: '',
}

export function AdicionarSolempCard({
  contratos,
  onAdicionar,
}: AdicionarSolempCardProps) {
  const [form, setForm] = useState<NovaSolemp>(FORM_INICIAL)

  const setCampo = (campo: keyof NovaSolemp, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (
      !form.contratoId ||
      !form.numeroSolemp.trim() ||
      !form.dataSolemp.trim() ||
      !form.valorSolemp.trim()
    ) {
      return
    }
    onAdicionar({
      contratoId: form.contratoId,
      numeroSolemp: form.numeroSolemp.trim(),
      dataSolemp: form.dataSolemp.trim(),
      valorSolemp: form.valorSolemp.trim(),
    })
    setForm(FORM_INICIAL)
  }

  return (
    <SectionCard title="Cadastrar Novas Solemps">
      <form className="form-solemp" onSubmit={handleSubmit}>
        <div className="form-solemp__grid">
          <label className="form-solemp__field form-solemp__field--full">
            <span className="form-solemp__label">Contrato vinculado</span>
            <select
              value={form.contratoId}
              onChange={(e) => setCampo('contratoId', e.target.value)}
              required
            >
              <option value="">
                {contratos.length === 0
                  ? 'Nenhum contrato cadastrado'
                  : 'Selecione o contrato'}
              </option>
              {contratos.map((contrato) => (
                <option key={contrato.id} value={contrato.id}>
                  {contrato.numeroContrato}
                </option>
              ))}
            </select>
          </label>

          <label className="form-solemp__field">
            <span className="form-solemp__label">Número da Solemp</span>
            <input
              type="text"
              value={form.numeroSolemp}
              onChange={(e) => setCampo('numeroSolemp', e.target.value)}
              placeholder="Número da solemp"
              required
            />
          </label>

          <label className="form-solemp__field">
            <span className="form-solemp__label">Data da Solemp</span>
            <DataInput
              value={form.dataSolemp}
              onValueChange={(valor) => setCampo('dataSolemp', valor)}
              required
            />
          </label>

          <label className="form-solemp__field">
            <span className="form-solemp__label">Valor da Solemp</span>
            <MoedaInput
              value={form.valorSolemp}
              onValueChange={(valor) => setCampo('valorSolemp', valor)}
              required
            />
          </label>
        </div>

        <div className="form-solemp__actions">
          <Button type="submit" disabled={contratos.length === 0}>
            Cadastrar Solemp
          </Button>
          <Button type="button" variant="secondary" onClick={() => setForm(FORM_INICIAL)}>
            Limpar
          </Button>
        </div>
      </form>
    </SectionCard>
  )
}

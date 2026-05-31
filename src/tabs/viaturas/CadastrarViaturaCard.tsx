import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { MoedaInput } from '../../components/inputs/MoedaInput'
import { SectionCard } from '../../components/SectionCard'
import '../financeiro/AdicionarContratoCard.css'

export type TipoViatura = 'ambulancia' | 'administrativo'

export interface NovaViatura {
  tipo: TipoViatura
  modelo: string
  ano: string
  placa: string
  valorFipe: string
}

export type ViaturaEdicao = NovaViatura & { id: string }

interface CadastrarViaturaFormProps {
  viaturaEdicao?: ViaturaEdicao | null
  onCadastrar: (viatura: NovaViatura) => void
  onSalvar?: (id: string, viatura: NovaViatura) => void
  onCancelar: () => void
}

const FORM_INICIAL: NovaViatura = {
  tipo: 'ambulancia',
  modelo: '',
  ano: '',
  placa: '',
  valorFipe: '',
}

const LABEL_TIPO: Record<TipoViatura, string> = {
  ambulancia: 'Ambulância',
  administrativo: 'Administrativo',
}

export function CadastrarViaturaForm({
  viaturaEdicao,
  onCadastrar,
  onSalvar,
  onCancelar,
}: CadastrarViaturaFormProps) {
  const [form, setForm] = useState<NovaViatura>(FORM_INICIAL)
  const emEdicao = Boolean(viaturaEdicao)

  useEffect(() => {
    if (viaturaEdicao) {
      setForm({
        tipo: viaturaEdicao.tipo,
        modelo: viaturaEdicao.modelo,
        ano: viaturaEdicao.ano,
        placa: viaturaEdicao.placa,
        valorFipe: viaturaEdicao.valorFipe,
      })
    } else {
      setForm(FORM_INICIAL)
    }
  }, [viaturaEdicao])

  const setCampo = <K extends keyof NovaViatura>(campo: K, valor: NovaViatura[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  const limpar = () => setForm(FORM_INICIAL)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.modelo.trim() || !form.ano.trim() || !form.placa.trim()) {
      return
    }

    const dados: NovaViatura = {
      ...form,
      modelo: form.modelo.trim(),
      ano: form.ano.trim(),
      placa: form.placa.trim().toUpperCase(),
      valorFipe: form.valorFipe.trim(),
    }

    if (emEdicao && viaturaEdicao && onSalvar) {
      onSalvar(viaturaEdicao.id, dados)
    } else {
      onCadastrar(dados)
    }

    limpar()
    onCancelar()
  }

  return (
    <form className="form-contrato" onSubmit={handleSubmit}>
      <div className="form-contrato__grid">
        <label className="form-contrato__field">
          <span className="form-contrato__label">Tipo</span>
          <select
            value={form.tipo}
            onChange={(e) => setCampo('tipo', e.target.value as TipoViatura)}
          >
            <option value="ambulancia">{LABEL_TIPO.ambulancia}</option>
            <option value="administrativo">{LABEL_TIPO.administrativo}</option>
          </select>
        </label>

        <label className="form-contrato__field">
          <span className="form-contrato__label">Modelo</span>
          <input
            type="text"
            value={form.modelo}
            onChange={(e) => setCampo('modelo', e.target.value)}
            placeholder="Ex: Mercedes Sprinter"
            required
          />
        </label>

        <label className="form-contrato__field">
          <span className="form-contrato__label">Ano</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.ano}
            onChange={(e) => setCampo('ano', e.target.value)}
            placeholder="Ex: 2024"
            maxLength={4}
            required
          />
        </label>

        <label className="form-contrato__field">
          <span className="form-contrato__label">Placa</span>
          <input
            type="text"
            value={form.placa}
            onChange={(e) => setCampo('placa', e.target.value)}
            placeholder="Ex: ABC-1234"
            required
          />
        </label>

        <label className="form-contrato__field">
          <span className="form-contrato__label">Valor de Mercado (SINGRA)</span>
          <MoedaInput
            value={form.valorFipe}
            onValueChange={(valor) => setCampo('valorFipe', valor)}
          />
        </label>
      </div>

      <div className="form-contrato__actions">
        <Button type="submit">
          {emEdicao ? 'Salvar alterações' : 'Cadastrar viatura'}
        </Button>
        <Button type="button" variant="secondary" onClick={limpar}>
          Limpar
        </Button>
        <Button type="button" variant="ghost" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export function CadastrarViaturaCard(props: CadastrarViaturaFormProps) {
  return (
    <SectionCard title="Cadastrar novas viaturas">
      <CadastrarViaturaForm {...props} />
    </SectionCard>
  )
}

export { LABEL_TIPO }

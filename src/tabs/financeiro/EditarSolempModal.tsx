import { useEffect, useId, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { DataInput } from '../../components/inputs/DataInput'
import { MoedaInput } from '../../components/inputs/MoedaInput'
import type { NovaSolemp } from './AdicionarSolempCard'
import type { ContratoRegistro } from './contratoStorage'
import type { SolempRegistro } from './solempStorage'
import { formatarDataExibir } from '../../utils/formatoBr'
import { valorMoedaParaEdicao } from './valorUtils'
import '../../styles/modern-ui.css'
import './EditarFinanceiroModal.css'

interface EditarSolempModalProps {
  aberto: boolean
  solemp: SolempRegistro | null
  contratos: ContratoRegistro[]
  onFechar: () => void
  onSalvar: (id: string, dados: NovaSolemp) => void
}

const FORM_VAZIO: NovaSolemp = {
  contratoId: '',
  numeroSolemp: '',
  dataSolemp: '',
  valorSolemp: '',
}

export function EditarSolempModal({
  aberto,
  solemp,
  contratos,
  onFechar,
  onSalvar,
}: EditarSolempModalProps) {
  const formId = useId()
  const [form, setForm] = useState<NovaSolemp>(FORM_VAZIO)

  useEffect(() => {
    if (!aberto || !solemp) return

    setForm({
      contratoId: solemp.contratoId,
      numeroSolemp: solemp.numeroSolemp,
      dataSolemp: formatarDataExibir(solemp.dataSolemp),
      valorSolemp: valorMoedaParaEdicao(solemp.valorSolemp),
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [aberto, solemp, onFechar])

  if (!aberto || !solemp) return null

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
    onSalvar(solemp.id, {
      contratoId: form.contratoId,
      numeroSolemp: form.numeroSolemp.trim(),
      dataSolemp: form.dataSolemp.trim(),
      valorSolemp: form.valorSolemp.trim(),
    })
  }

  return (
    <div className="modern-overlay" role="presentation" onClick={onFechar}>
      <div
        className="modern-modal-shell editar-financeiro-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-titulo`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <div className="modern-modal-header__main">
            <span className="modern-modal-header__icon" aria-hidden>
              ✎
            </span>
            <div>
              <h2 id={`${formId}-titulo`} className="modern-modal-header__title">
                Editar Solemp
              </h2>
              <p className="modern-modal-header__subtitle">
                Altere os dados da Solemp selecionada.
              </p>
            </div>
          </div>
          <button type="button" className="modern-modal-close" onClick={onFechar} aria-label="Fechar">
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modern-modal-body">
            <p className="modern-alert" role="note">
              A edição desta Solemp pode alterar os valores e informações já registrados na
              aba <strong>Resumo financeiro</strong>, incluindo saldos e faturamentos pagos
              vinculados a ela.
            </p>

            <div className="editar-financeiro-modal__grid">
            <label className="editar-financeiro-modal__field editar-financeiro-modal__field--full">
              <span className="editar-financeiro-modal__label">Contrato vinculado</span>
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

            <label className="editar-financeiro-modal__field">
              <span className="editar-financeiro-modal__label">Número da Solemp</span>
              <input
                type="text"
                value={form.numeroSolemp}
                onChange={(e) => setCampo('numeroSolemp', e.target.value)}
                required
              />
            </label>

            <label className="editar-financeiro-modal__field">
              <span className="editar-financeiro-modal__label">Data da Solemp</span>
              <DataInput
                value={form.dataSolemp}
                onValueChange={(valor) => setCampo('dataSolemp', valor)}
                required
              />
            </label>

            <label className="editar-financeiro-modal__field">
              <span className="editar-financeiro-modal__label">Valor da Solemp</span>
              <MoedaInput
                value={form.valorSolemp}
                onValueChange={(valor) => setCampo('valorSolemp', valor)}
                required
              />
            </label>
          </div>
          </div>

          <footer className="modern-modal-footer">
            <Button type="button" variant="secondary" onClick={onFechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={contratos.length === 0}>
              Salvar alterações
            </Button>
          </footer>
        </form>
      </div>
    </div>
  )
}

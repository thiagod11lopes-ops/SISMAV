import { useEffect, useId, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { DataInput } from '../../components/inputs/DataInput'
import { MoedaInput } from '../../components/inputs/MoedaInput'
import type { NovoContrato } from './AdicionarContratoCard'
import type { ContratoRegistro } from './contratoStorage'
import { formatarDataExibir } from '../../utils/formatoBr'
import { parseVigenciaContrato, valorMoedaParaEdicao } from './valorUtils'
import '../../styles/modern-ui.css'
import './EditarFinanceiroModal.css'

interface EditarContratoModalProps {
  aberto: boolean
  contrato: ContratoRegistro | null
  onFechar: () => void
  onSalvar: (id: string, dados: NovoContrato) => void
}

const FORM_VAZIO: NovoContrato = {
  numeroContrato: '',
  dataInicio: '',
  dataFim: '',
  valorTotal: '',
}

export function EditarContratoModal({
  aberto,
  contrato,
  onFechar,
  onSalvar,
}: EditarContratoModalProps) {
  const formId = useId()
  const [form, setForm] = useState<NovoContrato>(FORM_VAZIO)

  useEffect(() => {
    if (!aberto || !contrato) return

    const { dataInicio, dataFim } = parseVigenciaContrato(contrato.vigencia)
    setForm({
      numeroContrato: contrato.numeroContrato,
      dataInicio: formatarDataExibir(dataInicio),
      dataFim: formatarDataExibir(dataFim),
      valorTotal: valorMoedaParaEdicao(contrato.valorTotal),
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
  }, [aberto, contrato, onFechar])

  if (!aberto || !contrato) return null

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
    onSalvar(contrato.id, {
      numeroContrato: form.numeroContrato.trim(),
      dataInicio: form.dataInicio.trim(),
      dataFim: form.dataFim.trim(),
      valorTotal: form.valorTotal.trim(),
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
                Editar contrato
              </h2>
              <p className="modern-modal-header__subtitle">
                Altere os dados do contrato selecionado.
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
              A edição deste contrato pode alterar os valores e informações já registrados na
              aba <strong>Resumo financeiro</strong>, incluindo saldos e faturamentos pagos
              vinculados a ele.
            </p>

            <div className="editar-financeiro-modal__grid">
              <label className="editar-financeiro-modal__field">
                <span className="editar-financeiro-modal__label">Número do Contrato</span>
              <input
                type="text"
                value={form.numeroContrato}
                onChange={(e) => setCampo('numeroContrato', e.target.value)}
                required
              />
            </label>

            <label className="editar-financeiro-modal__field">
              <span className="editar-financeiro-modal__label">Data do início do contrato</span>
              <DataInput
                value={form.dataInicio}
                onValueChange={(valor) => setCampo('dataInicio', valor)}
                required
              />
            </label>

            <label className="editar-financeiro-modal__field">
              <span className="editar-financeiro-modal__label">Data do fim do contrato</span>
              <DataInput
                value={form.dataFim}
                onValueChange={(valor) => setCampo('dataFim', valor)}
                required
              />
            </label>

            <label className="editar-financeiro-modal__field">
              <span className="editar-financeiro-modal__label">Valor total do contrato</span>
              <MoedaInput
                value={form.valorTotal}
                onValueChange={(valor) => setCampo('valorTotal', valor)}
                required
              />
            </label>
          </div>
          </div>

          <footer className="modern-modal-footer">
            <Button type="button" variant="secondary" onClick={onFechar}>
              Cancelar
            </Button>
            <Button type="submit">Salvar alterações</Button>
          </footer>
        </form>
      </div>
    </div>
  )
}

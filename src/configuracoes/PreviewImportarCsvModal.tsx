import { useEffect, useMemo } from 'react'
import { Button } from '../components/Button'
import type { SismavBackupPayload } from './sismavBackupExport'
import {
  contarRegistrosImportacao,
  montarResumoImportacaoBackup,
} from './backupImportPreview'
import '../styles/modern-ui.css'
import './PreviewImportarCsvModal.css'

interface PreviewImportarCsvModalProps {
  aberto: boolean
  dados: SismavBackupPayload | null
  nomeArquivo: string
  onFechar: () => void
  onConfirmar: () => void
}

export function PreviewImportarCsvModal({
  aberto,
  dados,
  nomeArquivo,
  onFechar,
  onConfirmar,
}: PreviewImportarCsvModalProps) {
  const resumo = useMemo(
    () => (dados ? montarResumoImportacaoBackup(dados) : []),
    [dados],
  )
  const totalItens = dados ? contarRegistrosImportacao(dados) : 0
  const colunaEsquerda = resumo.slice(0, 4)
  const colunaDireita = resumo.slice(4, 8)

  useEffect(() => {
    if (!aberto) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [aberto, onFechar])

  if (!aberto || !dados) return null

  const renderLinha = (secao: (typeof resumo)[number]) => (
    <div key={secao.id} className="preview-importar-csv-modal__linha">
      <span className="preview-importar-csv-modal__linha-titulo">{secao.titulo}</span>
      <span className="preview-importar-csv-modal__linha-qtd">{secao.quantidade}</span>
    </div>
  )

  return (
    <div className="modern-overlay" role="presentation" onClick={onFechar}>
      <div
        className="modern-modal-shell preview-importar-csv-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-importar-csv-title"
        aria-describedby="preview-importar-csv-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modern-modal-header">
          <div className="modern-modal-header__main">
            <div>
              <h2
                id="preview-importar-csv-title"
                className="modern-modal-header__title"
              >
                Confirmar importação CSV
              </h2>
              <p className="preview-importar-csv-modal__arquivo">{nomeArquivo}</p>
            </div>
          </div>
        </header>

        <div className="modern-modal-body preview-importar-csv-modal__body">
          <p id="preview-importar-csv-desc" className="preview-importar-csv-modal__aviso">
            Os dados abaixo <strong>substituirão</strong> todos os registros atuais
            neste navegador. Confira o resumo antes de confirmar.
          </p>

          <p className="preview-importar-csv-modal__resumo-geral">
            {dados.exportadoEm && (
              <span className="preview-importar-csv-modal__data-export">
                Backup de {dados.exportadoEm}
                {' · '}
              </span>
            )}
            <span>{totalItens} itens no total</span>
          </p>

          <div className="preview-importar-csv-modal__colunas">
            <div className="preview-importar-csv-modal__coluna">
              {colunaEsquerda.map(renderLinha)}
            </div>
            <div className="preview-importar-csv-modal__coluna">
              {colunaDireita.map(renderLinha)}
            </div>
          </div>
        </div>

        <footer className="modern-modal-footer">
          <Button type="button" variant="secondary" onClick={onFechar}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={onConfirmar}>
            Carregar dados
          </Button>
        </footer>
      </div>
    </div>
  )
}

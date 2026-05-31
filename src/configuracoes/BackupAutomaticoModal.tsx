import { useEffect } from 'react'
import { Button } from '../components/Button'
import { obterDiaBackupAutomatico } from './backupAutomaticoStorage'
import './BackupAutomaticoModal.css'

interface BackupAutomaticoModalProps {
  onRealizarBackup: () => void
}

export function BackupAutomaticoModal({ onRealizarBackup }: BackupAutomaticoModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="backup-automatico-modal__overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="backup-automatico-title"
      aria-describedby="backup-automatico-desc"
    >
      <div className="modern-modal-shell backup-automatico-modal">
        <header className="modern-modal-header">
          <div className="modern-modal-header__main">
            <div>
              <h2
                id="backup-automatico-title"
                className="modern-modal-header__title"
              >
                Backup diário obrigatório
              </h2>
              <p className="backup-automatico-modal__data">{obterDiaBackupAutomatico()}</p>
            </div>
          </div>
        </header>

        <div className="modern-modal-body">
          <p id="backup-automatico-desc" className="backup-automatico-modal__texto">
            Uma vez por dia, o SISMAV exige que você salve uma cópia dos dados em
            CSV neste computador. O sistema permanece bloqueado até o backup ser
            concluído.
          </p>
          <ul className="backup-automatico-modal__lista">
            <li>Inclui serviços, viaturas, financeiro, fainas e anotações</li>
            <li>Salve o arquivo em local seguro (pendrive, nuvem ou pasta do setor)</li>
            <li>Amanhã será solicitado novamente ao abrir o sistema</li>
          </ul>
        </div>

        <footer className="modern-modal-footer">
          <Button type="button" variant="primary" onClick={onRealizarBackup}>
            Baixar backup CSV e continuar
          </Button>
        </footer>
      </div>
    </div>
  )
}

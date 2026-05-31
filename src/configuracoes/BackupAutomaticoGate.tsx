import { useCallback, useEffect, useState, type ReactNode } from 'react'
import './BackupAutomaticoGate.css'
import { BackupAutomaticoModal } from './BackupAutomaticoModal'
import {
  marcarBackupAutomaticoHoje,
  precisaBackupAutomaticoHoje,
} from './backupAutomaticoStorage'
import { exportarBackupSismavCsv } from './sismavBackupExport'

interface BackupAutomaticoGateProps {
  children: ReactNode
}

export function BackupAutomaticoGate({ children }: BackupAutomaticoGateProps) {
  const [bloqueado, setBloqueado] = useState(precisaBackupAutomaticoHoje)

  const atualizarBloqueio = useCallback(() => {
    setBloqueado(precisaBackupAutomaticoHoje())
  }, [])

  useEffect(() => {
    atualizarBloqueio()
    window.addEventListener('focus', atualizarBloqueio)
    document.addEventListener('visibilitychange', atualizarBloqueio)

    return () => {
      window.removeEventListener('focus', atualizarBloqueio)
      document.removeEventListener('visibilitychange', atualizarBloqueio)
    }
  }, [atualizarBloqueio])

  const realizarBackupDiario = () => {
    exportarBackupSismavCsv({ automatico: true })
    marcarBackupAutomaticoHoje()
    setBloqueado(false)
  }

  return (
    <>
      <div
        className={bloqueado ? 'backup-automatico-gate--bloqueado' : undefined}
        aria-hidden={bloqueado}
        inert={bloqueado ? true : undefined}
      >
        {children}
      </div>
      {bloqueado && <BackupAutomaticoModal onRealizarBackup={realizarBackupDiario} />}
    </>
  )
}

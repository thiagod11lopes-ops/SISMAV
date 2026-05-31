import { formatarData } from '../utils/formatoBr'

const STORAGE_KEY = 'sismav.backup-automatico-ultimo-dia'

export function obterDiaBackupAutomatico(): string {
  return formatarData(new Date())
}

export function backupAutomaticoFeitoHoje(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === obterDiaBackupAutomatico()
  } catch {
    return false
  }
}

export function marcarBackupAutomaticoHoje(): void {
  try {
    localStorage.setItem(STORAGE_KEY, obterDiaBackupAutomatico())
  } catch {
    /* ignore quota / private mode */
  }
}

export function precisaBackupAutomaticoHoje(): boolean {
  return !backupAutomaticoFeitoHoje()
}

export function lerBackupAutomaticoUltimoDiaParaBackup(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? ''
  } catch {
    return ''
  }
}

export function restaurarBackupAutomaticoUltimoDia(dia: string): void {
  const valor = dia.trim()
  try {
    if (!valor) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, valor)
  } catch {
    /* ignore quota / private mode */
  }
}

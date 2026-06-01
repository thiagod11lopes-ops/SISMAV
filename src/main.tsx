import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTheme } from './theme/initTheme'
import { BackupAutomaticoGate } from './configuracoes/BackupAutomaticoGate'
import { garantirFinanceiroDoBackup } from './tabs/financeiro/financeiroSeedMigration'
import { garantirViaturasIniciais } from './tabs/viaturas/viaturasSeedMigration'
import { ThemeProvider } from './theme/ThemeContext'
import './index.css'
import './styles/modern-ui.css'
import App from './App.tsx'

initTheme()
garantirFinanceiroDoBackup()
garantirViaturasIniciais()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BackupAutomaticoGate>
        <App />
      </BackupAutomaticoGate>
    </ThemeProvider>
  </StrictMode>,
)

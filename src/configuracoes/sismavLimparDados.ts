import { EVENTO_AVISO_FAINAS_DISPENSADO } from '../tabs/fainas/avisoFainasDismissStorage'
import { salvarFainas } from '../tabs/fainas/fainasStorage'
import { salvarContratos } from '../tabs/financeiro/contratoStorage'
import { salvarPagamentos } from '../tabs/financeiro/pagamentosStorage'
import { salvarSolemps } from '../tabs/financeiro/solempStorage'
import { limparBalancoPeriodo } from '../tabs/balanco/balancoPeriodoStorage'
import { persistirAnotacoes } from '../tabs/manutencao/anotacoesStorage'
import {
  EMPRESA_MANUTENCAO_PADRAO,
  restaurarEmpresaManutencao,
} from '../tabs/manutencao/empresaManutencaoStorage'
import { salvarControleCreditos } from '../tabs/manutencao/controleCreditosStorage'
import { salvarServicos } from '../tabs/manutencao/servicosStorage'
import { salvarViaturas } from '../tabs/viaturas/viaturasStorage'
import { restaurarBackupAutomaticoUltimoDia } from './backupAutomaticoStorage'

const CHAVE_AVISO_FAINAS_DISPENSADO = 'sismav.aviso-fainas-dispensado-dia'

/** Remove todos os registros do sistema neste navegador (mantém o tema atual). */
export function limparTodosDadosSismav(): void {
  salvarServicos([])
  salvarViaturas([])
  salvarContratos([])
  salvarSolemps([])
  salvarPagamentos([])
  salvarFainas([])
  persistirAnotacoes({})
  salvarControleCreditos({ pagamentos: [], compras: [] })
  restaurarEmpresaManutencao(EMPRESA_MANUTENCAO_PADRAO)
  restaurarBackupAutomaticoUltimoDia('')
  limparBalancoPeriodo()

  try {
    localStorage.removeItem(CHAVE_AVISO_FAINAS_DISPENSADO)
    window.dispatchEvent(new CustomEvent(EVENTO_AVISO_FAINAS_DISPENSADO))
  } catch {
    /* ignore */
  }
}

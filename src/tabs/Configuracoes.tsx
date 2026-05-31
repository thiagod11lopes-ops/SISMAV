import { useRef, useState } from 'react'
import { Button } from '../components/Button'
import { SectionCard } from '../components/SectionCard'
import { ExcluirTodosDadosModal } from '../configuracoes/ExcluirTodosDadosModal'
import type { SismavBackupPayload } from '../configuracoes/sismavBackupExport'
import { exportarBackupSismavCsv } from '../configuracoes/sismavBackupExport'
import {
  importarBackupCsvDados,
  lerBackupCsvDeArquivo,
} from '../configuracoes/sismavBackupImport'
import { PreviewImportarCsvModal } from '../configuracoes/PreviewImportarCsvModal'
import { limparTodosDadosSismav } from '../configuracoes/sismavLimparDados'
import { useTheme } from '../theme/ThemeContext'
import type { TemaId } from '../theme/themeStorage'
import './Configuracoes.css'

const OPCOES_TEMA: {
  id: TemaId
  titulo: string
  descricao: string
  icone: string
}[] = [
  {
    id: 'light',
    titulo: 'Tema claro',
    descricao: 'Fundo claro e textos escuros, ideal para ambientes bem iluminados.',
    icone: '☀',
  },
  {
    id: 'dark',
    titulo: 'Tema escuro',
    descricao:
      'Fundo escuro com textos claros e contraste reforçado para leitura confortável.',
    icone: '☾',
  },
]

export function Configuracoes() {
  const { tema, setTema } = useTheme()
  const inputCsvRef = useRef<HTMLInputElement>(null)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [modalImportarCsvAberto, setModalImportarCsvAberto] = useState(false)
  const [csvPendente, setCsvPendente] = useState<{
    dados: SismavBackupPayload
    nomeArquivo: string
  } | null>(null)

  const confirmarExclusaoTotal = () => {
    limparTodosDadosSismav()
    setModalExcluirAberto(false)
    window.alert('Todos os dados do sistema foram excluídos.')
  }

  const fecharModalImportarCsv = () => {
    setModalImportarCsvAberto(false)
    setCsvPendente(null)
  }

  const aoSelecionarCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0]
    event.target.value = ''
    if (!arquivo) return

    const resultado = await lerBackupCsvDeArquivo(arquivo)
    if (!resultado.sucesso) {
      window.alert(resultado.erro)
      return
    }

    setCsvPendente({
      dados: resultado.dados,
      nomeArquivo: resultado.nomeArquivo,
    })
    setModalImportarCsvAberto(true)
  }

  const confirmarImportarCsv = () => {
    if (!csvPendente) return
    importarBackupCsvDados(csvPendente.dados, { onTemaImportado: setTema })
    fecharModalImportarCsv()
    window.location.reload()
  }

  return (
    <div className="configuracoes">
      <SectionCard
        title="Configurações"
        description="Personalize a aparência do sistema."
      >
        <div className="configuracoes__secao">
          <h3 className="configuracoes__secao-titulo">Aparência</h3>
          <p className="configuracoes__secao-desc">
            Escolha o tema de exibição. A preferência é salva automaticamente neste
            navegador.
          </p>

          <div className="configuracoes__temas" role="radiogroup" aria-label="Tema do sistema">
            {OPCOES_TEMA.map((opcao) => {
              const selecionado = tema === opcao.id
              return (
                <button
                  key={opcao.id}
                  type="button"
                  role="radio"
                  aria-checked={selecionado}
                  className={`configuracoes__tema-card configuracoes__tema-card--${opcao.id}${
                    selecionado ? ' configuracoes__tema-card--ativo' : ''
                  }`}
                  onClick={() => setTema(opcao.id)}
                >
                  <span className="configuracoes__tema-icone" aria-hidden>
                    {opcao.icone}
                  </span>
                  <span className="configuracoes__tema-conteudo">
                    <strong className="configuracoes__tema-titulo">{opcao.titulo}</strong>
                    <span className="configuracoes__tema-desc">{opcao.descricao}</span>
                  </span>
                  {selecionado && (
                    <span className="configuracoes__tema-check" aria-hidden>
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="configuracoes__secao configuracoes__secao--backup">
          <h3 className="configuracoes__secao-titulo">Backup dos dados</h3>
          <p className="configuracoes__secao-desc">
            Exporte ou restaure todos os registros salvos neste navegador: manutenção
            (serviços, anotações, controle de créditos), viaturas, financeiro, fainas,
            balanço (período) e preferências. A importação substitui os dados atuais —
            use arquivos gerados por este sistema.
          </p>

          <div className="configuracoes__backup-grupo">
            <span className="configuracoes__backup-grupo-label">Exportar</span>
            <div className="configuracoes__backup-acoes">
              <Button variant="secondary" onClick={() => exportarBackupSismavCsv()}>
                Baixar backup (CSV)
              </Button>
            </div>
          </div>

          <div className="configuracoes__backup-grupo">
            <span className="configuracoes__backup-grupo-label">Importar</span>
            <div className="configuracoes__backup-acoes">
              <Button
                variant="secondary"
                onClick={() => inputCsvRef.current?.click()}
              >
                Carregar backup (CSV)
              </Button>
            </div>
            <input
              ref={inputCsvRef}
              type="file"
              accept=".csv,text/csv"
              className="configuracoes__backup-input"
              aria-hidden
              tabIndex={-1}
              onChange={aoSelecionarCsv}
            />
          </div>
        </div>

        <div className="configuracoes__secao configuracoes__secao--perigo">
          <h3 className="configuracoes__secao-titulo">Zona de perigo</h3>
          <p className="configuracoes__secao-desc">
            Apaga permanentemente todos os registros do sistema neste navegador.
            Faça um backup antes, se precisar recuperar os dados depois.
          </p>
          <Button variant="danger" onClick={() => setModalExcluirAberto(true)}>
            Excluir todos os dados
          </Button>
        </div>
      </SectionCard>

      <ExcluirTodosDadosModal
        aberto={modalExcluirAberto}
        onFechar={() => setModalExcluirAberto(false)}
        onConfirmar={confirmarExclusaoTotal}
      />

      <PreviewImportarCsvModal
        aberto={modalImportarCsvAberto}
        dados={csvPendente?.dados ?? null}
        nomeArquivo={csvPendente?.nomeArquivo ?? ''}
        onFechar={fecharModalImportarCsv}
        onConfirmar={confirmarImportarCsv}
      />
    </div>
  )
}

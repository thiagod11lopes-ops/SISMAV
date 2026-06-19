import { useEffect, useMemo, useRef, useState } from 'react'
import { extrairPlacaDoTexto, resolverViaturaDoPdf } from './manutencao/placaUtils'
import type { ViaturaLinha } from './viaturas/types'
import { useViaturas } from './viaturas/useViaturas'
import type { TipoViatura } from './viaturas/CadastrarViaturaCard'
import { Button } from '../components/Button'
import { DataInput } from '../components/inputs/DataInput'
import { MoedaInput } from '../components/inputs/MoedaInput'
import { SectionCard } from '../components/SectionCard'
import {
  formatarMoedaArmazenamento,
  normalizarDataBr,
} from '../utils/formatoBr'
import { SubTabs } from '../components/SubTabs'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { buscarServicos, filtrarServicos } from './manutencao/filterUtils'
import { AnotacoesModal } from './manutencao/AnotacoesModal'
import { ControleCreditosPanel } from './manutencao/ControleCreditosModal'
import { AprovarOrcamentoModal } from './manutencao/AprovarOrcamentoModal'
import { GerarPdfFaturamentoModal } from './manutencao/GerarPdfFaturamentoModal'
import {
  faturamentoFiltroEspecifico,
  gerarPdfAprovacaoOrcamentos,
  obterServicosParaAprovacaoPdf,
} from './manutencao/aprovacaoOrcamentoPdf'
import {
  montarOpcoesFaturamento,
  montarOpcoesFaturamentoSistema,
} from './manutencao/faturamentoOptions'
import {
  formularioVazio,
  montarRegistroServicoFromFormulario,
  servicoParaFormulario,
  valorFaturamentoFromInput,
  type DadosFormularioServico,
} from './manutencao/cadastroServicoForm'
import { AvisoFainasPendentesHoje } from './manutencao/AvisoFainasPendentesHoje'
import { ManutencaoFilters } from './manutencao/ManutencaoFilters'
import { FaturamentoResumoTotais } from './manutencao/FaturamentoResumoTotais'
import { useFainasPendentesHoje } from './manutencao/useFainasPendentesHoje'
import { ManutencaoStatusResumo } from './manutencao/ManutencaoStatusResumo'
import { ManutencaoToolbar } from './manutencao/ManutencaoToolbar'
import { filtrosEstaoVazios } from './manutencao/statusResumoUtils'
import { carregarServicos, salvarServicos } from './manutencao/servicosStorage'
import { ServicosTabelas } from './manutencao/ServicosTabelas'
import { ViaturasOficinaModal } from './manutencao/ViaturasOficinaModal'
import type { FaturamentoOption } from './manutencao/faturamentoOptions'
import type {
  ServicoRegistro,
  Singra2Status,
  StatusServico,
} from './manutencao/servicoTypes'
import { FILTROS_INICIAIS, type ManutencaoFiltros } from './manutencao/types'
import './Manutencao.css'

type ServicosSubTabId = 'servicos' | 'cadastro-servicos'

interface ServicosSubTabItem {
  id: ServicosSubTabId
  label: string
}

const SERVICOS_SUB_TABS: ServicosSubTabItem[] = [
  { id: 'servicos', label: 'Serviços' },
  { id: 'cadastro-servicos', label: 'Cadastro de Serviços' },
]

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PdfExtraido {
  os: string
  placa: string
  data: string
  valorTotal: string
  descricao: string
}

interface ImportFeedback {
  tipo: 'success' | 'warning' | 'error'
  mensagem: string
}

function extrairItensPorSecao(texto: string, inicio: string, fim: string): string[] {
  const startIndex = texto.search(new RegExp(inicio, 'i'))
  if (startIndex === -1) return []

  const secaoAposInicio = texto.slice(startIndex)
  const fimMatch = secaoAposInicio.match(new RegExp(fim, 'i'))
  if (!fimMatch || typeof fimMatch.index !== 'number') return []

  const endIndex = startIndex + fimMatch.index
  if (endIndex <= startIndex) return []

  const secao = texto.slice(startIndex, endIndex)
  const textoLimpo = secao.replace(/\s+/g, ' ').trim()
  const itens: string[] = []
  const itemRegex =
    /\d+,\d+\s+[A-Z0-9.-]+\s+(.+?)\s+\d{1,3}(?:\.\d{3})*,\d{2}\s+\d{1,3}(?:\.\d{3})*,\d{2}/gi

  let match: RegExpExecArray | null = itemRegex.exec(textoLimpo)
  while (match) {
    if (match[1]) {
      const nomeItem = match[1].replace(/\s+/g, ' ').trim()
      if (nomeItem) itens.push(nomeItem)
    }
    match = itemRegex.exec(textoLimpo)
  }

  return itens
}

function montarDescricao(pecas: string[], servicos: string[]): string {
  const secoes: string[] = []
  if (pecas.length > 0) {
    secoes.push(`Peças usadas:\n${pecas.map((item) => `- ${item}`).join('\n')}`)
  }
  if (servicos.length > 0) {
    secoes.push(`Serviços executados:\n${servicos.map((item) => `- ${item}`).join('\n')}`)
  }
  return secoes.join('\n\n')
}

function extrairDadosDoPdf(texto: string): PdfExtraido {
  const textoNormalizado = texto.replace(/\s+/g, ' ')
  const os =
    textoNormalizado.match(/OR[ÇC]AMENTO\s+OS\.?:?\s*(\d+)/i)?.[1] ??
    textoNormalizado.match(/SERVI[ÇC]O(?:\s+DIRETO)?\s+OS\.?:?\s*(\d+)/i)?.[1] ??
    textoNormalizado.match(/\bOS\.?:?\s*(\d+)\s+Data\b/i)?.[1] ??
    ''
  const placa = extrairPlacaDoTexto(texto)
  const dataBruta =
    textoNormalizado.match(/Data\s*\.?\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i)?.[1] ??
    textoNormalizado.match(/SERVI[ÇC]O\s+OS\.?:?\s*\d+\s+Data\s*\.?\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i)
      ?.at(1) ??
    textoNormalizado.match(/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/)?.[1] ??
    ''
  const data = dataBruta ? normalizarDataBr(dataBruta) : ''
  const valorTotalNumero =
    textoNormalizado.match(/VALOR\s+TOTAL\s+R\$\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})/i)?.[1] ??
    ''
  const valorTotal = valorTotalNumero
    ? formatarMoedaArmazenamento(valorTotalNumero)
    : ''

  const pecas = extrairItensPorSecao(
    textoNormalizado,
    'PE[ÇC]A\\s+Código\\s+Qtde',
    'PE[ÇC]AS\\s+R\\$',
  )
  const servicos = extrairItensPorSecao(
    textoNormalizado,
    'SERVI[ÇC]O\\s+Código\\s+Qtde',
    'SERVI[ÇC]OS\\s+R\\$',
  )

  return {
    os,
    placa,
    data,
    valorTotal,
    descricao: montarDescricao(pecas, servicos),
  }
}

function ServicosContent({
  opcoesFaturamento,
  viaturasCadastradas,
  exibirColunasDetalhadas,
  onAlternarColunasDetalhadas,
  onGerarPdfFaturamento,
  servicosFiltrados,
  filtrosAplicados,
  filtrosRascunho,
  setFiltrosRascunho,
  aplicarFiltro,
  limparFiltro,
  servicosGeral,
  buscaRascunho,
  setBuscaRascunho,
  aplicarBusca,
  handleEditarServico,
  handleExcluirServico,
  handleVerServico,
  onSingra2Change,
  onCheckboxChange,
  onStatusChange,
}: {
  opcoesFaturamento: FaturamentoOption[]
  viaturasCadastradas: ViaturaLinha[]
  exibirColunasDetalhadas: boolean
  onAlternarColunasDetalhadas: () => void
  onGerarPdfFaturamento: () => void
  servicosFiltrados: ServicoRegistro[]
  filtrosAplicados: ManutencaoFiltros
  filtrosRascunho: typeof FILTROS_INICIAIS
  setFiltrosRascunho: (filtros: typeof FILTROS_INICIAIS) => void
  aplicarFiltro: () => void
  limparFiltro: () => void
  servicosGeral: number
  buscaRascunho: string
  setBuscaRascunho: (busca: string) => void
  aplicarBusca: () => void
  handleEditarServico: (registro: ServicoRegistro) => void
  handleExcluirServico: (registro: ServicoRegistro) => void
  handleVerServico: (registro: ServicoRegistro) => void
  onSingra2Change: (id: string, valor: Singra2Status) => void
  onCheckboxChange: (
    id: string,
    campo: 'faturar' | 'preAprovado' | 'aprovado',
    valor: boolean,
  ) => void
  onStatusChange: (id: string, valor: StatusServico) => void
}) {
  return (
    <>
      <ManutencaoFilters
        opcoesFaturamento={opcoesFaturamento}
        viaturasCadastradas={viaturasCadastradas}
        filtros={filtrosRascunho}
        busca={buscaRascunho}
        onBuscaChange={setBuscaRascunho}
        onBuscar={aplicarBusca}
        onChange={setFiltrosRascunho}
        onAplicar={aplicarFiltro}
        onLimpar={limparFiltro}
        exibirColunasDetalhadas={exibirColunasDetalhadas}
        onAlternarColunasDetalhadas={onAlternarColunasDetalhadas}
        onGerarPdfFaturamento={onGerarPdfFaturamento}
        totalFiltrado={servicosFiltrados.length}
        totalGeral={servicosGeral}
      />

      <FaturamentoResumoTotais
        servicosFiltrados={servicosFiltrados}
        faturamentoAplicado={filtrosAplicados.tipoFaturamento}
        opcoesFaturamento={opcoesFaturamento}
      />

      <ServicosTabelas
        servicos={servicosFiltrados}
        exibirColunasDetalhadas={exibirColunasDetalhadas}
        onEditar={handleEditarServico}
        onExcluir={handleExcluirServico}
        onVer={handleVerServico}
        onSingra2Change={onSingra2Change}
        onCheckboxChange={onCheckboxChange}
        onStatusChange={onStatusChange}
      />
    </>
  )
}

function aplicarFormularioServico(
  form: DadosFormularioServico,
  setters: {
    setFaturamento: (v: string) => void
    setOrdemServico: (v: string) => void
    setTipoSelecionado: (v: TipoViatura | '') => void
    setViaturaSelecionada: (v: string) => void
    setModelo: (v: string) => void
    setDataIda: (v: string) => void
    setDataVolta: (v: string) => void
    setNfPeca: (v: string) => void
    setNfServico: (v: string) => void
    setValor: (v: string) => void
    setDescricaoServico: (v: string) => void
  },
) {
  setters.setFaturamento(form.faturamento)
  setters.setOrdemServico(form.os)
  setters.setTipoSelecionado(form.categoria)
  setters.setViaturaSelecionada(form.viatura)
  setters.setModelo(form.modelo)
  setters.setDataIda(form.dataSaida)
  setters.setDataVolta(form.dataRetorno)
  setters.setNfPeca(form.nfPeca)
  setters.setNfServico(form.nfServico)
  setters.setValor(form.valor)
  setters.setDescricaoServico(form.descricao)
}

function CadastroServicosContent({
  viaturasCadastradas,
  opcoesFaturamento,
  servicoEmEdicao,
  onSalvar,
  onCancelarEdicao,
}: {
  viaturasCadastradas: ViaturaLinha[]
  opcoesFaturamento: FaturamentoOption[]
  servicoEmEdicao: ServicoRegistro | null
  onSalvar: (registro: ServicoRegistro) => void
  onCancelarEdicao: () => void
}) {
  const [faturamentosExtras, setFaturamentosExtras] = useState<FaturamentoOption[]>(
    [],
  )
  const [faturamentoSelecionado, setFaturamentoSelecionado] = useState('')
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoViatura | ''>('')
  const [ordemServico, setOrdemServico] = useState('')
  const [viaturaSelecionada, setViaturaSelecionada] = useState('')
  const [modelo, setModelo] = useState('')
  const [dataIda, setDataIda] = useState('')
  const [dataVolta, setDataVolta] = useState('')
  const [nfPeca, setNfPeca] = useState('')
  const [nfServico, setNfServico] = useState('')
  const [valor, setValor] = useState('')
  const [descricaoServico, setDescricaoServico] = useState('')
  const [novoFaturamento, setNovoFaturamento] = useState('')
  const [isModalFaturamentoOpen, setIsModalFaturamentoOpen] = useState(false)
  const [importFeedback, setImportFeedback] = useState<ImportFeedback | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const opcoesFaturamentoForm = useMemo(() => {
    const mapa = new Map<string, FaturamentoOption>()
    for (const opcao of opcoesFaturamento) {
      if (opcao.value !== 'todos') mapa.set(opcao.value, opcao)
    }
    for (const opcao of faturamentosExtras) {
      mapa.set(opcao.value, opcao)
    }
    return [...mapa.values()].sort((a, b) => {
      const numA = Number(a.value)
      const numB = Number(b.value)
      if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB
      return a.label.localeCompare(b.label, 'pt-BR')
    })
  }, [opcoesFaturamento, faturamentosExtras])

  const limparFormulario = () => {
    aplicarFormularioServico(formularioVazio(), {
      setFaturamento: setFaturamentoSelecionado,
      setOrdemServico,
      setTipoSelecionado,
      setViaturaSelecionada,
      setModelo,
      setDataIda,
      setDataVolta,
      setNfPeca,
      setNfServico,
      setValor,
      setDescricaoServico,
    })
    setTipoSelecionado('')
  }

  useEffect(() => {
    if (servicoEmEdicao) {
      aplicarFormularioServico(servicoParaFormulario(servicoEmEdicao), {
        setFaturamento: setFaturamentoSelecionado,
        setOrdemServico,
        setTipoSelecionado,
        setViaturaSelecionada,
        setModelo,
        setDataIda,
        setDataVolta,
        setNfPeca,
        setNfServico,
        setValor,
        setDescricaoServico,
      })
      return
    }
    limparFormulario()
  }, [servicoEmEdicao])

  useEffect(() => {
    if (!viaturaSelecionada) return
    const viatura = viaturasCadastradas.find((v) => v.placa === viaturaSelecionada)
    if (viatura) setModelo(viatura.modelo)
  }, [viaturaSelecionada, viaturasCadastradas])

  const viaturasFiltradas = useMemo(() => {
    if (!tipoSelecionado) return []
    return viaturasCadastradas.filter((v) => v.tipo === tipoSelecionado)
  }, [tipoSelecionado, viaturasCadastradas])

  const adicionarFaturamento = () => {
    const { value, label } = valorFaturamentoFromInput(novoFaturamento)
    if (!value) return

    const jaExiste = opcoesFaturamentoForm.some((item) => item.value === value)
    if (jaExiste) return

    setFaturamentosExtras((prev) => [...prev, { value, label }])
    setFaturamentoSelecionado(value)
    setNovoFaturamento('')
  }

  const removerFaturamentoExtra = (value: string) => {
    setFaturamentosExtras((prev) => prev.filter((item) => item.value !== value))
    if (faturamentoSelecionado === value) {
      setFaturamentoSelecionado('')
    }
  }

  const handleSalvar = () => {
    const registro = montarRegistroServicoFromFormulario(
      {
        faturamento: faturamentoSelecionado,
        os: ordemServico,
        categoria: tipoSelecionado || 'administrativo',
        viatura: viaturaSelecionada,
        modelo,
        dataSaida: dataIda,
        dataRetorno: dataVolta,
        nfPeca,
        nfServico,
        valor,
        descricao: descricaoServico,
      },
      servicoEmEdicao,
    )

    onSalvar(registro)
    limparFormulario()
  }

  const importarDadosPdf = async (arquivo: File) => {
    const buffer = await arquivo.arrayBuffer()
    const pdf = await getDocument({ data: buffer }).promise
    const conteudos: string[] = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const textoPagina = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
      conteudos.push(textoPagina)
    }

    const texto = conteudos.join('\n')
    const dados = extrairDadosDoPdf(texto)
    const camposFaltantes: string[] = []

    if (dados.os) setOrdemServico(dados.os)
    else camposFaltantes.push('Ordem de Serviço')

    if (dados.data) setDataIda(dados.data)
    else camposFaltantes.push('Data de Ida')

    if (dados.valorTotal) setValor(dados.valorTotal)
    else camposFaltantes.push('Valor')

    if (dados.descricao) setDescricaoServico(dados.descricao)
    else camposFaltantes.push('Descrição do Serviço')

    let avisoPlaca: string | null = null
    const resultadoPlaca = resolverViaturaDoPdf(
      texto,
      arquivo.name,
      viaturasCadastradas,
    )

    if (resultadoPlaca) {
      setTipoSelecionado(resultadoPlaca.viatura.tipo)
      setViaturaSelecionada(resultadoPlaca.viatura.placa)

      if (!resultadoPlaca.exata) {
        avisoPlaca = `Placa do PDF (${resultadoPlaca.placaExtraida}) associada à viatura cadastrada ${resultadoPlaca.viatura.placa}.`
      }
    } else {
      camposFaltantes.push('Viatura')
    }

    if (camposFaltantes.length === 0 && !avisoPlaca) {
      setImportFeedback({
        tipo: 'success',
        mensagem: 'PDF importado com sucesso. Todos os campos obrigatorios foram preenchidos.',
      })
    } else if (camposFaltantes.length === 0 && avisoPlaca) {
      setImportFeedback({
        tipo: 'warning',
        mensagem: `PDF importado com sucesso. ${avisoPlaca}`,
      })
    } else {
      const partes = [...camposFaltantes]
      if (avisoPlaca) partes.push(avisoPlaca)
      setImportFeedback({
        tipo: 'warning',
        mensagem: `PDF importado parcialmente. ${partes.join(' ')}`,
      })
    }
  }

  return (
    <div className="cadastro-servicos">
      <div className="cadastro-servicos__header">
        <h3 className="cadastro-servicos__title">
          {servicoEmEdicao ? 'Editar Serviço' : 'Cadastro de Serviços'}
        </h3>
      </div>

      <div className="cadastro-servicos__grid">
        <label
          className="cadastro-servicos__field cadastro-servicos__field--faturamento"
          htmlFor="faturamento-select"
        >
          <span className="cadastro-servicos__label">Faturamento</span>
          <div className="cadastro-servicos__faturamento-row">
            <select
              id="faturamento-select"
              value={faturamentoSelecionado}
              onChange={(e) => setFaturamentoSelecionado(e.target.value)}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {opcoesFaturamentoForm.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="cadastro-servicos__add-btn"
              onClick={() => setIsModalFaturamentoOpen(true)}
              aria-label="Gerenciar opções de faturamento"
            >
              +
            </button>
          </div>
        </label>

        <label className="cadastro-servicos__field" htmlFor="ordem-servico-input">
          <span className="cadastro-servicos__label">Ordem de Serviço</span>
          <input
            id="ordem-servico-input"
            type="text"
            placeholder="Digite a ordem de serviço"
            value={ordemServico}
            onChange={(e) => setOrdemServico(e.target.value)}
          />
        </label>

        <label className="cadastro-servicos__field" htmlFor="tipo-select">
          <span className="cadastro-servicos__label">Tipo</span>
          <select
            id="tipo-select"
            value={tipoSelecionado}
            onChange={(e) => {
              setTipoSelecionado(e.target.value as TipoViatura | '')
              setViaturaSelecionada('')
            }}
          >
            <option value="" disabled>
              Selecione...
            </option>
            <option value="ambulancia">Ambulância</option>
            <option value="administrativo">Administrativa</option>
          </select>
        </label>

        <label className="cadastro-servicos__field" htmlFor="viatura-select">
          <span className="cadastro-servicos__label">Viatura</span>
          <select
            id="viatura-select"
            value={viaturaSelecionada}
            onChange={(e) => setViaturaSelecionada(e.target.value)}
            disabled={!tipoSelecionado}
          >
            <option value="" disabled>
              {tipoSelecionado
                ? 'Selecione a viatura...'
                : 'Selecione o tipo primeiro...'}
            </option>
            {viaturasFiltradas.map((v) => (
              <option key={v.id} value={v.placa}>
                {v.placa} — {v.modelo}
              </option>
            ))}
          </select>
        </label>

        <label className="cadastro-servicos__field" htmlFor="data-ida-input">
          <span className="cadastro-servicos__label">Data de Ida</span>
          <DataInput
            id="data-ida-input"
            value={dataIda}
            onValueChange={setDataIda}
          />
        </label>

        <label className="cadastro-servicos__field" htmlFor="data-volta-input">
          <span className="cadastro-servicos__label">Data de Volta</span>
          <DataInput
            id="data-volta-input"
            value={dataVolta}
            onValueChange={setDataVolta}
          />
        </label>

        <label className="cadastro-servicos__field" htmlFor="nota-fiscal-peca-input">
          <span className="cadastro-servicos__label">Nota Fiscal de Peça</span>
          <input
            id="nota-fiscal-peca-input"
            type="text"
            placeholder="Digite a NF de peça"
            value={nfPeca}
            onChange={(e) => setNfPeca(e.target.value)}
          />
        </label>

        <label className="cadastro-servicos__field" htmlFor="nota-fiscal-servico-input">
          <span className="cadastro-servicos__label">Nota Fiscal de Serviço</span>
          <input
            id="nota-fiscal-servico-input"
            type="text"
            placeholder="Digite a NF de serviço"
            value={nfServico}
            onChange={(e) => setNfServico(e.target.value)}
          />
        </label>

        <label className="cadastro-servicos__field" htmlFor="valor-input">
          <span className="cadastro-servicos__label">Valor</span>
          <MoedaInput
            id="valor-input"
            value={valor}
            onValueChange={setValor}
          />
        </label>

        <label
          className="cadastro-servicos__field cadastro-servicos__field--descricao"
          htmlFor="descricao-servico-input"
        >
          <span className="cadastro-servicos__label">Descrição do Serviço</span>
          <textarea
            id="descricao-servico-input"
            rows={5}
            placeholder="Descreva detalhadamente o serviço executado"
            value={descricaoServico}
            onChange={(e) => setDescricaoServico(e.target.value)}
          />
        </label>
      </div>

      <div className="cadastro-servicos__actions">
        <Button onClick={handleSalvar}>
          {servicoEmEdicao ? 'Salvar alterações' : 'Cadastrar Serviço'}
        </Button>
        {servicoEmEdicao && (
          <Button variant="secondary" onClick={onCancelarEdicao}>
            Cancelar edição
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Adicionar dados de PDF
        </Button>
        <input
          ref={fileInputRef}
          className="cadastro-servicos__file-input"
          type="file"
          accept="application/pdf"
          onChange={async (e) => {
            const arquivo = e.target.files?.[0]
            if (!arquivo) return

            try {
              setImportFeedback(null)
              await importarDadosPdf(arquivo)
            } catch {
              setImportFeedback({
                tipo: 'error',
                mensagem:
                  'Nao foi possivel ler o PDF informado. Verifique o arquivo e tente novamente.',
              })
            } finally {
              e.target.value = ''
            }
          }}
        />
      </div>

      {importFeedback && (
        <div
          className={`cadastro-servicos__feedback cadastro-servicos__feedback--${importFeedback.tipo}`}
          role="status"
        >
          {importFeedback.mensagem}
        </div>
      )}

      {isModalFaturamentoOpen && (
        <div className="cadastro-servicos-modal__overlay" role="presentation">
          <div
            className="cadastro-servicos-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Gerenciar faturamentos"
          >
            <div className="cadastro-servicos-modal__header">
              <h4 className="cadastro-servicos-modal__title">Gerenciar faturamentos</h4>
              <button
                type="button"
                className="cadastro-servicos-modal__close"
                onClick={() => setIsModalFaturamentoOpen(false)}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <div className="cadastro-servicos-modal__add-row">
              <input
                type="text"
                value={novoFaturamento}
                onChange={(e) => setNovoFaturamento(e.target.value)}
                placeholder="Novo faturamento"
              />
              <Button onClick={adicionarFaturamento}>Adicionar</Button>
            </div>

            <ul className="cadastro-servicos-modal__list">
              {opcoesFaturamentoForm.map((item) => {
                const ehExtra = faturamentosExtras.some(
                  (extra) => extra.value === item.value,
                )
                return (
                  <li key={item.value} className="cadastro-servicos-modal__item">
                    <span>{item.label}</span>
                    {ehExtra && (
                      <Button
                        variant="ghost"
                        onClick={() => removerFaturamentoExtra(item.value)}
                      >
                        Remover
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export function Manutencao() {
  const [filtrosRascunho, setFiltrosRascunho] = useState(FILTROS_INICIAIS)
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIAIS)
  const [buscaRascunho, setBuscaRascunho] = useState('')
  const [buscaAplicada, setBuscaAplicada] = useState('')
  const [activeSubTab, setActiveSubTab] =
    useState<ServicosSubTabId>('servicos')
  const [modalOficinaAberto, setModalOficinaAberto] = useState(false)
  const [modalAprovarOrcamentoAberto, setModalAprovarOrcamentoAberto] =
    useState(false)
  const [modalGerarPdfFaturamentoAberto, setModalGerarPdfFaturamentoAberto] =
    useState(false)
  const [modalAnotacoesAberto, setModalAnotacoesAberto] = useState(false)
  const [controleCreditosAberto, setControleCreditosAberto] = useState(false)
  const [servicosAprovacaoPdf, setServicosAprovacaoPdf] = useState<
    ServicoRegistro[]
  >([])
  const [servicos, setServicos] = useState<ServicoRegistro[]>(() => carregarServicos())
  const [servicoEmEdicao, setServicoEmEdicao] = useState<ServicoRegistro | null>(
    null,
  )
  const [exibirColunasDetalhadas, setExibirColunasDetalhadas] = useState(false)
  const viaturasCadastradas = useViaturas()
  const { fainas: fainasPendentesHoje, dispensarAviso: dispensarAvisoFainas } =
    useFainasPendentesHoje()

  useEffect(() => {
    salvarServicos(servicos)
  }, [servicos])

  const servicosFiltrados = useMemo(() => {
    const porFiltros = filtrarServicos(servicos, filtrosAplicados)
    return buscarServicos(porFiltros, buscaAplicada)
  }, [servicos, filtrosAplicados, buscaAplicada])

  const escopoResumoGeral = useMemo(
    () => filtrosEstaoVazios(filtrosAplicados, buscaAplicada),
    [filtrosAplicados, buscaAplicada],
  )

  const servicosParaResumo = useMemo(
    () => (escopoResumoGeral ? servicos : servicosFiltrados),
    [escopoResumoGeral, servicos, servicosFiltrados],
  )

  const opcoesFaturamento = useMemo(
    () => montarOpcoesFaturamento(servicos),
    [servicos],
  )

  const aprovarOrcamentoHabilitado =
    activeSubTab === 'servicos' &&
    faturamentoFiltroEspecifico(filtrosAplicados.tipoFaturamento)

  const tituloAprovarOrcamento = aprovarOrcamentoHabilitado
    ? 'Gerar PDF de aprovação de orçamentos'
    : 'Selecione e aplique um faturamento específico no filtro'

  const faturamentoAplicadoLabel = useMemo(() => {
    const valor = filtrosAplicados.tipoFaturamento
    return (
      opcoesFaturamento.find((opcao) => opcao.value === valor)?.label ?? valor
    )
  }, [filtrosAplicados.tipoFaturamento, opcoesFaturamento])

  const aplicarFiltro = () => setFiltrosAplicados({ ...filtrosRascunho })

  const limparFiltro = () => {
    setFiltrosRascunho(FILTROS_INICIAIS)
    setFiltrosAplicados(FILTROS_INICIAIS)
    setBuscaRascunho('')
    setBuscaAplicada('')
  }

  const aplicarBusca = () => setBuscaAplicada(buscaRascunho)

  const opcoesFaturamentoCadastro = useMemo(
    () => montarOpcoesFaturamentoSistema(servicos),
    [servicos],
  )

  const handleEditarServico = (registro: ServicoRegistro) => {
    setServicoEmEdicao(registro)
    setActiveSubTab('cadastro-servicos')
  }

  const handleExcluirServico = (registro: ServicoRegistro) => {
    const confirmar = window.confirm(
      `Excluir o serviço OS ${registro.os} (${registro.viatura})?`,
    )
    if (!confirmar) return

    setServicos((prev) => prev.filter((s) => s.id !== registro.id))
    if (servicoEmEdicao?.id === registro.id) {
      setServicoEmEdicao(null)
    }
  }

  const handleVerServico = (registro: ServicoRegistro) => {
    alert(`Visualizar — OS ${registro.os} (${registro.viatura})`)
  }

  const handleSalvarServico = (registro: ServicoRegistro) => {
    setServicos((prev) => {
      const indice = prev.findIndex((s) => s.id === registro.id)
      if (indice >= 0) {
        const proximo = [...prev]
        proximo[indice] = registro
        return proximo
      }
      return [...prev, registro]
    })
    setServicoEmEdicao(null)
  }

  const handleCancelarEdicaoServico = () => {
    setServicoEmEdicao(null)
  }

  const handleSingra2Change = (id: string, valor: Singra2Status) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, singra2: valor } : s)),
    )
  }

  const handleCheckboxChange = (
    id: string,
    campo: 'faturar' | 'preAprovado' | 'aprovado',
    valor: boolean,
  ) => {
    const scrollJanela = window.scrollY
    const scrollTabelas = Array.from(
      document.querySelectorAll<HTMLElement>('.servicos-table__scroll'),
    ).map((elemento) => ({
      elemento,
      topo: elemento.scrollTop,
    }))

    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [campo]: valor } : s)),
    )

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollJanela)
      scrollTabelas.forEach(({ elemento, topo }) => {
        elemento.scrollTop = topo
      })
    })
  }

  const handleStatusChange = (id: string, valor: StatusServico) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: valor } : s)),
    )
  }

  const handleAprovarOrcamento = () => {
    const faturamento = filtrosAplicados.tipoFaturamento
    if (!faturamentoFiltroEspecifico(faturamento)) return

    const selecionados = obterServicosParaAprovacaoPdf(servicos, faturamento)
    if (selecionados.length === 0) {
      alert(
        'Nenhum serviço selecionado para aprovação neste faturamento. Marque as colunas Pré aprovado ou Aprovado.',
      )
      return
    }

    setServicosAprovacaoPdf(selecionados)
    setModalAprovarOrcamentoAberto(true)
  }

  const handleConfirmarAprovacaoPdf = (nomeEmpresa: string) => {
    try {
      gerarPdfAprovacaoOrcamentos(servicosAprovacaoPdf, nomeEmpresa)
      setModalAprovarOrcamentoAberto(false)
      setServicosAprovacaoPdf([])
    } catch (erro) {
      console.error(erro)
      alert('Não foi possível gerar o PDF. Tente novamente.')
    }
  }

  const handleFecharModalAprovacao = () => {
    setModalAprovarOrcamentoAberto(false)
    setServicosAprovacaoPdf([])
  }

  return (
    <SectionCard
      fullWidth
      hideHeader
      title="Manutenção de Viaturas"
      description="Registro e acompanhamento de ordens de serviço e manutenções."
    >
      <AvisoFainasPendentesHoje
        fainas={fainasPendentesHoje}
        onDispensar={dispensarAvisoFainas}
      />

      <div className="manutencao-top">
        <SubTabs
          tabs={SERVICOS_SUB_TABS}
          activeTab={activeSubTab}
          onTabChange={setActiveSubTab}
          ariaLabel="Subabas de manutenção"
          panelIdPrefix="manutencao"
        />
        <ManutencaoStatusResumo
          servicos={servicosParaResumo}
          escopoGeral={escopoResumoGeral}
          totalServicos={servicosParaResumo.length}
        />
        <div className="manutencao-top__actions">
          <ManutencaoToolbar
            onViaturasOficina={() => setModalOficinaAberto(true)}
            onRelatorios={() => alert('Relatórios')}
            onAprovarOrcamento={handleAprovarOrcamento}
            onAnotacoes={() => setModalAnotacoesAberto(true)}
            onControleCreditos={() =>
              setControleCreditosAberto((aberto) => !aberto)
            }
            controleCreditosAtivo={controleCreditosAberto}
            aprovarOrcamentoDesabilitado={!aprovarOrcamentoHabilitado}
            tituloAprovarOrcamento={tituloAprovarOrcamento}
          />
        </div>
      </div>

      <ControleCreditosPanel
        aberto={controleCreditosAberto}
        opcoesFaturamento={opcoesFaturamento}
        onFechar={() => setControleCreditosAberto(false)}
      />

      <div
        className="sub-tabs-panel"
        role="tabpanel"
        id={`manutencao-panel-${activeSubTab}`}
        aria-labelledby={`manutencao-tab-${activeSubTab}`}
      >
        {activeSubTab === 'servicos' ? (
          <ServicosContent
            opcoesFaturamento={opcoesFaturamento}
            viaturasCadastradas={viaturasCadastradas}
            exibirColunasDetalhadas={exibirColunasDetalhadas}
            onAlternarColunasDetalhadas={() =>
              setExibirColunasDetalhadas((prev) => !prev)
            }
            onGerarPdfFaturamento={() => setModalGerarPdfFaturamentoAberto(true)}
            servicosFiltrados={servicosFiltrados}
            filtrosAplicados={filtrosAplicados}
            filtrosRascunho={filtrosRascunho}
            setFiltrosRascunho={setFiltrosRascunho}
            aplicarFiltro={aplicarFiltro}
            limparFiltro={limparFiltro}
            servicosGeral={servicos.length}
            buscaRascunho={buscaRascunho}
            setBuscaRascunho={setBuscaRascunho}
            aplicarBusca={aplicarBusca}
            handleEditarServico={handleEditarServico}
            handleExcluirServico={handleExcluirServico}
            handleVerServico={handleVerServico}
            onSingra2Change={handleSingra2Change}
            onCheckboxChange={handleCheckboxChange}
            onStatusChange={handleStatusChange}
          />
        ) : activeSubTab === 'cadastro-servicos' ? (
          <CadastroServicosContent
            viaturasCadastradas={viaturasCadastradas}
            opcoesFaturamento={opcoesFaturamentoCadastro}
            servicoEmEdicao={servicoEmEdicao}
            onSalvar={handleSalvarServico}
            onCancelarEdicao={handleCancelarEdicaoServico}
          />
        ) : null}
      </div>

      <ViaturasOficinaModal
        aberto={modalOficinaAberto}
        servicos={servicos}
        onFechar={() => setModalOficinaAberto(false)}
      />

      <AprovarOrcamentoModal
        aberto={modalAprovarOrcamentoAberto}
        servicos={servicosAprovacaoPdf}
        faturamentoLabel={faturamentoAplicadoLabel}
        onConfirmar={handleConfirmarAprovacaoPdf}
        onFechar={handleFecharModalAprovacao}
      />

      <GerarPdfFaturamentoModal
        aberto={modalGerarPdfFaturamentoAberto}
        servicos={servicos}
        opcoesFaturamento={opcoesFaturamento}
        onFechar={() => setModalGerarPdfFaturamentoAberto(false)}
      />

      <AnotacoesModal
        aberto={modalAnotacoesAberto}
        onFechar={() => setModalAnotacoesAberto(false)}
      />

    </SectionCard>
  )
}

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatarValor, parseDataBr } from './filterUtils'
import { montarTextoDeclaracaoAprovacao } from './empresaManutencaoStorage'
import type { ServicoRegistro } from './servicoTypes'

type CelulaAutoTable = {
  x?: number
  width?: number
  styles?: {
    cellPadding?: number | { right?: number; left?: number; top?: number; bottom?: number }
  }
}

type JsPdfComTabela = jsPDF & {
  lastAutoTable?: {
    finalY: number
    columns?: { width: number }[]
    head?: { cells: Record<number, CelulaAutoTable> }[]
    body?: { cells: Record<number, CelulaAutoTable> }[]
    settings: {
      margin?: { left?: number }
      tableWidth?: number
    }
  }
}

const PAGE = { w: 210, h: 297 } as const
const MARGIN = 16

const CORES = {
  slate900: [15, 23, 42] as [number, number, number],
  slate800: [30, 41, 59] as [number, number, number],
  slate600: [71, 85, 105] as [number, number, number],
  slate500: [100, 116, 139] as [number, number, number],
  slate100: [241, 245, 249] as [number, number, number],
  slate50: [248, 250, 252] as [number, number, number],
  blue600: [37, 99, 235] as [number, number, number],
  blue500: [59, 130, 246] as [number, number, number],
  blue100: [219, 234, 254] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  emerald600: [5, 150, 105] as [number, number, number],
} as const

export function faturamentoFiltroEspecifico(tipoFaturamento: string): boolean {
  return tipoFaturamento !== 'todos'
}

export function servicoSelecionadoParaAprovacao(registro: ServicoRegistro): boolean {
  return registro.preAprovado || registro.aprovado
}

export function obterServicosParaAprovacaoPdf(
  servicos: ServicoRegistro[],
  faturamento: string,
): ServicoRegistro[] {
  return servicos
    .filter(
      (s) => s.faturamento === faturamento && servicoSelecionadoParaAprovacao(s),
    )
    .sort((a, b) => {
      const dataA = parseDataBr(a.dataSaida)?.getTime() ?? 0
      const dataB = parseDataBr(b.dataSaida)?.getTime() ?? 0
      if (dataA !== dataB) return dataA - dataB
      return a.os.localeCompare(b.os, 'pt-BR', { numeric: true })
    })
}

function formatarDataHoje(): string {
  const hoje = new Date()
  const dd = String(hoje.getDate()).padStart(2, '0')
  const mm = String(hoje.getMonth() + 1).padStart(2, '0')
  const yyyy = hoje.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function nomeArquivoPdf(data: string): string {
  return `Aprovacao_Orcamentos_${data.replace(/\//g, '-')}.pdf`
}

function setFill(doc: jsPDF, cor: [number, number, number]) {
  doc.setFillColor(cor[0], cor[1], cor[2])
}

function setDraw(doc: jsPDF, cor: [number, number, number]) {
  doc.setDrawColor(cor[0], cor[1], cor[2])
}

function setText(doc: jsPDF, cor: [number, number, number]) {
  doc.setTextColor(cor[0], cor[1], cor[2])
}

function desenharFaixaCabecalho(doc: jsPDF) {
  setFill(doc, CORES.slate900)
  doc.rect(0, 0, PAGE.w, 46, 'F')

  setFill(doc, CORES.blue600)
  doc.rect(0, 46, PAGE.w, 1.5, 'F')

  setFill(doc, CORES.blue500)
  doc.rect(MARGIN, 12, 3.5, 22, 'F')

  setText(doc, CORES.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.text('APROVAÇÃO DE ORÇAMENTOS', MARGIN + 7, 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  setText(doc, CORES.blue100)
  doc.text('SISMAV — Sistema de Manutenção de Viaturas', MARGIN + 7, 29.5)

  doc.setFontSize(7.5)
  setText(doc, CORES.slate500)
  doc.text('Documento oficial de autorização de execução e faturamento', MARGIN + 7, 35)
}

function desenharChip(
  doc: jsPDF,
  x: number,
  y: number,
  largura: number,
  altura: number,
  rotulo: string,
  valor: string,
  destaque = false,
) {
  setFill(doc, destaque ? CORES.blue100 : CORES.slate50)
  setDraw(doc, destaque ? CORES.blue600 : CORES.slate100)
  doc.setLineWidth(0.25)
  doc.roundedRect(x, y, largura, altura, 2, 2, 'FD')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  setText(doc, CORES.slate500)
  doc.text(rotulo.toUpperCase(), x + 4, y + 5.5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(destaque ? 9.5 : 9)
  setText(doc, destaque ? CORES.slate900 : CORES.slate800)
  const linhas = doc.splitTextToSize(valor, largura - 8)
  doc.text(linhas, x + 4, y + 11.5)
}

function desenharMetaInformacoes(
  doc: jsPDF,
  dataDocumento: string,
  nomeEmpresa: string,
  quantidade: number,
): number {
  const y = 54
  const chipAltura = 18
  const chipLargura = (PAGE.w - MARGIN * 2 - 8) / 3

  desenharChip(doc, MARGIN, y, chipLargura, chipAltura, 'Data do documento', dataDocumento)
  desenharChip(
    doc,
    MARGIN + chipLargura + 4,
    y,
    chipLargura,
    chipAltura,
    'Empresa de manutenção',
    nomeEmpresa,
    true,
  )
  desenharChip(
    doc,
    MARGIN + (chipLargura + 4) * 2,
    y,
    chipLargura,
    chipAltura,
    'Ordens de serviço',
    `${quantidade} registro${quantidade === 1 ? '' : 's'}`,
  )

  return y + chipAltura + 8
}

function desenharCaixaDeclaracao(doc: jsPDF, y: number, texto: string): number {
  const largura = PAGE.w - MARGIN * 2
  const padding = 5
  const linhas = doc.splitTextToSize(texto, largura - padding * 2 - 4)
  const altura = linhas.length * 4.8 + padding * 2 + 4

  setFill(doc, CORES.slate50)
  setDraw(doc, CORES.slate100)
  doc.setLineWidth(0.3)
  doc.roundedRect(MARGIN, y, largura, altura, 2.5, 2.5, 'FD')

  setFill(doc, CORES.blue600)
  doc.roundedRect(MARGIN, y, 3, altura, 2.5, 0, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setText(doc, CORES.slate800)
  doc.text('DECLARAÇÃO', MARGIN + padding + 3, y + 7)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  setText(doc, CORES.slate600)
  doc.text(linhas, MARGIN + padding + 3, y + 13)

  return y + altura + 10
}

function desenharTituloSecao(doc: jsPDF, y: number, titulo: string): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setText(doc, CORES.slate900)
  doc.text(titulo, MARGIN, y)

  setDraw(doc, CORES.blue600)
  doc.setLineWidth(0.8)
  doc.line(MARGIN, y + 2, MARGIN + 28, y + 2)

  return y + 8
}

function desenharCabecalhoPaginaContinuacao(doc: jsPDF, nomeEmpresa: string) {
  setFill(doc, CORES.slate900)
  doc.rect(0, 0, PAGE.w, 14, 'F')

  setFill(doc, CORES.blue600)
  doc.rect(0, 14, PAGE.w, 0.8, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  setText(doc, CORES.white)
  doc.text('APROVAÇÃO DE ORÇAMENTOS', MARGIN, 9)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setText(doc, CORES.blue100)
  const empresaResumida =
    nomeEmpresa.length > 42 ? `${nomeEmpresa.slice(0, 39)}…` : nomeEmpresa
  doc.text(empresaResumida, PAGE.w - MARGIN, 9, { align: 'right' })
}

function desenharRodapePaginas(doc: jsPDF, dataDocumento: string) {
  const totalPaginas = doc.getNumberOfPages()

  for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
    doc.setPage(pagina)

    const yLinha = PAGE.h - 14
    setDraw(doc, CORES.slate100)
    doc.setLineWidth(0.35)
    doc.line(MARGIN, yLinha, PAGE.w - MARGIN, yLinha)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setText(doc, CORES.slate500)
    doc.text('Gerado pelo SISMAV 2.0', MARGIN, PAGE.h - 9)
    doc.text(`Emitido em ${dataDocumento}`, MARGIN, PAGE.h - 5.5)

    doc.text(
      `Página ${pagina} de ${totalPaginas}`,
      PAGE.w - MARGIN,
      PAGE.h - 7,
      { align: 'right' },
    )
  }
}

function paddingDireitaCelula(celula: CelulaAutoTable): number {
  const pad = celula.styles?.cellPadding
  if (typeof pad === 'number') return pad
  return pad?.right ?? 3
}

function obterGeometriaColunaValor(
  tabela: NonNullable<JsPdfComTabela['lastAutoTable']>,
): { x: number; width: number; paddingDireita: number } {
  const celulaValor =
    tabela.head?.[0]?.cells?.[4] ??
    tabela.body?.[tabela.body.length - 1]?.cells?.[4]

  if (
    celulaValor &&
    typeof celulaValor.x === 'number' &&
    typeof celulaValor.width === 'number'
  ) {
    return {
      x: celulaValor.x,
      width: celulaValor.width,
      paddingDireita: paddingDireitaCelula(celulaValor),
    }
  }

  const tabelaX = tabela.settings?.margin?.left ?? MARGIN
  const colunas = tabela.columns ?? []
  let xColuna = tabelaX
  for (let i = 0; i < 4 && i < colunas.length; i += 1) {
    xColuna += colunas[i]?.width ?? 0
  }

  return {
    x: xColuna,
    width: colunas[4]?.width ?? 32,
    paddingDireita: 3,
  }
}

function desenharResumoTotal(
  doc: jsPDF,
  y: number,
  total: number,
  colunaValor: { x: number; width: number; paddingDireita: number },
) {
  const { x, width, paddingDireita } = colunaValor
  const paddingEsquerda = paddingDireita
  const altura = 14
  const rotulo = 'Valor Total'
  const valorFormatado = formatarValor(total)

  if (y + altura > PAGE.h - 22) {
    doc.addPage()
    y = MARGIN + 6
  }

  const yTexto = y + 9.2

  const tamanhoFonte = 11

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(tamanhoFonte)
  const rotuloLargura = doc.getTextWidth(rotulo)
  const precoLargura = doc.getTextWidth(valorFormatado)

  const espacoEntreTextos = 4
  const larguraConteudo =
    paddingEsquerda +
    rotuloLargura +
    espacoEntreTextos +
    precoLargura +
    paddingDireita
  const larguraCampo = Math.max(width, larguraConteudo)
  const campoX = x + width - larguraCampo

  setFill(doc, CORES.slate900)
  doc.roundedRect(campoX, y, larguraCampo, altura, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(tamanhoFonte)
  setText(doc, CORES.white)
  doc.text(rotulo, campoX + paddingEsquerda, yTexto)

  doc.text(valorFormatado, x + width - paddingDireita, yTexto, {
    align: 'right',
  })
}

export function gerarPdfAprovacaoOrcamentos(
  servicos: ServicoRegistro[],
  nomeEmpresa: string,
): void {
  const dataDocumento = formatarDataHoje()
  const textoDeclaracao = montarTextoDeclaracaoAprovacao(nomeEmpresa)
  const empresaExibicao = nomeEmpresa.trim() || '—'
  const total = servicos.reduce((acc, s) => acc + s.valor, 0)

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  const docTabela = doc as JsPdfComTabela

  desenharFaixaCabecalho(doc)
  let y = desenharMetaInformacoes(
    doc,
    dataDocumento,
    empresaExibicao,
    servicos.length,
  )
  y = desenharCaixaDeclaracao(doc, y, textoDeclaracao)
  y = desenharTituloSecao(doc, y, 'Relação de orçamentos aprovados')

  const corpoTabela = servicos.map((s) => [
    s.os,
    s.viatura,
    s.modelo,
    s.dataSaida,
    formatarValor(s.valor),
  ])

  autoTable(doc, {
    startY: y,
    head: [['O.S.', 'Viatura', 'Modelo', 'Data entrada', 'Valor (R$)']],
    body: corpoTabela,
    theme: 'plain',
    margin: { top: 20, left: MARGIN, right: MARGIN, bottom: 22 },
    showHead: 'everyPage',
    tableWidth: PAGE.w - MARGIN * 2,
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 },
      lineColor: CORES.slate100,
      lineWidth: 0.2,
      textColor: CORES.slate800,
      valign: 'middle',
    },
    headStyles: {
      fillColor: CORES.blue600,
      textColor: CORES.white,
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
    },
    alternateRowStyles: {
      fillColor: CORES.slate50,
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold' },
      1: { cellWidth: 28 },
      2: { cellWidth: 32 },
      3: { cellWidth: 28, halign: 'center' },
      4: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        desenharCabecalhoPaginaContinuacao(doc, empresaExibicao)
      }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        data.cell.styles.textColor = CORES.emerald600
      }
    },
  })

  const tabela = docTabela.lastAutoTable
  const colunaValor = tabela
    ? obterGeometriaColunaValor(tabela)
    : {
        x: MARGIN + (24 + 28 + 32 + 28),
        width: 32,
        paddingDireita: 3,
      }
  const yAposTabela = (tabela?.finalY ?? y) + 4
  desenharResumoTotal(doc, yAposTabela, total, colunaValor)
  desenharRodapePaginas(doc, dataDocumento)

  doc.save(nomeArquivoPdf(dataDocumento))
}

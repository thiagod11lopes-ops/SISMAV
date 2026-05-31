import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatarLabelFaturamento } from './faturamentoOptions'
import { formatarValor, parseDataBr } from './filterUtils'
import {
  formatarPecasParaExibicao,
  separarPecasEDescricaoServico,
} from './servicoDescricaoUtils'
import type { ServicoRegistro } from './servicoTypes'

const PAGE = { w: 210, h: 297 } as const
const MARGIN = 14
const FOOTER_H = 18

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

export function obterServicosDoFaturamento(
  servicos: ServicoRegistro[],
  faturamento: string,
): ServicoRegistro[] {
  return servicos
    .filter((s) => s.faturamento === faturamento)
    .sort((a, b) => {
      const placa = a.viatura.localeCompare(b.viatura, 'pt-BR')
      if (placa !== 0) return placa
      const dataA = parseDataBr(a.dataSaida)?.getTime() ?? 0
      const dataB = parseDataBr(b.dataSaida)?.getTime() ?? 0
      if (dataA !== dataB) return dataA - dataB
      return a.os.localeCompare(b.os, 'pt-BR', { numeric: true })
    })
}

interface ResumoPlaca {
  placa: string
  modelo: string
  categoria: string
  quantidade: number
  valor: number
}

function montarResumoPlacas(servicos: ServicoRegistro[]): ResumoPlaca[] {
  const mapa = new Map<string, ResumoPlaca>()

  for (const s of servicos) {
    const atual = mapa.get(s.viatura)
    if (atual) {
      atual.quantidade += 1
      atual.valor += s.valor
      continue
    }
    mapa.set(s.viatura, {
      placa: s.viatura,
      modelo: s.modelo,
      categoria: s.categoria === 'ambulancia' ? 'Ambulância' : 'Administrativo',
      quantidade: 1,
      valor: s.valor,
    })
  }

  return [...mapa.values()].sort((a, b) =>
    a.placa.localeCompare(b.placa, 'pt-BR'),
  )
}

function formatarDataHoje(): string {
  const hoje = new Date()
  const dd = String(hoje.getDate()).padStart(2, '0')
  const mm = String(hoje.getMonth() + 1).padStart(2, '0')
  const yyyy = hoje.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function nomeArquivoPdf(faturamentoLabel: string, data: string): string {
  const slug = faturamentoLabel
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `Faturamento_${slug || 'detalhado'}_${data.replace(/\//g, '-')}.pdf`
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

function desenharCabecalho(doc: jsPDF, tituloFaturamento: string) {
  setFill(doc, CORES.slate900)
  doc.rect(0, 0, PAGE.w, 42, 'F')

  setFill(doc, CORES.blue600)
  doc.rect(0, 42, PAGE.w, 1.2, 'F')

  setFill(doc, CORES.blue500)
  doc.rect(MARGIN, 10, 3, 22, 'F')

  setText(doc, CORES.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('RELATÓRIO DE FATURAMENTO', MARGIN + 6, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  setText(doc, CORES.blue100)
  doc.text('SISMAV — Detalhamento de serviços por viatura', MARGIN + 6, 27)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  setText(doc, CORES.white)
  doc.text(tituloFaturamento, MARGIN + 6, 34)
}

function desenharCabecalhoContinuacao(doc: jsPDF, tituloFaturamento: string) {
  setFill(doc, CORES.slate900)
  doc.rect(0, 0, PAGE.w, 12, 'F')
  setFill(doc, CORES.blue600)
  doc.rect(0, 12, PAGE.w, 0.6, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setText(doc, CORES.white)
  doc.text('Relatório de faturamento', MARGIN, 8)

  doc.setFont('helvetica', 'normal')
  setText(doc, CORES.blue100)
  doc.text(tituloFaturamento, PAGE.w - MARGIN, 8, { align: 'right' })
}

function desenharChip(
  doc: jsPDF,
  x: number,
  y: number,
  largura: number,
  rotulo: string,
  valor: string,
  destaque = false,
) {
  const altura = 16
  setFill(doc, destaque ? CORES.blue100 : CORES.slate50)
  setDraw(doc, destaque ? CORES.blue600 : CORES.slate100)
  doc.setLineWidth(0.25)
  doc.roundedRect(x, y, largura, altura, 2, 2, 'FD')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  setText(doc, CORES.slate500)
  doc.text(rotulo.toUpperCase(), x + 3.5, y + 5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(destaque ? 9 : 8.5)
  setText(doc, destaque ? CORES.slate900 : CORES.slate800)
  const linhas = doc.splitTextToSize(valor, largura - 7)
  doc.text(linhas.slice(0, 2), x + 3.5, y + 11)
}

function desenharRodape(doc: jsPDF, dataDocumento: string) {
  const total = doc.getNumberOfPages()
  for (let pagina = 1; pagina <= total; pagina += 1) {
    doc.setPage(pagina)
    const y = PAGE.h - 10
    setDraw(doc, CORES.slate100)
    doc.setLineWidth(0.3)
    doc.line(MARGIN, y - 4, PAGE.w - MARGIN, y - 4)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    setText(doc, CORES.slate500)
    doc.text('Gerado pelo SISMAV 2.0', MARGIN, y)
    doc.text(`Emitido em ${dataDocumento}`, MARGIN, y + 3.5)
    doc.text(`Página ${pagina} de ${total}`, PAGE.w - MARGIN, y + 1.5, {
      align: 'right',
    })
  }
}

function garantirEspaco(doc: jsPDF, y: number, altura: number): number {
  if (y + altura <= PAGE.h - FOOTER_H) return y
  doc.addPage()
  return MARGIN + 4
}

function desenharTituloSecao(doc: jsPDF, y: number, titulo: string): number {
  y = garantirEspaco(doc, y, 12)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  setText(doc, CORES.slate900)
  doc.text(titulo, MARGIN, y)
  setDraw(doc, CORES.blue600)
  doc.setLineWidth(0.7)
  doc.line(MARGIN, y + 1.5, MARGIN + 32, y + 1.5)
  return y + 8
}

function formatarDataRetorno(data: string): string {
  const t = data.trim()
  if (!t || t === 'Indeterminado') return 'Indeterminado'
  return t
}

const ALTURA_LINHA = 4.2
const MAX_LINHAS_PECAS = 8
const MAX_LINHAS_DESCRICAO = 14

function medirSecaoTexto(
  linhas: string[],
  maxLinhas: number,
): { linhasVisiveis: string[]; truncado: boolean; altura: number } {
  const visiveis = linhas.slice(0, maxLinhas)
  const truncado = linhas.length > maxLinhas
  const alturaTitulo = 4
  const alturaTexto = visiveis.length * ALTURA_LINHA
  const alturaAviso = truncado ? 4 : 0
  return {
    linhasVisiveis: visiveis,
    truncado,
    altura: alturaTitulo + alturaTexto + alturaAviso,
  }
}

function desenharSecaoTexto(
  doc: jsPDF,
  x: number,
  y: number,
  titulo: string,
  linhas: string[],
  maxLinhas: number,
  corTitulo: [number, number, number] = CORES.slate800,
): number {
  if (linhas.length === 0) return y

  const { linhasVisiveis, truncado, altura } = medirSecaoTexto(linhas, maxLinhas)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  setText(doc, corTitulo)
  doc.text(titulo, x, y)

  let cursorY = y + 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  setText(doc, CORES.slate800)
  doc.text(linhasVisiveis, x, cursorY)

  if (truncado) {
    doc.setFontSize(7)
    setText(doc, CORES.slate500)
    doc.text(
      '(lista truncada — consulte o sistema para o conteúdo completo)',
      x,
      cursorY + linhasVisiveis.length * ALTURA_LINHA + 1,
    )
  }

  return y + altura
}

function desenharCardServico(
  doc: jsPDF,
  y: number,
  servico: ServicoRegistro,
  indice: number,
): number {
  const largura = PAGE.w - MARGIN * 2
  const padding = 4
  const textoLargura = largura - padding * 2 - 4
  const { pecas, descricaoServico } = separarPecasEDescricaoServico(
    servico.descricao,
  )

  const linhasPecas = pecas.length
    ? doc.splitTextToSize(formatarPecasParaExibicao(pecas), textoLargura)
    : []
  const linhasDescricao = doc.splitTextToSize(descricaoServico, textoLargura)

  const secaoPecas = medirSecaoTexto(linhasPecas, MAX_LINHAS_PECAS)
  const secaoDescricao = medirSecaoTexto(linhasDescricao, MAX_LINHAS_DESCRICAO)

  const altura =
    22 +
    (linhasPecas.length > 0 ? secaoPecas.altura + 2 : 0) +
    secaoDescricao.altura +
    2

  y = garantirEspaco(doc, y, altura)

  setFill(doc, indice % 2 === 0 ? CORES.white : CORES.slate50)
  setDraw(doc, CORES.slate100)
  doc.setLineWidth(0.25)
  doc.roundedRect(MARGIN, y, largura, altura, 2, 2, 'FD')

  setFill(doc, CORES.blue600)
  doc.roundedRect(MARGIN, y, 2.5, altura, 2, 0, 'F')

  let cursorY = y + 6
  const xTexto = MARGIN + padding + 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  setText(doc, CORES.slate900)
  doc.text(`OS ${servico.os}`, xTexto, cursorY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  setText(doc, CORES.blue600)
  doc.text(servico.viatura, MARGIN + 32, cursorY)

  doc.setFont('helvetica', 'normal')
  setText(doc, CORES.slate600)
  doc.text(servico.modelo, MARGIN + 58, cursorY)

  doc.setFont('helvetica', 'bold')
  setText(doc, CORES.emerald600)
  doc.text(formatarValor(servico.valor), PAGE.w - MARGIN - padding, cursorY, {
    align: 'right',
  })

  cursorY += 5.5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setText(doc, CORES.slate500)
  doc.text(
    `Saída oficina: ${servico.dataSaida}   ·   Retorno: ${formatarDataRetorno(servico.dataRetorno)}`,
    xTexto,
    cursorY,
  )

  cursorY += 6

  if (linhasPecas.length > 0) {
    cursorY = desenharSecaoTexto(
      doc,
      xTexto,
      cursorY,
      'Peças utilizadas',
      linhasPecas,
      MAX_LINHAS_PECAS,
      CORES.blue600,
    )
    cursorY += 2
  }

  desenharSecaoTexto(
    doc,
    xTexto,
    cursorY,
    'Descrição do serviço',
    linhasDescricao,
    MAX_LINHAS_DESCRICAO,
  )

  return y + altura + 4
}

export function gerarPdfFaturamentoDetalhado(
  servicos: ServicoRegistro[],
  faturamento: string,
): void {
  if (servicos.length === 0) {
    throw new Error('Nenhum serviço encontrado para este faturamento.')
  }

  const tituloFaturamento = formatarLabelFaturamento(faturamento)
  const dataDocumento = formatarDataHoje()
  const resumoPlacas = montarResumoPlacas(servicos)
  const total = servicos.reduce((acc, s) => acc + s.valor, 0)
  const amb = servicos.filter((s) => s.categoria === 'ambulancia').length
  const adm = servicos.length - amb

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })

  desenharCabecalho(doc, tituloFaturamento)

  const chipLargura = (PAGE.w - MARGIN * 2 - 9) / 4
  let y = 50
  desenharChip(doc, MARGIN, y, chipLargura, 'Serviços', String(servicos.length))
  desenharChip(
    doc,
    MARGIN + chipLargura + 3,
    y,
    chipLargura,
    'Viaturas',
    String(resumoPlacas.length),
  )
  desenharChip(
    doc,
    MARGIN + (chipLargura + 3) * 2,
    y,
    chipLargura,
    'Tipos',
    `${amb} amb. · ${adm} adm.`,
  )
  desenharChip(
    doc,
    MARGIN + (chipLargura + 3) * 3,
    y,
    chipLargura,
    'Valor total',
    formatarValor(total),
    true,
  )

  y += 22
  y = desenharTituloSecao(doc, y, 'Resumo por placa')

  autoTable(doc, {
    startY: y,
    head: [['Placa', 'Modelo', 'Tipo', 'Qtd. serviços', 'Valor (R$)']],
    body: resumoPlacas.map((r) => [
      r.placa,
      r.modelo,
      r.categoria,
      String(r.quantidade),
      formatarValor(r.valor),
    ]),
    theme: 'plain',
    margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_H },
    tableWidth: PAGE.w - MARGIN * 2,
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: { top: 3, right: 2.5, bottom: 3, left: 2.5 },
      lineColor: CORES.slate100,
      lineWidth: 0.2,
      textColor: CORES.slate800,
      valign: 'middle',
    },
    headStyles: {
      fillColor: CORES.blue600,
      textColor: CORES.white,
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: CORES.slate50 },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold' },
      1: { cellWidth: 32 },
      2: { cellWidth: 28, halign: 'center' },
      3: { cellWidth: 26, halign: 'center' },
      4: { halign: 'right', fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        desenharCabecalhoContinuacao(doc, tituloFaturamento)
      }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        data.cell.styles.textColor = CORES.emerald600
      }
    },
  })

  y =
    ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? y) + 8
  y = desenharTituloSecao(doc, y, 'Detalhamento por viatura e ordem de serviço')

  servicos.forEach((servico, indice) => {
    y = desenharCardServico(doc, y, servico, indice)
  })

  y = garantirEspaco(doc, y, 16)
  setFill(doc, CORES.slate900)
  doc.roundedRect(MARGIN, y, PAGE.w - MARGIN * 2, 12, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  setText(doc, CORES.white)
  doc.text('Total do faturamento', MARGIN + 5, y + 7.5)
  doc.text(formatarValor(total), PAGE.w - MARGIN - 5, y + 7.5, { align: 'right' })

  desenharRodape(doc, dataDocumento)
  doc.save(nomeArquivoPdf(tituloFaturamento, dataDocumento))
}

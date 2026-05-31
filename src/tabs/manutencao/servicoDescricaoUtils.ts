export interface ConteudoDescricaoServico {
  pecas: string[]
  descricaoServico: string
}

function extrairListaMarcador(bloco: string): string[] {
  return bloco
    .split('\n')
    .map((linha) => linha.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean)
}

function linhaPareceItemPeca(linha: string): boolean {
  const t = linha.trim()
  if (!t) return false
  if (/^obs\s*:/i.test(t)) return false
  return /\s+\d+\s*$/.test(t) || /^[A-Z0-9.-]+\s+.+\s+\d+\s*$/i.test(t)
}

function blocoPareceListaPecas(bloco: string): boolean {
  const linhas = bloco.split('\n').map((l) => l.trim()).filter(Boolean)
  if (linhas.length === 0) return false
  const comPadrao = linhas.filter(linhaPareceItemPeca).length
  return comPadrao >= Math.max(1, Math.ceil(linhas.length * 0.6))
}

/** Separa peças utilizadas e descrição de serviço a partir do campo descricao. */
export function separarPecasEDescricaoServico(
  descricao: string,
): ConteudoDescricaoServico {
  const trimmed = descricao.trim()
  if (!trimmed) {
    return { pecas: [], descricaoServico: 'Sem descrição registrada.' }
  }

  const pecasUsadas = trimmed.match(
    /Peças usadas:\s*\n([\s\S]*?)(?:\n\nServiços executados:|$)/i,
  )
  const servicosExecutados = trimmed.match(/Serviços executados:\s*\n([\s\S]*)/i)

  if (pecasUsadas || servicosExecutados) {
    const pecas = pecasUsadas ? extrairListaMarcador(pecasUsadas[1]) : []
    const descricaoServico = servicosExecutados
      ? extrairListaMarcador(servicosExecutados[1]).join('\n')
      : trimmed.replace(/Peças usadas:[\s\S]*/i, '').trim()

    return {
      pecas,
      descricaoServico: descricaoServico || 'Sem descrição registrada.',
    }
  }

  const blocos = trimmed.split(/\n\n+/).map((b) => b.trim()).filter(Boolean)
  if (blocos.length >= 2 && blocoPareceListaPecas(blocos[0])) {
    return {
      pecas: blocos[0].split('\n').map((l) => l.trim()).filter(Boolean),
      descricaoServico: blocos.slice(1).join('\n\n').trim() || trimmed,
    }
  }

  return { pecas: [], descricaoServico: trimmed }
}

export function formatarPecasParaExibicao(pecas: string[]): string {
  if (pecas.length === 0) return ''
  return pecas.map((p) => `• ${p}`).join('\n')
}

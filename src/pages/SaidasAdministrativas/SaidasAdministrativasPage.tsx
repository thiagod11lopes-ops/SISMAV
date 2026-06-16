import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { DataTable, type Column } from '../../components/DataTable'
import { SectionCard } from '../../components/SectionCard'
import {
  carregarSaidasAdministrativas,
  EVENTO_SAIDAS_ADMIN_ATUALIZADAS,
  salvarSaidasAdministrativas,
} from './saidasAdministrativasStorage'
import type { SaidaAdministrativa } from './types'
import styles from './SaidasAdministrativasPage.module.css'

const SETOR_FIXO = 'SIAD' as const

function gerarId() {
  return `saida_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function hojeIso() {
  // YYYY-MM-DD para input[type="date"]
  return new Date().toISOString().slice(0, 10)
}

const BAIRROS_RJ_E_RM = [
  // Cidade do Rio de Janeiro
  'Centro',
  'Copacabana',
  'Ipanema',
  'Botafogo',
  'Flamengo',
  'Laranjeiras',
  'Santa Teresa',
  'Lapa',
  'Catete',
  'Glória',
  'Gávea',
  'Leblon',
  'São Conrado',
  'Barra da Tijuca',
  'Recreio dos Bandeirantes',
  'Jacarepaguá',
  'Taquara',
  'Bangu',
  'Realengo',
  'Campo Grande',
  'Santa Cruz',
  'Guaratiba',
  'Sepetiba',
  'Vila Isabel',
  'Tijuca',
  'Grajaú',
  'Maracanã',
  'Méier',
  'Engenho de Dentro',
  'Madureira',
  'Del Castilho',
  'Parada de Lucas',
  'Honório Gurgel',
  'Rocha',
  'Penha',
  'Ramos',
  'Andaraí',
  'Cosme Velho',
  // Região Metropolitana (municípios)
  'Duque de Caxias',
  'São João de Meriti',
  'Nilópolis',
  'Belford Roxo',
  'Queimados',
  'Japeri',
  'Mesquita',
  'Nova Iguaçu',
  'Magé',
  'Petrópolis',
  'Teresópolis',
  'Seropédica',
  'Itaguaí',
  'Niterói',
  'São Gonçalo',
  'Maricá',
  'Cabo Frio',
  'Armação dos Búzios',
  'Volta Redonda',
  'Barra do Piraí',
  'Valença',
  'Resende',
].sort((a, b) => a.localeCompare(b))

export function SaidasAdministrativasPage() {
  const [saidas, setSaidas] = useState<SaidaAdministrativa[]>(() =>
    carregarSaidasAdministrativas(),
  )

  const [dataSaida, setDataSaida] = useState<string>(hojeIso())
  const [setor] = useState<typeof SETOR_FIXO>(SETOR_FIXO)
  const [endereco, setEndereco] = useState<string>('')
  const [numeroPassageiros, setNumeroPassageiros] = useState<string>('')

  const tableAnchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = () =>
      setSaidas(carregarSaidasAdministrativas())

    window.addEventListener(
      EVENTO_SAIDAS_ADMIN_ATUALIZADAS,
      handler as EventListener,
    )
    return () => {
      window.removeEventListener(
        EVENTO_SAIDAS_ADMIN_ATUALIZADAS,
        handler as EventListener,
      )
    }
  }, [])

  useEffect(() => {
    // URL abre e leva para a tabela
    const t = window.setTimeout(() => {
      tableAnchorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 150)
    return () => window.clearTimeout(t)
  }, [])

  const numeroPassageirosNumero = useMemo(() => {
    const n = parseInt(numeroPassageiros || '0', 10)
    return Number.isFinite(n) ? n : 0
  }, [numeroPassageiros])

  const colunas: Column<SaidaAdministrativa>[] = useMemo(
    () => [
      { key: 'data', header: 'Data' },
      { key: 'setor', header: 'Setor' },
      { key: 'endereco', header: 'Endereço' },
      {
        key: 'numeroPassageiros',
        header: 'Nº Passageiros',
        render: (row) => String(row.numeroPassageiros),
      },
    ],
    [],
  )

  function atualizarNumeroPassageiros(raw: string) {
    setNumeroPassageiros(raw.replace(/\D/g, ''))
  }

  function validarAntesDeSalvar(): { ok: true } | { ok: false; msg: string } {
    if (!dataSaida) return { ok: false, msg: 'Informe a data de saída.' }
    if (!endereco.trim())
      return { ok: false, msg: 'Informe o endereço (bairro/região).' }
    if (numeroPassageirosNumero < 0)
      return { ok: false, msg: 'Número de passageiros inválido.' }
    return { ok: true }
  }

  function aoSubmeter(e: FormEvent) {
    e.preventDefault()
    const validacao = validarAntesDeSalvar()
    if (!validacao.ok) {
      alert(validacao.msg)
      return
    }

    const novo: SaidaAdministrativa = {
      id: gerarId(),
      data: dataSaida,
      setor,
      endereco: endereco.trim(),
      numeroPassageiros: numeroPassageirosNumero,
      criadoEm: Date.now(),
    }

    const proximo = [novo, ...saidas]
    setSaidas(proximo)
    salvarSaidasAdministrativas(proximo)

    setEndereco('')
    setNumeroPassageiros('')

    tableAnchorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className={styles.saidasAdminPage}>
      <div className={styles.saidasAdminLayout}>
        <SectionCard
          title="Saídas Administrativas"
          description="Preencha as informações e consulte a tabela abaixo."
          actions={<span />}
          fullWidth
        >
          <form onSubmit={aoSubmeter}>
            <div className={styles.formGrid}>
              <div className={styles.campo}>
                <label>Data</label>
                <input
                  className={`${styles.inputModern} ${styles.dateModern}`}
                  type="date"
                  value={dataSaida}
                  onChange={(e) => setDataSaida(e.target.value)}
                />
              </div>

              <div className={styles.campo}>
                <label>Setor</label>
                <input
                  className={styles.inputModern}
                  value={setor}
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <div className={styles.campo} style={{ gridColumn: '1 / -1' }}>
                <label>Endereço (bairro/região do RJ e RM)</label>
                <input
                  className={styles.inputModern}
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  list="bairros-rj-rm"
                  placeholder="Ex: Copacabana, Duque de Caxias, Niterói..."
                />
                <datalist id="bairros-rj-rm">
                  {BAIRROS_RJ_E_RM.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
                <div className={styles.bairrosHint}>
                  Você pode selecionar uma opção ou digitar livremente.
                </div>
              </div>

              <div className={styles.campo}>
                <label>Número de Passageiros</label>
                <input
                  className={`${styles.inputModern} ${styles.numeroPass}`}
                  value={numeroPassageiros}
                  onChange={(e) => atualizarNumeroPassageiros(e.target.value)}
                  inputMode="numeric"
                  placeholder="Somente números"
                  aria-label="Número de Passageiros"
                />
              </div>

              <div className={styles.campo}>
                <label>&nbsp;</label>
                <div className={styles.formActions}>
                  <Button type="submit">Salvar saída</Button>
                </div>
              </div>
            </div>
          </form>
        </SectionCard>

        <div
          ref={tableAnchorRef}
          id="saidas-administrativas-tabela"
          className={styles.tableAnchor}
        >
          <SectionCard
            title="Tabela de Saídas Administrativas"
            description={`${saidas.length} registro(s)`}
            fullWidth
          >
            <DataTable
              columns={colunas}
              data={saidas}
              emptyMessage="Nenhuma saída administrativa cadastrada."
            />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}


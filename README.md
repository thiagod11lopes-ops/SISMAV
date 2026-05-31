# SISMAV

**SISMAV - Sistema de Manutenção de Viaturas**

Aplicação web em **React** (Vite + TypeScript) com módulos por abas:

- Manutenção
- Controle Financeiro
- Viaturas
- Fainas
- Balanço
- Configurações

## Acesso online

https://thiagod11lopes-ops.github.io/SISMAV/

## Como executar localmente

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (geralmente `http://localhost:5173`).

## Scripts

| Comando           | Descrição                    |
|-------------------|------------------------------|
| `npm run dev`     | Servidor de desenvolvimento  |
| `npm run build`   | Build de produção            |
| `npm run preview` | Pré-visualizar build         |

## Estrutura

```
src/
  components/   # Header, abas, tabelas, botões
  tabs/         # Conteúdo de cada módulo
  configuracoes/ # Backup CSV, tema, limpeza de dados
legacy/
  sismav-html/  # Versão anterior (HTML estático)
```

## Publicação

O deploy para GitHub Pages é feito automaticamente pelo workflow em `.github/workflows/deploy-pages.yml`. Veja `GITHUB_PAGES.md` para detalhes.

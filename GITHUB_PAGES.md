# Publicar o SISMAV no GitHub Pages

O SISMAV 2.0 (React + Vite) é publicado automaticamente a cada push na branch `main`.

**Link do site:** https://thiagod11lopes-ops.github.io/SISMAV/

## Configuração no GitHub (obrigatório)

### 1. Permissões do workflow

1. Repositório → **Settings** → **Actions** → **General**
2. Em **Workflow permissions**, marque **Read and write permissions**
3. Clique em **Save**

### 2. Origem do GitHub Pages

1. Repositório → **Settings** → **Pages**
2. Em **Build and deployment** > **Source**, escolha **Deploy from a branch**
3. Em **Branch**, selecione **`gh-pages`** e pasta **`/ (root)`**
4. Clique em **Save**

Aguarde 1–3 minutos após o workflow **Deploy GitHub Pages** concluir (aba **Actions**).

### 3. Disparar o deploy manualmente (se precisar)

1. Aba **Actions** → **Deploy GitHub Pages**
2. **Run workflow** → **Run workflow**

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Versão anterior (HTML)

Os arquivos do SISMAV clássico estão em `legacy/sismav-html/` apenas para referência.

## Dados

O SISMAV 2.0 salva os dados no **localStorage** do navegador e permite backup/importação em **CSV** pela aba Configurações.

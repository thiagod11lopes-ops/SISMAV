# Publicar o SISMAV no GitHub Pages

O SISMAV 2.0 (React + Vite) é publicado automaticamente pelo GitHub Actions a cada push na branch `main`.

**Link do site:** https://thiagod11lopes-ops.github.io/SISMAV/

## Configuração no GitHub (uma vez)

1. Abra o repositório: https://github.com/thiagod11lopes-ops/SISMAV
2. **Settings** → **Pages**
3. Em **Build and deployment** > **Source**, escolha **GitHub Actions** (não "Deploy from a branch")
4. Salve

Após o próximo push, o workflow **Deploy GitHub Pages** fará o build (`npm run build`) e publicará a pasta `dist/`.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Para simular o caminho do GitHub Pages localmente:

```bash
npm run build
npm run preview -- --base /SISMAV/
```

## Versão anterior (HTML)

Os arquivos do SISMAV clássico (HTML + IndexedDB + Firebase) estão em `legacy/sismav-html/` apenas para referência. Eles não são mais publicados no GitHub Pages.

## Dados

O SISMAV 2.0 salva os dados no **localStorage** do navegador e permite backup/importação em **CSV** pela aba Configurações. A sincronização automática com Firebase do sistema HTML anterior **não está incluída** nesta versão React.

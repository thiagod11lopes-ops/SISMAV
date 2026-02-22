# Verificação de arquivos – pasta SISMAV

## O que pode atrapalhar ou é redundante

### 1. Pasta **"Backup de dados"**
- **O que é:** Cópia antiga/backup de quase todo o projeto (HTML, backend, .bat, etc.).
- **Problema:** Duplica arquivos, aumenta o repositório e o que o GitHub Pages publica. Pode confundir (abrir arquivo da pasta errada). O Git já é o backup do código.
- **Recomendação:** Foi adicionada ao `.gitignore` para **não ser enviada** ao GitHub. A pasta continua no seu PC, mas deixa de ir para o repositório. Se quiser removê-la do GitHub depois de ignorar, avise.

### 2. **backend-server.js** (na raiz)
- **O que é:** Script Node que inicia o backend (verifica saúde, npm install, sobe o server).
- **Uso atual:** O **SISMAV.bat** usa direto `backend\server.js` (pasta backend + node server.js). Este arquivo não é usado pelo .bat.
- **Conclusão:** Não atrapalha. É um launcher alternativo. Pode ficar ou ser removido se quiser simplificar; no GitHub Pages ele não roda (só arquivos estáticos).

### 3. Workflow **.github/workflows/firebase-hosting.yml**
- **O que é:** Ação do GitHub para publicar no Firebase Hosting ao dar push.
- **Problema:** Exige o segredo `FIREBASE_SERVICE_ACCOUNT` no repositório. Se não foi configurado, o workflow falha a cada push.
- **Recomendação:** Se você **só usa GitHub Pages** (link thiagod11lopes-ops.github.io/SISMAV), pode **excluir** esse arquivo para não ter falha nas ações. Se quiser usar Firebase Hosting com deploy automático, aí sim configure o segredo.

### 4. **backend/node_modules** e **backend/data**
- Já estão no `.gitignore`. Não são enviados ao GitHub. Correto.

---

## Arquivos que devem permanecer (necessários)

| Item | Motivo |
|------|--------|
| **SISMAV.html** | Página principal do sistema |
| **index.html** | Redireciona para SISMAV no GitHub Pages |
| **.nojekyll** | Faz o GitHub Pages servir os arquivos estáticos sem Jekyll |
| **Valores.html, GerenciarServicos.html, Faturamentos.html, etc.** | Abas/funcionalidades do SISMAV |
| **indexeddb-service.js** | Armazenamento local (IndexedDB) |
| **firebase-config.js** | Configuração do Firebase/Firestore |
| **pasta backend/** (exceto node_modules e data) | Servidor local (localhost:3000); não roda no GitHub Pages, mas é usada quando você abre pelo PC |
| **SISMAV.bat, start-backend.bat, INICIAR_SISMAV.bat** | Para abrir o sistema e o backend no Windows |
| **iniciar-backend.vbs** | Iniciar backend (se usado por algum atalho) |

---

## Resumo das alterações feitas

1. **.gitignore:** Inclusão de `Backup de dados/` para não enviar essa pasta ao GitHub.
2. Se a pasta **"Backup de dados"** já tiver sido commitada antes, ela continuará no repositório até você removê-la do controle do Git (posso orientar o comando se quiser).

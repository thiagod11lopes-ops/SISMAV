# 🚀 SISMAV - Sistema de Manutenção de Viaturas

**Versão:** 3.0  
**Sistema completo para gestão de manutenção e controle financeiro de viaturas**

---

## 📋 Índice

1. [Início Rápido](#-início-rápido)
2. [Como Usar](#-como-usar)
3. [Estrutura do Sistema](#-estrutura-do-sistema)
4. [Funcionalidades Principais](#-funcionalidades-principais)
5. [Backup e Restauração](#-backup-e-restauração)
6. [Solução de Problemas](#-solução-de-problemas)
7. [Documentação Técnica](#-documentação-técnica)

---

## 🚀 Início Rápido

### Método Recomendado (Mais Fácil)

**Duplo clique no arquivo:** `SISMAV.bat`

Este arquivo irá automaticamente:
1. ✅ Verificar se Node.js está instalado
2. ✅ Verificar se o backend está rodando
3. ✅ Iniciar o backend automaticamente se necessário
4. ✅ Abrir o SISMAV no navegador

**É só isso!** O backend será iniciado automaticamente em segundo plano.

### Outros Métodos de Inicialização

#### Opção 2: Iniciar Backend Separadamente

1. Duplo clique em: `start-backend.bat`
2. Aguarde a mensagem "Servidor rodando em http://localhost:3000"
3. Abra o arquivo `SISMAV.html` no navegador

#### Opção 3: Usando PowerShell

**Windows:**
- Clique duas vezes em `INICIAR_SISMAV.ps1`

#### Opção 4: Abrir HTML Diretamente

1. Duplo clique em: `SISMAV.html`
2. Se o backend não estiver rodando, você verá um aviso
3. Execute `SISMAV.bat` ou `start-backend.bat` para iniciar o backend

---

## 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
  - Download: https://nodejs.org/
  - Verificar instalação: Abra o Prompt de Comando e digite `node --version`

---

## 🔧 Primeira Instalação

Na primeira vez que usar o sistema:

1. Execute `SISMAV.bat` ou `start-backend.bat`
2. As dependências serão instaladas automaticamente
3. Aguarde a mensagem "Servidor rodando em http://localhost:3000"

---

## 📁 Estrutura do Sistema

```
SISMAV/
├── SISMAV.bat                  ← Iniciar sistema completo (USE ESTE!)
├── INICIAR_SISMAV.bat          ← Atalho para SISMAV.bat
├── INICIAR_SISMAV.ps1          ← Alternativa PowerShell
├── SISMAV_DEBUG.bat            ← Modo debug
├── start-backend.bat           ← Iniciar apenas backend
├── iniciar-backend.vbs         ← Alternativa VBScript
│
├── SISMAV.html                 ← Interface principal (Hub do sistema)
├── GerenciarServicos.html      ← Aba de Manutenções
├── Valores.html                ← Controle Financeiro (Contratos e Solemps)
├── Faturamentos.html           ← Tabela de Faturamentos
├── Orcamentos.html             ← Orçamentos e Despesas
├── Viaturas.html               ← Cadastro de Viaturas
├── Balanco.html                ← Balanço e Relatórios
├── Backup.html                 ← Backup e Restauração
├── Fainas.html                 ← Gerenciamento de Atividades
│
├── indexeddb-service.js        ← Serviço IndexedDB (armazenamento)
├── backend-server.js           ← Servidor backend (inicialização)
│
├── backend/                    ← Backend Node.js
│   ├── server.js              ← Servidor principal
│   ├── routes/                ← Rotas da API
│   ├── models/                ← Modelos de dados
│   └── data/                  ← Dados armazenados (criado automaticamente)
│
└── Documentação/
    ├── README.md              ← Este arquivo
    ├── DOCUMENTACAO_TECNICA.md ← Documentação técnica completa
    └── HISTORICO_ALTERACOES.md ← Histórico de alterações
```

---

## ⚙️ Como Funciona

### Backend Online
Quando o backend está rodando:
- ✅ Dados são salvos no servidor (arquivos JSON)
- ✅ Dados são compartilhados entre navegadores
- ✅ Backup automático em arquivos
- ✅ Melhor performance
- ✅ Armazenamento usando IndexedDB com fallback para localStorage

### Backend Offline
Se o backend não estiver rodando:
- ⚠️ Sistema usa IndexedDB/localStorage como fallback
- ⚠️ Dados ficam apenas no navegador
- ⚠️ Não são compartilhados entre navegadores

---

## 📚 Funcionalidades Principais

### 1. **Gestão de Manutenções** (`GerenciarServicos.html`)
- ✅ Cadastro completo de serviços de manutenção
- ✅ Importação de PDF de Ordem de Serviço (O.S.)
- ✅ Campos para NF Peça e NF Serviço
- ✅ Anexar PDFs em NF Peça/Serviço
- ✅ Filtros avançados (Ano, Mês, Faturamento, Viatura)
- ✅ Busca em tempo real
- ✅ Tabelas separadas (Ambulâncias e Administrativas)
- ✅ Backup CSV e JSON

### 2. **Controle Financeiro** (`Valores.html`)
- ✅ Cadastro de Contratos
- ✅ Cadastro de Solemps (vinculadas a Contratos)
- ✅ Geração de Faturamentos
- ✅ Controle de saldo (Contrato - Gastos)
- ✅ Exclusão em cascata com avisos detalhados
- ✅ Resumo financeiro completo

### 3. **Tabela de Faturamentos** (`Faturamentos.html`)
- ✅ Cadastro de faturamentos (1° a 10°)
- ✅ Anexar PDF de faturamento
- ✅ Filtro por ano
- ✅ Download de PDFs

### 4. **Orçamentos** (`Orcamentos.html`)
- ✅ Cadastro de orçamentos
- ✅ Separação Pagamentos/Compras
- ✅ Filtros e busca

### 5. **Cadastro de Viaturas** (`Viaturas.html`)
- ✅ Cadastro completo de viaturas
- ✅ Edição e exclusão
- ✅ Controle de tipos (Ambulância, Administrativa, etc.)

### 6. **Balanço e Relatórios** (`Balanco.html`)
- ✅ Visualização de totais
- ✅ Gráficos interativos (Chart.js)
- ✅ Análise de gastos por tipo de viatura
- ✅ Evolução mensal de gastos
- ✅ Status de faturamento

### 7. **Gestão de Atividades** (`Fainas.html`)
- ✅ Gerenciamento de atividades pendentes
- ✅ Atividades em andamento
- ✅ Atividades finalizadas
- ✅ Sistema de anotações

### 8. **Backup e Restauração** (`Backup.html`)
- ✅ Estatísticas do sistema
- ✅ Backup completo (inclui todos os PDFs)
- ✅ Restauração de backup
- ✅ Compatibilidade retroativa (v1.0, v2.0, v3.0)
- ✅ Backup automático diário
- ✅ Limpeza de dados

---

## 💾 Backup e Restauração

### Fazer Backup Manual

1. Abra a aba "Backup"
2. Clique em "Fazer Backup Geral"
3. O arquivo será baixado automaticamente (formato JSON)

### Importar Backup

1. Abra a aba "Backup"
2. Clique em "Importar Backup"
3. Selecione o arquivo JSON
4. Confirme a importação
5. Aguarde o recarregamento

### Backup Automático

O sistema oferece backup automático:
- **Backup Diário:** Modal aparece automaticamente se não houver backup no dia
- **OPFS:** Backups salvos automaticamente no Origin Private File System
- **File System Access API:** Salvar em pasta escolhida (Chrome/Edge)

### Dados Incluídos no Backup

- ✅ Manutenções (com todos os PDFs)
- ✅ Viaturas
- ✅ Contratos e Solemps
- ✅ Orçamentos (Pagamentos e Compras)
- ✅ Faturamentos (com PDFs)
- ✅ Fainas (Pendentes, Em Andamento, Finalizadas, Anotações)
- ✅ Configurações do sistema

---

## 🛠️ Solução de Problemas

### "Node.js não encontrado"
- **Solução:** Instale o Node.js de https://nodejs.org/
- Reinicie o computador após instalar
- Verifique se Node.js está no PATH do sistema

### "Backend não está rodando"
- Execute `start-backend.bat` manualmente
- Verifique se a porta 3000 está livre
- Verifique se há erros na janela do backend
- Acesse: http://localhost:3000/api/health

### "Erro ao instalar dependências"
- Verifique sua conexão com a internet
- Execute `npm install` manualmente na pasta `backend`
- Verifique se o Node.js está atualizado

### "Porta 3000 já em uso"
- Feche outros programas que possam estar usando a porta 3000
- Ou altere a porta no arquivo `backend/server.js`:
  ```javascript
  const PORT = process.env.PORT || 3001; // Alterar para 3001
  ```

### "Dados não estão sendo salvos"
- Verifique se o IndexedDB está funcionando (console F12)
- Execute: `await window.verificarIndexedDB()` no console
- Verifique o console para erros (F12)

### "Backup não está funcionando"
- Verifique se há dados para fazer backup
- Verifique o console do navegador para erros
- Tente fazer download manual na aba Backup

---

## 🔍 Verificar Status do Backend

**Abrir no navegador:** http://localhost:3000/api/health

Se aparecer `{"status":"ok"}`, o backend está funcionando!

---

## 💡 Dicas Importantes

1. **Sempre use `SISMAV.bat`** para iniciar o sistema completo
2. **Mantenha a janela do backend aberta** enquanto usar o sistema
3. **Faça backup regular** dos dados (recomendado semanalmente)
4. **Guarde os backups em local seguro**
5. **O backend roda em segundo plano** quando iniciado via `SISMAV.bat`
6. **Use o modo debug** (`SISMAV_DEBUG.bat`) para diagnosticar problemas

---

## 📖 Documentação Técnica

Para informações técnicas detalhadas, consulte:

- **`DOCUMENTACAO_TECNICA.md`** - Documentação técnica completa (inclui IndexedDB e Backend)
- **`HISTORICO_ALTERACOES.md`** - Histórico de todas as alterações

### Verificar IndexedDB

No console do navegador (F12):
```javascript
// Verificar dados no IndexedDB
await window.verificarIndexedDB()

// Comparar com localStorage
await window.compararArmazenamento()
```

### Integração com Backend

O sistema usa fallback automático:
1. Tenta usar API do backend (se disponível)
2. Se falhar, usa IndexedDB
3. Se IndexedDB não disponível, usa localStorage

Funções disponíveis:
```javascript
const dados = await window.getData('manutencoesCadastradas');
await window.setData('manutencoesCadastradas', dados);
```

---

## 🌐 URLs Importantes

- **Sistema Principal:** `SISMAV.html` (abrir no navegador)
- **API Backend:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health
- **Storage Stats:** http://localhost:3000/api/storage

---

## 🚑 Como Parar o Backend

1. Feche a janela "SISMAV Backend" que foi aberta
2. Ou pressione Ctrl+C na janela do backend

---

## 📞 Suporte

Em caso de problemas:

1. Verifique se Node.js está instalado (`node --version`)
2. Verifique se o backend está rodando (http://localhost:3000/api/health)
3. Consulte os arquivos de log na janela do backend
4. Verifique o console do navegador (F12)
5. Execute `SISMAV_DEBUG.bat` para diagnóstico

---

## ✅ Sistema Verificado e Funcional

**Status Atual:** ✅ **100% FUNCIONAL**

Todas as funcionalidades foram testadas e estão operacionais.

---

**Última atualização:** 2025-01-XX  
**Versão do Sistema:** 3.0

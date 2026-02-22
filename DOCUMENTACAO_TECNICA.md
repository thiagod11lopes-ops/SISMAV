# 📚 Documentação Técnica - SISMAV

**Versão:** 3.0  
**Documentação completa das funcionalidades técnicas do sistema**

---

## 📋 Índice

1. [Armazenamento de Dados](#armazenamento-de-dados)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Sistema de Backup](#sistema-de-backup)
4. [Integração Backend](#integração-backend)
5. [IndexedDB Service](#indexeddb-service)
6. [Arquitetura do Sistema](#arquitetura-do-sistema)

---

## 💾 Armazenamento de Dados

### Camadas de Armazenamento (Prioridade)

1. **IndexedDB** (Prioridade 1)
   - Via `indexeddb-service.js`
   - Maior capacidade que localStorage
   - Melhor performance para grandes volumes
   - Persiste entre sessões

2. **localStorage** (Fallback)
   - Limite ~5-10 MB por domínio
   - Usado se IndexedDB não estiver disponível
   - Compatibilidade universal

3. **Backend (API)** (Prioridade 2 - quando disponível)
   - Dados centralizados no servidor
   - Compartilhamento entre navegadores
   - Arquivos JSON em `backend/data/`

### Chaves Utilizadas no Armazenamento

```javascript
// DADOS PRINCIPAIS
'manutencoesCadastradas'   // Array de manutenções/serviços
'viaturasCadastradas'      // Array de viaturas

// DADOS FINANCEIROS
'empenhos'                 // Array de contratos (chave mantida para compatibilidade)
'solemps'                  // Array de solemps (vinculadas a contratos)
'faturamentos'             // Array de faturamentos

// ORÇAMENTOS
'orcamentos_pagamentos'    // Array de orçamentos de pagamento
'orcamentos_compras'       // Array de orçamentos de compra

// FAINAS (ATIVIDADES)
'fainas_pendentes'         // Array de atividades pendentes
'fainas_andamento'         // Array de atividades em andamento
'fainas_finalizadas'       // Array de atividades finalizadas
'fainas_anotacoes'         // Array de anotações

// CONFIGURAÇÕES
'sismavActiveTab'          // Aba ativa do sistema
'sismavVersao'             // Versão do sistema
'sismavUltimoBackup'       // Data do último backup

// OBSOLETO (mantido para compatibilidade)
'valoresCadastrados'       // ⚠️ Não utilizado (obsoleto)
```

---

## 📊 Estrutura de Dados

### Manutenção/Serviço

```javascript
{
  id: "man_1234567890",
  tipo: "Ambulância" | "Administrativa",
  viatura: "ABC-1234",
  os: "OS-001",
  dataEntrada: "2025-01-15",
  dataSaida: "2025-01-20",
  faturamento: "1° Faturamento",
  nfPeca: "NF-001",
  dataNfPeca: "2025-01-18",
  nfServico: "NF-002",
  dataNfServico: "2025-01-19",
  valorPeca: 1500.00,
  valorServico: 800.00,
  valorTotal: 2300.00,
  singra2: "Lançado" | "Aguardando",
  preAprovado: "sim" | "nao",
  aprovado: "sim" | "nao",
  status: "Faturado" | "Pendente",
  descricao: "Descrição do serviço...",
  pdfBase64: "data:application/pdf;base64,...",  // PDF da O.S.
  pdfNfPeca: "data:application/pdf;base64,...",  // PDF da NF Peça
  pdfNfServico: "data:application/pdf;base64,..." // PDF da NF Serviço
}
```

### Contrato

```javascript
{
  id: "emp_1234567890",
  numero: "2025NE00123",
  data: "2025-01-15",
  valorTotal: 50000.00,
  valorGasto: 25000.00,
  saldo: 25000.00
}
```

### Solemp

```javascript
{
  id: "sol_1234567890",
  numero: "2025SL00456",
  empenhoId: "emp_1234567890",  // Vínculo com Contrato
  data: "2025-01-16",
  valor: 20000.00,
  descricao: "Descrição da Solemp...",
  saldo: 20000.00  // Saldo disponível após faturamentos
}
```

### Faturamento

```javascript
{
  id: "fat_1234567890",
  numero: "1° Faturamento",
  data: "2025-01-20",
  solempId: "sol_1234567890",  // Vínculo com Solemp
  pdf: "data:application/pdf;base64,...",  // PDF do faturamento
  servicosIds: ["man_123", "man_456"]  // Serviços vinculados
}
```

### Faina (Atividade)

```javascript
{
  id: "faina_1234567890",
  titulo: "Título da atividade",
  descricao: "Descrição completa...",
  status: "pendente" | "andamento" | "finalizada",
  dataCriacao: "2025-01-15T10:00:00.000Z",
  dataInicio: "2025-01-16T09:00:00.000Z",
  dataFinalizacao: "2025-01-20T17:00:00.000Z",
  responsavel: "Nome do responsável",
  prioridade: "baixa" | "media" | "alta",
  categoria: "Categoria da atividade",
  anotacoes: [
    {
      id: "anot_123",
      data: "2025-01-17T14:30:00.000Z",
      texto: "Anotação sobre a atividade...",
      autor: "Nome do autor"
    }
  ]
}
```

---

## 🔄 Sistema de Backup

### Versões de Backup Suportadas

#### Versão 1.0 (Legado)
```json
{
  "versao": "1.0",
  "dataBackup": "2025-01-15T10:00:00.000Z",
  "dados": {
    "manutencoesCadastradas": [...],
    "viaturasCadastradas": [...],
    "valoresCadastrados": [...]
  }
}
```

#### Versão 2.0 (Com Faturamentos)
```json
{
  "versao": "2.0",
  "dataBackup": "2025-01-15T10:00:00.000Z",
  "dados": {
    "manutencoesCadastradas": [...],
    "viaturasCadastradas": [...],
    "valoresCadastrados": [...],
    "orcamentos_pagamentos": [...],
    "orcamentos_compras": [...],
    "faturamentos": [...]
  }
}
```

#### Versão 3.0 (Atual - Completa)
```json
{
  "versao": "3.0",
  "dataBackup": "2025-01-15T10:00:00.000Z",
  "dados": {
    "manutencoesCadastradas": [...],
    "viaturasCadastradas": [...],
    "empenhos": [...],
    "solemps": [...],
    "valoresCadastrados": [...],
    "orcamentos_pagamentos": [...],
    "orcamentos_compras": [...],
    "faturamentos": [...],
    "fainas_pendentes": [...],
    "fainas_andamento": [...],
    "fainas_finalizadas": [...],
    "fainas_anotacoes": [...],
    "sismavActiveTab": "servicos"
  }
}
```

### Tipos de Backup

1. **Backup Manual** (via aba Backup)
   - Download automático de arquivo JSON
   - Inclui todos os dados e PDFs

2. **Backup Diário** (automático)
   - Modal aparece se não houver backup no dia
   - Salva no IndexedDB/OPFS

3. **Backup OPFS** (automático)
   - Origin Private File System
   - Persiste entre sessões
   - Acessível via aba Backup

4. **Backup em Pasta** (File System Access API)
   - Salva diretamente em pasta escolhida
   - Requer Chrome/Edge atualizado

---

## 🔌 Integração Backend

### Visão Geral

O backend foi criado para substituir o uso direto do `localStorage` no frontend. O sistema fornece funções de compatibilidade que automaticamente redirecionam as chamadas para a API quando o backend está disponível, ou usam IndexedDB/localStorage como fallback.

### Sistema de Fallback Automático

O sistema implementa fallback automático em camadas:

1. **Prioridade 1:** API do Backend (se disponível)
2. **Prioridade 2:** IndexedDB (se disponível)
3. **Prioridade 3:** localStorage (fallback final)

Isso garante que o sistema continue funcionando mesmo se o backend estiver offline.

### API Endpoints Disponíveis

```
GET    /api/health              - Verificar status do backend
GET    /api/storage             - Estatísticas de armazenamento
GET    /api/servicos            - Listar todos os serviços
GET    /api/servicos/:id        - Obter serviço por ID
POST   /api/servicos            - Criar novo serviço
PUT    /api/servicos/:id        - Atualizar serviço
DELETE /api/servicos/:id        - Excluir serviço

GET    /api/viaturas            - Listar todas as viaturas
GET    /api/viaturas/:id        - Obter viatura por ID
POST   /api/viaturas            - Criar nova viatura
PUT    /api/viaturas/:id        - Atualizar viatura
DELETE /api/viaturas/:id        - Excluir viatura

GET    /api/valores             - Listar valores (contratos/solemps)
GET    /api/orcamentos          - Listar orçamentos
GET    /api/faturamentos        - Listar faturamentos
GET    /api/fainas              - Listar fainas
POST   /api/backup              - Fazer backup
POST   /api/backup/restore      - Restaurar backup
GET    /api/folhaA4/:servicoId/:aba - Obter folha A4 salva
POST   /api/folhaA4/:servicoId/:aba - Salvar folha A4
```

### Funções de Compatibilidade Globais

```javascript
// Obter dados (tenta API primeiro, depois IndexedDB/localStorage)
const dados = await window.getData('manutencoesCadastradas');

// Salvar dados (tenta API primeiro, depois IndexedDB/localStorage)
await window.setData('manutencoesCadastradas', dados);

// Verificar conexão com backend
const backendOnline = await checkBackendConnection();
```

### Migração Gradual

#### Usar Funções de Compatibilidade (Recomendado)

**Antes:**
```javascript
const servicos = JSON.parse(localStorage.getItem('manutencoesCadastradas') || '[]');
localStorage.setItem('manutencoesCadastradas', JSON.stringify(servicos));
```

**Depois:**
```javascript
const servicos = await getData('manutencoesCadastradas');
await setData('manutencoesCadastradas', servicos);
```

### Verificar Conexão com Backend

```javascript
// No console do navegador (F12)
const backendOnline = await checkBackendConnection();

if (backendOnline) {
    console.log('✅ Backend conectado - usando API');
} else {
    console.warn('⚠️ Backend offline - usando IndexedDB/localStorage');
}
```

### Localização dos Dados

**Backend Online:**
- Dados salvos em: `backend/data/*.json`
- Compartilhado entre navegadores
- Backup automático em arquivos

**Backend Offline:**
- Dados salvos em: IndexedDB/localStorage (navegador)
- Não compartilhado entre navegadores
- Limitado ao navegador atual

---

## 🗄️ IndexedDB Service

### Funções Disponíveis

```javascript
// Inicializar
await window.indexedDBService.init();

// Obter valor
const valor = await window.indexedDBService.get('chave');

// Salvar valor
await window.indexedDBService.set('chave', valor);

// Remover valor
await window.indexedDBService.remove('chave');

// Obter todas as chaves
const chaves = await window.indexedDBService.getAllKeys();

// Obter todos os dados
const todos = await window.indexedDBService.getAll();

// Limpar tudo
await window.indexedDBService.clear();

// Obter tamanho usado
const tamanho = await window.indexedDBService.getStorageSize();

// Obter estimativa de armazenamento
const estimativa = await window.indexedDBService.getStorageEstimate();
```

### Verificar IndexedDB

#### Método 1: Usando o Console do Navegador (Mais Fácil)

1. Abra o sistema SISMAV no navegador
2. Pressione `F12` ou `Ctrl+Shift+I`
3. Vá para a aba **Console**
4. Execute:

```javascript
// Verificar dados no IndexedDB
await window.verificarIndexedDB()

// Comparar com localStorage
await window.compararArmazenamento()
```

#### Método 2: Usando as Ferramentas de Desenvolvedor (DevTools)

**Chrome/Edge/Brave:**
1. Abrir DevTools: `F12` ou `Ctrl+Shift+I`
2. Ir para a aba **Application** (ou **Aplicativo**)
3. No menu lateral esquerdo, expandir **Storage**
4. Clicar em **IndexedDB**
5. Expandir **SISMAV_DB** → **sismav_data**
6. Ver todas as chaves e valores armazenados

**Firefox:**
1. Abrir DevTools: `F12` ou `Ctrl+Shift+I`
2. Ir para a aba **Storage**
3. Expandir **IndexedDB**
4. Expandir **SISMAV_DB** → **sismav_data**
5. Ver todas as chaves e valores

#### Método 3: Verificar Programaticamente

```javascript
// Verificar se o IndexedDB está inicializado
window.indexedDBService.db

// Obter uma chave específica
await window.getData('manutencoesCadastradas')

// Ver todas as chaves
await window.indexedDBService.getAllKeys()

// Ver todos os dados
await window.indexedDBService.getAll()

// Calcular tamanho usado
await window.indexedDBService.getStorageSize()
```

#### Exemplo de Saída Esperada

Quando você executar `await window.verificarIndexedDB()`, você verá:

```
🔍 Verificando dados no IndexedDB...

📊 Total de chaves armazenadas: 7

📋 Chaves armazenadas:
   1. manutencoesCadastradas
   2. viaturasCadastradas
   3. contratos (chave: empenhos)
   4. solemps
   5. orcamentos_pagamentos
   6. faturamentos
   7. sismavActiveTab

💾 Estatísticas de Armazenamento:
   Usado: 245.67 KB
   Quota disponível: 50.00 GB
   Percentual usado: 0.0005%

✅ Verificação concluída!
```

### Solução de Problemas - IndexedDB

**Se não encontrar dados no IndexedDB:**
1. Verificar se há dados no localStorage:
   ```javascript
   localStorage.length
   Object.keys(localStorage)
   ```
2. Forçar migração manual:
   ```javascript
   await window.migrateLocalStorageToIndexedDB()
   ```
3. Verificar erros no console (F12)

**Se o IndexedDB não estiver disponível:**
- Alguns navegadores ou contextos (modo privado, algumas extensões) podem bloquear o IndexedDB
- Nesse caso, o sistema usa automaticamente o localStorage como fallback

---

## 🏗️ Arquitetura do Sistema

### Frontend

- **HTML5 + CSS3 + JavaScript Vanilla**
- **Sistema de abas** com iframes
- **IndexedDB** para armazenamento local
- **PDF.js** para visualização de PDFs
- **Chart.js** para gráficos
- **Tesseract.js** para OCR
- **jsPDF** para geração de PDFs
- **html2canvas** para captura de tela

### Backend

- **Node.js + Express**
- **Arquivos JSON** para armazenamento
- **RESTful API**
- **CORS habilitado**
- **Body Parser** para JSON grande (50MB)

### Fluxo de Dados

```
Frontend (Browser)
    ↓
IndexedDB Service
    ↓
API Service (se backend online)
    ↓
Backend Server (Node.js)
    ↓
Arquivos JSON (backend/data/)
```

---

## 📝 Notas Técnicas Importantes

### Limites de Armazenamento

- **localStorage:** ~5-10 MB por domínio
- **IndexedDB:** ~50% do espaço livre do disco (geralmente vários GB)
- **Backend:** Ilimitado (depende do disco)

### PDFs em Base64

- PDFs são convertidos para base64 para armazenamento
- Tamanho aumenta ~33% na conversão
- Recomenda-se fazer backup externo para grandes volumes

### Compatibilidade de Navegadores

- ✅ Chrome 90+ (recomendado)
- ✅ Edge 90+
- ✅ Firefox 88+
- ⚠️ Safari 14+ (suporte parcial a algumas APIs)
- ❌ Internet Explorer (não suportado)

---

**Para mais detalhes sobre alterações específicas, consulte `HISTORICO_ALTERACOES.md`**

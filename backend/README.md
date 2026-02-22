# SISMAV Backend API

Backend Node.js para o Sistema de Manutenção de Viaturas (SISMAV).

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## Endpoints da API

### Serviços
- `GET /api/servicos` - Listar todos os serviços
- `GET /api/servicos/:id` - Obter serviço por ID
- `POST /api/servicos` - Criar novo serviço
- `PUT /api/servicos/:id` - Atualizar serviço
- `DELETE /api/servicos/:id` - Deletar serviço
- `GET /api/servicos/search/filter` - Buscar serviços por filtros

### Viaturas
- `GET /api/viaturas` - Listar todas as viaturas
- `GET /api/viaturas/:id` - Obter viatura por ID
- `POST /api/viaturas` - Criar nova viatura
- `PUT /api/viaturas/:id` - Atualizar viatura
- `DELETE /api/viaturas/:id` - Deletar viatura

### Valores
- `GET /api/valores` - Obter todos os valores
- `POST /api/valores` - Salvar/Atualizar valores
- `PUT /api/valores/:id` - Atualizar valores

### Orçamentos
- `GET /api/orcamentos` - Listar todos os orçamentos
- `GET /api/orcamentos/:id` - Obter orçamento por ID
- `POST /api/orcamentos` - Criar novo orçamento
- `PUT /api/orcamentos/:id` - Atualizar orçamento
- `DELETE /api/orcamentos/:id` - Deletar orçamento

### Faturamentos
- `GET /api/faturamentos` - Listar todos os faturamentos
- `GET /api/faturamentos/:id` - Obter faturamento por ID
- `POST /api/faturamentos` - Criar novo faturamento
- `PUT /api/faturamentos/:id` - Atualizar faturamento
- `DELETE /api/faturamentos/:id` - Deletar faturamento

### Fainas
- `GET /api/fainas` - Listar todas as fainas
- `GET /api/fainas/:id` - Obter faina por ID
- `POST /api/fainas` - Criar nova faina
- `PUT /api/fainas/:id` - Atualizar faina
- `DELETE /api/fainas/:id` - Deletar faina

### Backup
- `GET /api/backup/export` - Exportar backup completo
- `POST /api/backup/import` - Importar backup completo
- `DELETE /api/backup/clear` - Limpar todos os dados

### Folha A4 (Modal de Impressão)
- `GET /api/folhaA4/:servicoId/:abaNome` - Obter conteúdo da folha
- `POST /api/folhaA4/:servicoId/:abaNome` - Salvar conteúdo da folha
- `PUT /api/folhaA4/:servicoId/:abaNome` - Atualizar conteúdo da folha
- `DELETE /api/folhaA4/:servicoId/:abaNome` - Deletar conteúdo da folha

### Utilitários
- `GET /api/health` - Health check
- `GET /api/storage` - Estatísticas de armazenamento

## Armazenamento

Os dados são armazenados em arquivos JSON no diretório `data/`. Cada tipo de dado tem seu próprio arquivo:
- `manutencoesCadastradas.json`
- `viaturasCadastradas.json`
- `valores.json`
- `orcamentos.json`
- `faturamentos.json`
- `fainas.json`
- `folhaA4_*.json` (para cada serviço e aba)

## Porta

O servidor roda na porta 3000 por padrão. Para alterar, defina a variável de ambiente `PORT`:

```bash
PORT=8080 npm start
```











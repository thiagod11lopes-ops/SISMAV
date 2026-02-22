# Guia de Instalação do Backend SISMAV

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (geralmente vem com Node.js)

## Instalação

1. **Navegue até a pasta do backend:**
```bash
cd backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## Desenvolvimento

Para desenvolvimento com auto-reload (recomendado):
```bash
npm run dev
```

## Migração de Dados do LocalStorage

Para migrar dados existentes do localStorage para o backend:

1. **No navegador, exporte os dados do localStorage:**
   - Abra o console do navegador (F12)
   - Execute o seguinte código:
   ```javascript
   const data = {};
   for (let i = 0; i < localStorage.length; i++) {
       const key = localStorage.key(i);
       data[key] = JSON.parse(localStorage.getItem(key));
   }
   const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'localStorage_backup.json';
   a.click();
   ```

2. **Salve o arquivo `localStorage_backup.json` na pasta `backend`**

3. **Execute o script de migração:**
```bash
node migrate.js
```

## Configuração do Frontend

O arquivo `api-service.js` já está configurado para se conectar ao backend em `http://localhost:3000`.

Se você precisar alterar a URL do backend, edite a constante `API_BASE_URL` no arquivo `api-service.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Estrutura de Dados

Os dados são armazenados em arquivos JSON na pasta `backend/data/`:
- `manutencoesCadastradas.json` - Serviços de manutenção
- `viaturasCadastradas.json` - Viaturas cadastradas
- `valores.json` - Valores financeiros
- `orcamentos.json` - Orçamentos
- `faturamentos.json` - Faturamentos
- `fainas.json` - Fainas
- `folhaA4_*.json` - Conteúdo das folhas A4 do modal de impressão

## Testando a API

Você pode testar se a API está funcionando acessando:
- `http://localhost:3000/api/health` - Health check
- `http://localhost:3000/api/storage` - Estatísticas de armazenamento

## Solução de Problemas

### Porta já em uso
Se a porta 3000 estiver em uso, você pode alterar definindo a variável de ambiente:
```bash
PORT=8080 npm start
```

### CORS Errors
O backend já está configurado com CORS habilitado. Se ainda houver problemas, verifique se o frontend está acessando a URL correta.

### Dados não aparecem
1. Verifique se o servidor está rodando
2. Verifique se os dados foram migrados corretamente
3. Verifique o console do navegador para erros











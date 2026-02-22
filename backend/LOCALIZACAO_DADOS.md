# 📁 Localização dos Dados do SISMAV

## Pasta Principal

Todos os dados do backend são salvos na pasta:

```
C:\Users\anamr\OneDrive\Área de Trabalho\Projetos\SISMAV\backend\data\
```

## Estrutura de Arquivos

A pasta `data/` contém os seguintes arquivos JSON:

### Dados Principais

1. **`manutencoesCadastradas.json`**
   - Todos os serviços de manutenção cadastrados
   - Localização: `backend/data/manutencoesCadastradas.json`

2. **`viaturasCadastradas.json`**
   - Todas as viaturas cadastradas no sistema
   - Localização: `backend/data/viaturasCadastradas.json`

3. **`valores.json`**
   - Valores financeiros e configurações de preços
   - Localização: `backend/data/valores.json`

4. **`orcamentos.json`**
   - Todos os orçamentos gerados
   - Localização: `backend/data/orcamentos.json`

5. **`faturamentos.json`**
   - Registros de faturamento
   - Localização: `backend/data/faturamentos.json`

6. **`fainas.json`**
   - Registros de fainas
   - Localização: `backend/data/fainas.json`

7. **`folhasA4.json`**
   - Conteúdo das folhas A4 do modal de impressão
   - Armazena HTML e dados de canvas para cada serviço e aba
   - Localização: `backend/data/folhasA4.json`

## Caminho Completo

```
C:\Users\anamr\OneDrive\Área de Trabalho\Projetos\SISMAV\
└── backend/
    └── data/                    ← TODOS OS DADOS FICAM AQUI
        ├── manutencoesCadastradas.json
        ├── viaturasCadastradas.json
        ├── valores.json
        ├── orcamentos.json
        ├── faturamentos.json
        ├── fainas.json
        └── folhasA4.json
```

## Criação Automática

⚠️ **Importante:** A pasta `data/` é criada **automaticamente** quando o servidor inicia pela primeira vez.

Você não precisa criar manualmente. O sistema faz isso sozinho!

## Backup

### Fazer Backup Manual

1. **Copiar a pasta inteira:**
   ```
   Copiar: backend/data/
   Para:   [pasta de backup]/data/
   ```

2. **Ou copiar arquivos individuais:**
   - Copie os arquivos `.json` que deseja fazer backup
   - Guarde em local seguro

### Backup Automático via API

Você pode exportar todos os dados via API:
```
GET http://localhost:3000/api/backup/export
```

Isso retorna um JSON com todos os dados do sistema.

## Restaurar Dados

### Restaurar Backup Manual

1. Pare o servidor backend
2. Substitua os arquivos na pasta `backend/data/`
3. Inicie o servidor novamente

### Restaurar via API

```
POST http://localhost:3000/api/backup/import
Body: { dados do backup }
```

## Formato dos Arquivos

Todos os arquivos são **JSON** formatado (com indentação), facilitando:
- ✅ Leitura manual
- ✅ Edição se necessário
- ✅ Backup e restauração
- ✅ Migração futura para banco de dados

### Exemplo de Estrutura:

```json
[
  {
    "id": "1234567890",
    "tipo": "Ambulância",
    "descricao": "Manutenção preventiva",
    "createdAt": "2025-01-05T10:30:00.000Z",
    "updatedAt": "2025-01-05T10:30:00.000Z"
  }
]
```

## Tamanho dos Arquivos

- **Arquivos pequenos:** Geralmente alguns KB
- **Arquivos médios:** Com muitos registros, podem chegar a alguns MB
- **folhasA4.json:** Pode ser maior devido ao conteúdo HTML e imagens

## Limpeza de Dados

⚠️ **Cuidado:** Não delete arquivos manualmente enquanto o servidor está rodando!

Para limpar dados, use a API:
```
DELETE http://localhost:3000/api/backup/clear
```

Ou delete os arquivos quando o servidor estiver parado.

## Migração Futura

A estrutura atual usa arquivos JSON, mas pode ser facilmente migrada para:
- ✅ Banco de dados SQL (MySQL, PostgreSQL)
- ✅ Banco NoSQL (MongoDB)
- ✅ Outros sistemas de armazenamento

A pasta `data/` continuará existindo para backups e migrações.











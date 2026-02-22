# 📝 Histórico de Alterações - SISMAV

**Documentação consolidada de todas as alterações realizadas no sistema**

---

## 📊 Relatórios de Verificação

### Relatório de Verificação 2025 (17/11/2025)
**Versão:** 3.0  
**Status:** ✅ **SISTEMA FUNCIONANDO COM CORREÇÕES APLICADAS**

**Principais Correções:**
- ✅ Backup agora inclui Contratos e Solemps
- ✅ Restauração de backup atualizada para incluir Contratos e Solemps
- ✅ Versão do backup atualizada para 3.0
- ✅ Limpeza de dados atualizada para incluir Contratos e Solemps
- ✅ Estatísticas atualizadas para suportar Contratos e Solemps

**Estrutura de Dados Verificada:**
- ✅ manutencoesCadastradas (com PDFs)
- ✅ viaturasCadastradas
- ✅ Contratos (empenhos) ← AGORA INCLUÍDO NO BACKUP
- ✅ solemps ← AGORA INCLUÍDO NO BACKUP
- ✅ valoresCadastrados (obsoleto, mantido para compatibilidade)
- ✅ orcamentos_pagamentos
- ✅ orcamentos_compras
- ✅ faturamentos (com PDFs)
- ✅ fainas_pendentes, fainas_andamento, fainas_finalizadas, fainas_anotacoes

---

## 🔄 Alterações Recentes

### 2025-01-XX - Otimização e Consolidação de Documentação
- ✅ **Consolidado:** Guias de início em README.md
- ✅ **Consolidado:** Documentação técnica em DOCUMENTACAO_TECNICA.md
- ✅ **Consolidado:** Histórico de alterações em HISTORICO_ALTERACOES.md
- ✅ **Removido:** 12 arquivos de documentação duplicados
- ✅ **Criado:** Estrutura de documentação organizada

### 2025-01-XX - Remoção da Janela de Boas-Vindas
- ❌ **Removido:** Janela BemVindo.html
- ❌ **Removido:** Sistema de bloqueio na inicialização
- ✅ **Adicionado:** Inicialização direta do sistema
- ✅ **Adicionado:** Verificação de versão automática
- ✅ **Mantido:** Modal de backup diário (aparece quando necessário)

### 2025-01-XX - Otimização do Sistema
- ❌ **Removido:** GerenciarServicos_backup.html (arquivo não utilizado)
- ❌ **Removido:** BemVindo.html (removido do sistema)
- ✅ **Criado:** RELATORIO_OTIMIZACAO.md
- ✅ **Consolidado:** Documentação em arquivos organizados

---

## 📋 Alterações Históricas Consolidadas

### 1. Alteração do Card "Valores" para "Solemps com Saldo"
**Data:** 22/10/2025 10:13  
**Arquivo:** `Backup.html`

**Mudanças:**
- Card "Valores" (sempre mostrava 0) substituído por card interativo
- Agora mostra quantidade de Solemps com saldo disponível
- Lista detalhada de cada Solemp com número e saldo
- Apenas Solemps com saldo > 0 são exibidas
- Card clicável para expandir/recolher

---

### 2. Implementação de Exclusão em Cascata
**Data:** 22/10/2025 09:33  
**Arquivo:** `Valores.html`

**Funcionalidade:**
- Permite exclusão de Contratos e Solemps mesmo com itens vinculados
- Exclusão automática de todos os itens dependentes
- Hierarquia: Contrato → Solemps → Faturamentos → Serviços
- Avisos detalhados mostrando tudo que será excluído

---

### 3. Implementação de Exclusão com Avisos Detalhados
**Data:** 22/10/2025 09:05  
**Arquivo:** `Valores.html`

**Funcionalidades:**
- Exclusão de Contratos com validações
- Não permite excluir contrato com Solemps (sem cascata)
- Exclusão de Solemps com validações
- Exclusão de Faturamentos (reversão)
- Avisos prévios detalhados para todas as operações

---

### 4. Correção dos Botões de Exclusão
**Data:** 22/10/2025 09:30  
**Arquivo:** `Valores.html`

**Problema:** Botões de exclusão não funcionavam na aba "Resumo Financeiro"

**Solução:**
- Adicionado `window.` antes de `handleDelete` em todos os botões
- Corrigido acesso a funções no escopo global
- Todos os botões de exclusão agora funcionam corretamente

---

### 5. Simplificação da Aba Backup
**Data:** 22/10/2025 07:45  
**Arquivo:** `Backup.html`

**Removido:**
- ❌ Backup em Pasta (File System Access API)
- ❌ Verificar Dados no Sistema

**Mantido:**
- ✅ Estatísticas do Sistema
- ✅ Fazer Backup Geral
- ✅ Importar Backup
- ✅ Limpar Todos os Dados

**Redução:** ~43% menos código

---

### 6. Correção do Backup - Contratos e Solemps
**Data:** 17/11/2025  
**Versão:** 3.0

**Problema Crítico:** Backup não incluía Contratos e Solemps

**Correção:**
- ✅ Adicionado `empenhos` (Contratos) ao backup
- ✅ Adicionado `solemps` ao backup
- ✅ Versão do backup atualizada para 3.0
- ✅ Restauração atualizada para incluir Contratos e Solemps
- ✅ Estatísticas atualizadas

---

### 7. Implementação de Gráficos no Balanço
**Data:** 22/10/2025 10:43  
**Arquivo:** `Balanco.html`

**Gráficos Adicionados:**
1. Custos por Tipo de Viatura (Pizza)
2. Top 5 Viaturas - Maior Gasto (Barras)
3. Evolução Mensal de Gastos (Linha)
4. Dias em Manutenção por Viatura (Barras Horizontais)
5. Contratos vs Solemps vs Faturamentos (Rosca)
6. Status dos Serviços (Pizza)

**Biblioteca:** Chart.js 4.4.0

---

### 8. Estrutura de Dados - Fainas em Andamento
**Data:** Documentado  
**Arquivo:** `Fainas.html`

**Estrutura implementada:**
- Fainas pendentes
- Fainas em andamento
- Fainas finalizadas
- Sistema de anotações
- Histórico de edições

---

## 📊 Versões do Sistema

### Versão 3.0 (Atual)
- ✅ Backup completo (inclui Contratos e Solemps)
- ✅ Remoção da janela de boas-vindas
- ✅ Otimização do código
- ✅ Documentação consolidada

### Versão 2.0
- ✅ Adicionado Faturamentos ao backup
- ✅ Melhorias na interface

### Versão 1.0
- ✅ Versão inicial do sistema

---

## 🔧 Correções Técnicas

### Código Duplicado Removido
- Funções de bloqueio/desbloqueio do sistema
- Referências à janela de boas-vindas
- Overlay de bloqueio (CSS e HTML)

### Código Consolidado
- Função de backup geral unificada
- Sistema de verificação de versão
- Inicialização simplificada

---

**Para mais detalhes sobre cada alteração, consulte os arquivos individuais de documentação.**

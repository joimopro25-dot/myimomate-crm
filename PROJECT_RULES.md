# 📋 REGRAS FUNDAMENTAIS - MyImoMate 2.0

## 🎯 **PRINCÍPIOS INQUEBRÁVEIS**

### **🧠 ANTES DE QUALQUER CÓDIGO**
```
1. 📖 LER SEMPRE O PROJECT KNOWLEDGE PRIMEIRO
   - Usar project_knowledge_search para entender contexto
   - Verificar memory.md atual antes de qualquer alteração
   - Compreender arquitetura existente
   - Identificar padrões já estabelecidos
```

### **📏 LIMITES TÉCNICOS RÍGIDOS**
```
2. 🚫 NUNCA ULTRAPASSAR 700 LINHAS POR FICHEIRO
   - Ficheiro > 600 linhas = ALERTA
   - Ficheiro > 700 linhas = DIVIDIR IMEDIATAMENTE
   - Criar mais ficheiros e pastas sempre que necessário
   - Modularidade > Conveniência
```

### **🔨 METODOLOGIA DE DESENVOLVIMENTO**
```
3. ✋ UM FICHEIRO DE CADA VEZ
   - Focar numa tarefa específica por vez
   - Completar e testar antes de passar ao próximo
   - Não criar múltiplos ficheiros simultaneamente
   - Qualidade > Velocidade
```

### **📝 DOCUMENTAÇÃO OBRIGATÓRIA**
```
4. 📋 ATUALIZAR MEMORY.MD SEMPRE
   - Adicionar progresso no final do memory.md
   - Manter base histórica intacta
   - Documentar decisões importantes
   - Registar problemas resolvidos
```

### **🔄 CONTROLO DE VERSÃO DISCIPLINADO**
```
5. 💾 COMMIT APÓS CADA FICHEIRO
   git add .
   git commit -m "✅ [COMPONENTE] - Descrição específica"
   git push
   
   Exemplos:
   git commit -m "✅ ClientsHeader.jsx - Componente header modular <700 linhas"
   git commit -m "✅ clientsCrud.js - Service CRUD separado do documentsService"
   git commit -m "✅ Memory atualizado - Refactoring ClientsPage completo"
```

---

## 🏗️ **REGRAS ARQUITETURAIS**

### **📁 ESTRUTURA OBRIGATÓRIA**
```
src/features/[module]/
├── components/
│   ├── [feature]/          # Máx 5 componentes por pasta
│   │   ├── Component.jsx   # Máx 700 linhas
│   │   └── index.js        # Export barrel
│   └── shared/             # Componentes reutilizáveis
├── pages/
│   ├── [Module]Page.jsx    # Máx 300 linhas (apenas orquestração)
│   └── [Module]Detail.jsx  # Máx 400 linhas
├── hooks/
│   ├── use[Feature].js     # Máx 500 linhas por hook
│   └── use[Specific].js    # Dividir por responsabilidade
├── services/
│   ├── [feature]/          # Dividir por funcionalidade
│   │   ├── [feature]Crud.js    # Máx 400 linhas
│   │   ├── [feature]Query.js   # Máx 300 linhas
│   │   └── [feature]Utils.js   # Máx 200 linhas
├── stores/
│   └── [module]Store.js    # Máx 500 linhas
├── types/
│   ├── index.js           # Máx 300 linhas
│   └── enums.js           # Máx 200 linhas
└── utils/
    ├── [module]Utils.js   # Máx 400 linhas
    └── [specific]Utils.js # Dividir por função
```

### **🎯 RESPONSABILIDADES CLARAS**
```
PÁGINAS (Máx 300 linhas):
- Apenas orquestração de componentes
- Gestão de estado da página
- Routing e navegação

COMPONENTES (Máx 700 linhas):
- Uma responsabilidade específica
- UI e lógica relacionada
- Props bem definidas

HOOKS (Máx 500 linhas):
- Uma funcionalidade específica
- Estado e lógica encapsulados
- Reutilização clara

SERVICES (Máx 400 linhas):
- Uma área funcional específica
- API calls relacionadas
- Error handling específico
```

---

## ⚡ **WORKFLOW OBRIGATÓRIO**

### **🔄 CICLO DE DESENVOLVIMENTO**
```
1. 📖 ANÁLISE
   → project_knowledge_search para entender contexto
   → Ler memory.md atual
   → Identificar ficheiros relacionados
   → Planear abordagem modular

2. 🏗️ PLANEAMENTO
   → Dividir tarefa em ficheiros <700 linhas
   → Definir estrutura de pastas necessária
   → Identificar dependências
   → Escolher um ficheiro para começar

3. 💻 IMPLEMENTAÇÃO
   → Criar/modificar UM ficheiro por vez
   → Verificar linha count regularmente
   → Testar funcionalidade específica
   → Refactorar se aproximar de 600 linhas

4. 📝 DOCUMENTAÇÃO
   → Atualizar memory.md com progresso
   → Documentar decisões importantes
   → Registar problemas e soluções

5. 💾 COMMIT
   → git add .
   → git commit -m "✅ [COMPONENTE] - Descrição"
   → git push
   → Confirmar que subiu correctamente

6. 🔄 REPETIR
   → Próximo ficheiro da lista
   → Manter foco numa tarefa específica
```

### **🚨 SINAIS DE ALERTA**
```
PARAR IMEDIATAMENTE SE:
❌ Ficheiro atingir 600+ linhas
❌ Misturar responsabilidades diferentes
❌ Criar código sem ler project knowledge
❌ Saltar etapa de commit
❌ Não atualizar memory.md

AÇÃO CORRETIVA:
✅ Dividir ficheiro em múltiplos
✅ Separar responsabilidades
✅ Voltar ao project knowledge
✅ Fazer commit imediatamente
✅ Atualizar documentação
```

---

## 📊 **MÉTRICAS DE QUALIDADE**

### **🎯 OBJETIVOS MENSURÁVEIS**
```
FICHEIROS:
✅ 100% dos ficheiros <700 linhas
✅ 90% dos componentes <500 linhas
✅ 95% dos services <400 linhas

ESTRUTURA:
✅ Máx 5 componentes por pasta
✅ Separação clara de responsabilidades
✅ Imports organizados por categoria

DOCUMENTAÇÃO:
✅ Memory.md atualizado após cada sessão
✅ Commits descritivos e específicos
✅ Histórico de decisões preservado

PERFORMANCE:
✅ Loading time <2s por página
✅ Bundle size otimizado
✅ Zero memory leaks
```

### **📈 TRACKING DE PROGRESSO**
```
DAILY CHECKLIST:
□ Li project knowledge antes de começar?
□ Planeei divisão modular da tarefa?
□ Todos os ficheiros estão <700 linhas?
□ Fiz commit após cada ficheiro?
□ Atualizei memory.md com progresso?
□ Testei funcionalidade implementada?

WEEKLY REVIEW:
□ Arquitetura mantém-se consistente?
□ Não há technical debt acumulado?
□ Performance mantém-se otimizada?
□ Documentação está atualizada?
□ Git history está organizado?
```

---

## 🎨 **PADRÕES DE CÓDIGO**

### **📝 CONVENÇÕES OBRIGATÓRIAS**
```javascript
// IMPORTS ORGANIZADOS
import React from 'react';                    // React
import { useState, useEffect } from 'react';  // React hooks
import { motion } from 'framer-motion';       // External libs
import { Plus, Edit } from 'lucide-react';    // Icons

import { useAuth } from '@/shared/hooks';     // Shared hooks
import { ClientCard } from './clientCard';    // Local components
import { formatCurrency } from '../utils';   // Local utils

// COMPONENTE ESTRUTURADO
const ComponentName = ({ prop1, prop2 }) => {
  // =========================================
  // 🎣 HOOKS & STATE (máx 50 linhas)
  // =========================================
  
  // =========================================
  // 🔄 EFFECTS (máx 30 linhas)
  // =========================================
  
  // =========================================
  // 📋 HANDLERS (máx 100 linhas)
  // =========================================
  
  // =========================================
  // 🧠 COMPUTED VALUES (máx 50 linhas)
  // =========================================
  
  // =========================================
  // 🎨 RENDER (máx 400 linhas)
  // =========================================
  
  return (
    // JSX limpo e organizado
  );
};

export default ComponentName;
```

### **🔧 ESTRUTURA DE SERVICES**
```javascript
// services/clients/clientsCrud.js (Máx 400 linhas)

import { db } from '@/shared/services/firebase';
import { validateClientData } from '../utils';

// =========================================
// 📋 CRUD OPERATIONS
// =========================================

export const createClient = async (userId, clientData) => {
  // Implementação específica
};

export const updateClient = async (userId, clientId, updates) => {
  // Implementação específica
};

// Máximo 10 funções por service
// Se mais que 10, dividir em múltiplos services
```

---

## 🚀 **EXECUÇÃO IMEDIATA**

### **🎯 PRÓXIMOS PASSOS**
```
HOJE:
1. 📖 Analisar ficheiros atuais >700 linhas
2. 📋 Priorizar refactoring por impacto
3. 🔧 Dividir ClientsPage.jsx (1200→4 ficheiros)
4. 💾 Commit cada divisão separadamente
5. 📝 Atualizar memory.md com progresso

ESTA SEMANA:
1. 🔧 Refactorar todos os ficheiros >700 linhas
2. 🏗️ Criar estrutura de pastas completa
3. 📊 Implementar métricas de qualidade
4. 📝 Documentar nova arquitetura
5. 🧪 Testar performance após refactoring
```

### **📞 ACCOUNTABILITY**
```
PERGUNTA OBRIGATÓRIA ANTES DE CADA TAREFA:
"Este código respeita as 5 regras fundamentais?"

1. ✅ Li o project knowledge?
2. ✅ Ficheiro ficará <700 linhas?
3. ✅ É apenas um ficheiro por vez?
4. ✅ Vou atualizar memory.md?
5. ✅ Vou fazer commit imediatamente?

SE ALGUMA RESPOSTA FOR "NÃO" → PARAR E REORGANIZAR
```

---

## 💎 **FILOSOFIA INQUEBRÁVEL**

### **🎯 MANTRA DO PROJETO**
```
"QUALIDADE ANTES DE FUNCIONALIDADE"
"MODULARIDADE ANTES DE CONVENIÊNCIA"  
"DOCUMENTAÇÃO ANTES DE DESENVOLVIMENTO"
"UM FICHEIRO DE CADA VEZ"
"NUNCA MAIS QUE 700 LINHAS"
```

### **🏆 RESULTADO ESPERADO**
Um CRM que consultores **ADORAM usar** - construído com a mais alta qualidade técnica, maintível por qualquer developer, e escalável para o futuro.

**ESTAS REGRAS SÃO INQUEBRÁVEIS. SEGUIR SEMPRE. SEM EXCEÇÕES.**
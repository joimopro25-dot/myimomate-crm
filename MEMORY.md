🧠 MEMÓRIA DO PROJETO - MyImoMate 2.0
📋 RESUMO EXECUTIVO
Projeto: MyImoMate 2.0 - CRM Imobiliário Inteligente
Status: ✅ Estrutura Base Criada | 🚧 Desenvolvendo Módulo Clientes
Última Atualização: 12 Agosto 2025
Linguagem: JavaScript (React + Vite + Firebase)

🎯 VISÃO GERAL DO PROJETO
Objetivo Principal:
Criar a espinha dorsal escalável de um CRM imobiliário com foco inicial no módulo Clientes super completo.

Arquitetura Decidida:
Frontend: React 18 + Vite + JavaScript
Styling: TailwindCSS com design system customizado
Backend: Firebase (Auth + Firestore + Storage)
Estado: Zustand + React Query
Formulários: React Hook Form + Zod
Estrutura: Modular e escalável (max 700 linhas por arquivo)
🏗️ ESTRUTURA DE MÓDULOS APROVADA
ESPINHA DORSAL:
🔐 Authentication System - Login/Register/Session
📊 Dashboard - Overview e KPIs
👥 Clientes - Base completa (FOCO ATUAL)
🎯 Leads - Pipeline básico
📋 Tarefas - Sistema de tasks
📅 Calendário - Eventos e lembretes
PRIORIDADE ATUAL:
Módulo Clientes com estrutura super completa aprovada.

📂 ESTRUTURA DE PASTAS CRIADA
src/
├── app/                    # Configurações gerais da app
├── features/              # Módulos principais
│   ├── auth/             # Autenticação
│   ├── dashboard/        # Dashboard principal
│   ├── clients/          # 🎯 MÓDULO ATUAL
│   ├── leads/            # Pipeline de leads
│   ├── tasks/            # Sistema de tarefas
│   └── calendar/         # Calendário e eventos
├── shared/               # Recursos compartilhados
│   ├── components/       # Componentes reutilizáveis
│   ├── hooks/            # Custom hooks
│   ├── services/         # APIs e integrações
│   ├── utils/            # Funções utilitárias
│   ├── stores/           # Estados globais
│   └── types/            # TypeScript definitions
└── assets/               # Recursos estáticos
🎯 MÓDULO CLIENTES - ESPECIFICAÇÃO COMPLETA
DADOS DO CLIENTE (Estrutura Aprovada):
📋 DADOS PESSOAIS:
Nome, Morada, Telefone, Email
Data Nascimento, Naturalidade, Nacionalidade, Residência
NIF, Contribuinte, Nº Cartão Cidadão
Estado Civil
💑 DADOS DO CÔNJUGE (se casado):
Nome do Cônjuge + todos os dados pessoais
Comunhão de Bens (geral/separação/adquiridos)
🏦 DADOS BANCÁRIOS:
Banco, IBAN, SWIFT
📄 DOCUMENTOS:
Upload múltiplo de documentos pessoais
Categorização e organização
Preview e download
📧 CONFIGURAÇÕES DE COMUNICAÇÃO:
Switch: Enviar emails de aniversário
Switch: Lembretes de visitas
Switch: Lembretes de pagamentos
Switch: Eventos gerais
🎭 SYSTEM DE ROLES:
Cliente pode ser (múltiplos roles simultâneos):

Investidor
Comprador
Vendedor
Senhorio
Inquilino
🤝 DEALS/NEGÓCIOS:
Cada role pode ter múltiplos negócios
Histórico de transações
Status e valores
📁 ARQUIVOS DO MÓDULO CLIENTES (A CRIAR)
🗂️ ESTRUTURA DETALHADA:
src/features/clients/
├── types/
│   ├── index.js           # Interfaces principais
│   └── enums.js          # Enumerações
├── components/
│   ├── forms/            # Formulários
│   ├── cards/            # Cards de cliente
│   ├── lists/            # Listas e tabelas
│   └── modals/           # Modais
├── services/
│   ├── clientsService.js # CRUD Firebase
│   └── documentsService.js # Upload docs
├── hooks/
│   ├── useClients.js     # Hook principal
│   ├── useClientForm.js  # Hook formulários
│   └── useClientDocuments.js # Hook documentos
├── stores/
│   └── clientsStore.js   # Estado Zustand
└── pages/
    ├── ClientsPage.jsx   # Página principal
    ├── ClientDetailPage.jsx # Detalhes
    └── CreateClientPage.jsx # Criar novo
✅ PROGRESSO ATUAL
FEITO:
 Estrutura de pastas completa criada
 Configurações base (package.json, vite, tailwind)
 Firebase configurado
 Aliases de import configurados
 App.jsx com roteamento básico
 Especificação completa do módulo Clientes aprovada
EM ANDAMENTO:
 🚧 Criação do módulo Clientes
PRÓXIMOS PASSOS:
Types/Interfaces para Clientes
Zustand Store para gestão de estado
Firebase Services para CRUD
Componentes da interface
Páginas do módulo
🎨 DESIGN SYSTEM
CORES APROVADAS:
Primary: Blue scale (500: #3b82f6)
Success: Green scale (500: #22c55e)
Warning: Yellow scale (500: #f59e0b)
Danger: Red scale (500: #ef4444)
Gray: Neutral scale
COMPONENTES BASE:
Cards com shadow-soft
Buttons com hover states
Forms com validação visual
Modals responsivos
🔄 METODOLOGIA DE DESENVOLVIMENTO
PRINCÍPIOS:
Arquivos pequenos (max 700 linhas)
Modularidade total
Reutilização de componentes
Performance otimizada
Escalabilidade futura
STACK TÉCNICO:
React 18 com hooks modernos
Zustand para estado global simples
React Query para cache e sincronização
React Hook Form para formulários performantes
Zod para validação de schemas
Firebase v10 para backend
📝 DECISÕES ARQUITETURAIS
Por que JavaScript e não TypeScript?
Maior agilidade de desenvolvimento
Menor complexidade inicial
Equipe mais confortável com JS
Possível migração futura gradual
Por que Zustand e não Redux?
Menos boilerplate
API mais simples
Performance nativa
Melhor para projetos médios
Por que React Query?
Cache inteligente
Sincronização automática
Estados de loading/error
Refetch em background
🚀 ROADMAP FUTURO
FASE 1: Clientes (ATUAL)
Módulo completo de clientes
CRUD + Upload + Roles + Deals
FASE 2: Core Features
Dashboard com métricas
Sistema de autenticação
Leads básico
FASE 3: Funcionalidades Avançadas
Tarefas e calendário
Relatórios avançados
Integrações externas
FASE 4: Otimizações
Performance improvements
Mobile responsiveness
PWA features
🔗 LINKS IMPORTANTES
Repo GitHub: [Link do repositório]
Firebase Console: [Link do projeto Firebase]
Design System: TailwindCSS customizado
Documentação: Este arquivo
📞 CONTATOS E NOTAS
EQUIPE:
Desenvolvedor Principal: [Nome]
Designer: [Nome]
Product Owner: [Nome]
REUNIÕES:
Daily: [Horário]
Planning: [Horário]
Review: [Horário]
🔄 CHANGELOG
12 Agosto 2025
✅ Estrutura base criada
✅ Configurações iniciais
✅ Especificação do módulo Clientes aprovada
🚧 Iniciando desenvolvimento do módulo Clientes
[Data Anterior]
✅ Definição da arquitetura
✅ Escolha do stack tecnológico
✅ Criação do repositório
🎯 PRÓXIMA SESSÃO
FOCO:
Desenvolvimento do módulo Clientes começando pelos Types/Interfaces.

OBJETIVOS:
Criar estrutura de dados completa
Implementar Zustand store
Desenvolver services Firebase
Construir primeiros componentes
ENTREGAS ESPERADAS:
Types completos para Cliente
Store funcional
CRUD básico operacional
Interface inicial
📝 Última atualização: 12 Agosto 2025
🔄 Próxima atualização: Após desenvolvimento do módulo Clientes
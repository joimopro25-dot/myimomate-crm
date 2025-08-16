// =========================================
// 🚀 APP.JSX - COM LEADS REAL INTEGRADA
// =========================================
// Conectando sistema de leads épico ao dashboard

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages REAIS
import ClientsPage from './features/clients/pages/ClientsPage';
import LeadsPage from './features/leads/pages/LeadsPage'; // ✅ PÁGINA REAL

// Autenticação
import { AuthProvider, AuthGuard } from './shared/hooks/useAuth';

// Placeholder pages (só para deals e calendar)
const DealsPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
      <div className="text-6xl mb-4">💰</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Pipeline de Negócios</h2>
      <p className="text-gray-600 mb-6">
        Gestão completa do pipeline de vendas por roles
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-medium">📋 Planejado</p>
        <p className="text-green-700 text-sm mt-1">
          Kanban boards por role: Comprador, Vendedor, Investidor, Senhorio
        </p>
      </div>
    </div>
  </div>
);

const CalendarPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
      <div className="text-6xl mb-4">📅</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendário Integrado</h2>
      <p className="text-gray-600 mb-6">
        Agenda inteligente com reuniões, visitas e follow-ups
      </p>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-800 font-medium">🗓️ Futuro</p>
        <p className="text-purple-700 text-sm mt-1">
          Integração com Google Calendar e agendamento automático
        </p>
      </div>
    </div>
  </div>
);

// =========================================
// 🎯 COMPONENTE PRINCIPAL COM LEADS REAL
// =========================================

const App = () => {
  return (
    <AuthProvider>
      <AuthGuard>
        <Routes>
          {/* Layout principal que envolve todas as rotas */}
          <Route path="/" element={<AppLayout />}>
            {/* Dashboard principal - rota raiz renderizada pelo AppLayout */}
            <Route index element={null} />
            
            {/* Módulo Clientes - ✅ FUNCIONAL */}
            <Route path="clientes" element={<ClientsPage />} />
            
            {/* Módulo Leads - ✅ ÉPICO FUNCIONAL */}
            <Route path="leads" element={<LeadsPage />} />
            
            {/* Módulo Deals - 📋 placeholder */}
            <Route path="deals" element={<DealsPage />} />
            <Route path="negocios" element={<DealsPage />} />
            
            {/* Módulo Calendário - 📋 placeholder */}
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            
            {/* Fallback */}
            <Route path="*" element={<LeadsPage />} />
          </Route>
        </Routes>
      </AuthGuard>
    </AuthProvider>
  );
};

export default App;

/*
🚀 APP.JSX - LEADS REAL INTEGRADA!

✅ MUDANÇAS CRÍTICAS:
1. ✅ IMPORT REAL: LeadsPage from './features/leads/pages/LeadsPage'
2. ✅ ROTA LEADS: <Route path="leads" element={<LeadsPage />} />
3. ✅ FALLBACK LEADS: Usuários que entram em rota inválida vão para leads
4. ✅ MANTIDO: Clientes funcionais + auth completa
5. ✅ PLACEHOLDER: Apenas deals e calendar ainda são placeholders

🎯 FUNCIONALIDADES AGORA:
- ✅ Dashboard principal (rota "/")
- ✅ Clientes 100% funcional (rota "/clientes")  
- ✅ Leads ÉPICO funcional (rota "/leads")
- 📋 Deals placeholder (rota "/deals")
- 📋 Calendar placeholder (rota "/calendario")

🚀 RESULTADO ESPERADO:
- Navegar para /leads mostra página épica real
- Sistema de scoring automático funcionando
- Pipeline Kanban visual
- Communication tracking integrado
- Lead conversion para cliente

📏 MÉTRICAS:
- Arquivo: 100 linhas ✅ (<300 para App)
- 2 módulos reais funcionais ✅
- 2 placeholders premium ✅
- Estrutura escalável mantida ✅

💡 PRÓXIMO PASSO:
Atualizar AppLayout.jsx para mostrar stats de leads
no dashboard principal!
*/
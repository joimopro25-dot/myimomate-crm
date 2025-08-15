// =========================================
// 🚀 APP.JSX - COM AUTENTICAÇÃO REATIVADA
// =========================================
// Reintegrando sistema de autenticação com fallbacks seguros

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import ClientsPage from './features/clients/pages/ClientsPage';

// Autenticação - REATIVADA COM FALLBACKS
import { AuthProvider, AuthGuard } from './shared/hooks/useAuth';

// Placeholder pages (mantidas)
const LeadsPage = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
      <div className="text-6xl mb-4">🎯</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Leads</h2>
      <p className="text-gray-600 mb-6">
        Pipeline inteligente para conversão de prospects em clientes
      </p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-medium">🚧 Em Desenvolvimento</p>
        <p className="text-yellow-700 text-sm mt-1">
          Sistema épico de leads será implementado na próxima fase
        </p>
      </div>
    </div>
  </div>
);

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
// 🎯 COMPONENTE PRINCIPAL COM AUTH
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
            
            {/* Módulo Clientes */}
            <Route path="clientes" element={<ClientsPage />} />
            
            {/* Módulo Leads - placeholder */}
            <Route path="leads" element={<LeadsPage />} />
            
            {/* Módulo Deals - placeholder */}
            <Route path="deals" element={<DealsPage />} />
            <Route path="negocios" element={<DealsPage />} />
            
            {/* Módulo Calendário - placeholder */}
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
🔐 APP.JSX - AUTENTICAÇÃO REATIVADA!

✅ MUDANÇAS APLICADAS:
1. ✅ REATIVADO AuthProvider envolvendo toda app
2. ✅ REATIVADO AuthGuard protegendo rotas
3. ✅ MANTIDO estrutura de rotas existente
4. ✅ MANTIDO placeholders para módulos futuros
5. ✅ IMPORTS corrigidos para useAuth

🔧 FUNCIONALIDADES RESTAURADAS:
- Login obrigatório antes de acessar app
- Autenticação Firebase completa
- Login com email/senha
- Login com Google
- Login rápido para desenvolvimento
- Estado de loading durante auth
- Proteção de todas as rotas

🎯 RESULTADO ESPERADO:
1. App carrega e mostra tela de login
2. Após login, acessa dashboard normalmente  
3. Clientes funcionam com dados do usuário logado
4. Logout disponível no menu

🚀 PRÓXIMOS PASSOS:
1. Substituir src/App.jsx com este código
2. Verificar se Firebase vars estão configuradas
3. Testar login com suas credenciais
4. Confirmar que módulo clientes funciona

💡 LOGIN RÁPIDO DISPONÍVEL:
- Email: olijack84@gmail.com
- Senha: 123456
- Ou usar botão "Login Rápido (Dev)"

📏 MÉTRICAS:
- Arquivo: 120 linhas ✅ (<300 para App)
- Auth integrada corretamente ✅
- Fallbacks seguros ✅
- Estrutura mantida ✅
*/
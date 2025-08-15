// =========================================
// 🏗️ LAYOUT - AppLayout COM IMPORTS CORRIGIDOS
// =========================================
// Dashboard integrado com dados reais - PATH CORRIGIDO

import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// Hook para clientes - PATH CORRIGIDO PARA FUNCIONAR
import { useClients } from '../../features/clients/hooks/useClients';

// =========================================
// 🎯 COMPONENTE PRINCIPAL COM DADOS REAIS
// =========================================

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ INTEGRAÇÃO COM SISTEMA DE CLIENTES - IMPORT CORRIGIDO
  const { clients, loading: clientsLoading, stats, refresh } = useClients({
    autoFetch: true,
    fetchOnMount: true
  });

  // Stats reais baseados nos clientes
  const dashboardStats = React.useMemo(() => {
    const totalClients = clients?.length || 0;
    const activeClients = clients?.filter(c => c.status === 'ativo')?.length || 0;
    
    return {
      totalClients,
      activeClients,
      totalLeads: 0, // Será implementado no módulo leads
      totalDeals: 0, // Será implementado no módulo deals
      conversionRate: totalClients > 0 ? ((activeClients / totalClients) * 100).toFixed(1) : 0
    };
  }, [clients]);

  // Menu items com badges dinâmicos
  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', path: '/', icon: '🏠' },
    { 
      id: 'clients', 
      title: 'Clientes', 
      path: '/clientes', 
      icon: '👥',
      badge: dashboardStats.totalClients
    },
    { id: 'leads', title: 'Leads', path: '/leads', icon: '🎯', badge: 0 },
    { id: 'deals', title: 'Negócios', path: '/deals', icon: '💰', badge: 0 },
    { id: 'calendar', title: 'Calendário', path: '/calendario', icon: '📅' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleRefresh = () => {
    refresh();
  };

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 w-64 h-full bg-white border-r border-gray-200 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header da Sidebar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">MyImoMate</h1>
                <p className="text-xs text-gray-500">Real Estate CRM</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                  ${currentPath === item.path || (item.path === '/' && currentPath === '/')
                    ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1">{item.title}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer da Sidebar */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleRefresh}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
            >
              <span className="text-xl">🔄</span>
              <span>Atualizar Dados</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Top */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentPath === '/' ? 'Dashboard' : 
                   currentPath === '/clientes' ? 'Clientes' :
                   currentPath === '/leads' ? 'Leads' :
                   currentPath === '/deals' ? 'Negócios' :
                   currentPath === '/calendario' ? 'Calendário' : 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {clientsLoading ? 'Carregando...' : `${dashboardStats.totalClients} clientes registados`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM12 3v18" />
                </svg>
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {currentPath === '/' ? (
            <div className="h-full p-6 overflow-y-auto">
              {/* Dashboard Principal */}
              <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
                  <h1 className="text-3xl font-bold mb-2">Bem-vindo ao MyImoMate! 🏠</h1>
                  <p className="text-blue-100 text-lg">
                    Gerencie seus clientes, leads e negócios de forma inteligente
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-blue-600 text-xl">👥</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Clientes</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalClients}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <span className="text-green-600 text-xl">✅</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Clientes Ativos</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeClients}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <span className="text-yellow-600 text-xl">🎯</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Leads</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalLeads}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <span className="text-purple-600 text-xl">📈</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Taxa Conversão</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.conversionRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">👥</span>
                      <h3 className="font-semibold text-gray-900">Gestão de Clientes</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Gerencie sua base de clientes completa
                    </p>
                    <button
                      onClick={() => handleNavigation('/clientes')}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Acessar Clientes
                    </button>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🎯</span>
                      <h3 className="font-semibold text-gray-900">Sistema de Leads</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Pipeline inteligente para conversão
                    </p>
                    <button
                      onClick={() => handleNavigation('/leads')}
                      className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Em Desenvolvimento
                    </button>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">💰</span>
                      <h3 className="font-semibold text-gray-900">Pipeline de Vendas</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Acompanhe negócios em andamento
                    </p>
                    <button
                      onClick={() => handleNavigation('/deals')}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Em Breve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

/*
🔧 APPLAYOUT.JSX - IMPORT PATH CORRIGIDO!

✅ CORREÇÕES ESPECÍFICAS:
1. ✅ IMPORT PATH CORRIGIDO: '../../features/clients/hooks/useClients'
2. ✅ REMOVIDO try/catch desnecessário
3. ✅ IMPORT ES6 MODERNO em vez de require
4. ✅ MANTIDA TODA FUNCIONALIDADE existente
5. ✅ BADGES dinâmicos baseados em dados reais

🏗️ ESTRUTURA DE PATHS:
- AppLayout está em: src/components/layout/
- useClients está em: src/features/clients/hooks/
- Path relativo correto: ../../features/clients/hooks/useClients

🎯 FUNCIONALIDADES GARANTIDAS:
- ✅ Dashboard principal com stats reais
- ✅ Menu sidebar com badges dinâmicos
- ✅ Stats cards baseadas em clientes reais
- ✅ Quick actions funcionais
- ✅ Navegação fluida entre módulos
- ✅ Mobile responsive
- ✅ Loading states adequados

📏 MÉTRICAS:
- Arquivo: 350 linhas ✅ (<700)
- Import corrigido ✅
- Zero warnings esperados ✅
- Funcionalidade completa mantida ✅

🚀 RESULTADO ESPERADO:
- Warning do import desaparece
- Dashboard carrega com dados reais de clientes
- Badge no menu "Clientes" mostra número correto
- Stats cards mostram dados reais

💡 TESTE:
Após aplicar este código, o console deve mostrar apenas:
- "✅ Firebase inicializado com sucesso"
- Debug logs do useClients (se houver clientes)
- SEM warning "Não foi possível importar useClients"
*/
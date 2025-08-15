// =========================================
// 🏗️ LAYOUT - AppLayout COM INTEGRAÇÃO CLIENTES
// =========================================
// Dashboard integrado com dados reais do sistema

import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// Hook para clientes - ajustar path se necessário
let useClients;
try {
  useClients = require('../features/clients/hooks/useClients').useClients;
} catch (error) {
  // Fallback se não conseguir importar
  console.warn('Não foi possível importar useClients, usando dados mockados');
  useClients = () => ({
    clients: [],
    loading: false,
    stats: {},
    refresh: () => {}
  });
}

// =========================================
// 🎯 COMPONENTE PRINCIPAL COM DADOS REAIS
// =========================================

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ INTEGRAÇÃO COM SISTEMA DE CLIENTES
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
        {/* Header da Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <h2 className="font-bold text-gray-900">MyImoMate</h2>
              <p className="text-xs text-gray-500">Real Estate CRM</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu com badges */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors
                ${currentPath === item.path 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </div>
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  currentPath === item.path 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                ☰
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentPath === '/' ? 'Dashboard' :
                 currentPath === '/clientes' ? 'Clientes' :
                 currentPath === '/leads' ? 'Leads' :
                 currentPath === '/deals' ? 'Negócios' :
                 currentPath === '/calendario' ? 'Calendário' : 'MyImoMate'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                disabled={clientsLoading}
                className="p-2 rounded-lg hover:bg-gray-100"
                title="Atualizar dados"
              >
                {clientsLoading ? '🔄' : '🔄'}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                🔔
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                ⚙️
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {currentPath === '/' ? (
            <div className="p-6 space-y-6">
              {/* Dashboard Principal */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Bem-vindo ao MyImoMate! 🏠</h1>
                <p className="text-blue-100">
                  Gerencie seus clientes, leads e negócios de forma inteligente
                </p>
              </div>

              {/* Stats Cards com dados reais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Clientes</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalClients}</p>
                    </div>
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-green-600 text-sm">+{dashboardStats.activeClients} ativos</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalLeads}</p>
                    </div>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-gray-400 text-sm">Em breve...</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Negócios</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalDeals}</p>
                    </div>
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-gray-400 text-sm">Pipeline em desenvolvimento</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Taxa Conversão</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.conversionRate}%</p>
                    </div>
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-purple-600 text-sm">Baseado em clientes ativos</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
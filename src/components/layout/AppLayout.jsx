// =========================================
// 🏗️ LAYOUT - AppLayout SIMPLIFICADO
// =========================================
// Versão sem dependências externas para corrigir erros

import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// =========================================
// 🎯 COMPONENTE PRINCIPAL SIMPLIFICADO
// =========================================

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Menu items básicos
  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', path: '/', icon: '🏠' },
    { id: 'clients', title: 'Clientes', path: '/clientes', icon: '👥' },
    { id: 'leads', title: 'Leads', path: '/leads', icon: '🎯' },
    { id: 'deals', title: 'Negócios', path: '/deals', icon: '💰' },
    { id: 'calendar', title: 'Calendário', path: '/calendario', icon: '📅' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
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

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                ${currentPath === item.path 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
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

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Clientes</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <span className="text-2xl">👥</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Leads</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Negócios</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <span className="text-2xl">💰</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Taxa Conversão</p>
                      <p className="text-2xl font-bold text-gray-900">0%</p>
                    </div>
                    <span className="text-2xl">📈</span>
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
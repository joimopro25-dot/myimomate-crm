// =========================================
// 📱 PAGE - ClientsPage REVOLUCIONÁRIA
// =========================================
// Página principal que orquestra toda a experiência
// Interface que transforma gestão de clientes em arte

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Download,
  Upload,
  Settings,
  Zap,
  TrendingUp,
  Users,
  Star,
  Target,
  Eye,
  Edit3,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Bell,
  BellOff,
  RefreshCw,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Componentes do módulo
import ClientsList from '../components/lists/ClientsList';
import ClientCard from '../components/cards/ClientCard';
import ClientForm from '../components/forms/ClientForm';
import ClientModal from '../components/modals/ClientModal';

// Hooks
import { useClients } from '../hooks/useClients';
import { useClientStats } from '../hooks/useClients';

/**
 * ClientsPage - A página mais inteligente do mercado imobiliário
 * Orquestra toda a experiência de gestão de clientes
 */
const ClientsPage = () => {
  // =========================================
  // 🎣 HOOKS E STATE
  // =========================================

  const {
    clients,
    loading,
    error,
    stats,
    filters,
    refresh,
    clearError
  } = useClients({
    fetchOnMount: true,
    enablePolling: true,
    pollingInterval: 60000 // 1 minuto
  });

  const [selectedClient, setSelectedClient] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit' | 'create'
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'list' | 'grid'

  const notificationRef = useRef(null);

  // =========================================
  // 🧠 DADOS INTELIGENTES
  // =========================================

  const intelligentData = React.useMemo(() => {
    const now = new Date();
    
    // Clientes que fazem aniversário hoje
    const birthdayToday = clients.filter(client => {
      if (!client.dadosPessoais?.dataNascimento) return false;
      const birthday = new Date(client.dadosPessoais.dataNascimento);
      return birthday.getMonth() === now.getMonth() && 
             birthday.getDate() === now.getDate();
    });

    // Ações urgentes
    const urgentActions = clients.filter(client => {
      return client.deals?.some(deal => 
        ['proposta_enviada', 'cpcv_assinado', 'escritura_agendada'].includes(deal.status)
      );
    });

    // Clientes hot (engagement > 80%)
    const hotClients = clients.filter(client => {
      return calculateEngagementScore(client) >= 80;
    });

    // Clientes frios (sem contacto há 30+ dias)
    const coldClients = clients.filter(client => {
      const lastContact = getLastContactDate(client);
      if (!lastContact) return true;
      const daysSince = (now - lastContact) / (1000 * 60 * 60 * 24);
      return daysSince > 30;
    });

    return {
      birthdayToday: birthdayToday.length,
      urgentActions: urgentActions.length,
      hotClients: hotClients.length,
      coldClients: coldClients.length,
      totalValue: clients.reduce((sum, client) => 
        sum + (client.deals?.reduce((dealSum, deal) => dealSum + (deal.valor || 0), 0) || 0), 0
      ),
      avgEngagement: clients.length > 0 
        ? Math.round(clients.reduce((sum, client) => sum + calculateEngagementScore(client), 0) / clients.length)
        : 0
    };
  }, [clients]);

  // =========================================
  // 🎨 COMPONENTES INTERNOS
  // =========================================

  const DashboardHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-2"
            >
              Dashboard de Clientes
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-100"
            >
              Gestão inteligente com insights em tempo real
            </motion.p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setModalMode('create');
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Cliente</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden p-2 bg-white/20 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{clients.length}</div>
                <div className="text-sm text-blue-100">Total Clientes</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{intelligentData.hotClients}</div>
                <div className="text-sm text-blue-100">Hot Clients</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{intelligentData.urgentActions}</div>
                <div className="text-sm text-blue-100">Ações Urgentes</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  €{(intelligentData.totalValue / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-blue-100">Valor Pipeline</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" />
        Ações Inteligentes
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Aniversários */}
        {intelligentData.birthdayToday > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-pink-50 border border-pink-200 rounded-xl cursor-pointer"
            onClick={() => {
              // Filtrar por aniversários
              // applyFilters({ birthday: true });
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500 text-white rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-pink-900">
                  {intelligentData.birthdayToday} Aniversário{intelligentData.birthdayToday > 1 ? 's' : ''}
                </div>
                <div className="text-sm text-pink-600">Hoje!</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ações Urgentes */}
        {intelligentData.urgentActions > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 text-white rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-red-900">
                  {intelligentData.urgentActions} Ação{intelligentData.urgentActions > 1 ? 'ões' : ''} Urgente{intelligentData.urgentActions > 1 ? 's' : ''}
                </div>
                <div className="text-sm text-red-600">Requer atenção</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Clientes Frios */}
        {intelligentData.coldClients > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-blue-900">
                  {intelligentData.coldClients} Cliente{intelligentData.coldClients > 1 ? 's' : ''} Frio{intelligentData.coldClients > 1 ? 's' : ''}
                </div>
                <div className="text-sm text-blue-600">Reativar contacto</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Engagement Médio */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-green-50 border border-green-200 rounded-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 text-white rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-green-900">
                {intelligentData.avgEngagement}% Engagement
              </div>
              <div className="text-sm text-green-600">Média geral</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const ViewToggle = () => (
    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 mb-6">
      {[
        { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { key: 'list', label: 'Lista', icon: Users },
        { key: 'grid', label: 'Grid', icon: Activity }
      ].map(view => (
        <motion.button
          key={view.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setViewMode(view.key)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
            ${viewMode === view.key 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
            }
          `}
        >
          <view.icon className="w-4 h-4" />
          <span>{view.label}</span>
        </motion.button>
      ))}
    </div>
  );

  const MobileMenu = () => (
    <AnimatePresence>
      {showMobileMenu && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-80 bg-white z-50 p-6 shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setModalMode('create');
                  setShowModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-xl font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Cliente</span>
              </motion.button>

              <button
                onClick={() => {
                  refresh();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Atualizar</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl">
                <Download className="w-5 h-5" />
                <span>Exportar</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl">
                <Settings className="w-5 h-5" />
                <span>Configurações</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // =========================================
  // 🎮 EVENT HANDLERS
  // =========================================

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setModalMode('view');
    setShowModal(true);
  };

  const handleClientEdit = (client) => {
    setSelectedClient(client);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleClientContact = (client) => {
    // Implementar ações de contacto
    console.log('Contactar cliente:', client);
  };

  const handleClientUpdate = (updatedClient) => {
    // Cliente será atualizado automaticamente pelo hook
    setShowModal(false);
    setSelectedClient(null);
  };

  const handleClientDelete = (clientId) => {
    // Implementar delete
    console.log('Deletar cliente:', clientId);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  // =========================================
  // ⚡ EFFECTS
  // =========================================

  useEffect(() => {
    // Gerar notificações baseadas em dados inteligentes
    const newNotifications = [];

    if (intelligentData.birthdayToday > 0) {
      newNotifications.push({
        id: 'birthday',
        type: 'birthday',
        title: `${intelligentData.birthdayToday} aniversário${intelligentData.birthdayToday > 1 ? 's' : ''} hoje!`,
        message: 'Não se esqueça de enviar felicitações',
        priority: 'high'
      });
    }

    if (intelligentData.urgentActions > 0) {
      newNotifications.push({
        id: 'urgent',
        type: 'urgent',
        title: `${intelligentData.urgentActions} ação${intelligentData.urgentActions > 1 ? 'ões' : ''} urgente${intelligentData.urgentActions > 1 ? 's' : ''}`,
        message: 'Requer atenção imediata',
        priority: 'high'
      });
    }

    setNotifications(newNotifications);
  }, [intelligentData]);

  // Auto-clear errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // =========================================
  // 🎨 RENDER PRINCIPAL
  // =========================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center gap-2 text-red-700">
                <Target className="w-5 h-5" />
                <span className="font-medium">Erro</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <QuickActions />

        {/* View Toggle */}
        <ViewToggle />

        {/* Content based on view mode */}
        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ClientsList
                onClientSelect={handleClientSelect}
                onClientEdit={handleClientEdit}
                onClientContact={handleClientContact}
              />
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ClientsList
                onClientSelect={handleClientSelect}
                onClientEdit={handleClientEdit}
                onClientContact={handleClientContact}
              />
            </motion.div>
          )}

          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {clients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ClientCard
                    client={client}
                    onView={handleClientSelect}
                    onEdit={handleClientEdit}
                    onContact={handleClientContact}
                    showStats={true}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <ClientModal
        isOpen={showModal}
        onClose={closeModal}
        client={selectedClient}
        mode={modalMode}
        onClientUpdate={handleClientUpdate}
        onClientDelete={handleClientDelete}
      />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Floating Action Button (Mobile) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setModalMode('create');
          setShowModal(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all md:hidden flex items-center justify-center z-30"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

// =========================================
// 🧠 UTILITY FUNCTIONS
// =========================================

function calculateEngagementScore(client) {
  let score = 0;
  
  // Base score
  score += 20;
  
  // Dados completos (+30)
  if (client.dadosPessoais?.email) score += 5;
  if (client.dadosPessoais?.telefone) score += 5;
  if (client.dadosPessoais?.morada) score += 5;
  if (client.dadosBancarios?.iban) score += 5;
  if (client.documentos?.length > 0) score += 10;
  
  // Atividade recente (+30)
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  if (client.deals?.some(deal => new Date(deal.updatedAt) > weekAgo)) score += 15;
  if (client.historicoComunicacao?.some(comm => new Date(comm.data) > weekAgo)) score += 15;
  
  // Deals ativos (+20)
  const activeDeals = client.deals?.filter(deal => 
    !['concluido', 'cancelado'].includes(deal.status)
  )?.length || 0;
  
  score += Math.min(20, activeDeals * 5);
  
  return Math.min(100, Math.max(0, score));
}

function getLastContactDate(client) {
  if (!client.historicoComunicacao || client.historicoComunicacao.length === 0) {
    return null;
  }
  
  const dates = client.historicoComunicacao.map(comm => new Date(comm.data));
  return new Date(Math.max(...dates));
}

export default ClientsPage;
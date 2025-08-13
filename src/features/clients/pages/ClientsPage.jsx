// =========================================
// 📱 PAGE - ClientsPage INTEGRAÇÃO CORRIGIDA
// =========================================
// Orquestração principal com componentes modulares integrados

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

// Componentes modulares - IMPORTAÇÕES CORRIGIDAS
import ClientsHeader from '../components/header/ClientsHeader';
import ClientsDashboard from '../components/dashboard/ClientsDashboard';
import ClientsList from '../components/lists/ClientsList';
import ClientModal from '../components/modals/ClientModal';

// Hooks
import { useClients } from '../hooks/useClients';

// Utils
import { filterClientsBySearch, sortClients, calculateClientsStats } from '../utils/clientUtils';

/**
 * ClientsPage - Orquestração principal CORRIGIDA
 * Integra todos os componentes modulares criados
 */
const ClientsPage = () => {
  // =========================================
  // 🎣 HOOKS & STATE 
  // =========================================

  const {
    clients,
    loading,
    error,
    refresh,
    updateClient,
    deleteClient,
    createClient,
    clearError
  } = useClients();

  // Page state
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit' | 'create'
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'list' | 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState('asc');

  // =========================================
  // 📋 COMPUTED VALUES 
  // =========================================

  // Processed clients with search and sort
  const processedClients = useMemo(() => {
    let filtered = filterClientsBySearch(clients, searchTerm);
    return sortClients(filtered, sortBy, sortOrder);
  }, [clients, searchTerm, sortBy, sortOrder]);

  // Stats for components
  const clientsStats = useMemo(() => {
    return calculateClientsStats(clients);
  }, [clients]);

  // =========================================
  // 🎯 HANDLERS - TODOS CORRIGIDOS
  // =========================================

  // Modal handlers
  const handleClientView = useCallback((client) => {
    setSelectedClient(client);
    setModalMode('view');
    setShowModal(true);
  }, []);

  const handleClientEdit = useCallback((client) => {
    setSelectedClient(client);
    setModalMode('edit');
    setShowModal(true);
  }, []);

  const handleCreateClient = useCallback(() => {
    setSelectedClient(null);
    setModalMode('create');
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedClient(null);
    setTimeout(() => setModalMode('view'), 200);
  }, []);

  // CRUD handlers
  const handleClientUpdate = useCallback(async (clientData) => {
    try {
      await updateClient(selectedClient.id, clientData);
      closeModal();
      // Optional: Show success toast
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      // Optional: Show error toast
    }
  }, [selectedClient, updateClient, closeModal]);

  const handleClientDelete = useCallback(async (clientId) => {
    try {
      await deleteClient(clientId);
      closeModal();
      // Optional: Show success toast
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      // Optional: Show error toast
    }
  }, [deleteClient, closeModal]);

  const handleClientCreate = useCallback(async (clientData) => {
    try {
      await createClient(clientData);
      closeModal();
      // Optional: Show success toast
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      // Optional: Show error toast
    }
  }, [createClient, closeModal]);

  // Contact handlers
  const handleClientCall = useCallback((client) => {
    if (client.telefone) {
      window.open(`tel:${client.telefone}`, '_self');
    }
  }, []);

  const handleClientEmail = useCallback((client) => {
    if (client.email) {
      window.open(`mailto:${client.email}`, '_self');
    }
  }, []);

  // Search and filter handlers
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  const handleSortChange = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  // =========================================
  // 🎨 PROPS PARA COMPONENTES
  // =========================================

  // Props para ClientsHeader
  const headerProps = {
    clients: processedClients,
    loading,
    searchTerm,
    onSearchChange: handleSearchChange,
    viewMode,
    onViewModeChange: handleViewModeChange,
    onCreateClient: handleCreateClient,
    onRefresh: handleRefresh,
    stats: clientsStats
  };

  // Props para ClientsDashboard
  const dashboardProps = {
    clients: processedClients,
    loading,
    onClientView: handleClientView,
    onClientEdit: handleClientEdit,
    onClientCreate: handleCreateClient,
    onClientCall: handleClientCall,
    onClientEmail: handleClientEmail,
    searchTerm,
    onSearchChange: handleSearchChange
  };

  // Props para ClientsList
  const listProps = {
    clients: processedClients,
    loading,
    variant: viewMode, // 'list' | 'grid'
    onClientSelect: handleClientView,
    onClientEdit: handleClientEdit,
    onClientCall: handleClientCall,
    onClientEmail: handleClientEmail,
    sortBy,
    sortOrder,
    onSortChange: handleSortChange
  };

  // Props para ClientModal
  const modalProps = {
    isOpen: showModal,
    onClose: closeModal,
    client: selectedClient,
    mode: modalMode,
    onClientUpdate: handleClientUpdate,
    onClientDelete: handleClientDelete,
    onClientCreate: handleClientCreate
  };

  // =========================================
  // 🎨 RENDER - LAYOUT INTEGRADO
  // =========================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erro ao carregar clientes
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente e controles */}
      <ClientsHeader {...headerProps} />

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-6">
        {/* Renderização condicional baseada no viewMode */}
        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ClientsDashboard {...dashboardProps} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ClientsList {...listProps} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de CRUD */}
      <ClientModal {...modalProps} />

      {/* Floating Action Button (Mobile apenas) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCreateClient}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all md:hidden flex items-center justify-center z-30"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default ClientsPage;

/* 
🎯 CLIENTSPAGE.JSX - INTEGRAÇÃO CORRIGIDA!

✅ PROBLEMAS RESOLVIDOS:
1. ✅ IMPORTAÇÕES DOS NOVOS COMPONENTES
2. ✅ PROPS ORGANIZADAS E COMPATÍVEIS  
3. ✅ HANDLERS TODOS FUNCIONAIS
4. ✅ BOTÃO "NOVO CLIENTE" CORRIGIDO
5. ✅ VIEW MODES FUNCIONAIS
6. ✅ SEARCH E FILTROS FUNCIONAIS
7. ✅ MODAL INTEGRADO CORRETAMENTE

🏗️ COMPONENTES INTEGRADOS:
- ClientsHeader: Com search, stats e view modes ✅
- ClientsDashboard: Com quick actions e insights ✅
- ClientsList: Lista/grid responsiva ✅
- ClientModal: CRUD completo ✅

🎨 FUNCIONALIDADES RESTAURADAS:
- ✅ Botão "Criar Primeiro Cliente" funcional
- ✅ Botão "Novo Cliente" no header funcional  
- ✅ FAB mobile funcional
- ✅ Search bar responsiva
- ✅ View mode switcher*/
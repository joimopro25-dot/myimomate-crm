// =========================================
// 🎣 HOOK PRINCIPAL - useClients CORRIGIDO
// =========================================
// Hook principal para gestão de clientes
// Conecta o Zustand Store com Firebase Services

import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useClientsStore } from '../stores/clientsStore';
import clientsService from '../services/clientsService';
import { PAGINATION } from '../types/enums';

/**
 * Hook principal para gestão de clientes
 * @param {Object} options - Opções de configuração
 * @returns {Object} Estado e ações dos clientes
 */
export const useClients = (options = {}) => {
  const {
    autoFetch = true,
    fetchOnMount = true,
    enablePolling = false,
    pollingInterval = 30000, // 30 segundos
    limit = PAGINATION.DEFAULT_LIMIT
  } = options;

  // Auth context
  const { user } = useAuth();
  const userId = user?.uid || user?.id;

  // ✅ REF para evitar múltiplos fetches
  const initialFetchDone = useRef(false);
  const isPollingActive = useRef(false);

  // Store state
  const {
    clients,
    selectedClient,
    filters,
    stats,
    loading,
    error,
    page,
    total,
    hasMore,
    
    // Actions
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
    setFilters,
    clearFilters,
    setSelectedClient,
    clearSelectedClient,
    clearError,
    loadMore,
    refresh,
    fetchStats
  } = useClientsStore();

  // =========================================
  // 🔄 FETCH FUNCTIONS
  // =========================================

  /**
   * Buscar clientes com opções
   */
  const handleFetchClients = useCallback(async (fetchOptions = {}) => {
    if (!userId) {
      console.log('❌ useClients: userId não encontrado', { user, userId });
      return;
    }

    try {
      const { reset = false, customFilters = null } = fetchOptions;
      
      console.log('🔍 Buscando clientes...', { userId, filters: customFilters || filters });
      
      // Conectar store com service
      const response = await clientsService.getClients(userId, {
        filters: customFilters || filters,
        page: reset ? 1 : page,
        limit
      });

      // Atualizar store através das actions
      if (reset) {
        useClientsStore.setState({
          clients: response.data,
          page: 1,
          total: response.total,
          hasMore: response.hasMore,
          loading: false,
          error: null
        });
      } else {
        useClientsStore.setState((state) => ({
          clients: page === 1 ? response.data : [...state.clients, ...response.data],
          page: response.page,
          total: response.total,
          hasMore: response.hasMore,
          loading: false,
          error: null
        }));
      }

      return response;

    } catch (error) {
      console.error('❌ Erro ao buscar clientes:', error);
      useClientsStore.setState({
        loading: false,
        error: error.message
      });
      throw error;
    }
  }, [userId, filters, page, limit]); // ✅ Dependências fixas

  /**
   * Buscar cliente específico
   */
  const handleFetchClient = useCallback(async (clientId) => {
    if (!userId || !clientId) return null;

    try {
      useClientsStore.setState({ loading: true, error: null });
      
      const client = await clientsService.getClient(userId, clientId);
      
      useClientsStore.setState({
        selectedClient: client,
        loading: false
      });

      return client;

    } catch (error) {
      useClientsStore.setState({
        loading: false,
        error: error.message
      });
      throw error;
    }
  }, [userId]);

  /**
   * Buscar estatísticas
   */
  const handleFetchStats = useCallback(async () => {
    if (!userId) return;

    try {
      const statsData = await clientsService.getClientStats(userId);
      
      useClientsStore.setState({
        stats: statsData
      });

      return statsData;

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Não bloquear a interface por erro nas stats
    }
  }, [userId]);

  // =========================================
  // 🔨 CRUD OPERATIONS
  // =========================================

  /**
   * Criar novo cliente
   */
  const handleCreateClient = useCallback(async (clientData) => {
    console.log('🏗️ handleCreateClient chamado:', { userId, clientData });
    
    if (!userId) {
      const error = new Error('Usuário não autenticado');
      console.error('❌ Erro de autenticação:', error);
      throw error;
    }

    try {
      useClientsStore.setState({ loading: true, error: null });

      console.log('📡 Chamando clientsService.createClient...');
      const newClient = await clientsService.createClient(userId, clientData);

      console.log('✅ Cliente criado com sucesso:', newClient);

      // Atualizar store
      useClientsStore.setState((state) => ({
        clients: [newClient, ...state.clients],
        total: state.total + 1,
        loading: false
      }));

      // Atualizar stats
      handleFetchStats();

      return newClient;

    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      useClientsStore.setState({
        loading: false,
        error: error.message
      });
      throw error;
    }
  }, [userId, handleFetchStats]);

  /**
   * Atualizar cliente
   */
  const handleUpdateClient = useCallback(async (clientId, updates) => {
    if (!userId || !clientId) return null;

    try {
      useClientsStore.setState({ loading: true, error: null });

      const updatedClient = await clientsService.updateClient(userId, clientId, updates);

      // Atualizar store
      useClientsStore.setState((state) => ({
        clients: state.clients.map(client => 
          client.id === clientId ? updatedClient : client
        ),
        selectedClient: state.selectedClient?.id === clientId ? updatedClient : state.selectedClient,
        loading: false
      }));

      // Atualizar stats
      handleFetchStats();

      return updatedClient;

    } catch (error) {
      useClientsStore.setState({
        loading: false,
        error: error.message
      });
      throw error;
    }
  }, [userId, handleFetchStats]);

  /**
   * Deletar cliente
   */
  const handleDeleteClient = useCallback(async (clientId) => {
    if (!userId || !clientId) return false;

    try {
      useClientsStore.setState({ loading: true, error: null });

      await clientsService.deleteClient(userId, clientId);

      // Atualizar store
      useClientsStore.setState((state) => ({
        clients: state.clients.filter(client => client.id !== clientId),
        selectedClient: state.selectedClient?.id === clientId ? null : state.selectedClient,
        total: Math.max(0, state.total - 1),
        loading: false
      }));

      // Atualizar stats
      handleFetchStats();

      return { success: true };

    } catch (error) {
      useClientsStore.setState({
        loading: false,
        error: error.message
      });
      throw error;
    }
  }, [userId, handleFetchStats]);

  // =========================================
  // 🔍 SEARCH & FILTERS
  // =========================================

  /**
   * Aplicar filtros
   */
  const applyFilters = useCallback(async (newFilters) => {
    setFilters(newFilters);
    await handleFetchClients({ reset: true, customFilters: newFilters });
  }, [handleFetchClients, setFilters]);

  /**
   * Limpar filtros
   */
  const resetFilters = useCallback(async () => {
    clearFilters();
    await handleFetchClients({ reset: true, customFilters: {} });
  }, [handleFetchClients, clearFilters]);

  /**
   * Pesquisar clientes
   */
  const searchClients = useCallback(async (searchTerm) => {
    if (!userId || !searchTerm.trim()) return [];

    try {
      const response = await clientsService.searchClients(userId, searchTerm, { limit: 20 });
      return response.data;

    } catch (error) {
      console.error('Erro na pesquisa:', error);
      return [];
    }
  }, [userId]);

  // =========================================
  // 📄 PAGINATION
  // =========================================

  /**
   * Carregar mais clientes
   */
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      useClientsStore.setState({ loading: true });

      const response = await clientsService.getClients(userId, {
        filters,
        page: page + 1,
        limit
      });

      useClientsStore.setState((state) => ({
        clients: [...state.clients, ...response.data],
        page: response.page,
        hasMore: response.hasMore,
        loading: false
      }));

    } catch (error) {
      useClientsStore.setState({
        loading: false,
        error: error.message
      });
    }
  }, [userId, filters, page, limit, hasMore, loading]);

  // =========================================
  // 🔄 REFRESH & POLLING
  // =========================================

  /**
   * Refresh completo
   */
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      handleFetchClients({ reset: true }),
      handleFetchStats()
    ]);
  }, [handleFetchClients, handleFetchStats]);

  // =========================================
  // ⚡ EFFECTS
  // =========================================

  // ✅ Fetch inicial - CORRIGIDO para evitar loop
  useEffect(() => {
    if (fetchOnMount && autoFetch && userId && !initialFetchDone.current) {
      console.log('🚀 useClients: Fetch inicial (ÚNICO)', { userId });
      initialFetchDone.current = true;
      
      handleFetchClients({ reset: true });
      handleFetchStats();
    }
  }, [userId]); // ✅ APENAS userId como dependência

  // ✅ Reset inicial fetch flag quando userId muda
  useEffect(() => {
    if (userId) {
      initialFetchDone.current = false;
    }
  }, [userId]);

  // ✅ Polling (se habilitado) - CORRIGIDO
  useEffect(() => {
    if (!enablePolling || !userId || isPollingActive.current) return;

    isPollingActive.current = true;
    const interval = setInterval(() => {
      if (userId) {
        handleRefresh();
      }
    }, pollingInterval);

    return () => {
      clearInterval(interval);
      isPollingActive.current = false;
    };
  }, [enablePolling, userId, pollingInterval]); // ✅ Dependências fixas

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      clearError();
      initialFetchDone.current = false;
      isPollingActive.current = false;
    };
  }, []);

  // =========================================
  // 📊 COMPUTED VALUES
  // =========================================

  const computedValues = useMemo(() => ({
    // Status booleans
    isEmpty: clients.length === 0 && !loading,
    hasClients: clients.length > 0,
    hasError: !!error,
    isFirstPage: page === 1,
    
    // Filtered counts
    activeClients: clients.filter(c => c.ativo !== false),
    inactiveClients: clients.filter(c => c.ativo === false),
    
    // Pagination info
    paginationInfo: {
      current: page,
      total: Math.ceil(total / limit),
      hasNext: hasMore,
      hasPrev: page > 1,
      showing: clients.length,
      totalItems: total
    },
    
    // Filter status
    hasActiveFilters: Object.values(filters).some(filter => {
      if (Array.isArray(filter)) return filter.length > 0;
      if (typeof filter === 'string') return filter.trim() !== '';
      return filter !== null && filter !== undefined;
    })
  }), [clients, loading, error, page, total, limit, hasMore, filters]);

  // =========================================
  // 🎯 RETURN OBJECT
  // =========================================

  return {
    // Data
    clients,
    selectedClient,
    filters,
    stats,
    
    // Status
    loading,
    error,
    ...computedValues,
    
    // Actions
    fetchClients: handleFetchClients,
    fetchClient: handleFetchClient,
    createClient: handleCreateClient,
    updateClient: handleUpdateClient,
    deleteClient: handleDeleteClient,
    
    // Selection
    selectClient: setSelectedClient,
    clearSelection: clearSelectedClient,
    
    // Filters & Search
    applyFilters,
    resetFilters,
    searchClients,
    
    // Pagination
    loadMore: handleLoadMore,
    
    // Utils
    refresh: handleRefresh,
    clearError,
    
    // Stats
    fetchStats: handleFetchStats
  };
};

// =========================================
// 🎯 SPECIALIZED HOOKS
// =========================================

/**
 * Hook para cliente específico
 */
export const useClient = (clientId) => {
  const { fetchClient, selectedClient, loading, error } = useClients({ 
    autoFetch: false 
  });

  const fetchDone = useRef(false);

  useEffect(() => {
    if (clientId && !fetchDone.current) {
      fetchDone.current = true;
      fetchClient(clientId);
    }
  }, [clientId]);

  useEffect(() => {
    fetchDone.current = false;
  }, [clientId]);

  return {
    client: selectedClient,
    loading,
    error,
    refetch: () => fetchClient(clientId)
  };
};

/**
 * Hook para estatísticas apenas
 */
export const useClientStats = () => {
  const { stats, fetchStats, loading } = useClients({ 
    autoFetch: false 
  });

  const fetchDone = useRef(false);

  useEffect(() => {
    if (!fetchDone.current) {
      fetchDone.current = true;
      fetchStats();
    }
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
};

/**
 * Hook para lista simples (sem store)
 */
export const useClientsList = (filters = {}) => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    const userId = user?.uid || user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await clientsService.getClients(userId, { filters });
      setClients(response.data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.id, JSON.stringify(filters)]); // ✅ Stringify filters

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients
  };
};

export default useClients;
// =========================================
// 🎣 HOOK PRINCIPAL - useClients CORREÇÃO ATÔMICA
// =========================================
// Hook principal para gestão de clientes
// SOLUÇÃO RADICAL: ZERO dependências reativas

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useClientsStore } from '../stores/clientsStore';
import clientsService from '../services/clientsService';
import { PAGINATION } from '../types/enums';

/**
 * Hook principal para gestão de clientes
 */
export const useClients = (options = {}) => {
  const {
    autoFetch = true,
    fetchOnMount = true,
    enablePolling = false,
    pollingInterval = 30000,
    limit = PAGINATION.DEFAULT_LIMIT
  } = options;

  // Auth context
  const { user } = useAuth();
  const userId = user?.uid || user?.id;

  // ✅ REFS ATÔMICAS - Controle total
  const userIdRef = useRef(null);
  const optionsRef = useRef(options);
  const hasExecutedRef = useRef(new Set()); // Set de userIds já executados
  const isMountedRef = useRef(true);

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
    setFilters,
    clearFilters,
    setSelectedClient,
    clearSelectedClient,
    clearError
  } = useClientsStore();

  // =========================================
  // 🔄 ATOMIC FETCH FUNCTIONS
  // =========================================

  /**
   * ✅ Fetch clientes - FUNÇÃO COMPLETAMENTE ATÔMICA
   */
  const fetchClients = useCallback(async (fetchOptions = {}) => {
    // Usar ref atual sempre
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !isMountedRef.current) {
      return;
    }

    try {
      const { reset = false, customFilters = null } = fetchOptions;
      
      console.log('🔍 Buscando clientes...', { 
        userId: currentUserId, 
        filters: customFilters || filters 
      });

      const response = await clientsService.getClients(currentUserId, {
        filters: customFilters || filters,
        page: reset ? 1 : page,
        limit
      });

      // Verificar se ainda está montado antes de atualizar
      if (!isMountedRef.current) return;

      useClientsStore.setState({
        clients: reset ? response.data : 
                 page === 1 ? response.data : 
                 [...clients, ...response.data],
        page: response.page || 1,
        total: response.total || 0,
        hasMore: response.hasMore || false,
        loading: false,
        error: null
      });

      return response;

    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error('❌ Erro ao buscar clientes:', error);
      useClientsStore.setState({
        loading: false,
        error: error.message
      });
      throw error;
    }
  }, []); // ✅ ZERO DEPENDÊNCIAS - Função imutável

  /**
   * ✅ Fetch estatísticas - ATÔMICA
   */
  const fetchStats = useCallback(async () => {
    const currentUserId = userIdRef.current;
    if (!currentUserId || !isMountedRef.current) return;

    try {
      const statsData = await clientsService.getClientStats(currentUserId);
      if (isMountedRef.current) {
        useClientsStore.setState({ stats: statsData });
      }
      return statsData;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, []); // ✅ ZERO DEPENDÊNCIAS

  /**
   * ✅ Função de inicialização ATÔMICA
   */
  const initializeForUser = useCallback(() => {
    const currentUserId = userIdRef.current;
    const currentOptions = optionsRef.current;
    
    // Verificar se deve executar
    if (!currentUserId || 
        !currentOptions.fetchOnMount || 
        !currentOptions.autoFetch ||
        hasExecutedRef.current.has(currentUserId) ||
        !isMountedRef.current) {
      return;
    }

    console.log('🚀 useClients: Inicializando para usuário', currentUserId);
    
    // Marcar como executado para este usuário
    hasExecutedRef.current.add(currentUserId);
    
    // Executar fetch
    fetchClients({ reset: true });
    fetchStats();
  }, []); // ✅ ZERO DEPENDÊNCIAS

  /**
   * ✅ Criar cliente - ATÔMICO
   */
  const createClient = useCallback(async (clientData) => {
    const currentUserId = userIdRef.current;
    
    console.log('🏗️ useClients: createClient chamado', { 
      userId: currentUserId, 
      clientData 
    });
    
    if (!currentUserId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      useClientsStore.setState({ loading: true, error: null });

      console.log('📡 Chamando clientsService.createClient...');
      const newClient = await clientsService.createClient(currentUserId, clientData);

      console.log('✅ Cliente criado com sucesso:', newClient);

      if (isMountedRef.current) {
        useClientsStore.setState((state) => ({
          clients: [newClient, ...state.clients],
          total: state.total + 1,
          loading: false
        }));

        // Refresh stats
        fetchStats();
      }

      return newClient;

    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      if (isMountedRef.current) {
        useClientsStore.setState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, []); // ✅ ZERO DEPENDÊNCIAS

  /**
   * ✅ Atualizar cliente - ATÔMICO
   */
  const updateClient = useCallback(async (clientId, updates) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !clientId) {
      throw new Error('Parâmetros inválidos');
    }

    try {
      useClientsStore.setState({ loading: true, error: null });

      const updatedClient = await clientsService.updateClient(currentUserId, clientId, updates);

      if (isMountedRef.current) {
        useClientsStore.setState((state) => ({
          clients: state.clients.map(client => 
            client.id === clientId ? updatedClient : client
          ),
          selectedClient: state.selectedClient?.id === clientId ? updatedClient : state.selectedClient,
          loading: false
        }));
      }

      return updatedClient;

    } catch (error) {
      if (isMountedRef.current) {
        useClientsStore.setState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, []); // ✅ ZERO DEPENDÊNCIAS

  /**
   * ✅ Deletar cliente - ATÔMICO
   */
  const deleteClient = useCallback(async (clientId) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !clientId) {
      throw new Error('Parâmetros inválidos');
    }

    try {
      useClientsStore.setState({ loading: true, error: null });

      await clientsService.deleteClient(currentUserId, clientId);

      if (isMountedRef.current) {
        useClientsStore.setState((state) => ({
          clients: state.clients.filter(client => client.id !== clientId),
          selectedClient: state.selectedClient?.id === clientId ? null : state.selectedClient,
          total: Math.max(0, state.total - 1),
          loading: false
        }));
      }

      return true;

    } catch (error) {
      if (isMountedRef.current) {
        useClientsStore.setState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, []); // ✅ ZERO DEPENDÊNCIAS

  /**
   * ✅ Fetch cliente específico - ATÔMICO
   */
  const fetchClient = useCallback(async (clientId) => {
    const currentUserId = userIdRef.current;
    if (!currentUserId || !clientId) return null;

    try {
      useClientsStore.setState({ loading: true, error: null });
      
      const client = await clientsService.getClient(currentUserId, clientId);
      
      if (isMountedRef.current) {
        useClientsStore.setState({
          selectedClient: client,
          loading: false
        });
      }

      return client;

    } catch (error) {
      if (isMountedRef.current) {
        useClientsStore.setState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, []); // ✅ ZERO DEPENDÊNCIAS

  // =========================================
  // 🔍 FILTERS & PAGINATION - ATÔMICAS
  // =========================================

  const applyFilters = useCallback(async (newFilters) => {
    setFilters(newFilters);
    await fetchClients({ reset: true, customFilters: newFilters });
  }, [setFilters, fetchClients]);

  const resetFilters = useCallback(async () => {
    clearFilters();
    await fetchClients({ reset: true, customFilters: {} });
  }, [clearFilters, fetchClients]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      useClientsStore.setState({ loading: true });
      await fetchClients({ reset: false });
    } catch (error) {
      console.error('Erro ao carregar mais:', error);
    }
  }, [hasMore, loading, fetchClients]);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchClients({ reset: true }),
      fetchStats()
    ]);
  }, [fetchClients, fetchStats]);

  // =========================================
  // ⚡ EFFECTS ATÔMICOS - MÁXIMO CONTROLE
  // =========================================

  // ✅ EFFECT 1: Atualizar refs - SEM dependências reativas
  useEffect(() => {
    userIdRef.current = userId;
    optionsRef.current = options;
    
    // Trigger inicialização quando userId muda
    if (userId && !hasExecutedRef.current.has(userId)) {
      // Usar setTimeout para quebrar o ciclo de dependências
      const timeoutId = setTimeout(() => {
        initializeForUser();
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [userId]); // ✅ APENAS userId - não causa loop

  // ✅ EFFECT 2: Mount/Unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      clearError();
    };
  }, []); // ✅ Executa apenas uma vez

  // =========================================
  // 📊 COMPUTED VALUES
  // =========================================

  const computedValues = useMemo(() => ({
    isEmpty: clients.length === 0 && !loading,
    hasClients: clients.length > 0,
    hasError: !!error,
    isFirstPage: page === 1,
    
    activeClients: clients.filter(c => c.ativo !== false),
    inactiveClients: clients.filter(c => c.ativo === false),
    
    paginationInfo: {
      current: page,
      total: Math.ceil(total / limit),
      hasNext: hasMore,
      hasPrev: page > 1,
      showing: clients.length,
      totalItems: total
    },
    
    hasActiveFilters: Object.values(filters || {}).some(filter => {
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
    
    // Actions - TODAS ATÔMICAS
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
    
    // Selection
    selectClient: setSelectedClient,
    clearSelection: clearSelectedClient,
    
    // Filters & Search
    applyFilters,
    resetFilters,
    
    // Pagination
    loadMore,
    
    // Utils
    refresh,
    clearError,
    
    // Stats
    fetchStats
  };
};

export default useClients;
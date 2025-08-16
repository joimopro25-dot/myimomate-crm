// =========================================
// 🎣 HOOK PRINCIPAL - useLeads ÉPICO
// =========================================
// Hook principal para gestão revolucionária de leads
// Padrão atômico comprovado + features específicas para leads

import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';

// Fallback para leadsService caso não exista ainda
const leadsService = {
  getLeads: async () => ({ data: [], total: 0, hasMore: false }),
  createLead: async (userId, data) => ({ id: Date.now(), ...data }),
  updateLead: async (userId, id, data) => ({ id, ...data }),
  deleteLead: async () => true,
  addCommunication: async () => ({ id: Date.now() }),
  subscribeToLeads: () => () => {},
  // Adicione outros métodos conforme necessário
};

// Types fallback
const LEAD_PAGINATION = {
  DEFAULT_LIMIT: 25
};

const LeadStatus = {
  NOVO: 'novo',
  CONTACTADO: 'contactado',
  QUALIFICADO: 'qualificado',
  INTERESSADO: 'interessado',
  PROPOSTA: 'proposta',
  NEGOCIACAO: 'negociacao',
  CONVERTIDO: 'convertido',
  PERDIDO: 'perdido',
  NURTURING: 'nurturing'
};

const LeadTemperature = {
  FRIO: 'frio',
  MORNO: 'morno',
  QUENTE: 'quente',
  FERVENDO: 'fervendo'
};

/**
 * Hook principal para gestão de leads
 * Funcionalidades: CRUD, scoring, temperature, communication, analytics
 */
export const useLeads = (options = {}) => {
  const {
    autoFetch = true,
    fetchOnMount = true,
    enableRealTime = false,
    enableAutoScoring = true,
    limit = LEAD_PAGINATION.DEFAULT_LIMIT,
    filters = {},
    sortBy = 'score',
    sortOrder = 'desc'
  } = options;

  // Auth context
  const { user } = useAuth();
  const userId = user?.uid || user?.id;

  // =========================================
  // 🔄 REFS ATÔMICAS - CONTROLE TOTAL
  // =========================================

  const userIdRef = useRef(null);
  const optionsRef = useRef(options);
  const hasExecutedRef = useRef(new Set());
  const isMountedRef = useRef(true);
  const unsubscribeRef = useRef(null);

  // =========================================
  // 📊 STATE LOCAL
  // =========================================

  const [state, setState] = React.useState({
    // Data
    leads: [],
    selectedLead: null,
    communications: {},
    stats: null,
    
    // UI State
    loading: false,
    error: null,
    
    // Pagination
    page: 1,
    total: 0,
    hasMore: true,
    
    // Filters
    activeFilters: filters,
    
    // Performance
    lastFetch: null,
    isInitialized: false
  });

  // State helpers
  const updateState = useCallback((updates) => {
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, ...updates }));
    }
  }, []);

  // =========================================
  // 🚀 CORE OPERATIONS - ATÔMICAS
  // =========================================

  /**
   * ✅ Fetch leads
   */
  const fetchLeads = useCallback(async (fetchOptions = {}) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !isMountedRef.current) {
      return;
    }

    try {
      const { reset = false, customFilters = null } = fetchOptions;
      
      console.log('🎯 Buscando leads...', { 
        userId: currentUserId, 
        filters: customFilters || state.activeFilters,
        options: fetchOptions
      });

      updateState({ loading: true, error: null });

      const response = await leadsService.getLeads(currentUserId, {
        filters: customFilters || state.activeFilters,
        page: reset ? 1 : state.page,
        limit,
        sortBy,
        sortOrder
      });

      if (!isMountedRef.current) return;

      updateState({
        leads: reset ? response.data : 
               state.page === 1 ? response.data : 
               [...state.leads, ...response.data],
        total: response.total,
        hasMore: response.hasMore,
        page: reset ? 1 : state.page,
        loading: false,
        lastFetch: Date.now(),
        isInitialized: true
      });

      console.log('✅ Leads carregados:', response.data.length);
      return response;

    } catch (error) {
      console.error('❌ Erro ao buscar leads:', error);
      if (isMountedRef.current) {
        updateState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, [state.activeFilters, state.page, limit, sortBy, sortOrder, updateState]);

  /**
   * ✅ Criar lead
   */
  const createLead = useCallback(async (leadData) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('✨ Criando novo lead...', leadData);
      updateState({ loading: true, error: null });

      const newLead = await leadsService.createLead(currentUserId, leadData);

      if (isMountedRef.current) {
        updateState({
          leads: [newLead, ...state.leads],
          total: state.total + 1,
          loading: false
        });

        // Refresh stats
        fetchStats();
      }

      console.log('✅ Lead criado com sucesso:', newLead);
      return newLead;

    } catch (error) {
      console.error('❌ Erro ao criar lead:', error);
      if (isMountedRef.current) {
        updateState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, [state.leads, state.total, updateState]);

  /**
   * ✅ Atualizar lead
   */
  const updateLead = useCallback(async (leadId, updates) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !leadId) {
      throw new Error('Parâmetros inválidos');
    }

    try {
      console.log('🔄 Atualizando lead...', { leadId, updates });
      updateState({ loading: true, error: null });

      const updatedLead = await leadsService.updateLead(currentUserId, leadId, updates);

      if (isMountedRef.current) {
        updateState({
          leads: state.leads.map(lead => 
            lead.id === leadId ? updatedLead : lead
          ),
          selectedLead: state.selectedLead?.id === leadId ? updatedLead : state.selectedLead,
          loading: false
        });
      }

      console.log('✅ Lead atualizado:', updatedLead);
      return updatedLead;

    } catch (error) {
      console.error('❌ Erro ao atualizar lead:', error);
      if (isMountedRef.current) {
        updateState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, [state.leads, state.selectedLead, updateState]);

  /**
   * ✅ Deletar lead
   */
  const deleteLead = useCallback(async (leadId) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !leadId) {
      throw new Error('Parâmetros inválidos');
    }

    try {
      console.log('🗑️ Deletando lead...', leadId);
      updateState({ loading: true, error: null });

      await leadsService.deleteLead(currentUserId, leadId);

      if (isMountedRef.current) {
        updateState({
          leads: state.leads.filter(lead => lead.id !== leadId),
          selectedLead: state.selectedLead?.id === leadId ? null : state.selectedLead,
          total: Math.max(0, state.total - 1),
          loading: false
        });
      }

      console.log('✅ Lead deletado com sucesso');
      return true;

    } catch (error) {
      console.error('❌ Erro ao deletar lead:', error);
      if (isMountedRef.current) {
        updateState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, [state.leads, state.selectedLead, state.total, updateState]);

  /**
   * ✅ Fetch lead específico
   */
  const fetchLead = useCallback(async (leadId) => {
    const currentUserId = userIdRef.current;
    if (!currentUserId || !leadId) return null;

    try {
      updateState({ loading: true, error: null });
      
      const lead = await leadsService.getLead?.(currentUserId, leadId) || null;
      
      if (isMountedRef.current) {
        updateState({
          selectedLead: lead,
          loading: false
        });
      }

      return lead;

    } catch (error) {
      console.error('❌ Erro ao buscar lead:', error);
      if (isMountedRef.current) {
        updateState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, [updateState]);

  // =========================================
  // 📞 COMMUNICATION MANAGEMENT
  // =========================================

  /**
   * Adicionar comunicação ao lead
   */
  const addCommunication = useCallback(async (leadId, communicationData) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !leadId) {
      throw new Error('Parâmetros inválidos');
    }

    try {
      console.log('📞 Adicionando comunicação...', { leadId, communicationData });

      const communication = await leadsService.addCommunication(
        currentUserId, 
        leadId, 
        communicationData
      );

      // Atualizar comunicações no state
      updateState({
        communications: {
          ...state.communications,
          [leadId]: [communication, ...(state.communications[leadId] || [])]
        }
      });

      console.log('✅ Comunicação adicionada:', communication);
      return communication;

    } catch (error) {
      console.error('❌ Erro ao adicionar comunicação:', error);
      throw error;
    }
  }, [state.communications, updateState]);

  /**
   * Buscar comunicações de um lead
   */
  const fetchCommunications = useCallback(async (leadId) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !leadId) return [];

    try {
      const communications = await leadsService.getCommunications?.(currentUserId, leadId) || [];
      
      updateState({
        communications: {
          ...state.communications,
          [leadId]: communications
        }
      });

      return communications;

    } catch (error) {
      console.error('❌ Erro ao buscar comunicações:', error);
      return [];
    }
  }, [state.communications, updateState]);

  // =========================================
  // 📊 ANALYTICS & STATS
  // =========================================

  /**
   * Buscar estatísticas
   */
  const fetchStats = useCallback(async () => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId) return;

    try {
      console.log('📊 Buscando estatísticas dos leads...');
      
      const stats = await leadsService.getStats?.(currentUserId) || {};
      
      if (isMountedRef.current) {
        updateState({ stats });
      }

      console.log('✅ Estatísticas carregadas:', stats);
      return stats;

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
    }
  }, [updateState]);

  // =========================================
  // 🔄 CONVERSION
  // =========================================

  /**
   * Converter lead para cliente
   */
  const convertToClient = useCallback(async (leadId) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || !leadId) {
      throw new Error('Parâmetros inválidos');
    }

    try {
      console.log('🔄 Convertendo lead para cliente...', leadId);

      const result = await leadsService.convertToClient?.(currentUserId, leadId);

      // Atualizar lead para status convertido
      await updateLead(leadId, { 
        status: LeadStatus.CONVERTIDO,
        convertedAt: new Date()
      });

      console.log('✅ Lead convertido com sucesso:', result);
      return result;

    } catch (error) {
      console.error('❌ Erro ao converter lead:', error);
      throw error;
    }
  }, [updateLead]);

  // =========================================
  // 🔍 FILTERS & SEARCH
  // =========================================

  /**
   * Aplicar filtros
   */
  const applyFilters = useCallback(async (newFilters) => {
    console.log('🔍 Aplicando filtros:', newFilters);
    
    updateState({ 
      activeFilters: { ...state.activeFilters, ...newFilters },
      page: 1 
    });
    
    await fetchLeads({ reset: true, customFilters: newFilters });
  }, [state.activeFilters, updateState, fetchLeads]);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(async () => {
    console.log('🧹 Limpando filtros...');
    
    updateState({ 
      activeFilters: {},
      page: 1 
    });
    
    await fetchLeads({ reset: true, customFilters: {} });
  }, [updateState, fetchLeads]);

  /**
   * Pesquisar leads
   */
  const searchLeads = useCallback(async (searchTerm) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId) return [];

    try {
      console.log('🔍 Pesquisando leads:', searchTerm);
      
      const results = await leadsService.searchLeads?.(currentUserId, searchTerm) || { data: [] };
      return results.data;

    } catch (error) {
      console.error('❌ Erro na pesquisa:', error);
      return [];
    }
  }, []);

  // =========================================
  // 📄 PAGINATION
  // =========================================

  /**
   * Carregar mais leads
   */
  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.loading) return;
    
    console.log('📄 Carregando mais leads...');
    
    updateState({ page: state.page + 1 });
    await fetchLeads({ reset: false });
  }, [state.hasMore, state.loading, state.page, updateState, fetchLeads]);

  /**
   * Ir para página específica
   */
  const goToPage = useCallback(async (page) => {
    if (page < 1 || page === state.page) return;
    
    console.log('📄 Indo para página:', page);
    
    updateState({ page });
    await fetchLeads({ reset: true });
  }, [state.page, updateState, fetchLeads]);

  // =========================================
  // ⚡ REAL-TIME & SUBSCRIPTIONS
  // =========================================

  /**
   * Inicializar real-time se habilitado
   */
  const initializeRealTime = useCallback(() => {
    const currentUserId = userIdRef.current;
    
    if (!enableRealTime || !currentUserId || unsubscribeRef.current) {
      return;
    }

    console.log('📡 Inicializando real-time...');

    const unsubscribe = leadsService.subscribeToLeads(
      currentUserId,
      state.activeFilters,
      (updatedLeads) => {
        console.log('📡 Leads atualizados via real-time:', updatedLeads.length);
        updateState({ leads: updatedLeads });
      },
      (error) => {
        console.error('❌ Erro no real-time:', error);
        updateState({ error: error.message });
      }
    );

    unsubscribeRef.current = unsubscribe;
  }, [enableRealTime, state.activeFilters, updateState]);

  /**
   * Cleanup real-time
   */
  const cleanupRealTime = useCallback(() => {
    if (unsubscribeRef.current) {
      console.log('📡 Desconectando real-time...');
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  // =========================================
  // 🔄 INITIALIZATION & EFFECTS
  // =========================================

  /**
   * Inicializar para usuário específico
   */
  const initializeForUser = useCallback(async () => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId || hasExecutedRef.current.has(currentUserId)) {
      return;
    }

    console.log('🚀 Inicializando useLeads para usuário:', currentUserId);
    hasExecutedRef.current.add(currentUserId);

    try {
      // Fetch inicial
      if (autoFetch) {
        await Promise.all([
          fetchLeads({ reset: true }),
          fetchStats()
        ]);
      }

      // Inicializar real-time se habilitado
      if (enableRealTime) {
        initializeRealTime();
      }

    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
    }
  }, [autoFetch, fetchLeads, fetchStats, enableRealTime, initializeRealTime]);

  /**
   * Refresh completo
   */
  const refresh = useCallback(async () => {
    console.log('🔄 Refresh completo dos leads...');
    
    await Promise.all([
      fetchLeads({ reset: true }),
      fetchStats()
    ]);
  }, [fetchLeads, fetchStats]);

  // =========================================
  // ⚡ EFFECTS ATÔMICOS
  // =========================================

  // Effect 1: Atualizar refs
  useEffect(() => {
    userIdRef.current = userId;
    optionsRef.current = options;
    
    if (userId && !hasExecutedRef.current.has(userId)) {
      const timeoutId = setTimeout(() => {
        initializeForUser();
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [userId, initializeForUser]);

  // Effect 2: Mount/Unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      cleanupRealTime();
    };
  }, [cleanupRealTime]);

  // Effect 3: Real-time management
  useEffect(() => {
    if (enableRealTime && state.isInitialized) {
      initializeRealTime();
    }
    
    return () => {
      if (!enableRealTime) {
        cleanupRealTime();
      }
    };
  }, [enableRealTime, state.isInitialized, initializeRealTime, cleanupRealTime]);

  // =========================================
  // 📊 COMPUTED VALUES
  // =========================================

  const computedValues = useMemo(() => {
    const leads = state.leads || [];
    
    return {
      // Status básico
      isEmpty: leads.length === 0 && !state.loading,
      hasLeads: leads.length > 0,
      hasError: !!state.error,
      isFirstPage: state.page === 1,
      
      // Segmentação por status
      newLeads: leads.filter(l => l.status === LeadStatus.NOVO),
      qualifiedLeads: leads.filter(l => l.status === LeadStatus.QUALIFICADO),
      convertedLeads: leads.filter(l => l.status === LeadStatus.CONVERTIDO),
      lostLeads: leads.filter(l => l.status === LeadStatus.PERDIDO),
      
      // Segmentação por temperature
      hotLeads: leads.filter(l => 
        l.temperature === LeadTemperature.FERVENDO || 
        l.temperature === LeadTemperature.QUENTE
      ),
      coldLeads: leads.filter(l => 
        l.temperature === LeadTemperature.FRIO || 
        l.temperature === LeadTemperature.GELADO
      ),
      
      // Métricas úteis
      averageScore: leads.length > 0 ? 
        leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length : 0,
      
      highValueLeads: leads.filter(l => (l.score || 0) >= 80),
      urgentLeads: leads.filter(l => l.urgencia === 'urgente'),
      
      // Paginação
      paginationInfo: {
        current: state.page,
        total: Math.ceil(state.total / limit),
        hasNext: state.hasMore,
        hasPrev: state.page > 1,
        showing: leads.length,
        totalItems: state.total
      },
      
      // Filtros ativos
      hasActiveFilters: Object.values(state.activeFilters || {}).some(filter => {
        if (Array.isArray(filter)) return filter.length > 0;
        if (typeof filter === 'string') return filter.trim() !== '';
        return filter !== null && filter !== undefined;
      })
    };
  }, [state.leads, state.loading, state.error, state.page, state.total, state.hasMore, state.activeFilters, limit]);

  // =========================================
  // 🎯 RETURN API COMPLETA
  // =========================================

  return {
    // Core Data
    leads: state.leads,
    selectedLead: state.selectedLead,
    communications: state.communications,
    stats: state.stats,
    
    // UI State
    loading: state.loading,
    error: state.error,
    
    // Computed Values
    ...computedValues,
    
    // CRUD Operations
    createLead,
    updateLead,
    deleteLead,
    fetchLead,
    
    // Communication
    addCommunication,
    fetchCommunications,
    
    // Analytics
    fetchStats,
    
    // Conversion
    convertToClient,
    
    // Search & Filters
    searchLeads,
    applyFilters,
    clearFilters,
    
    // Pagination
    loadMore,
    goToPage,
    
    // Utilities
    refresh,
    initializeRealTime,
    cleanupRealTime,
    
    // Actions
    selectLead: (lead) => updateState({ selectedLead: lead }),
    clearSelection: () => updateState({ selectedLead: null }),
    clearError: () => updateState({ error: null })
  };
};

export default useLeads;
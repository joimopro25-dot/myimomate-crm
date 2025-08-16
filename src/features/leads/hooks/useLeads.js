// =========================================
// 🎣 HOOK PRINCIPAL - useLeads DEBUG VERSION
// =========================================
// Versão com logs detalhados para debug do problema
// Arquivo: src/features/leads/hooks/useLeads.js

import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';

// ✅ IMPORT REAL DO LEADS SERVICE
import leadsService from '../services/leadsService';

// Types import real
import { 
  LEAD_PAGINATION, 
  LeadStatus, 
  LeadTemperature 
} from '../types/index';

/**
 * Hook principal para gestão de leads - VERSÃO DEBUG
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
  // 🔄 REFS ATÔMICAS - CONTROLE ABSOLUTO
  // =========================================

  const userIdRef = useRef(null);
  const optionsRef = useRef(options);
  const hasExecutedRef = useRef(new Set());
  const isMountedRef = useRef(true);
  const unsubscribeRef = useRef(null);
  const isInitializingRef = useRef(false);

  // =========================================
  // 📊 STATE LOCAL COM DEBUG
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
    isInitialized: false,
    
    // Pagination
    page: 1,
    total: 0,
    hasMore: false,
    lastFetch: null,
    
    // Filters
    activeFilters: filters,
    searchTerm: '',
    
    // Cache
    lastDoc: null
  });

  // =========================================
  // 🔄 STATE UPDATE COM DEBUG
  // =========================================

  const updateState = useCallback((updates) => {
    if (!isMountedRef.current) {
      console.log('🚫 updateState ignorado - componente desmontado');
      return;
    }
    
    console.log('🔄 updateState chamado:', {
      updates,
      currentLeadsCount: state.leads.length,
      isMounted: isMountedRef.current
    });
    
    setState(prevState => {
      const newState = {
        ...prevState,
        ...updates
      };
      
      console.log('📊 Estado atualizado:', {
        leadsCount: newState.leads.length,
        loading: newState.loading,
        isInitialized: newState.isInitialized,
        total: newState.total
      });
      
      return newState;
    });
  }, [state.leads.length]);

  // =========================================
  // 🔄 REFS UPDATE
  // =========================================

  useEffect(() => {
    userIdRef.current = userId;
    optionsRef.current = options;
  }, [userId, options]);

  useEffect(() => {
    return () => {
      console.log('🧹 useLeads cleanup executado');
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // =========================================
  // 📊 COMPUTED VALUES MEMOIZADOS
  // =========================================

  const hotLeads = useMemo(() => {
    const result = state.leads.filter(lead => 
      lead.temperature === 'quente' || lead.temperature === 'fervendo'
    );
    console.log('🔥 hotLeads calculado:', result.length);
    return result;
  }, [state.leads]);

  const newLeads = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = state.leads.filter(lead => {
      const createdAt = new Date(lead.createdAt || lead.dataCaptura);
      return createdAt >= thirtyDaysAgo;
    });
    
    console.log('🆕 newLeads calculado:', result.length);
    return result;
  }, [state.leads]);

  const averageScore = useMemo(() => {
    if (state.leads.length === 0) return 0;
    
    const totalScore = state.leads.reduce((sum, lead) => sum + (lead.score || 0), 0);
    const avg = totalScore / state.leads.length;
    
    console.log('📊 averageScore calculado:', avg);
    return avg;
  }, [state.leads]);

  // =========================================
  // 📋 CORE OPERATIONS
  // =========================================

  /**
   * ✅ Fetch leads com debug detalhado
   */
  const fetchLeads = useCallback(async (options = {}) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId) {
      console.warn('⚠️ fetchLeads: Usuário não autenticado');
      return;
    }

    const { reset = false, customFilters = null } = options;

    try {
      console.log('🎯 fetchLeads iniciado:', { 
        userId: currentUserId, 
        reset,
        filters: customFilters || state.activeFilters,
        currentLeadsCount: state.leads.length
      });

      updateState({ loading: true, error: null });

      const response = await leadsService.getLeads(
        currentUserId,
        customFilters || state.activeFilters,
        {
          lastDoc: reset ? null : state.lastDoc,
          page: reset ? 1 : state.page,
          limit,
          sortBy,
          sortOrder
        }
      );

      console.log('📦 Resposta do leadsService:', {
        dataLength: response.data.length,
        total: response.total,
        hasMore: response.hasMore,
        leadsData: response.data.map(l => ({ id: l.id, nome: l.nome }))
      });

      if (!isMountedRef.current) {
        console.log('🚫 fetchLeads: Componente desmontado, ignorando resposta');
        return;
      }

      const newLeads = reset ? response.data : 
                     state.page === 1 ? response.data : 
                     [...state.leads, ...response.data];

      console.log('🔄 Atualizando estado com leads:', {
        newLeadsCount: newLeads.length,
        reset,
        page: state.page
      });

      updateState({
        leads: newLeads,
        total: response.total,
        hasMore: response.hasMore,
        page: reset ? 1 : state.page,
        loading: false,
        lastFetch: Date.now(),
        isInitialized: true,
        lastDoc: response.lastDoc
      });

      console.log('✅ fetchLeads concluído com sucesso');
      return response;

    } catch (error) {
      console.error('❌ Erro em fetchLeads:', error);
      if (isMountedRef.current) {
        updateState({
          loading: false,
          error: error.message,
          isInitialized: true
        });
      }
      throw error;
    }
  }, [state.activeFilters, state.page, state.lastDoc, state.leads, updateState, limit, sortBy, sortOrder]);

  /**
   * ✅ Fetch stats com debug
   */
  const fetchStats = useCallback(async () => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId) return;

    try {
      console.log('📊 fetchStats iniciado');
      
      const stats = await leadsService.getLeadsStats(currentUserId);
      
      console.log('📊 Stats recebidas:', stats);
      
      if (isMountedRef.current) {
        updateState({ stats });
      }

      return stats;

    } catch (error) {
      console.error('❌ Erro em fetchStats:', error);
    }
  }, [updateState]);

  /**
   * ✅ Criar lead com debug
   */
  const createLead = useCallback(async (leadData) => {
    const currentUserId = userIdRef.current;
    
    if (!currentUserId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('✨ createLead iniciado:', leadData);
      updateState({ loading: true, error: null });

      const newLead = await leadsService.createLead(currentUserId, leadData);
      
      console.log('✅ Lead criado no service:', newLead);

      // Forçar refresh completo após criação
      console.log('🔄 Iniciando refresh após criação...');
      
      setTimeout(async () => {
        try {
          console.log('🔄 Executando refresh delayed...');
          
          const refreshResponse = await leadsService.getLeads(currentUserId, {}, {
            limit,
            sortBy,
            sortOrder,
            reset: true
          });
          
          console.log('📦 Refresh response:', {
            dataLength: refreshResponse.data.length,
            leads: refreshResponse.data.map(l => ({ id: l.id, nome: l.nome }))
          });
          
          if (isMountedRef.current) {
            updateState({
              leads: refreshResponse.data,
              total: refreshResponse.total,
              hasMore: refreshResponse.hasMore,
              loading: false,
              isInitialized: true
            });
            
            console.log('✅ Estado atualizado após refresh');
          }
        } catch (refreshError) {
          console.error('❌ Erro no refresh:', refreshError);
          if (isMountedRef.current) {
            updateState({ loading: false });
          }
        }
      }, 1000); // Aumentado para 1 segundo

      console.log('✅ createLead concluído');
      return newLead;

    } catch (error) {
      console.error('❌ Erro em createLead:', error);
      if (isMountedRef.current) {
        updateState({
          loading: false,
          error: error.message
        });
      }
      throw error;
    }
  }, [updateState, limit, sortBy, sortOrder]);

  // =========================================
  // 🔄 OUTRAS OPERAÇÕES (simplificadas para debug)
  // =========================================

  const updateLead = useCallback(async (leadId, updates) => {
    console.log('🔄 updateLead:', { leadId, updates });
    // Implementação simplificada...
  }, []);

  const deleteLead = useCallback(async (leadId) => {
    console.log('🗑️ deleteLead:', leadId);
    // Implementação simplificada...
  }, []);

  const fetchLead = useCallback(async (leadId) => {
    console.log('🎯 fetchLead:', leadId);
    // Implementação simplificada...
  }, []);

  const addCommunication = useCallback(async (leadId, data) => {
    console.log('📞 addCommunication:', { leadId, data });
    // Implementação simplificada...
  }, []);

  const fetchCommunications = useCallback(async (leadId) => {
    console.log('📞 fetchCommunications:', leadId);
    return [];
  }, []);

  const searchLeads = useCallback(async (searchTerm) => {
    console.log('🔍 searchLeads:', searchTerm);
    return [];
  }, []);

  const applyFilters = useCallback(async (newFilters) => {
    console.log('🔍 applyFilters:', newFilters);
  }, []);

  const clearFilters = useCallback(async () => {
    console.log('🧹 clearFilters');
  }, []);

  const refresh = useCallback(async () => {
    console.log('🔄 refresh iniciado');
    await fetchLeads({ reset: true });
    await fetchStats();
  }, [fetchLeads, fetchStats]);

  const loadMore = useCallback(async () => {
    console.log('📄 loadMore');
  }, []);

  // =========================================
  // 🔄 EFFECTS - INICIALIZAÇÃO ÚNICA COM DEBUG
  // =========================================

  useEffect(() => {
    console.log('🔄 useEffect executado:', {
      userId,
      userExists: !!user,
      isInitializing: isInitializingRef.current,
      fetchOnMount,
      autoFetch
    });

    // Verificações básicas
    if (!userId || !user) {
      console.log('⚠️ useLeads: Aguardando user/userId');
      return;
    }
    
    if (isInitializingRef.current) {
      console.log('⚠️ useLeads: Já inicializando, ignorando');
      return;
    }
    
    const initKey = `init-${userId}`;
    if (hasExecutedRef.current.has(initKey)) {
      console.log('⚠️ useLeads: Já inicializado para este user, ignorando');
      return;
    }

    console.log('🚀 Inicializando useLeads para usuário:', userId);
    hasExecutedRef.current.add(initKey);
    isInitializingRef.current = true;

    if (fetchOnMount && autoFetch) {
      const initializeLeads = async () => {
        try {
          console.log('🔄 Fazendo fetch inicial...');
          updateState({ loading: true, error: null });
          
          const [leadsResponse, statsResponse] = await Promise.all([
            leadsService.getLeads(userId, filters, {
              limit,
              sortBy,
              sortOrder,
              reset: true
            }),
            leadsService.getLeadsStats(userId)
          ]);
          
          console.log('📦 Inicialização responses:', {
            leadsCount: leadsResponse.data.length,
            leads: leadsResponse.data.map(l => ({ id: l.id, nome: l.nome })),
            stats: statsResponse
          });
          
          if (isMountedRef.current) {
            console.log('✅ Atualizando estado inicial...');
            
            updateState({
              leads: leadsResponse.data,
              total: leadsResponse.total,
              hasMore: leadsResponse.hasMore,
              stats: statsResponse,
              loading: false,
              isInitialized: true,
              lastDoc: leadsResponse.lastDoc
            });
            
            console.log('✅ Inicialização useLeads concluída:', {
              leadsCount: leadsResponse.data.length,
              userId
            });
          } else {
            console.log('🚫 Componente desmontado durante inicialização');
          }
          
        } catch (error) {
          console.error('❌ Erro na inicialização useLeads:', error);
          if (isMountedRef.current) {
            updateState({
              loading: false,
              error: error.message,
              isInitialized: true
            });
          }
        } finally {
          isInitializingRef.current = false;
        }
      };
      
      initializeLeads();
    } else {
      console.log('⚠️ Inicialização pulada (fetchOnMount=false ou autoFetch=false)');
      isInitializingRef.current = false;
    }
  }, [userId, user?.uid, fetchOnMount, autoFetch]); // Mantidas apenas dependencies estáveis

  // Debug do estado atual
  useEffect(() => {
    console.log('🔍 Estado atual do useLeads:', {
      leadsCount: state.leads.length,
      loading: state.loading,
      isInitialized: state.isInitialized,
      error: state.error,
      total: state.total
    });
  }, [state.leads.length, state.loading, state.isInitialized, state.error, state.total]);

  // =========================================
  // 📤 RETURN INTERFACE
  // =========================================

  const returnValue = {
    // Data
    leads: state.leads,
    selectedLead: state.selectedLead,
    stats: state.stats,
    hotLeads,
    newLeads,
    averageScore,
    
    // UI State
    loading: state.loading,
    error: state.error,
    isInitialized: state.isInitialized,
    
    // Pagination
    page: state.page,
    total: state.total,
    hasMore: state.hasMore,
    
    // Filters
    activeFilters: state.activeFilters,
    
    // Operations
    createLead,
    updateLead,
    deleteLead,
    fetchLead,
    
    // Communication
    addCommunication,
    fetchCommunications,
    communications: state.communications,
    
    // Search & Filters
    searchLeads,
    applyFilters,
    clearFilters,
    
    // Control
    refresh,
    loadMore,
    fetchStats
  };

  console.log('📤 useLeads return:', {
    leadsCount: returnValue.leads.length,
    loading: returnValue.loading,
    isInitialized: returnValue.isInitialized
  });

  return returnValue;
};

/*
🔍 USELEADS DEBUG VERSION

✅ LOGS ADICIONADOS:
1. ✅ Estado updateState detalhado
2. ✅ Fetch responses completas
3. ✅ Leads data mapeada por ID/nome
4. ✅ Estado atual a cada mudança
5. ✅ Return value logado
6. ✅ Mounted checks detalhados
7. ✅ Timing de operações

🎯 OBJETIVO:
Identificar exatamente onde o estado não está sendo atualizado
ou onde os leads se perdem no processo.

📊 LOGS ESPERADOS:
- fetchLeads responses com dados
- updateState calls com leads
- Estado atual mostrando leads
- Return value com leads corretos

🔧 USO:
Substituir temporariamente para debug,
depois implementar fix baseado nos logs.
*/
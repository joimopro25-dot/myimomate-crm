// =========================================
// 🗄️ ZUSTAND STORE - CLIENTES
// =========================================
// Estado centralizado para gestão de clientes
// Sistema reativo e performante

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * Store principal para gestão de clientes
 */
export const useClientsStore = create((set, get) => ({
  // =========================================
  // 📊 STATE
  // =========================================

  // Dados principais
  clients: [],
  selectedClient: null,
  
  // Paginação
  page: 1,
  limit: 20,
  total: 0,
  hasMore: true,
  
  // Status
  loading: false,
  error: null,
  
  // Filtros
  filters: {
    search: '',
    roles: [],
    status: 'all', // 'all' | 'active' | 'inactive'
    source: null,
    dateRange: null
  },
  
  // Estatísticas
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    birthdaysThisMonth: 0,
    hotClients: 0,
    avgDealsValue: 0
  },
  
  // UI State
  viewMode: 'dashboard', // 'dashboard' | 'list' | 'grid'
  sidebarOpen: false,
  
  // =========================================
  // 🔨 ACTIONS
  // =========================================

  // Clients CRUD
  setClients: (clients) => set({ clients }),
  addClient: (client) => set((state) => ({
    clients: [client, ...state.clients],
    total: state.total + 1
  })),
  updateClient: (clientId, updates) => set((state) => ({
    clients: state.clients.map(client =>
      client.id === clientId ? { ...client, ...updates } : client
    ),
    selectedClient: state.selectedClient?.id === clientId
      ? { ...state.selectedClient, ...updates }
      : state.selectedClient
  })),
  removeClient: (clientId) => set((state) => ({
    clients: state.clients.filter(client => client.id !== clientId),
    selectedClient: state.selectedClient?.id === clientId ? null : state.selectedClient,
    total: Math.max(0, state.total - 1)
  })),
  
  // Selection
  setSelectedClient: (client) => set({ selectedClient: client }),
  clearSelectedClient: () => set({ selectedClient: null }),
  
  // Pagination
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setTotal: (total) => set({ total }),
  setHasMore: (hasMore) => set({ hasMore }),
  
  // Loading & Error
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Filters
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    page: 1 // Reset page when filters change
  })),
  clearFilters: () => set({
    filters: {
      search: '',
      roles: [],
      status: 'all',
      source: null,
      dateRange: null
    },
    page: 1
  }),
  
  // Stats
  setStats: (stats) => set({ stats }),
  updateStats: (updates) => set((state) => ({
    stats: { ...state.stats, ...updates }
  })),
  
  // UI
  setViewMode: (viewMode) => set({ viewMode }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Utils
  reset: () => set({
    clients: [],
    selectedClient: null,
    page: 1,
    total: 0,
    hasMore: true,
    loading: false,
    error: null,
    filters: {
      search: '',
      roles: [],
      status: 'all',
      source: null,
      dateRange: null
    }
  })
}));

// =========================================
// 🎯 SELECTORS
// =========================================

export const selectClients = (state) => state.clients;
export const selectSelectedClient = (state) => state.selectedClient;
export const selectLoading = (state) => state.loading;
export const selectError = (state) => state.error;
export const selectFilters = (state) => state.filters;
export const selectStats = (state) => state.stats;
export const selectPagination = (state) => ({
  page: state.page,
  limit: state.limit,
  total: state.total,
  hasMore: state.hasMore
});

// Computed selectors
export const selectFilteredClients = (state) => {
  const { clients, filters } = state;
  
  return clients.filter(client => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = (
        client.dadosPessoais?.nome?.toLowerCase().includes(searchLower) ||
        client.dadosPessoais?.email?.toLowerCase().includes(searchLower) ||
        client.dadosPessoais?.telefone?.includes(filters.search)
      );
      if (!matchesSearch) return false;
    }
    
    // Roles filter
    if (filters.roles.length > 0) {
      const hasMatchingRole = client.roles?.some(role => 
        filters.roles.includes(role)
      );
      if (!hasMatchingRole) return false;
    }
    
    // Status filter
    if (filters.status !== 'all') {
      const isActive = client.ativo !== false;
      if (filters.status === 'active' && !isActive) return false;
      if (filters.status === 'inactive' && isActive) return false;
    }
    
    // Source filter
    if (filters.source && client.origem !== filters.source) {
      return false;
    }
    
    return true;
  });
};

export const selectActiveClients = (state) => 
  state.clients.filter(client => client.ativo !== false);

export const selectInactiveClients = (state) => 
  state.clients.filter(client => client.ativo === false);

export default useClientsStore;
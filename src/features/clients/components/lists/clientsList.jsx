// =========================================
// 🎨 COMPONENT - ClientsList CORRIGIDO
// =========================================
// Lista revolucionária que transforma dados em insights
// Interface que vicia consultores a usar

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Grid3X3,
  List,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Gift,
  AlertCircle,
  Plus,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
  Euro,
  Phone,
  Mail
} from 'lucide-react';

import ClientCard from '../cards/ClientCard';
import { useClients } from '../../hooks/useClients';
import { ClientRole, ClientRoleLabels, EstadoCivil, ClientSource } from '../../types/enums';

// Utils
import {
  calculateEngagementScore,
  hasUrgentActions,
  isBirthdayThisMonth,
  isBirthdayToday,
  getTotalDealsValue,
  formatCurrency
} from '../../utils/clientUtils';

/**
 * ClientsList - Lista inteligente e cativante
 * Transforma gestão de clientes numa experiência viciante
 */
const ClientsList = ({ 
  onClientSelect,
  onClientEdit,
  onClientContact,
  onClientCall,
  onClientEmail,
  className = '',
  variant = 'grid', // 'grid' | 'list' | 'compact'
  showFilters = true,
  showStats = true,
  showSearch = true,
  autoRefresh = true
}) => {
  // =========================================
  // 🎣 HOOKS & STATE
  // =========================================

  const {
    clients,
    loading,
    error,
    stats,
    filters,
    hasActiveFilters,
    applyFilters,
    resetFilters,
    loadMore,
    hasMore,
    refresh,
    clearError
  } = useClients({
    autoFetch: true,
    enablePolling: autoRefresh,
    pollingInterval: 60000 // 1 minuto
  });

  const [viewMode, setViewMode] = useState(variant);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created'); // 'created' | 'name' | 'engagement' | 'deals'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'hot' | 'urgent' | 'cold' | 'birthday'

  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // =========================================
  // 🧠 DADOS INTELIGENTES
  // =========================================

  const intelligentData = useMemo(() => {
    if (!clients.length) return {
      hotClients: [],
      urgentClients: [],
      coldClients: [],
      birthdayClients: [],
      totalValue: 0,
      avgEngagement: 0,
      totalClients: 0,
      activeClients: 0,
      newThisMonth: 0
    };

    // Análise dos clientes
    const hotClients = clients.filter(client => calculateEngagementScore(client) >= 80);
    const urgentClients = clients.filter(client => hasUrgentActions(client));
    const coldClients = clients.filter(client => calculateEngagementScore(client) < 40);
    const birthdayClients = clients.filter(client => isBirthdayThisMonth(client));
    
    // Insights de negócio
    const totalValue = clients.reduce((sum, client) => 
      sum + getTotalDealsValue(client), 0
    );
    
    const avgEngagement = clients.length > 0 
      ? Math.round(clients.reduce((sum, client) => 
          sum + calculateEngagementScore(client), 0
        ) / clients.length)
      : 0;

    return {
      hotClients,
      urgentClients,
      coldClients,
      birthdayClients,
      totalValue,
      avgEngagement,
      totalClients: clients.length,
      activeClients: clients.filter(c => c.ativo !== false).length,
      newThisMonth: clients.filter(c => {
        const created = new Date(c.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && 
               created.getFullYear() === now.getFullYear();
      }).length
    };
  }, [clients]);

  // =========================================
  // 🔍 FILTROS E PESQUISA
  // =========================================

  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...clients];

    // Aplicar pesquisa
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.dadosPessoais?.nome?.toLowerCase().includes(search) ||
        client.dadosPessoais?.email?.toLowerCase().includes(search) ||
        client.dadosPessoais?.telefone?.includes(searchTerm) ||
        client.roles?.some(role => 
          ClientRoleLabels[role]?.toLowerCase().includes(search)
        )
      );
    }

    // Aplicar quick filters
    switch (quickFilter) {
      case 'hot':
        filtered = filtered.filter(client => 
          calculateEngagementScore(client) >= 80
        );
        break;
      case 'urgent':
        filtered = filtered.filter(client => hasUrgentActions(client));
        break;
      case 'cold':
        filtered = filtered.filter(client => 
          calculateEngagementScore(client) < 40
        );
        break;
      case 'birthday':
        filtered = filtered.filter(client => isBirthdayThisMonth(client));
        break;
      default:
        // 'all' - sem filtro adicional
        break;
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.dadosPessoais?.nome || '';
          bValue = b.dadosPessoais?.nome || '';
          break;
        case 'engagement':
          aValue = calculateEngagementScore(a);
          bValue = calculateEngagementScore(b);
          break;
        case 'deals':
          aValue = getTotalDealsValue(a);
          bValue = getTotalDealsValue(b);
          break;
        case 'created':
        default:
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'pt-PT');
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      const comparison = aValue - bValue;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [clients, searchTerm, quickFilter, sortBy, sortOrder]);

  // =========================================
  // 🎯 EVENT HANDLERS
  // =========================================

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy]);

  const handleQuickFilter = useCallback((filter) => {
    setQuickFilter(filter);
  }, []);

  const handleClientAction = useCallback((action, client) => {
    switch (action) {
      case 'select':
      case 'view':
        onClientSelect?.(client);
        break;
      case 'edit':
        onClientEdit?.(client);
        break;
      case 'contact':
        onClientContact?.(client);
        break;
      case 'call':
        onClientCall?.(client);
        break;
      case 'email':
        onClientEmail?.(client);
        break;
    }
  }, [onClientSelect, onClientEdit, onClientContact, onClientCall, onClientEmail]);

  const handleBulkAction = useCallback((action) => {
    console.log('Bulk action:', action, 'for clients:', selectedClients);
    // Implementar ações em massa conforme necessário
  }, [selectedClients]);

  // =========================================
  // ⚡ EFFECTS
  // =========================================

  // Focus na pesquisa com Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-clear errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // =========================================
  // 🎨 RENDER HELPERS
  // =========================================

  const renderStatsCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      <StatsCard
        icon={Users}
        label="Total"
        value={intelligentData.totalClients}
        color="blue"
        active={quickFilter === 'all'}
        onClick={() => handleQuickFilter('all')}
      />
      <StatsCard
        icon={TrendingUp}
        label="Hot Clients"
        value={intelligentData.hotClients.length}
        color="green"
        active={quickFilter === 'hot'}
        onClick={() => handleQuickFilter('hot')}
      />
      <StatsCard
        icon={AlertCircle}
        label="Urgentes"
        value={intelligentData.urgentClients.length}
        color="red"
        active={quickFilter === 'urgent'}
        onClick={() => handleQuickFilter('urgent')}
      />
      <StatsCard
        icon={Clock}
        label="Frios"
        value={intelligentData.coldClients.length}
        color="gray"
        active={quickFilter === 'cold'}
        onClick={() => handleQuickFilter('cold')}
      />
      <StatsCard
        icon={Gift}
        label="Aniversários"
        value={intelligentData.birthdayClients.length}
        color="pink"
        active={quickFilter === 'birthday'}
        onClick={() => handleQuickFilter('birthday')}
      />
      <StatsCard
        icon={Euro}
        label="Valor Total"
        value={formatCurrency(intelligentData.totalValue)}
        color="purple"
        compact
      />
    </div>
  );

  const renderToolbar = () => (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      {/* Search & Filters */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Pesquisar clientes... (Ctrl+K)"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {showFilters && (
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`
              flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors
              ${hasActiveFilters 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        )}
      </div>

      {/* View Controls */}
      <div className="flex items-center gap-2">
        {/* Sort Buttons */}
        <div className="flex items-center border border-gray-300 rounded-xl">
          <button
            onClick={() => handleSort('name')}
            className={`
              px-3 py-2 text-sm rounded-l-xl transition-colors
              ${sortBy === 'name' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
            `}
          >
            Nome
            {sortBy === 'name' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1 inline" /> : <SortDesc className="w-3 h-3 ml-1 inline" />
            )}
          </button>
          <button
            onClick={() => handleSort('engagement')}
            className={`
              px-3 py-2 text-sm border-l border-gray-300 transition-colors
              ${sortBy === 'engagement' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
            `}
          >
            Score
            {sortBy === 'engagement' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1 inline" /> : <SortDesc className="w-3 h-3 ml-1 inline" />
            )}
          </button>
          <button
            onClick={() => handleSort('deals')}
            className={`
              px-3 py-2 text-sm border-l border-gray-300 transition-colors
              ${sortBy === 'deals' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
            `}
          >
            Valor
            {sortBy === 'deals' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1 inline" /> : <SortDesc className="w-3 h-3 ml-1 inline" />
            )}
          </button>
          <button
            onClick={() => handleSort('created')}
            className={`
              px-3 py-2 text-sm border-l border-gray-300 rounded-r-xl transition-colors
              ${sortBy === 'created' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
            `}
          >
            Data
            {sortBy === 'created' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1 inline" /> : <SortDesc className="w-3 h-3 ml-1 inline" />
            )}
          </button>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center border border-gray-300 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`
              p-2 rounded-l-xl transition-colors
              ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
            `}
            title="Vista em grade"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              p-2 border-l border-gray-300 transition-colors
              ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
            `}
            title="Vista em lista"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`
              p-2 border-l border-gray-300 rounded-r-xl transition-colors
              ${viewMode === 'compact' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
            `}
            title="Vista compacta"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>

        {/* Refresh Button */}
        <button
          onClick={refresh}
          disabled={loading}
          className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          title="Atualizar"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );

  const renderClientsList = () => {
    if (loading && !clients.length) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erro ao carregar clientes
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    if (!filteredAndSortedClients.length) {
      return (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || quickFilter !== 'all' 
              ? 'Nenhum cliente encontrado' 
              : 'Ainda não tem clientes'
            }
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || quickFilter !== 'all'
              ? 'Tente ajustar os filtros ou pesquisa'
              : 'Comece por adicionar o seu primeiro cliente'
            }
          </p>
          {(searchTerm || quickFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setQuickFilter('all');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      );
    }

    // Render baseado na view mode
    const gridClasses = {
      grid: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
      list: 'space-y-4',
      compact: 'space-y-2'
    };

    return (
      <div className={gridClasses[viewMode]}>
        <AnimatePresence mode="popLayout">
          {filteredAndSortedClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              variant={viewMode === 'grid' ? 'default' : viewMode}
              onView={(client) => handleClientAction('view', client)}
              onEdit={(client) => handleClientAction('edit', client)}
              onContact={(client) => handleClientAction('contact', client)}
              onCall={(client) => handleClientAction('call', client)}
              onEmail={(client) => handleClientAction('email', client)}
              showActions={true}
              showMetrics={viewMode !== 'compact'}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const renderLoadMore = () => {
    if (!hasMore) return null;

    return (
      <div className="text-center mt-8">
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : (
            'Carregar mais'
          )}
        </button>
      </div>
    );
  };

  // =========================================
  // 🎨 MAIN RENDER
  // =========================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      {showStats && renderStatsCards()}

      {/* Toolbar */}
      {renderToolbar()}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFiltersPanel && (
          <FiltersPanel
            onClose={() => setShowFiltersPanel(false)}
            onApply={(newFilters) => {
              applyFilters(newFilters);
              setShowFiltersPanel(false);
            }}
            onReset={() => {
              resetFilters();
              setShowFiltersPanel(false);
            }}
            currentFilters={filters}
          />
        )}
      </AnimatePresence>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredAndSortedClients.length === 1 
            ? '1 cliente encontrado'
            : `${filteredAndSortedClients.length} clientes encontrados`
          }
          {(searchTerm || quickFilter !== 'all') && (
            <span className="ml-2">
              ({clients.length} total)
            </span>
          )}
        </span>

        {selectedClients.length > 0 && (
          <div className="flex items-center gap-3">
            <span>{selectedClients.length} selecionados</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleBulkAction('email')}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
              >
                Email
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
              >
                Exportar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clients List */}
      <div ref={listRef}>
        {renderClientsList()}
      </div>

      {/* Load More */}
      {renderLoadMore()}
    </div>
  );
};

// =========================================
// 🎨 STATS CARD COMPONENT
// =========================================

const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color = 'blue', 
  active = false,
  onClick,
  compact = false 
}) => {
  const colorClasses = {
    blue: active ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    green: active ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100',
    red: active ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100',
    gray: active ? 'bg-gray-500 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
    pink: active ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100',
    purple: active ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
  };

  return (
    <motion.button
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={`
        p-4 rounded-xl border-2 transition-all text-left w-full
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        ${active ? 'border-current' : 'border-transparent'}
        ${colorClasses[color]}
      `}
      disabled={!onClick}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className={`text-2xl font-bold ${compact ? 'text-lg' : ''}`}>
            {value}
          </p>
          <p className={`text-sm opacity-80 ${compact ? 'text-xs' : ''}`}>
            {label}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

// =========================================
// 🎨 SKELETON CARD
// =========================================

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-gray-200 rounded-full w-16" />
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1" />
        <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
      </div>
      <div className="text-center">
        <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1" />
        <div className="h-3 bg-gray-200 rounded w-10 mx-auto" />
      </div>
      <div className="text-center">
        <div className="h-6 bg-gray-200 rounded w-6 mx-auto mb-1" />
        <div className="h-3 bg-gray-200 rounded w-14 mx-auto" />
      </div>
    </div>
    <div className="h-12 bg-gray-200 rounded-xl mb-4" />
    <div className="flex justify-between items-center">
      <div className="h-3 bg-gray-200 rounded w-24" />
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

// =========================================
// 🎨 FILTERS PANEL
// =========================================

const FiltersPanel = ({ 
  onClose, 
  onApply, 
  onReset, 
  currentFilters 
}) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const updateFilter = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipos de Cliente
          </label>
          <div className="space-y-2">
            {Object.entries(ClientRoleLabels).map(([value, label]) => (
              <label key={value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.roles?.includes(value) || false}
                  onChange={(e) => {
                    const roles = localFilters.roles || [];
                    if (e.target.checked) {
                      updateFilter('roles', [...roles, value]);
                    } else {
                      updateFilter('roles', roles.filter(r => r !== value));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={localFilters.status || 'all'}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        {/* Data Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período de Criação
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={localFilters.dateRange?.start || ''}
              onChange={(e) => updateFilter('dateRange', {
                ...localFilters.dateRange,
                start: e.target.value
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Data início"
            />
            <input
              type="date"
              value={localFilters.dateRange?.end || ''}
              onChange={(e) => updateFilter('dateRange', {
                ...localFilters.dateRange,
                end: e.target.value
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Data fim"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Limpar
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => onApply(localFilters)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Aplicar Filtros
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(ClientsList);
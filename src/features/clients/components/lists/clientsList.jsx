// =========================================
// 🎨 COMPONENT - ClientsList INTELIGENTE
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
  Zap,
  Target,
  TrendingUp,
  Users,
  Star,
  Calendar,
  Gift,
  AlertCircle,
  Sparkles,
  Eye,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import ClientCard from '../cards/ClientCard';
import { useClients } from '../../hooks/useClients';
import { ClientRole, EstadoCivil, ClientSource } from '../../types/enums';

/**
 * ClientsList - Lista inteligente e cativante
 * Transforma gestão de clientes numa experiência viciante
 */
const ClientsList = ({ 
  onClientSelect,
  onClientEdit,
  onClientContact,
  className = ''
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
    refresh
  } = useClients();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created'); // 'created' | 'name' | 'engagement' | 'deals'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'hot' | 'urgent' | 'cold'

  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // =========================================
  // 🧠 DADOS INTELIGENTES
  // =========================================

  const intelligentData = useMemo(() => {
    // Análise dos clientes
    const hotClients = clients.filter(client => calculateEngagementScore(client) >= 80);
    const urgentClients = clients.filter(client => hasUrgentActions(client));
    const coldClients = clients.filter(client => calculateEngagementScore(client) < 40);
    const birthdayClients = clients.filter(client => isBirthdayThisMonth(client));
    
    // Insights de negócio
    const totalValue = clients.reduce((sum, client) => 
      sum + (client.deals?.reduce((dealSum, deal) => dealSum + (deal.valor || 0), 0) || 0), 0
    );
    
    const avgEngagement = clients.length > 0 
      ? clients.reduce((sum, client) => sum + calculateEngagementScore(client), 0) / clients.length 
      : 0;

    return {
      hotClients: hotClients.length,
      urgentClients: urgentClients.length,
      coldClients: coldClients.length,
      birthdayClients: birthdayClients.length,
      totalValue,
      avgEngagement: Math.round(avgEngagement),
      trendingUp: hotClients.length > coldClients.length
    };
  }, [clients]);

  // =========================================
  // 🔍 FILTROS E ORDENAÇÃO
  // =========================================

  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...clients];

    // Filtro de pesquisa
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.dadosPessoais?.nome?.toLowerCase().includes(search) ||
        client.dadosPessoais?.email?.toLowerCase().includes(search) ||
        client.dadosPessoais?.telefone?.includes(search) ||
        client.dadosPessoais?.nif?.includes(search)
      );
    }

    // Quick filters
    switch (quickFilter) {
      case 'hot':
        filtered = filtered.filter(client => calculateEngagementScore(client) >= 80);
        break;
      case 'urgent':
        filtered = filtered.filter(client => hasUrgentActions(client));
        break;
      case 'cold':
        filtered = filtered.filter(client => calculateEngagementScore(client) < 40);
        break;
      case 'birthday':
        filtered = filtered.filter(client => isBirthdayThisMonth(client));
        break;
    }

    // Ordenação
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
          aValue = a.deals?.length || 0;
          bValue = b.deals?.length || 0;
          break;
        case 'value':
          aValue = a.deals?.reduce((sum, deal) => sum + (deal.valor || 0), 0) || 0;
          bValue = b.deals?.reduce((sum, deal) => sum + (deal.valor || 0), 0) || 0;
          break;
        default: // 'created'
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [clients, searchTerm, quickFilter, sortBy, sortOrder]);

  // =========================================
  // 🎨 COMPONENTES INTERNOS
  // =========================================

  const InsightsBanner = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-2xl text-white mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Dashboard Inteligente</h2>
          <p className="text-blue-100">Insights em tempo real dos seus clientes</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-2xl font-bold">{intelligentData.avgEngagement}%</div>
            <div className="text-sm opacity-90">Engagement Médio</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-2xl font-bold">
              €{(intelligentData.totalValue / 1000).toFixed(0)}k
            </div>
            <div className="text-sm opacity-90">Valor Total</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mt-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 rounded-xl p-3 cursor-pointer"
          onClick={() => setQuickFilter('hot')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="font-medium">Hot Clients</span>
          </div>
          <div className="text-2xl font-bold">{intelligentData.hotClients}</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 rounded-xl p-3 cursor-pointer"
          onClick={() => setQuickFilter('urgent')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-300" />
            <span className="font-medium">Urgentes</span>
          </div>
          <div className="text-2xl font-bold">{intelligentData.urgentClients}</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 rounded-xl p-3 cursor-pointer"
          onClick={() => setQuickFilter('birthday')}
        >
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-4 h-4 text-pink-300" />
            <span className="font-medium">Aniversários</span>
          </div>
          <div className="text-2xl font-bold">{intelligentData.birthdayClients}</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 rounded-xl p-3 cursor-pointer"
          onClick={() => setQuickFilter('cold')}
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-blue-300" />
            <span className="font-medium">Frios</span>
          </div>
          <div className="text-2xl font-bold">{intelligentData.coldClients}</div>
        </motion.div>
      </div>
    </motion.div>
  );

  const SearchAndFilters = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Pesquisar clientes por nome, email, telefone ou NIF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refresh}
            disabled={loading}
            className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>
      
      {/* Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Todos', icon: Users, count: clients.length },
          { key: 'hot', label: 'Hot', icon: Star, count: intelligentData.hotClients },
          { key: 'urgent', label: 'Urgentes', icon: Zap, count: intelligentData.urgentClients },
          { key: 'birthday', label: 'Aniversários', icon: Gift, count: intelligentData.birthdayClients },
          { key: 'cold', label: 'Frios', icon: AlertCircle, count: intelligentData.coldClients }
        ].map(filter => (
          <motion.button
            key={filter.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setQuickFilter(filter.key)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${quickFilter === filter.key 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <filter.icon className="w-4 h-4" />
            <span>{filter.label}</span>
            <span className={`
              px-2 py-0.5 rounded-full text-xs
              ${quickFilter === filter.key ? 'bg-blue-200' : 'bg-gray-200'}
            `}>
              {filter.count}
            </span>
          </motion.button>
        ))}
      </div>
      
      {/* Sort Options */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
        <div className="flex gap-2">
          {[
            { key: 'created', label: 'Criação' },
            { key: 'name', label: 'Nome' },
            { key: 'engagement', label: 'Engagement' },
            { key: 'deals', label: 'Deals' },
            { key: 'value', label: 'Valor' }
          ].map(sort => (
            <button
              key={sort.key}
              onClick={() => {
                if (sortBy === sort.key) {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy(sort.key);
                  setSortOrder('desc');
                }
              }}
              className={`
                flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all
                ${sortBy === sort.key 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span>{sort.label}</span>
              {sortBy === sort.key && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Users className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente ainda'}
      </h3>
      <p className="text-gray-500 mb-6">
        {searchTerm 
          ? 'Tente ajustar os filtros ou pesquisa' 
          : 'Comece adicionando o seu primeiro cliente'
        }
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors mx-auto"
      >
        <Plus className="w-5 h-5" />
        <span>Adicionar Cliente</span>
      </motion.button>
    </motion.div>
  );

  const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // =========================================
  // 🎨 RENDER PRINCIPAL
  // =========================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Insights Banner */}
      <InsightsBanner />
      
      {/* Search and Filters */}
      <SearchAndFilters />
      
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredAndSortedClients.length} cliente{filteredAndSortedClients.length !== 1 ? 's' : ''}
            {quickFilter !== 'all' && (
              <span className="text-blue-600 ml-2">
                ({quickFilter === 'hot' ? 'Hot' : 
                  quickFilter === 'urgent' ? 'Urgentes' : 
                  quickFilter === 'birthday' ? 'Aniversários' : 'Frios'})
              </span>
            )}
          </h3>
          {searchTerm && (
            <p className="text-sm text-gray-500">
              Resultados para "{searchTerm}"
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </motion.button>
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : filteredAndSortedClients.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Clients Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredAndSortedClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <ClientCard
                    client={client}
                    onView={onClientSelect}
                    onEdit={onClientEdit}
                    onContact={onClientContact}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                    showStats={viewMode === 'grid'}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Carregando...' : 'Carregar Mais'}
              </motion.button>
            </div>
          )}
        </>
      )}
      
      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Erro ao carregar clientes</span>
          </div>
          <p className="text-sm mt-1">{error}</p>
        </motion.div>
      )}
    </div>
  );
};

// =========================================
// 🧠 FUNÇÕES AUXILIARES
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

function hasUrgentActions(client) {
  // Aniversário hoje
  if (isBirthdayToday(client)) return true;
  
  // Deals urgentes
  const urgentDeals = client.deals?.filter(deal => 
    ['proposta_enviada', 'cpcv_assinado', 'escritura_agendada'].includes(deal.status)
  ) || [];
  
  return urgentDeals.length > 0;
}

function isBirthdayThisMonth(client) {
  if (!client.dadosPessoais?.dataNascimento) return false;
  
  const birthday = new Date(client.dadosPessoais.dataNascimento);
  const now = new Date();
  
  return birthday.getMonth() === now.getMonth();
}

function isBirthdayToday(client) {
  if (!client.dadosPessoais?.dataNascimento) return false;
  
  const birthday = new Date(client.dadosPessoais.dataNascimento);
  const now = new Date();
  
  return birthday.getMonth() === now.getMonth() && 
         birthday.getDate() === now.getDate();
}

export default ClientsList;
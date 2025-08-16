import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Phone, 
  Mail, 
  MessageCircle,
  Target,
  TrendingUp,
  Thermometer,
  Users,
  Zap,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Filter,
  Search,
  Grid,
  List,
  Kanban
} from 'lucide-react';

// Hooks
import useLeads from '../hooks/useLeads';

// Components
import LeadModal from '../components/modals/LeadModal';
import LeadCard from '../components/cards/LeadCard';

// Types fallback
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
 * LeadsPage - Sistema de gestão de leads com pipeline Kanban
 * CORREÇÃO: Estado do modal gerenciado localmente sem conflitos
 */
const LeadsPage = () => {
  // =========================================
  // 🎣 HOOKS & STATE 
  // =========================================

  const {
    leads,
    loading,
    error,
    stats,
    createLead,
    updateLead,
    deleteLead,
    addCommunication,
    convertToClient,
    refresh,
    clearError,
    hotLeads,
    newLeads,
    averageScore
  } = useLeads({
    enableRealTime: true,
    enableAutoScoring: true
  });

  // Estado local da página - SEM CONFLITOS
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'kanban' | 'list'
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [selectedLead, setSelectedLead] = useState(null); // ✅ Estado local para modal
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // =========================================
  // 📊 COMPUTED VALUES 
  // =========================================

  const dashboardData = useMemo(() => {
    const totalLeads = leads?.length || 0;
    const hotCount = hotLeads?.length || 0;
    const newCount = newLeads?.length || 0;
    const score = averageScore || 0;

    return {
      total: totalLeads,
      newLeads: newCount,
      hotLeads: hotCount,
      readyToConvert: leads?.filter(l => (l.score || 0) >= 80)?.length || 0,
      averageScore: Math.round(score),
      needsAttention: leads?.filter(l => {
        const daysSinceContact = l.lastContact 
          ? Math.floor((Date.now() - new Date(l.lastContact).getTime()) / (1000 * 60 * 60 * 24))
          : null;
        return daysSinceContact && daysSinceContact > 7;
      })?.length || 0,
      conversionRate: stats?.conversionRate || 0
    };
  }, [leads, hotLeads, newLeads, averageScore, stats]);

  // Pipeline data por status
  const pipelineData = useMemo(() => {
    const pipeline = {};
    
    // Inicializar todos os status
    Object.values(LeadStatus).forEach(status => {
      pipeline[status] = leads?.filter(lead => (lead.status || 'novo') === status) || [];
    });
    
    return pipeline;
  }, [leads]);

  // =========================================
  // 📋 HANDLERS - CORRIGIDOS 
  // =========================================

  const handleCreateLead = useCallback(() => {
    setSelectedLead(null);
    setModalMode('create');
    setShowModal(true);
  }, []);

  const handleViewLead = useCallback((lead) => {
    setSelectedLead(lead);
    setModalMode('view');
    setShowModal(true);
  }, []);

  const handleEditLead = useCallback((lead) => {
    setSelectedLead(lead);
    setModalMode('edit');
    setShowModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelectedLead(null);
  }, []);

  const handleLeadCreate = useCallback(async (leadData) => {
    try {
      await createLead(leadData);
      setShowModal(false);
      setSelectedLead(null);
      console.log('✅ Lead criado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar lead:', error);
      throw error;
    }
  }, [createLead]);

  const handleLeadUpdate = useCallback(async (leadId, leadData) => {
    try {
      await updateLead(leadId, leadData);
      setShowModal(false);
      setSelectedLead(null);
      console.log('✅ Lead atualizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar lead:', error);
      throw error;
    }
  }, [updateLead]);

  const handleLeadDelete = useCallback(async (leadId) => {
    try {
      await deleteLead(leadId);
      setShowModal(false);
      setSelectedLead(null);
      console.log('✅ Lead deletado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar lead:', error);
      throw error;
    }
  }, [deleteLead]);

  // =========================================
  // 📞 COMMUNICATION HANDLERS
  // =========================================

  const handleCall = useCallback(async (lead) => {
    console.log('📞 Iniciando chamada para:', lead.name);
    
    if (lead.phone) {
      window.open(`tel:${lead.phone}`, '_self');
      
      try {
        await addCommunication(lead.id, {
          type: 'call',
          notes: 'Chamada realizada via sistema',
          outcome: 'attempted'
        });
      } catch (error) {
        console.error('Erro ao registrar comunicação:', error);
      }
    }
  }, [addCommunication]);

  const handleEmail = useCallback(async (lead) => {
    console.log('📧 Abrindo email para:', lead.name);
    
    if (lead.email) {
      const subject = encodeURIComponent(`Contacto MyImoMate - ${lead.name}`);
      const body = encodeURIComponent(`Olá ${lead.name},\n\n`);
      window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_self');
      
      try {
        await addCommunication(lead.id, {
          type: 'email',
          notes: 'Email enviado via sistema',
          outcome: 'sent'
        });
      } catch (error) {
        console.error('Erro ao registrar comunicação:', error);
      }
    }
  }, [addCommunication]);

  const handleWhatsApp = useCallback(async (lead) => {
    console.log('💬 Abrindo WhatsApp para:', lead.name);
    
    if (lead.phone) {
      const message = encodeURIComponent(`Olá ${lead.name}! Sou da MyImoMate.`);
      window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
      
      try {
        await addCommunication(lead.id, {
          type: 'whatsapp',
          notes: 'WhatsApp enviado via sistema',
          outcome: 'sent'
        });
      } catch (error) {
        console.error('Erro ao registrar comunicação:', error);
      }
    }
  }, [addCommunication]);

  // =========================================
  // 🎨 RENDER HELPERS
  // =========================================

  const renderStatsCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.total}</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Novos</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.newLeads}</p>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Quentes</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.hotLeads}</p>
          </div>
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Thermometer className="w-4 h-4 text-red-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Prontos</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.readyToConvert}</p>
          </div>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-purple-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Score Médio</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.averageScore}%</p>
          </div>
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-yellow-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Atenção</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.needsAttention}</p>
          </div>
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderViewModeToggle = () => (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setViewMode('dashboard')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'dashboard'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <BarChart3 className="w-4 h-4 inline mr-1" />
        Dashboard
      </button>
      <button
        onClick={() => setViewMode('kanban')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'kanban'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Kanban className="w-4 h-4 inline mr-1" />
        Pipeline
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="w-4 h-4 inline mr-1" />
        Lista
      </button>
    </div>
  );

  // =========================================
  // 🎨 MAIN RENDER
  // =========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md w-full mx-4">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Erro ao carregar leads
          </h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={refresh}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={clearError}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Dismissar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Leads Épico</h1>
              <p className="text-gray-600 mt-1">
                {dashboardData.total} leads • {dashboardData.newLeads} quentes • {dashboardData.averageScore}% score médio
              </p>
            </div>
            <div className="flex items-center gap-4">
              {renderViewModeToggle()}
              <button
                onClick={handleCreateLead}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderStatsCards()}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {dashboardData.total === 0 ? 'Comece Agora!' : 'Dashboard Completo'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {dashboardData.total === 0
                    ? 'Comece criando seu primeiro lead para ver o sistema em ação'
                    : 'Dashboard com insights será implementado aqui'
                  }
                </p>
                <button
                  onClick={handleCreateLead}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {dashboardData.total === 0 ? 'Criar Primeiro Lead' : 'Novo Lead'}
                </button>
              </div>
            </motion.div>
          )}

          {viewMode === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(pipelineData).map(([status, statusLeads]) => (
                  <div key={status} className="bg-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 text-center">
                      {status.toUpperCase()} ({statusLeads.length})
                    </h3>
                    <div className="space-y-3">
                      {statusLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleViewLead(lead)}
                        >
                          <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {lead.email} • {lead.phone}
                          </p>
                          {lead.score && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs">
                                <span>Score</span>
                                <span>{lead.score}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-blue-600 h-1 rounded-full"
                                  style={{ width: `${lead.score}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {leads?.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewLead(lead)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{lead.name}</h3>
                      <p className="text-sm text-gray-600">{lead.email} • {lead.phone}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {lead.status || 'novo'}
                        </span>
                        {lead.score && (
                          <span className="text-xs text-gray-600">
                            Score: {lead.score}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(lead);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmail(lead);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsApp(lead);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <LeadModal
        isOpen={showModal}
        onClose={handleModalClose}
        lead={selectedLead}
        mode={modalMode}
        onLeadCreate={handleLeadCreate}
        onLeadUpdate={handleLeadUpdate}
        onLeadDelete={handleLeadDelete}
        loading={loading}
      />

      {/* Floating Action Button (Mobile) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCreateLead}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all md:hidden flex items-center justify-center z-30"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default LeadsPage;
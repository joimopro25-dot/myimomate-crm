// =========================================
// 📊 COMPONENT - LeadsDashboard INTELIGENTE
// =========================================
// Dashboard específico do módulo Leads com intelligence
// Implementando arquivo LeadsDashboard.jsx (2/4)
// Arquivo: src/features/leads/components/dashboard/LeadsDashboard.jsx

import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Zap,
  Fire,
  Thermometer,
  BarChart3,
  PieChart,
  Activity,
  Briefcase,
  MapPin,
  Euro,
  UserCheck,
  PhoneCall
} from 'lucide-react';

// Utils
import { formatDate, formatCurrency, formatPercentage } from '@/shared/utils/formatters';

// Types
import { LeadStatus, LeadTemperature } from '../../types/index';

/**
 * LeadsDashboard - Dashboard inteligente com analytics e quick actions
 * Features: Stats cards, recent leads, hot leads, quick actions, trends
 */
const LeadsDashboard = ({
  leads = [],
  stats = {},
  loading = false,
  onCreateLead,
  onEditLead,
  onViewLead,
  onLeadCall,
  onLeadEmail,
  onLeadWhatsapp,
  onRefresh
}) => {
  // =========================================
  // 🧠 COMPUTED VALUES
  // =========================================

  const computedStats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter(l => l.temperature === 'quente' || l.temperature === 'fervendo').length;
    const new30Days = leads.filter(l => {
      const created = new Date(l.createdAt || l.dataCaptura);
      const now = new Date();
      const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length;
    
    const converted = leads.filter(l => l.status === 'convertido').length;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;
    
    const averageScore = total > 0 
      ? leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / total 
      : 0;

    const byStatus = leads.reduce((acc, lead) => {
      const status = lead.status || 'novo';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const byTemperature = leads.reduce((acc, lead) => {
      const temp = lead.temperature || 'frio';
      acc[temp] = (acc[temp] || 0) + 1;
      return acc;
    }, {});

    const bySource = leads.reduce((acc, lead) => {
      const source = lead.fonte || 'desconhecido';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      hot,
      new30Days,
      converted,
      conversionRate,
      averageScore,
      byStatus,
      byTemperature,
      bySource
    };
  }, [leads]);

  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt || b.dataCaptura) - new Date(a.createdAt || a.dataCaptura))
      .slice(0, 5);
  }, [leads]);

  const hotLeads = useMemo(() => {
    return [...leads]
      .filter(lead => lead.temperature === 'quente' || lead.temperature === 'fervendo')
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 6);
  }, [leads]);

  const urgentActions = useMemo(() => {
    const actions = [];
    
    // Leads sem contacto há mais de 3 dias
    const staleLeads = leads.filter(lead => {
      if (!lead.lastContact) return true;
      const daysSince = Math.floor((Date.now() - new Date(lead.lastContact)) / (1000 * 60 * 60 * 24));
      return daysSince > 3;
    });

    if (staleLeads.length > 0) {
      actions.push({
        type: 'stale_leads',
        title: `${staleLeads.length} leads sem contacto`,
        description: 'Há mais de 3 dias',
        icon: Clock,
        color: 'orange',
        count: staleLeads.length,
        leads: staleLeads.slice(0, 3)
      });
    }

    // Leads quentes sem follow-up
    const hotNoFollowup = leads.filter(lead => 
      (lead.temperature === 'quente' || lead.temperature === 'fervendo') &&
      lead.status === 'novo'
    );

    if (hotNoFollowup.length > 0) {
      actions.push({
        type: 'hot_leads',
        title: `${hotNoFollowup.length} leads quentes`,
        description: 'Precisam de follow-up urgente',
        icon: Fire,
        color: 'red',
        count: hotNoFollowup.length,
        leads: hotNoFollowup.slice(0, 3)
      });
    }

    // Leads interessados para converter
    const readyToConvert = leads.filter(lead => 
      lead.status === 'interessado' && 
      (lead.score || 0) > 70
    );

    if (readyToConvert.length > 0) {
      actions.push({
        type: 'ready_convert',
        title: `${readyToConvert.length} leads prontos`,
        description: 'Para conversão em clientes',
        icon: UserCheck,
        color: 'green',
        count: readyToConvert.length,
        leads: readyToConvert.slice(0, 3)
      });
    }

    return actions;
  }, [leads]);

  // =========================================
  // 📋 HANDLERS
  // =========================================

  const handleQuickCall = useCallback((lead) => {
    console.log('📞 Quick call para:', lead.nome);
    onLeadCall?.(lead);
  }, [onLeadCall]);

  const handleQuickEmail = useCallback((lead) => {
    console.log('📧 Quick email para:', lead.nome);
    onLeadEmail?.(lead);
  }, [onLeadEmail]);

  const handleQuickWhatsapp = useCallback((lead) => {
    console.log('💬 Quick WhatsApp para:', lead.nome);
    onLeadWhatsapp?.(lead);
  }, [onLeadWhatsapp]);

  // =========================================
  // 🎨 RENDER HELPERS
  // =========================================

  const renderTemperatureIcon = (temperature) => {
    switch (temperature) {
      case 'fervendo': return <Fire className="w-4 h-4 text-red-600" />;
      case 'quente': return <Thermometer className="w-4 h-4 text-orange-500" />;
      case 'morno': return <Thermometer className="w-4 h-4 text-yellow-500" />;
      case 'frio': return <Thermometer className="w-4 h-4 text-blue-500" />;
      default: return <Thermometer className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderScoreBadge = (score) => {
    const scoreValue = score || 0;
    let colorClass = 'bg-gray-100 text-gray-600';
    
    if (scoreValue >= 80) colorClass = 'bg-green-100 text-green-800';
    else if (scoreValue >= 60) colorClass = 'bg-yellow-100 text-yellow-800';
    else if (scoreValue >= 40) colorClass = 'bg-orange-100 text-orange-800';
    else if (scoreValue > 0) colorClass = 'bg-red-100 text-red-800';

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        <Star className="w-3 h-3 mr-1" />
        {scoreValue.toFixed(0)}
      </span>
    );
  };

  // =========================================
  // 🎨 RENDER
  // =========================================

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-24"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Leads</p>
              <p className="text-3xl font-bold">{computedStats.total}</p>
              <p className="text-blue-100 text-xs mt-1">
                {computedStats.new30Days} novos (30 dias)
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Leads Quentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Leads Quentes</p>
              <p className="text-3xl font-bold">{computedStats.hot}</p>
              <p className="text-red-100 text-xs mt-1">
                {((computedStats.hot / computedStats.total) * 100 || 0).toFixed(1)}% do total
              </p>
            </div>
            <div className="w-12 h-12 bg-red-400 rounded-lg flex items-center justify-center">
              <Fire className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Score Médio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Score Médio</p>
              <p className="text-3xl font-bold">{computedStats.averageScore.toFixed(1)}</p>
              <p className="text-green-100 text-xs mt-1">
                Qualidade dos leads
              </p>
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Taxa Conversão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Taxa Conversão</p>
              <p className="text-3xl font-bold">{computedStats.conversionRate.toFixed(1)}%</p>
              <p className="text-purple-100 text-xs mt-1">
                {computedStats.converted} convertidos
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ações Urgentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ⚡ Ações Urgentes
            </h3>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>

          {urgentActions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">Todas as ações em dia!</p>
              <p className="text-sm text-gray-500 mt-1">Excelente trabalho</p>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentActions.map((action, index) => (
                <div
                  key={action.type}
                  className={`p-4 rounded-lg border-l-4 ${
                    action.color === 'red' ? 'border-red-500 bg-red-50' :
                    action.color === 'orange' ? 'border-orange-500 bg-orange-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <action.icon className={`w-5 h-5 mt-0.5 ${
                      action.color === 'red' ? 'text-red-600' :
                      action.color === 'orange' ? 'text-orange-600' :
                      'text-green-600'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                      {action.leads.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {action.leads.map(lead => (
                            <div key={lead.id} className="text-xs text-gray-500">
                              • {lead.nome} ({lead.telefone})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Leads Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              🕒 Recentes
            </h3>
            <button
              onClick={onCreateLead}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Novo Lead
            </button>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Nenhum lead ainda</p>
              <button
                onClick={onCreateLead}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Criar Primeiro Lead
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map(lead => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {lead.nome?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{lead.nome}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderTemperatureIcon(lead.temperature)}
                      <span className="text-sm text-gray-500">{lead.fonte}</span>
                      {renderScoreBadge(lead.score)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuickCall(lead)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ligar"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewLead?.(lead)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Leads Quentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              🔥 Leads Quentes
            </h3>
            <Fire className="w-5 h-5 text-red-500" />
          </div>

          {hotLeads.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Nenhum lead quente</p>
              <p className="text-sm text-gray-500 mt-1">Continue prospectando!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hotLeads.map(lead => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 p-3 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Fire className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{lead.nome}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{lead.empresa || lead.telefone}</span>
                      {renderScoreBadge(lead.score)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuickWhatsapp(lead)}
                      className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleQuickCall(lead)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ligar"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditLead?.(lead)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ⚡ Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={onCreateLead}
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <Plus className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Novo Lead</span>
          </button>

          <button
            onClick={onRefresh}
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all group"
          >
            <Activity className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
            <span className="text-sm font-medium text-gray-900">Atualizar</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all group">
            <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Analytics</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all group">
            <Briefcase className="w-6 h-6 text-gray-600 group-hover:text-orange-600" />
            <span className="text-sm font-medium text-gray-900">Pipeline</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all group">
            <Calendar className="w-6 h-6 text-gray-600 group-hover:text-gray-700" />
            <span className="text-sm font-medium text-gray-900">Agendar</span>
          </button>
        </div>
      </motion.div>

      {/* Analytics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Por Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">📊 Por Status</h4>
          <div className="space-y-3">
            {Object.entries(computedStats.byStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / computedStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por Temperatura */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">🌡️ Por Temperatura</h4>
          <div className="space-y-3">
            {Object.entries(computedStats.byTemperature).map(([temp, count]) => (
              <div key={temp} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {renderTemperatureIcon(temp)}
                  <span className="text-sm text-gray-600 capitalize">{temp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        temp === 'fervendo' ? 'bg-red-600' :
                        temp === 'quente' ? 'bg-orange-500' :
                        temp === 'morno' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${(count / computedStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por Fonte */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">📍 Por Fonte</h4>
          <div className="space-y-3">
            {Object.entries(computedStats.bySource).slice(0, 5).map(([source, count]) => (
              <div key={source} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{source}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(count / computedStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadsDashboard;

/*
📊 LEADSDASHBOARD.JSX - DASHBOARD INTELIGENTE (2/4)

✅ FEATURES IMPLEMENTADAS:
1. ✅ STATS CARDS premium com gradientes e animations
2. ✅ AÇÕES URGENTES inteligentes (leads frios, quentes, conversão)
3. ✅ LEADS RECENTES com quick actions inline
4. ✅ LEADS QUENTES prioritários com score badges
5. ✅ QUICK ACTIONS grid para operações rápidas
6. ✅ ANALYTICS SUMMARY com charts por status/temperatura/fonte
7. ✅ LOADING STATES elegantes com skeleton
8. ✅ EMPTY STATES motivacionais
9. ✅ RESPONSIVE DESIGN mobile-first
10. ✅ COMPUTED VALUES otimizados com useMemo

🧠 INTELLIGENCE FEATURES:
- Análise automática de leads sem contacto (>3 dias)
- Identificação de leads quentes sem follow-up
- Detecção de leads prontos para conversão (score >70)
- Stats distribuição por status/temperatura/fonte
- Quick actions*/
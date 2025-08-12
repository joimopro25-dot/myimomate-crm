// =========================================
// 🎨 COMPONENT - ClientModal INTELIGENTE
// =========================================
// Modal revolucionário que adapta-se ao contexto
// Interface que torna ações rápidas viciantes

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Eye,
  MessageCircle,
  Star,
  Heart,
  Briefcase,
  Euro,
  FileText,
  Upload,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Gift,
  AlertCircle,
  Settings,
  Trash2,
  Archive,
  Clock,
  TrendingUp,
  Target,
  Camera,
  Save,
  RefreshCw
} from 'lucide-react';
import { useClientForm } from '../../hooks/useClientForm';
import { useClientDocuments } from '../../hooks/useClientDocuments';
import { ClientRoleLabels, ClientRoleColors, EstadoCivilLabels } from '../../types/enums';
import ClientForm from '../forms/ClientForm';

/**
 * ClientModal - Modal inteligente e adaptativo
 * Transforma visualização e edição em experiência fluida
 */
const ClientModal = ({ 
  isOpen, 
  onClose, 
  client = null,
  mode = 'view', // 'view' | 'edit' | 'create' | 'quick-contact'
  onClientUpdate,
  onClientDelete,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const modalRef = useRef(null);
  const { documents } = useClientDocuments(client?.id);

  // =========================================
  // 🎯 MODAL VARIANTS CONFIGURATION
  // =========================================

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // =========================================
  // 🧠 DADOS INTELIGENTES
  // =========================================

  const intelligentData = React.useMemo(() => {
    if (!client) return {};

    const now = new Date();
    const createdDate = new Date(client.createdAt);
    const daysSinceCreated = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
    
    // Engagement score (reutilizando lógica do card)
    const engagementScore = calculateEngagementScore(client);
    
    // Deals stats
    const activeDeals = client.deals?.filter(deal => 
      !['concluido', 'cancelado'].includes(deal.status)
    ) || [];
    
    const totalValue = client.deals?.reduce((sum, deal) => sum + (deal.valor || 0), 0) || 0;
    
    // Next actions
    const nextActions = getNextActions(client);
    
    return {
      daysSinceCreated,
      engagementScore,
      activeDeals: activeDeals.length,
      totalValue,
      nextActions,
      completionScore: calculateCompletionScore(client)
    };
  }, [client]);

  // =========================================
  // 🎨 COMPONENTES INTERNOS
  // =========================================

  const ModalHeader = () => (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        {/* Avatar Inteligente */}
        <div className="relative">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl
            ${getScoreBg(intelligentData.engagementScore)}
          `}>
            {client?.avatar ? (
              <img 
                src={client.avatar} 
                alt={client.dadosPessoais?.nome}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              client?.dadosPessoais?.nome?.charAt(0)?.toUpperCase() || 'C'
            )}
          </div>
          
          {/* Status Badge */}
          <div className={`
            absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white
            ${client?.ativo !== false ? 'bg-green-400' : 'bg-gray-400'}
          `} />
          
          {/* Engagement Ring */}
          <div className="absolute -bottom-1 -right-1">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="2" fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="2" fill="transparent"
                  strokeDasharray={`${intelligentData.engagementScore * 0.628} 62.8`}
                  className={getScoreColor(intelligentData.engagementScore)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-bold ${getScoreColor(intelligentData.engagementScore)}`}>
                  {intelligentData.engagementScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              {client?.dadosPessoais?.nome || 'Cliente'}
            </h2>
            {intelligentData.engagementScore >= 80 && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            {client?.roles?.map((role, index) => (
              <span 
                key={role}
                className={`px-2 py-1 rounded-full text-xs font-medium ${ClientRoleColors[role]}`}
              >
                {ClientRoleLabels[role]}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Cliente há {intelligentData.daysSinceCreated} dias</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{intelligentData.activeDeals} deals ativos</span>
            </div>
            {intelligentData.totalValue > 0 && (
              <div className="flex items-center gap-1">
                <Euro className="w-4 h-4" />
                <span>€{(intelligentData.totalValue / 1000).toFixed(0)}k</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        {mode === 'view' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(client?.dadosPessoais?.telefone, 'telefone')}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              title="Copiar telefone"
            >
              {copied === 'telefone' ? <Check className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(client?.dadosPessoais?.email, 'email')}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Copiar email"
            >
              {copied === 'email' ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            </motion.button>
          </>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );

  const TabNavigation = () => {
    const tabs = [
      { id: 'overview', label: 'Visão Geral', icon: Eye },
      { id: 'details', label: 'Detalhes', icon: User },
      { id: 'deals', label: 'Negócios', icon: Briefcase },
      { id: 'documents', label: 'Documentos', icon: FileText },
      { id: 'communication', label: 'Comunicação', icon: MessageCircle },
      { id: 'actions', label: 'Ações', icon: Zap }
    ];

    return (
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all
                border-b-2 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              
              {/* Badges para alguns tabs */}
              {tab.id === 'deals' && intelligentData.activeDeals > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                  {intelligentData.activeDeals}
                </span>
              )}
              {tab.id === 'documents' && documents?.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                  {documents.length}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="p-6 space-y-6">
      {/* Completion Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Perfil do Cliente</h3>
          <span className="text-2xl font-bold text-blue-600">
            {intelligentData.completionScore}%
          </span>
        </div>
        
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${intelligentData.completionScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{intelligentData.engagementScore}%</div>
            <div className="text-sm text-gray-600">Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{intelligentData.activeDeals}</div>
            <div className="text-sm text-gray-600">Deals Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{documents?.length || 0}</div>
            <div className="text-sm text-gray-600">Documentos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              €{intelligentData.totalValue > 0 ? (intelligentData.totalValue / 1000).toFixed(0) + 'k' : '0'}
            </div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      {intelligentData.nextActions?.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Próximas Ações Sugeridas</h3>
          </div>
          
          <div className="space-y-3">
            {intelligentData.nextActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white rounded-xl"
              >
                <div className={`w-2 h-2 rounded-full ${action.priority === 'high' ? 'bg-red-500' : action.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-gray-900">{action.description}</span>
                {action.priority === 'high' && <Zap className="w-4 h-4 text-red-500" />}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </h3>
          
          <div className="space-y-3">
            {client?.dadosPessoais?.email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{client.dadosPessoais.email}</span>
                <button
                  onClick={() => copyToClipboard(client.dadosPessoais.email, 'email')}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  {copied === 'email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
            
            {client?.dadosPessoais?.telefone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{client.dadosPessoais.telefone}</span>
                <button
                  onClick={() => copyToClipboard(client.dadosPessoais.telefone, 'telefone')}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  {copied === 'telefone' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
            
            {client?.dadosPessoais?.morada && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 text-sm">{client.dadosPessoais.morada}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Status & Relacionamento
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Heart className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">
                {EstadoCivilLabels[client?.dadosPessoais?.estadoCivil] || 'Não informado'}
              </span>
            </div>
            
            {client?.conjuge?.nome && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{client.conjuge.nome}</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-900">
                Cliente há {intelligentData.daysSinceCreated} dia{intelligentData.daysSinceCreated !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================
  // 🎮 UTILITY FUNCTIONS
  // =========================================

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // =========================================
  // ⌨️ KEYBOARD HANDLERS
  // =========================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const tabs = ['overview', 'details', 'deals', 'documents', 'communication', 'actions'];
        const currentIndex = tabs.indexOf(activeTab);
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + tabs.length) % tabs.length
          : (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex]);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, activeTab, onClose]);

  // =========================================
  // 🎨 RENDER PRINCIPAL
  // =========================================

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          ref={modalRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`
            bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] 
            overflow-hidden flex flex-col ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader />
          
          {mode === 'edit' || mode === 'create' ? (
            <div className="flex-1 overflow-y-auto">
              <ClientForm
                initialData={client}
                mode={mode}
                onSuccess={(updatedClient) => {
                  onClientUpdate?.(updatedClient);
                  onClose();
                }}
                onCancel={onClose}
              />
            </div>
          ) : (
            <>
              <TabNavigation />
              
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && <OverviewTab />}
                  {/* Outros tabs seriam implementados aqui */}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
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

function calculateCompletionScore(client) {
  let score = 0;
  let total = 0;
  
  // Dados pessoais essenciais
  const essentialFields = ['nome', 'email', 'telefone', 'morada'];
  essentialFields.forEach(field => {
    total += 20;
    if (client.dadosPessoais?.[field]) score += 20;
  });
  
  // Documentos
  total += 20;
  if (client.documentos?.length > 0) score += 20;
  
  return Math.round((score / total) * 100);
}

function getNextActions(client) {
  const actions = [];
  
  // Aniversário hoje/próximo
  if (client.dadosPessoais?.dataNascimento) {
    const birthday = new Date(client.dadosPessoais.dataNascimento);
    const today = new Date();
    if (birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate()) {
      actions.push({ description: '🎉 Enviar felicitações de aniversário', priority: 'high' });
    }
  }
  
  // Deals urgentes
  const urgentDeals = client.deals?.filter(deal => 
    ['proposta_enviada', 'cpcv_assinado', 'escritura_agendada'].includes(deal.status)
  ) || [];
  
  if (urgentDeals.length > 0) {
    actions.push({ 
      description: `📋 Acompanhar ${urgentDeals.length} negócio${urgentDeals.length > 1 ? 's' : ''} urgente${urgentDeals.length > 1 ? 's' : ''}`,
      priority: 'high' 
    });
  }
  
  // Dados incompletos
  if (!client.dadosPessoais?.telefone) {
    actions.push({ description: '📞 Completar dados de contacto', priority: 'medium' });
  }
  
  if (!client.documentos || client.documentos.length === 0) {
    actions.push({ description: '📄 Solicitar documentos em falta', priority: 'medium' });
  }
  
  // Sem contacto recente
  const lastContact = getLastContactDate(client);
  if (!lastContact || (new Date() - lastContact) > (30 * 24 * 60 * 60 * 1000)) {
    actions.push({ description: '📞 Contactar - sem comunicação há mais de 30 dias', priority: 'low' });
  }
  
  return actions;
}

function getLastContactDate(client) {
  if (!client.historicoComunicacao || client.historicoComunicacao.length === 0) {
    return null;
  }
  
  const dates = client.historicoComunicacao.map(comm => new Date(comm.data));
  return new Date(Math.max(...dates));
}

export default ClientModal;
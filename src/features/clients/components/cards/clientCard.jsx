// =========================================
// 🎨 COMPONENT - ClientCard INTELIGENTE
// =========================================
// Card transformador que torna cada cliente vivo e cativante
// Design que motiva consultores a interagir

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  TrendingUp,
  Heart,
  Star,
  Eye,
  Edit3,
  MessageCircle,
  Gift,
  Zap,
  Target,
  Clock,
  Euro,
  Home,
  Briefcase,
  Users,
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ClientRoleLabels, ClientRoleColors, EstadoCivilLabels } from '../../types/enums';
import { formatPhone, calculateAge } from '@/shared/utils/formatters';

/**
 * ClientCard - O card mais inteligente e cativante do mercado
 * Torna cada cliente numa experiência visual envolvente
 */
const ClientCard = ({ 
  client, 
  onView, 
  onEdit, 
  onContact,
  variant = 'default', // 'default' | 'compact' | 'detailed'
  showActions = true,
  showStats = true,
  interactive = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // =========================================
  // 📊 DADOS INTELIGENTES
  // =========================================

  const intelligentData = useMemo(() => {
    const now = new Date();
    const createdDate = new Date(client.createdAt);
    const idade = client.dadosPessoais?.dataNascimento 
      ? calculateAge(client.dadosPessoais.dataNascimento) 
      : null;

    // Calcular "tempo como cliente"
    const daysSinceCreated = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
    
    // Status de aniversário
    const birthday = client.dadosPessoais?.dataNascimento ? new Date(client.dadosPessoais.dataNascimento) : null;
    const isBirthdayThisMonth = birthday && birthday.getMonth() === now.getMonth();
    const isBirthdayToday = birthday && 
      birthday.getMonth() === now.getMonth() && 
      birthday.getDate() === now.getDate();

    // Urgência baseada em deals
    const activeDeals = client.deals?.filter(deal => 
      !['concluido', 'cancelado'].includes(deal.status)
    ) || [];
    
    const urgentDeals = activeDeals.filter(deal => 
      ['proposta_enviada', 'cpcv_assinado', 'escritura_agendada'].includes(deal.status)
    );

    // Score de engagement
    const engagementScore = calculateEngagementScore(client);
    
    // Valor total de negócios
    const totalValue = client.deals?.reduce((sum, deal) => sum + (deal.valor || 0), 0) || 0;

    return {
      idade,
      daysSinceCreated,
      isBirthdayThisMonth,
      isBirthdayToday,
      activeDeals: activeDeals.length,
      urgentDeals: urgentDeals.length,
      engagementScore,
      totalValue,
      lastContact: getLastContactDate(client),
      nextAction: getNextSuggestedAction(client)
    };
  }, [client]);

  // =========================================
  // 🎨 VISUAL DYNAMICS
  // =========================================

  const cardVariants = {
    default: {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    },
    hovered: {
      scale: 1.02,
      y: -4,
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)"
    }
  };

  const roleColors = client.roles?.map(role => ClientRoleColors[role]) || [];
  const primaryRole = client.roles?.[0];
  const primaryRoleColor = ClientRoleColors[primaryRole] || 'bg-gray-100 text-gray-800';

  // Score visual
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
  // 🎯 COMPONENTES INTERNOS
  // =========================================

  const QuickStats = () => (
    <div className="grid grid-cols-3 gap-2 mt-3">
      <div className="text-center p-2 bg-gray-50 rounded-lg">
        <div className="text-lg font-bold text-gray-900">{intelligentData.activeDeals}</div>
        <div className="text-xs text-gray-500">Deals Ativos</div>
      </div>
      <div className="text-center p-2 bg-gray-50 rounded-lg">
        <div className="text-lg font-bold text-emerald-600">
          {intelligentData.totalValue > 0 ? `€${(intelligentData.totalValue / 1000).toFixed(0)}k` : '€0'}
        </div>
        <div className="text-xs text-gray-500">Valor Total</div>
      </div>
      <div className="text-center p-2 bg-gray-50 rounded-lg">
        <div className={`text-lg font-bold ${getScoreColor(intelligentData.engagementScore)}`}>
          {intelligentData.engagementScore}%
        </div>
        <div className="text-xs text-gray-500">Engagement</div>
      </div>
    </div>
  );

  const UrgencyIndicators = () => (
    <div className="flex gap-2 mt-2">
      {intelligentData.isBirthdayToday && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
        >
          <Gift className="w-3 h-3" />
          Aniversário Hoje!
        </motion.div>
      )}
      
      {intelligentData.isBirthdayThisMonth && !intelligentData.isBirthdayToday && (
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          <Calendar className="w-3 h-3" />
          Aniversário Este Mês
        </div>
      )}
      
      {intelligentData.urgentDeals > 0 && (
        <motion.div
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
        >
          <Zap className="w-3 h-3" />
          {intelligentData.urgentDeals} Urgente{intelligentData.urgentDeals > 1 ? 's' : ''}
        </motion.div>
      )}
      
      {intelligentData.daysSinceCreated <= 7 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          Novo Cliente
        </div>
      )}
    </div>
  );

  const NextAction = () => {
    if (!intelligentData.nextAction) return null;
    
    return (
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Próxima Ação:</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">{intelligentData.nextAction}</p>
      </div>
    );
  };

  const QuickActions = () => (
    <AnimatePresence>
      {showQuickActions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-4 right-4 flex gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onContact?.(client)}
            className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
            title="Contactar"
          >
            <MessageCircle className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit?.(client)}
            className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView?.(client)}
            className="p-2 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors"
            title="Ver Detalhes"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // =========================================
  // 🎨 RENDER PRINCIPAL
  // =========================================

  return (
    <motion.div
      variants={cardVariants}
      initial="default"
      animate={isHovered ? "hovered" : "default"}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowQuickActions(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickActions(false);
      }}
      className={`
        relative bg-white rounded-2xl border border-gray-200 overflow-hidden
        cursor-pointer group transition-all duration-200
        ${interactive ? 'hover:border-blue-300' : ''}
        ${className}
      `}
      onClick={() => interactive && onView?.(client)}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="20" fill="currentColor" />
          <circle cx="80" cy="20" r="15" fill="currentColor" />
          <circle cx="20" cy="80" r="10" fill="currentColor" />
        </svg>
      </div>

      {/* Header com Engagement Score */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar Inteligente */}
            <div className="relative">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg
                ${getScoreBg(intelligentData.engagementScore)}
              `}>
                {client.avatar ? (
                  <img 
                    src={client.avatar} 
                    alt={client.dadosPessoais?.nome}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  client.dadosPessoais?.nome?.charAt(0)?.toUpperCase() || 'C'
                )}
              </div>
              
              {/* Score Ring */}
              <div className="absolute -top-1 -right-1">
                <div className="relative w-6 h-6">
                  <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
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
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {client.dadosPessoais?.nome || 'Nome não informado'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${primaryRoleColor}
                `}>
                  {ClientRoleLabels[primaryRole] || 'Cliente'}
                </span>
                {client.roles?.length > 1 && (
                  <span className="text-xs text-gray-500">
                    +{client.roles.length - 1} role{client.roles.length > 2 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center gap-2">
            <div className={`
              w-3 h-3 rounded-full
              ${client.ativo !== false ? 'bg-green-400' : 'bg-gray-400'}
            `} />
            {intelligentData.engagementScore >= 80 && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
        </div>
      </div>

      {/* Informações de Contacto */}
      <div className="px-6 space-y-2">
        {client.dadosPessoais?.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{client.dadosPessoais.email}</span>
          </div>
        )}
        
        {client.dadosPessoais?.telefone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{formatPhone(client.dadosPessoais.telefone)}</span>
          </div>
        )}
        
        {client.dadosPessoais?.morada && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{client.dadosPessoais.morada}</span>
          </div>
        )}
      </div>

      {/* Indicadores de Urgência */}
      <div className="px-6">
        <UrgencyIndicators />
      </div>

      {/* Stats Rápidas */}
      {showStats && (
        <div className="px-6">
          <QuickStats />
        </div>
      )}

      {/* Próxima Ação Sugerida */}
      <div className="px-6">
        <NextAction />
      </div>

      {/* Footer com Tempo */}
      <div className="px-6 py-4 bg-gray-50 mt-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {intelligentData.daysSinceCreated === 0 
                ? 'Hoje' 
                : `${intelligentData.daysSinceCreated} dia${intelligentData.daysSinceCreated > 1 ? 's' : ''}`
              }
            </span>
          </div>
          
          {interactive && (
            <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ver mais</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Overlay */}
      {interactive && showActions && <QuickActions />}
    </motion.div>
  );
};

// =========================================
// 🧠 FUNÇÕES INTELIGENTES
// =========================================

/**
 * Calcular score de engagement baseado em atividade
 */
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

/**
 * Obter data do último contacto
 */
function getLastContactDate(client) {
  if (!client.historicoComunicacao || client.historicoComunicacao.length === 0) {
    return null;
  }
  
  const dates = client.historicoComunicacao.map(comm => new Date(comm.data));
  return new Date(Math.max(...dates));
}

/**
 * Sugerir próxima ação baseada no estado do cliente
 */
function getNextSuggestedAction(client) {
  // Aniversário hoje
  if (client.dadosPessoais?.dataNascimento) {
    const birthday = new Date(client.dadosPessoais.dataNascimento);
    const today = new Date();
    if (birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate()) {
      return "🎉 Enviar felicitações de aniversário";
    }
  }
  
  // Deals urgentes
  const urgentDeals = client.deals?.filter(deal => 
    ['proposta_enviada', 'cpcv_assinado', 'escritura_agendada'].includes(deal.status)
  ) || [];
  
  if (urgentDeals.length > 0) {
    return `📋 Acompanhar ${urgentDeals.length} negócio${urgentDeals.length > 1 ? 's' : ''} urgente${urgentDeals.length > 1 ? 's' : ''}`;
  }
  
  // Sem contacto recente
  const lastContact = getLastContactDate(client);
  if (!lastContact || (new Date() - lastContact) > (30 * 24 * 60 * 60 * 1000)) {
    return "📞 Contactar - sem comunicação há mais de 30 dias";
  }
  
  // Dados incompletos
  if (!client.dadosPessoais?.telefone) {
    return "📋 Completar dados de contacto";
  }
  
  if (!client.documentos || client.documentos.length === 0) {
    return "📄 Solicitar documentos em falta";
  }
  
  // Default
  return "✨ Agendar próximo contacto";
}

export default ClientCard;
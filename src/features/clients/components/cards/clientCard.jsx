// =========================================
// 🎨 COMPONENT - ClientCard COMPLETO
// =========================================
// Card inteligente para exibição de clientes
// Interface cativante com insights em tempo real

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  Briefcase,
  Euro,
  FileText,
  Star,
  Eye,
  Edit3,
  MoreHorizontal,
  MessageCircle,
  Gift,
  AlertCircle,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
  Home
} from 'lucide-react';

// Utils e enums
import {
  calculateEngagementScore,
  getEngagementColor,
  getEngagementLabel,
  formatCurrency,
  getTotalDealsValue,
  getNextRecommendedAction,
  isBirthdayToday,
  isBirthdayThisMonth,
  hasUrgentActions,
  getNameInitials,
  formatPhone,
  formatRelativeDate,
  getLastContactDate,
  getRoleColor
} from '../../utils/clientUtils';

import { ClientRoleLabels } from '../../types/enums';

/**
 * ClientCard - Card revolucionário para clientes
 * Interface inteligente que transforma dados em insights
 */
const ClientCard = ({ 
  client,
  variant = 'default', // 'default' | 'compact' | 'detailed'
  onView,
  onEdit,
  onContact,
  onCall,
  onEmail,
  onClick,
  className = '',
  showActions = true,
  showMetrics = true,
  ...props
}) => {

  // =========================================
  // 🎣 STATE & REFS
  // =========================================

  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // =========================================
  // 🧠 DADOS INTELIGENTES
  // =========================================

  const intelligentData = useMemo(() => {
    if (!client) return {};

    const engagementScore = calculateEngagementScore(client);
    const totalValue = getTotalDealsValue(client);
    const lastContact = getLastContactDate(client);
    const nextAction = getNextRecommendedAction(client);
    
    return {
      engagementScore,
      engagementColor: getEngagementColor(engagementScore),
      engagementLabel: getEngagementLabel(engagementScore),
      totalValue,
      formattedValue: formatCurrency(totalValue),
      lastContact,
      lastContactFormatted: formatRelativeDate(lastContact),
      nextAction,
      isBirthday: isBirthdayToday(client),
      isBirthdayMonth: isBirthdayThisMonth(client),
      hasUrgent: hasUrgentActions(client),
      initials: getNameInitials(client?.dadosPessoais?.nome),
      activeDeals: client?.deals?.filter(deal => 
        ['ativo', 'proposta_enviada', 'negociacao'].includes(deal.status)
      )?.length || 0,
      completedDeals: client?.deals?.filter(deal => 
        deal.status === 'concluido'
      )?.length || 0
    };
  }, [client]);

  // =========================================
  // 🎯 EVENT HANDLERS
  // =========================================

  const handleClick = () => {
    if (onClick) onClick(client);
    else if (onView) onView(client);
  };

  const handleActionClick = (action, event) => {
    event?.stopPropagation();
    
    switch (action) {
      case 'view':
        onView?.(client);
        break;
      case 'edit':
        onEdit?.(client);
        break;
      case 'contact':
        onContact?.(client);
        break;
      case 'call':
        onCall?.(client);
        break;
      case 'email':
        onEmail?.(client);
        break;
    }
  };

  // =========================================
  // 🎨 RENDER VARIANTS
  // =========================================

  if (variant === 'compact') {
    return (
      <CompactCard 
        client={client}
        intelligentData={intelligentData}
        onActionClick={handleActionClick}
        onClick={handleClick}
        className={className}
        {...props}
      />
    );
  }

  if (variant === 'detailed') {
    return (
      <DetailedCard 
        client={client}
        intelligentData={intelligentData}
        onActionClick={handleActionClick}
        onClick={handleClick}
        showActions={showActions}
        showMetrics={showMetrics}
        className={className}
        {...props}
      />
    );
  }

  // =========================================
  // 🎨 DEFAULT CARD
  // =========================================

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative bg-white rounded-2xl border border-gray-200 p-6
        cursor-pointer transition-all duration-200 overflow-hidden
        hover:border-blue-300 group
        ${className}
      `}
      {...props}
    >
      {/* Badges superiores */}
      <div className="absolute top-4 right-4 flex gap-2">
        {intelligentData.isBirthday && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center"
          >
            🎂
          </motion.div>
        )}
        
        {intelligentData.hasUrgent && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
          >
            <AlertCircle className="w-4 h-4 text-red-600" />
          </motion.div>
        )}
      </div>

      {/* Header com avatar e info básica */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {client?.avatar ? (
              <img 
                src={client.avatar} 
                alt={client?.dadosPessoais?.nome}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              intelligentData.initials
            )}
          </div>
          
          {/* Status indicator */}
          <div className={`
            absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white
            ${client?.ativo !== false ? 'bg-green-400' : 'bg-gray-400'}
          `} />
        </div>

        {/* Info básica */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg truncate">
            {client?.dadosPessoais?.nome || 'Nome não definido'}
          </h3>
          
          <div className="flex items-center gap-2 mt-1">
            {client?.dadosPessoais?.email && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Mail className="w-3 h-3" />
                <span className="truncate">{client.dadosPessoais.email}</span>
              </div>
            )}
          </div>
          
          {client?.dadosPessoais?.telefone && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Phone className="w-3 h-3" />
              <span>{formatPhone(client.dadosPessoais.telefone)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Roles */}
      {client?.roles?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {client.roles.slice(0, 3).map((role, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
            >
              {ClientRoleLabels[role] || role}
            </span>
          ))}
          {client.roles.length > 3 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{client.roles.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Métricas */}
      {showMetrics && (
        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-gray-100">
          {/* Engagement Score */}
          <div className="text-center">
            <div className={`
              inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold
              ${intelligentData.engagementColor}
            `}>
              {intelligentData.engagementScore}
            </div>
            <p className="text-xs text-gray-500 mt-1">Engagement</p>
          </div>

          {/* Deals Value */}
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">
              {intelligentData.formattedValue}
            </div>
            <p className="text-xs text-gray-500">Valor Total</p>
          </div>

          {/* Active Deals */}
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">
              {intelligentData.activeDeals}
            </div>
            <p className="text-xs text-gray-500">Negócios</p>
          </div>
        </div>
      )}

      {/* Próxima ação */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-700 flex-1">
            {intelligentData.nextAction}
          </span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Último contacto: {intelligentData.lastContactFormatted}</span>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleActionClick('call', e)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Telefonar"
            >
              <Phone className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleActionClick('email', e)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Enviar email"
            >
              <Mail className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleActionClick('edit', e)}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleActionClick('view', e)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Ver detalhes"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// =========================================
// 🎨 COMPACT VARIANT
// =========================================

const CompactCard = ({ 
  client, 
  intelligentData, 
  onActionClick, 
  onClick, 
  className 
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={`
      bg-white rounded-xl border border-gray-200 p-4
      cursor-pointer transition-all duration-200
      hover:border-blue-300 hover:shadow-md
      ${className}
    `}
  >
    <div className="flex items-center gap-3">
      {/* Avatar compacto */}
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
        {intelligentData.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">
          {client?.dadosPessoais?.nome}
        </h4>
        <p className="text-sm text-gray-500 truncate">
          {client?.dadosPessoais?.email}
        </p>
      </div>

      {/* Score */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
        ${intelligentData.engagementColor}
      `}>
        {intelligentData.engagementScore}
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => onActionClick('call', e)}
          className="p-1 text-gray-400 hover:text-green-600 rounded"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => onActionClick('edit', e)}
          className="p-1 text-gray-400 hover:text-purple-600 rounded"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

// =========================================
// 🎨 DETAILED VARIANT
// =========================================

const DetailedCard = ({ 
  client, 
  intelligentData, 
  onActionClick, 
  onClick,
  showActions,
  showMetrics,
  className 
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ 
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    }}
    onClick={onClick}
    className={`
      bg-white rounded-3xl border border-gray-200 p-8
      cursor-pointer transition-all duration-300 overflow-hidden
      hover:border-blue-300 group shadow-lg
      ${className}
    `}
  >
    {/* Header expandido */}
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start gap-4">
        {/* Avatar grande */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-xl shadow-xl">
            {intelligentData.initials}
          </div>
          
          {/* Badges do avatar */}
          <div className="absolute -top-2 -right-2 flex flex-col gap-1">
            {intelligentData.isBirthday && (
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs">
                🎂
              </div>
            )}
            {intelligentData.hasUrgent && (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Info detalhada */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {client?.dadosPessoais?.nome}
          </h2>
          
          <div className="space-y-2">
            {client?.dadosPessoais?.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{client.dadosPessoais.email}</span>
              </div>
            )}
            
            {client?.dadosPessoais?.telefone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{formatPhone(client.dadosPessoais.telefone)}</span>
              </div>
            )}
            
            {client?.dadosPessoais?.morada && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{client.dadosPessoais.morada}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Score grande */}
      <div className="text-center">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold
          ${intelligentData.engagementColor} shadow-lg
        `}>
          {intelligentData.engagementScore}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {intelligentData.engagementLabel}
        </p>
      </div>
    </div>

    {/* Roles expandidos */}
    {client?.roles?.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-6">
        {client.roles.map((role, index) => (
          <span
            key={index}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${getRoleColor(role)}`}
          >
            {ClientRoleLabels[role] || role}
          </span>
        ))}
      </div>
    )}

    {/* Métricas detalhadas */}
    {showMetrics && (
      <div className="grid grid-cols-4 gap-6 mb-6 py-6 border-t border-b border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {intelligentData.formattedValue}
          </div>
          <p className="text-sm text-gray-500">Valor Total</p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {intelligentData.activeDeals}
          </div>
          <p className="text-sm text-gray-500">Negócios Ativos</p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {intelligentData.completedDeals}
          </div>
          <p className="text-sm text-gray-500">Concluídos</p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {client?.documentos?.length || 0}
          </div>
          <p className="text-sm text-gray-500">Documentos</p>
        </div>
      </div>
    )}

    {/* Próxima ação expandida */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Próxima ação:</p>
          <p className="text-gray-600">{intelligentData.nextAction}</p>
        </div>
      </div>
    </div>

    {/* Actions expandidas */}
    {showActions && (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Último contacto: {intelligentData.lastContactFormatted}</span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onActionClick('call', e)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Ligar</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onActionClick('email', e)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onActionClick('edit', e)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar</span>
          </motion.button>
        </div>
      </div>
    )}
  </motion.div>
);

export default React.memo(ClientCard);
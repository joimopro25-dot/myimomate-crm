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
      lastContact,
      nextAction,
      initials: getNameInitials(client?.dadosPessoais?.nome),
      isBirthday: isBirthdayToday(client),
      isBirthdayMonth: isBirthdayThisMonth(client),
      hasUrgent: hasUrgentActions(client),
      roleColor: getRoleColor(client?.papel)
    };
  }, [client]);

  // =========================================
  // 🎯 HANDLERS
  // =========================================

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onClick?.(client);
  }, [onClick, client]);

  const handleActionClick = useCallback((action, e) => {
    e.stopPropagation();
    
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
  }, [onView, onEdit, onContact, onCall, onEmail, client]);

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
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              intelligentData.initials
            )}
          </div>
          
          {/* Status indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <div className={`w-4 h-4 rounded-full ${intelligentData.engagementColor}`} />
          </div>
        </div>

        {/* Info básica */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
            {client?.dadosPessoais?.nome || 'Nome não disponível'}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${intelligentData.roleColor}
            `}>
              {ClientRoleLabels[client?.papel] || 'Cliente'}
            </span>
            
            {client?.dadosPessoais?.empresa && (
              <span className="text-sm text-gray-500 truncate">
                {client.dadosPessoais.empresa}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {client?.dadosPessoais?.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{client.dadosPessoais.email}</span>
              </div>
            )}
            
            {client?.dadosPessoais?.telefone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{formatPhone(client.dadosPessoais.telefone)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métricas centrais */}
      {showMetrics && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Engagement Score */}
          <div className="text-center">
            <div className={`
              w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-white font-bold mb-2
              ${intelligentData.engagementColor}
            `}>
              {intelligentData.engagementScore}
            </div>
            <p className="text-xs text-gray-500">Engagement</p>
          </div>

          {/* Valor total */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 mb-1">
              {formatCurrency(intelligentData.totalValue)}
            </div>
            <p className="text-xs text-gray-500">Valor Total</p>
          </div>

          {/* Último contacto */}
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-700 mb-1">
              {intelligentData.lastContact ? formatRelativeDate(intelligentData.lastContact) : 'Nunca'}
            </div>
            <p className="text-xs text-gray-500">Último contacto</p>
          </div>
        </div>
      )}

      {/* Próxima ação recomendada */}
      {intelligentData.nextAction && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Próxima ação
            </span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            {intelligentData.nextAction}
          </p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {intelligentData.engagementLabel}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleActionClick('call', e)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Ligar"
            >
              <Phone className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleActionClick('email', e)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Email"
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
    whileHover={{ scale: 1.01 }}
    onClick={onClick}
    className={`
      bg-white rounded-2xl border border-gray-200 p-8
      cursor-pointer transition-all duration-200
      hover:border-blue-300 hover:shadow-xl
      ${className}
    `}
  >
    {/* Header expandido */}
    <div className="flex items-start gap-6 mb-6">
      {/* Avatar grande */}
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
        {intelligentData.initials}
      </div>

      {/* Info detalhada */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {client?.dadosPessoais?.nome}
        </h2>
        
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${intelligentData.roleColor}`}>
            {ClientRoleLabels[client?.papel] || 'Cliente'}
          </span>
          {client?.dadosPessoais?.empresa && (
            <span className="text-gray-600">{client.dadosPessoais.empresa}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {client?.dadosPessoais?.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span>{client.dadosPessoais.email}</span>
            </div>
          )}
          
          {client?.dadosPessoais?.telefone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-5 h-5" />
              <span>{formatPhone(client.dadosPessoais.telefone)}</span>
            </div>
          )}
          
          {client?.dadosPessoais?.endereco && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="truncate">{client.dadosPessoais.endereco}</span>
            </div>
          )}
          
          {client?.dadosPessoais?.aniversario && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{new Date(client.dadosPessoais.aniversario).toLocaleDateString('pt-PT')}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Métricas expandidas */}
    {showMetrics && (
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-2 ${intelligentData.engagementColor}`}>
            {intelligentData.engagementScore}
          </div>
          <p className="font-medium text-gray-900">Engagement</p>
          <p className="text-sm text-gray-500">{intelligentData.engagementLabel}</p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatCurrency(intelligentData.totalValue)}
          </div>
          <p className="font-medium text-gray-900">Valor Total</p>
          <p className="text-sm text-gray-500">Negócios ativos</p>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 mb-2">
            {intelligentData.lastContact ? formatRelativeDate(intelligentData.lastContact) : 'Nunca'}
          </div>
          <p className="font-medium text-gray-900">Último Contacto</p>
          <p className="text-sm text-gray-500">Comunicação recente</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {intelligentData.isBirthday && <Gift className="w-6 h-6 text-pink-500" />}
            {intelligentData.hasUrgent && <AlertCircle className="w-6 h-6 text-red-500" />}
            {!intelligentData.isBirthday && !intelligentData.hasUrgent && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>
          <p className="font-medium text-gray-900">Status</p>
          <p className="text-sm text-gray-500">
            {intelligentData.isBirthday ? 'Aniversário hoje!' : 
             intelligentData.hasUrgent ? 'Ações urgentes' : 'Tudo OK'}
          </p>
        </div>
      </div>
    )}

    {/* Próxima ação */}
    {intelligentData.nextAction && (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Próxima ação recomendada</span>
        </div>
        <p className="text-blue-800">{intelligentData.nextAction}</p>
      </div>
    )}

    {/* Actions expandidas */}
    {showActions && (
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Última atualização:</span>
          <span className="text-sm font-medium text-gray-700">
            {formatRelativeDate(client?.updatedAt || new Date())}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onActionClick('call', e)}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Ligar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onActionClick('email', e)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onActionClick('edit', e)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Editar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => onActionClick('view', e)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Detalhes
          </motion.button>
        </div>
      </div>
    )}
  </motion.div>
);

export default ClientCard;
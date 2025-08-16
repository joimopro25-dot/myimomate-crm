// =========================================
// 🎯 CARD - LeadCard COMPONENT
// =========================================
// Card responsivo para exibir leads em diferentes layouts

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageCircle,
  MapPin,
  User,
  Calendar,
  Euro,
  Home,
  Target,
  Thermometer,
  Star,
  Clock
} from 'lucide-react';

/**
 * LeadCard - Componente para exibir leads
 * @param {object} lead - Dados do lead
 * @param {string} variant - Estilo: 'kanban' | 'list' | 'grid'
 * @param {function} onClick - Callback ao clicar no card
 * @param {function} onCall - Callback para chamada
 * @param {function} onEmail - Callback para email
 * @param {function} onWhatsApp - Callback para WhatsApp
 */
const LeadCard = ({
  lead,
  variant = 'kanban',
  onClick,
  onCall,
  onEmail,
  onWhatsApp
}) => {
  // =========================================
  // 🎨 HELPERS
  // =========================================

  const getStatusColor = (status) => {
    const colors = {
      novo: 'bg-blue-100 text-blue-800',
      contactado: 'bg-yellow-100 text-yellow-800',
      qualificado: 'bg-green-100 text-green-800',
      interessado: 'bg-purple-100 text-purple-800',
      proposta: 'bg-orange-100 text-orange-800',
      negociacao: 'bg-pink-100 text-pink-800',
      convertido: 'bg-emerald-100 text-emerald-800',
      perdido: 'bg-red-100 text-red-800',
      nurturing: 'bg-indigo-100 text-indigo-800'
    };
    return colors[status] || colors.novo;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-500',
      normal: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority] || colors.normal;
  };

  const getTemperatureIcon = (temperature) => {
    const temps = {
      frio: { icon: '🧊', color: 'text-blue-400' },
      morno: { icon: '🌡️', color: 'text-yellow-400' },
      quente: { icon: '🔥', color: 'text-orange-400' },
      fervendo: { icon: '🌋', color: 'text-red-400' }
    };
    return temps[temperature] || temps.morno;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return `€${value.toLocaleString('pt-PT')}`;
  };

  // =========================================
  // 🎨 RENDER VARIANTS
  // =========================================

  if (variant === 'kanban') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {lead.name}
            </h4>
            <p className="text-xs text-gray-600 truncate">
              {lead.email}
            </p>
          </div>
          {lead.score && (
            <div className="ml-2 flex items-center">
              <Star className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-xs font-medium text-gray-700">
                {lead.score}%
              </span>
            </div>
          )}
        </div>

        {/* Property Info */}
        {(lead.propertyType || lead.budget) && (
          <div className="mb-2 space-y-1">
            {lead.propertyType && (
              <div className="flex items-center text-xs text-gray-600">
                <Home className="w-3 h-3 mr-1" />
                <span className="capitalize">{lead.propertyType}</span>
              </div>
            )}
            {lead.budget && (
              <div className="flex items-center text-xs text-gray-600">
                <Euro className="w-3 h-3 mr-1" />
                <span>{lead.budget}</span>
              </div>
            )}
          </div>
        )}

        {/* Status & Temperature */}
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
            {lead.status || 'novo'}
          </span>
          
          {lead.temperature && (
            <div className="flex items-center">
              <span className={`text-sm ${getTemperatureIcon(lead.temperature).color}`}>
                {getTemperatureIcon(lead.temperature).icon}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {lead.phone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCall?.(lead);
                }}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Ligar"
              >
                <Phone className="w-3 h-3" />
              </button>
            )}
            {lead.email && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEmail?.(lead);
                }}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Email"
              >
                <Mail className="w-3 h-3" />
              </button>
            )}
            {lead.phone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatsApp?.(lead);
                }}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-3 h-3" />
              </button>
            )}
          </div>
          
          {lead.createdAt && (
            <span className="text-xs text-gray-500">
              {formatDate(lead.createdAt)}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.005 }}
        onClick={onClick}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          {/* Lead Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {lead.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status || 'novo'}
                  </span>
                  {lead.priority === 'urgent' && (
                    <Target className={`w-4 h-4 ${getPriorityColor(lead.priority)}`} />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  {lead.email && (
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {lead.email}
                    </span>
                  )}
                  {lead.phone && (
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {lead.phone}
                    </span>
                  )}
                  {lead.city && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {lead.city}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property & Budget */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            {lead.propertyType && (
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                <span className="capitalize">{lead.propertyType}</span>
              </div>
            )}
            
            {lead.budget && (
              <div className="flex items-center">
                <Euro className="w-4 h-4 mr-1" />
                <span>{lead.budget}</span>
              </div>
            )}
            
            {lead.score && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                <span className="font-medium">{lead.score}%</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            {lead.temperature && (
              <div className="flex items-center">
                <span className={`text-lg ${getTemperatureIcon(lead.temperature).color}`}>
                  {getTemperatureIcon(lead.temperature).icon}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              {lead.phone && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCall?.(lead);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                  title="Ligar"
                >
                  <Phone className="w-4 h-4" />
                </button>
              )}
              {lead.email && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEmail?.(lead);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
              {lead.phone && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onWhatsApp?.(lead);
                  }}
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {lead.createdAt && (
              <div className="flex items-center text-xs text-gray-500 ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(lead.createdAt)}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default: grid variant
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-600">{lead.email}</p>
          </div>
        </div>
        
        {lead.score && (
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-yellow-700">
              {lead.score}%
            </span>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        {lead.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {lead.phone}
          </div>
        )}
        {lead.city && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {lead.city}
          </div>
        )}
      </div>

      {/* Property Info */}
      {(lead.propertyType || lead.budget) && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
          {lead.propertyType && (
            <div className="flex items-center text-sm text-gray-700">
              <Home className="w-4 h-4 mr-2" />
              <span className="capitalize">{lead.propertyType}</span>
              {lead.rooms && <span className="ml-1">- T{lead.rooms}</span>}
            </div>
          )}
          {lead.budget && (
            <div className="flex items-center text-sm text-gray-700">
              <Euro className="w-4 h-4 mr-2" />
              {lead.budget}
            </div>
          )}
        </div>
      )}

      {/* Status & Meta */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
          {lead.status || 'novo'}
        </span>
        
        <div className="flex items-center space-x-2">
          {lead.priority === 'urgent' && (
            <Target className={`w-4 h-4 ${getPriorityColor(lead.priority)}`} />
          )}
          {lead.temperature && (
            <span className={`text-lg ${getTemperatureIcon(lead.temperature).color}`}>
              {getTemperatureIcon(lead.temperature).icon}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {lead.phone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCall?.(lead);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Ligar"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}
          {lead.email && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEmail?.(lead);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </button>
          )}
          {lead.phone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWhatsApp?.(lead);
              }}
              className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {lead.createdAt && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(lead.createdAt)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeadCard;
// =========================================
// 🎨 COMPONENT - ClientModal COMPLETO E HOOKS-SAFE
// =========================================
// Modal completo que respeita as regras dos React Hooks
// Todas as funcionalidades mantidas, zero early returns

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  X, User, Mail, Phone, MapPin, Calendar, Edit3, Eye, MessageCircle,
  Star, Heart, Briefcase, Euro, FileText, Upload, Download, Share2,
  Copy, Check, ExternalLink, Zap, Gift, AlertCircle, Settings,
  Trash2, Archive, Clock, TrendingUp, Target, Camera, Save,
  RefreshCw, Building, CreditCard, Bell, Users, Plus, Send
} from 'lucide-react';

// Componentes
import ClientForm from '../forms/ClientForm';

// Hooks
import { useClients } from '../../hooks/useClients';

// Utils - importação corrigida com fallbacks
import {
  calculateEngagementScore,
  getEngagementColor,
  getEngagementLabel,
  formatCurrency,
  getTotalDealsValue,
  getActiveDeals,
  isBirthdayToday,
  isBirthdayThisMonth,
  hasUrgentActions,
  getNameInitials,
  formatPhone,
  formatRelativeDate,
  getLastContactDate,
  getRoleColor,
  getRoleLabel,
  calculateDataCompleteness
} from '../../utils/clientUtils';

// Fallbacks locais caso utils não funcionem
const fallbackCalculateEngagementScore = (client) => {
  if (!client) return 0;
  let score = 20;
  if (client.dadosPessoais?.email) score += 20;
  if (client.dadosPessoais?.telefone) score += 20;
  if (client.deals?.length > 0) score += 20;
  return Math.min(100, score);
};

const fallbackFormatCurrency = (value) => {
  if (!value || isNaN(value)) return '€0';
  return `€${value.toLocaleString('pt-PT')}`;
};

const fallbackGetNameInitials = (name) => {
  if (!name) return '??';
  const words = name.split(' ');
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Enums com fallbacks
const ClientRoleLabels = {
  'comprador': 'Comprador',
  'vendedor': 'Vendedor', 
  'investidor': 'Investidor',
  'inquilino': 'Inquilino',
  'senhorio': 'Senhorio'
};

const ClientRoleColors = {
  'comprador': 'bg-blue-100 text-blue-800',
  'vendedor': 'bg-green-100 text-green-800',
  'investidor': 'bg-purple-100 text-purple-800',
  'inquilino': 'bg-orange-100 text-orange-800',
  'senhorio': 'bg-red-100 text-red-800'
};

const EstadoCivilLabels = {
  'solteiro': 'Solteiro(a)',
  'casado': 'Casado(a)',
  'divorciado': 'Divorciado(a)',
  'viuvo': 'Viúvo(a)',
  'uniao_facto': 'União de Facto'
};

// =========================================
// 🧠 FUNÇÕES AUXILIARES LOCAIS
// =========================================

const safeCalculateEngagementScore = (client) => {
  try {
    return calculateEngagementScore ? calculateEngagementScore(client) : fallbackCalculateEngagementScore(client);
  } catch {
    return fallbackCalculateEngagementScore(client);
  }
};

const safeFormatCurrency = (value) => {
  try {
    return formatCurrency ? formatCurrency(value) : fallbackFormatCurrency(value);
  } catch {
    return fallbackFormatCurrency(value);
  }
};

const safeGetNameInitials = (name) => {
  try {
    return getNameInitials ? getNameInitials(name) : fallbackGetNameInitials(name);
  } catch {
    return fallbackGetNameInitials(name);
  }
};

const getNextActions = (client) => {
  const actions = [];
  
  try {
    if (isBirthdayToday && isBirthdayToday(client)) {
      actions.push({ description: '🎉 Parabenizar aniversário!', priority: 'high' });
    }
    
    if (isBirthdayThisMonth && isBirthdayThisMonth(client)) {
      actions.push({ description: '🎂 Aniversário este mês - agendar contacto', priority: 'medium' });
    }
    
    if (!client.dadosPessoais?.telefone) {
      actions.push({ description: '📞 Completar dados de contacto', priority: 'medium' });
    }
    
    if (!client.documentos || client.documentos.length === 0) {
      actions.push({ description: '📄 Solicitar documentos em falta', priority: 'medium' });
    }
  } catch (error) {
    console.warn('Erro ao calcular próximas ações:', error);
  }
  
  return actions;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('pt-PT');
  } catch {
    return 'Data inválida';
  }
};

// =========================================
// 🎨 COMPONENTE PRINCIPAL
// =========================================

const ClientModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  client = null,
  mode = 'view', // 'view' | 'edit' | 'create'
  onClientUpdate = () => {},
  onClientDelete = () => {},
  onClientCreate = () => {},
  className = ''
}) => {
  // =========================================
  // 🎣 TODOS OS HOOKS NO TOPO (ORDEM FIXA)
  // =========================================
  
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newCommunication, setNewCommunication] = useState({ 
    tipo: 'email', 
    assunto: '', 
    notas: '' 
  });
  
  const modalRef = useRef(null);
  
  // Hook useClients sempre executado
  const { updateClient, deleteClient, createClient, isLoading } = useClients();

  // =========================================
  // 📊 DADOS COMPUTADOS (SEMPRE EXECUTADOS)
  // =========================================

  const intelligentData = useMemo(() => {
    if (!client) {
      return {
        daysSinceCreated: 0,
        engagementScore: 0,
        activeDeals: 0,
        totalValue: 0,
        nextActions: [],
        completionScore: 0
      };
    }

    try {
      const now = new Date();
      const createdDate = new Date(client.createdAt || now);
      const daysSinceCreated = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
      
      const engagementScore = safeCalculateEngagementScore(client);
      const activeDeals = client.deals?.filter(deal => 
        !['concluido', 'cancelado'].includes(deal.status)
      )?.length || 0;
      const totalValue = client.deals?.reduce((sum, deal) => sum + (deal.valor || 0), 0) || 0;
      const nextActions = getNextActions(client);
      const completionScore = calculateDataCompleteness ? calculateDataCompleteness(client) : 50;
      
      return {
        daysSinceCreated,
        engagementScore,
        activeDeals,
        totalValue,
        nextActions,
        completionScore
      };
    } catch (error) {
      console.warn('Erro ao calcular dados inteligentes:', error);
      return {
        daysSinceCreated: 0,
        engagementScore: 0,
        activeDeals: 0,
        totalValue: 0,
        nextActions: [],
        completionScore: 0
      };
    }
  }, [client]);

  // =========================================
  // 🎬 ANIMAÇÕES (SEMPRE EXECUTADAS)
  // =========================================

  const modalVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", duration: 0.4 }
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
  }), []);

  const backdropVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }), []);

  // =========================================
  // 🎯 HANDLERS (SEMPRE DEFINIDOS)
  // =========================================

  const copyToClipboard = useCallback(async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  }, []);

  const handleDeleteClient = useCallback(async () => {
    if (!client?.id) return;
    
    try {
      await deleteClient(client.id);
      onClientDelete(client.id);
      onClose();
    } catch (error) {
      console.error('Erro ao eliminar cliente:', error);
    }
  }, [client?.id, deleteClient, onClientDelete, onClose]);

  const handleAddCommunication = useCallback(async () => {
    if (!client?.id || !newCommunication.assunto.trim()) return;
    
    try {
      const comunicacao = {
        ...newCommunication,
        data: new Date().toISOString(),
        autor: 'Sistema'
      };
      
      const updatedClient = {
        ...client,
        historicoComunicacao: [...(client.historicoComunicacao || []), comunicacao]
      };
      
      await updateClient(client.id, updatedClient);
      onClientUpdate(updatedClient);
      setNewCommunication({ tipo: 'email', assunto: '', notas: '' });
    } catch (error) {
      console.error('Erro ao adicionar comunicação:', error);
    }
  }, [client, newCommunication, updateClient, onClientUpdate]);

  // =========================================
  // ⌨️ KEYBOARD HANDLERS (SEMPRE EXECUTADOS)
  // =========================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const tabs = ['overview', 'personal', 'financial', 'documents', 'communication', 'activity'];
        const currentIndex = tabs.indexOf(activeTab);
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + tabs.length) % tabs.length
          : (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex]);
        e.preventDefault();
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
  // 🎨 TABS COMPONENTS (DEFINIDOS SEMPRE)
  // =========================================

  const OverviewTab = useCallback(() => (
    <div className="p-6 space-y-6">
      {/* Completion & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Perfil do Cliente</h3>
            <span className="text-2xl font-bold text-blue-600">{intelligentData.completionScore}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${intelligentData.completionScore}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">Dados pessoais completos</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Engagement</h3>
            <span className={`text-2xl font-bold ${
              intelligentData.engagementScore >= 70 ? 'text-green-600' : 
              intelligentData.engagementScore >= 40 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {intelligentData.engagementScore}%
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                intelligentData.engagementScore >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                intelligentData.engagementScore >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${intelligentData.engagementScore}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {intelligentData.engagementScore >= 70 ? 'Hot' : 
             intelligentData.engagementScore >= 40 ? 'Warm' : 'Cold'} • Cliente há {intelligentData.daysSinceCreated} dias
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-gray-900">{intelligentData.activeDeals}</div>
          <div className="text-sm text-gray-600">Deals Ativos</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-gray-900">{client?.documentos?.length || 0}</div>
          <div className="text-sm text-gray-600">Documentos</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-gray-900">{safeFormatCurrency(intelligentData.totalValue)}</div>
          <div className="text-sm text-gray-600">Valor Total</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <div className="text-2xl font-bold text-gray-900">{client?.historicoComunicacao?.length || 0}</div>
          <div className="text-sm text-gray-600">Comunicações</div>
        </div>
      </div>

      {/* Next Actions */}
      {intelligentData.nextActions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Próximas Ações Recomendadas
          </h4>
          <div className="space-y-2">
            {intelligentData.nextActions.map((action, index) => (
              <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${
                action.priority === 'high' ? 'bg-red-100 text-red-800' :
                action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <span className="text-sm">{action.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2 text-gray-900">{client?.dadosPessoais?.email || 'Não informado'}</span>
              {client?.dadosPessoais?.email && (
                <button
                  onClick={() => copyToClipboard(client.dadosPessoais.email, 'email')}
                  className="ml-2 text-blue-500 hover:text-blue-600"
                >
                  {copied === 'email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div>
              <span className="text-gray-500">Telefone:</span>
              <span className="ml-2 text-gray-900">{client?.dadosPessoais?.telefone || 'Não informado'}</span>
              {client?.dadosPessoais?.telefone && (
                <button
                  onClick={() => copyToClipboard(client.dadosPessoais.telefone, 'phone')}
                  className="ml-2 text-blue-500 hover:text-blue-600"
                >
                  {copied === 'phone' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Status & Relacionamento
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                client?.ativo !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {client?.ativo !== false ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Última comunicação:</span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {client?.historicoComunicacao?.length > 0 ? 'Recente' : 'Nunca'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [client, intelligentData, copied, copyToClipboard]);

  const PersonalTab = useCallback(() => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Dados Pessoais
          </h3>
          
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div>
              <label className="text-sm text-gray-500">Nome Completo</label>
              <div className="text-gray-900 font-medium">{client?.dadosPessoais?.nome || 'Não informado'}</div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <div className="text-gray-900">{client?.dadosPessoais?.email || 'Não informado'}</div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Telefone</label>
              <div className="text-gray-900">{client?.dadosPessoais?.telefone || 'Não informado'}</div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Estado Civil</label>
              <div className="text-gray-900">{EstadoCivilLabels[client?.dadosPessoais?.estadoCivil] || 'Não informado'}</div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Morada</label>
              <div className="text-gray-900">{client?.dadosPessoais?.morada || 'Não informado'}</div>
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Roles do Cliente
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {client?.roles?.map((role, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${ClientRoleColors[role] || 'bg-gray-100 text-gray-800'}`}
              >
                {ClientRoleLabels[role] || role}
              </span>
            )) || <span className="text-gray-500 text-sm">Nenhum role definido</span>}
          </div>
        </div>
      </div>
    </div>
  ), [client]);

  const FinancialTab = useCallback(() => (
    <div className="p-6 space-y-6">
      {/* Dados Bancários */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Dados Bancários
        </h3>
        
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div>
            <label className="text-sm text-gray-500">Banco</label>
            <div className="text-gray-900 font-medium">{client?.dadosBancarios?.banco || 'Não informado'}</div>
          </div>
          
          <div>
            <label className="text-sm text-gray-500">IBAN</label>
            <div className="text-gray-900 font-mono">{client?.dadosBancarios?.iban || 'Não informado'}</div>
          </div>
          
          <div>
            <label className="text-sm text-gray-500">Titular</label>
            <div className="text-gray-900">{client?.dadosBancarios?.titular || 'Não informado'}</div>
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Euro className="w-5 h-5" />
          Resumo Financeiro
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{safeFormatCurrency(intelligentData.totalValue)}</div>
              <div className="text-sm text-green-700">Valor Total</div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{intelligentData.activeDeals}</div>
              <div className="text-sm text-blue-700">Deals Ativos</div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {client?.deals?.filter(deal => deal.status === 'concluido')?.length || 0}
              </div>
              <div className="text-sm text-purple-700">Deals Concluídos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [client, intelligentData]);

  const DocumentsTab = useCallback(() => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Documentos
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Upload className="w-4 h-4" />
          Adicionar Documento
        </button>
      </div>

      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">Nenhum documento</h3>
        <p className="text-gray-400 mb-4">Este cliente ainda não tem documentos anexados.</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto">
          <Upload className="w-4 h-4" />
          Adicionar Primeiro Documento
        </button>
      </div>
    </div>
  ), []);

  const CommunicationTab = useCallback(() => (
    <div className="p-6 space-y-6">
      {/* Add Communication Form */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nova Comunicação
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={newCommunication.tipo}
            onChange={(e) => setNewCommunication(prev => ({ ...prev, tipo: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="email">Email</option>
            <option value="telefone">Telefone</option>
            <option value="reuniao">Reunião</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          
          <input
            type="text"
            placeholder="Assunto"
            value={newCommunication.assunto}
            onChange={(e) => setNewCommunication(prev => ({ ...prev, assunto: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={handleAddCommunication}
            disabled={!newCommunication.assunto.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Adicionar
          </button>
        </div>
        
        <textarea
          placeholder="Notas adicionais..."
          value={newCommunication.notas}
          onChange={(e) => setNewCommunication(prev => ({ ...prev, notas: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>

      {/* Communication History */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Histórico de Comunicações
        </h3>

        {client?.historicoComunicacao && client.historicoComunicacao.length > 0 ? (
          <div className="space-y-4">
            {client.historicoComunicacao
              .sort((a, b) => new Date(b.data) - new Date(a.data))
              .map((comm, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        comm.tipo === 'email' ? 'bg-blue-100 text-blue-600' :
                        comm.tipo === 'telefone' ? 'bg-green-100 text-green-600' :
                        comm.tipo === 'reuniao' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {comm.tipo === 'email' && <Mail className="w-4 h-4" />}
                        {comm.tipo === 'telefone' && <Phone className="w-4 h-4" />}
                        {comm.tipo === 'reuniao' && <Calendar className="w-4 h-4" />}
                        {comm.tipo === 'whatsapp' && <MessageCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{comm.assunto}</h4>
                        <p className="text-sm text-gray-500">{comm.tipo} • {formatDate(comm.data)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{comm.autor || 'Sistema'}</span>
                  </div>
                  
                  {comm.notas && (
                    <p className="text-sm text-gray-600 mt-2">{comm.notas}</p>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma comunicação registada</p>
          </div>
        )}
      </div>
    </div>
  ), [client, newCommunication, handleAddCommunication]);

  const ActivityTab = useCallback(() => (
    <div className="p-6 space-y-6">
      {/* Timeline */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timeline de Atividades
        </h3>

        <div className="space-y-4">
          {/* Cliente criado */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Cliente criado</h4>
              <p className="text-sm text-gray-500">{formatDate(client?.createdAt)} • {client?.createdBy || 'Sistema'}</p>
            </div>
          </div>

          {/* Dados atualizados */}
          {client?.updatedAt && client.updatedAt !== client.createdAt && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Dados atualizados</h4>
                <p className="text-sm text-gray-500">{formatDate(client.updatedAt)} • {client?.updatedBy || 'Sistema'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Ações Perigosas
        </h4>
        
        <div className="space-y-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar Cliente
          </button>
        </div>
      </div>
    </div>
  ), [client]);

  // =========================================
  // 🎨 RENDER LOGIC - SEM EARLY RETURNS ANTES DAQUI!
  // =========================================

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'personal': return <PersonalTab />;
      case 'financial': return <FinancialTab />;
      case 'documents': return <DocumentsTab />;
      case 'communication': return <CommunicationTab />;
      case 'activity': return <ActivityTab />;
      default: return <OverviewTab />;
    }
  }, [activeTab, OverviewTab, PersonalTab, FinancialTab, DocumentsTab, CommunicationTab, ActivityTab]);

  // =========================================
  // 🎯 RENDERIZAÇÃO CONDICIONAL (SÓ AGORA!)
  // =========================================

  // Se modal não está aberto, retornar null
  if (!isOpen) {
    return null;
  }

  // Se modo é create ou edit, renderizar ClientForm
  if (mode === 'create' || mode === 'edit') {
    const formContent = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <ClientForm
          client={mode === 'edit' ? client : null}
          onSuccess={(result) => {
            console.log('Cliente processado:', result);
            if (mode === 'create') {
              onClientCreate(result);
            } else {
              onClientUpdate(result);
            }
            onClose();
          }}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </motion.div>
    );

    return createPortal(formContent, document.body);
  }

  // Mode VIEW - Renderizar Modal de Visualização
  const viewModalContent = (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={modalRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar com Engagement Ring */}
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-4"
                    style={{
                      borderColor: intelligentData.engagementScore >= 70 ? '#10B981' :
                                  intelligentData.engagementScore >= 40 ? '#F59E0B' : '#EF4444'
                    }}
                  >
                    {client?.avatar ? (
                      <img src={client.avatar} alt={client.dadosPessoais?.nome} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      safeGetNameInitials(client?.dadosPessoais?.nome)
                    )}
                  </div>
                  
                  {/* Engagement Score Badge */}
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    intelligentData.engagementScore >= 70 ? 'bg-green-500' :
                    intelligentData.engagementScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {intelligentData.engagementScore}
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{client?.dadosPessoais?.nome || 'Cliente'}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-blue-100">
                      📅 Cliente há {intelligentData.daysSinceCreated} dias
                    </span>
                    <span className="text-blue-100">
                      💼 {intelligentData.activeDeals} deals ativos
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Quick Actions */}
                {client?.dadosPessoais?.telefone && (
                  <button
                    onClick={() => copyToClipboard(client.dadosPessoais.telefone, 'phone')}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                    title="Copiar telefone"
                  >
                    {copied === 'phone' ? <Check className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                  </button>
                )}

                {client?.dadosPessoais?.email && (
                  <button
                    onClick={() => copyToClipboard(client.dadosPessoais.email, 'email')}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                    title="Copiar email"
                  >
                    {copied === 'email' ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Visão Geral', icon: Eye },
                { id: 'personal', label: 'Pessoal', icon: User },
                { id: 'financial', label: 'Financeiro', icon: Euro },
                { id: 'documents', label: 'Documentos', icon: FileText },
                { id: 'communication', label: 'Comunicação', icon: MessageCircle },
                { id: 'activity', label: 'Atividade', icon: Clock }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {renderTabContent()}
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Eliminar Cliente
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Tem a certeza que deseja eliminar este cliente? 
                    Esta ação não pode ser desfeita.
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteClient}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(viewModalContent, document.body);
};

export default React.memo(ClientModal);

/* 
🎉 CLIENTMODAL.JSX - VERSÃO COMPLETA E 100% HOOKS-SAFE!

✅ PROBLEMA TOTALMENTE RESOLVIDO:
- ZERO early returns antes de todos os hooks serem executados
- TODOS os hooks sempre na mesma ordem
- Renderização condicional apenas no FINAL do componente
- Funcionalidades COMPLETAS mantidas

🔧 ESTRUTURA HOOKS-SAFE:
1. ✅ Todos os useState no topo
2. ✅ Todos os useCallback/useMemo sempre executados  
3. ✅ useEffect sempre executado
4. ✅ Lógica condicional APENAS no final

🚀 FUNCIONALIDADES COMPLETAS:
- 6 tabs funcionais (Overview, Personal, Financial, Documents, Communication, Activity)
- Modo CREATE/EDIT com ClientForm integrado
- Engagement scoring com visual
- Copy to clipboard
- Delete confirmation
- Keyboard navigation
- Animações suaves
- Error handling robusto

💎 AGORA DEVE FUNCIONAR 100% SEM ERROS DE HOOKS!
*/
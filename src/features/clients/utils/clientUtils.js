// =========================================
// 🛠️ CLIENT UTILITIES - FUNÇÕES AUXILIARES
// =========================================
// Funções essenciais para lógica de negócio dos clientes
// Reutilizáveis em toda a aplicação

import { DealStatus, ClientRole } from '../types/enums';

// =========================================
// 📊 ENGAGEMENT & SCORING
// =========================================

/**
 * Calcular score de engagement do cliente (0-100)
 * @param {Object} client - Dados do cliente
 * @returns {number} Score entre 0-100
 */
export const calculateEngagementScore = (client) => {
  if (!client) return 0;
  
  let score = 0;
  const weights = {
    recentContact: 25,
    activeDeals: 25, 
    completedData: 20,
    documents: 15,
    communication: 15
  };
  
  // 1. Contacto recente (25 pontos)
  const lastContact = getLastContactDate(client);
  if (lastContact) {
    const daysSince = (new Date() - lastContact) / (1000 * 60 * 60 * 24);
    if (daysSince <= 7) score += weights.recentContact;
    else if (daysSince <= 30) score += weights.recentContact * 0.7;
    else if (daysSince <= 90) score += weights.recentContact * 0.3;
  }
  
  // 2. Negócios ativos (25 pontos)
  const activeDeals = client.deals?.filter(deal => 
    [DealStatus.ATIVO, DealStatus.PROPOSTA_ENVIADA, DealStatus.NEGOCIACAO].includes(deal.status)
  ) || [];
  if (activeDeals.length > 0) {
    score += Math.min(weights.activeDeals, activeDeals.length * 8);
  }
  
  // 3. Dados completos (20 pontos)
  const completionRate = calculateDataCompletionRate(client);
  score += weights.completedData * (completionRate / 100);
  
  // 4. Documentos (15 pontos)
  const documents = client.documentos || [];
  if (documents.length > 0) {
    score += Math.min(weights.documents, documents.length * 3);
  }
  
  // 5. Configurações de comunicação (15 pontos)
  if (client.comunicacoes?.enviarAniversario || 
      client.comunicacoes?.lembretesVisitas || 
      client.comunicacoes?.lembretesPagamentos) {
    score += weights.communication;
  }
  
  return Math.min(100, Math.round(score));
};

/**
 * Calcular taxa de completude dos dados (0-100%)
 * @param {Object} client - Dados do cliente
 * @returns {number} Percentagem de completude
 */
export const calculateDataCompletionRate = (client) => {
  if (!client) return 0;
  
  const requiredFields = [
    'dadosPessoais.nome',
    'dadosPessoais.email', 
    'dadosPessoais.telefone',
    'dadosPessoais.morada',
    'dadosPessoais.nif'
  ];
  
  const optionalFields = [
    'dadosPessoais.dataNascimento',
    'dadosPessoais.naturalidade',
    'dadosBancarios.iban',
    'roles'
  ];
  
  let completed = 0;
  const total = requiredFields.length + optionalFields.length;
  
  // Campos obrigatórios (peso 2)
  requiredFields.forEach(field => {
    const value = getNestedValue(client, field);
    if (value && value.toString().trim()) completed += 2;
  });
  
  // Campos opcionais (peso 1)
  optionalFields.forEach(field => {
    const value = getNestedValue(client, field);
    if (value && (Array.isArray(value) ? value.length > 0 : value.toString().trim())) {
      completed += 1;
    }
  });
  
  return Math.round((completed / (requiredFields.length * 2 + optionalFields.length)) * 100);
};

// =========================================
// 📅 DATAS E EVENTOS
// =========================================

/**
 * Obter data do último contacto
 * @param {Object} client - Dados do cliente
 * @returns {Date|null} Data do último contacto
 */
export const getLastContactDate = (client) => {
  if (!client?.historicoComunicacao?.length) return null;
  
  const sortedHistory = [...client.historicoComunicacao]
    .sort((a, b) => new Date(b.data) - new Date(a.data));
    
  return sortedHistory[0]?.data ? new Date(sortedHistory[0].data) : null;
};

/**
 * Verificar se faz aniversário este mês
 * @param {Object} client - Dados do cliente
 * @returns {boolean} True se faz aniversário este mês
 */
export const isBirthdayThisMonth = (client) => {
  const birthday = client?.dadosPessoais?.dataNascimento;
  if (!birthday) return false;
  
  const birthdayDate = new Date(birthday);
  const now = new Date();
  
  return birthdayDate.getMonth() === now.getMonth();
};

/**
 * Verificar se faz aniversário hoje
 * @param {Object} client - Dados do cliente  
 * @returns {boolean} True se faz aniversário hoje
 */
export const isBirthdayToday = (client) => {
  const birthday = client?.dadosPessoais?.dataNascimento;
  if (!birthday) return false;
  
  const birthdayDate = new Date(birthday);
  const now = new Date();
  
  return birthdayDate.getMonth() === now.getMonth() && 
         birthdayDate.getDate() === now.getDate();
};

/**
 * Calcular idade do cliente
 * @param {Object} client - Dados do cliente
 * @returns {number|null} Idade em anos
 */
export const calculateAge = (client) => {
  const birthday = client?.dadosPessoais?.dataNascimento;
  if (!birthday) return null;
  
  const birthdayDate = new Date(birthday);
  const now = new Date();
  
  let age = now.getFullYear() - birthdayDate.getFullYear();
  const monthDiff = now.getMonth() - birthdayDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthdayDate.getDate())) {
    age--;
  }
  
  return age;
};

// =========================================
// 🚨 AÇÕES URGENTES
// =========================================

/**
 * Verificar se cliente tem ações urgentes
 * @param {Object} client - Dados do cliente
 * @returns {boolean} True se tem ações urgentes
 */
export const hasUrgentActions = (client) => {
  if (!client) return false;
  
  // Verificar deals urgentes
  const urgentDeals = getUrgentDeals(client);
  if (urgentDeals.length > 0) return true;
  
  // Verificar falta de contacto há muito tempo
  const lastContact = getLastContactDate(client);
  if (!lastContact) return true;
  
  const daysSinceContact = (new Date() - lastContact) / (1000 * 60 * 60 * 24);
  if (daysSinceContact > 60) return true;
  
  // Verificar dados incompletos críticos
  if (!client.dadosPessoais?.telefone || !client.dadosPessoais?.email) {
    return true;
  }
  
  return false;
};

/**
 * Obter deals urgentes do cliente
 * @param {Object} client - Dados do cliente
 * @returns {Array} Lista de deals urgentes
 */
export const getUrgentDeals = (client) => {
  if (!client?.deals?.length) return [];
  
  const urgentStatuses = [
    DealStatus.PROPOSTA_ENVIADA,
    DealStatus.CPCV_ASSINADO,
    DealStatus.ESCRITURA_AGENDADA,
    DealStatus.FINANCIAMENTO_PENDENTE
  ];
  
  return client.deals.filter(deal => urgentStatuses.includes(deal.status));
};

/**
 * Obter próxima ação recomendada
 * @param {Object} client - Dados do cliente
 * @returns {string} Descrição da próxima ação
 */
export const getNextRecommendedAction = (client) => {
  if (!client) return "📋 Criar cliente";
  
  // Aniversário hoje
  if (isBirthdayToday(client)) {
    return "🎂 Parabenizar pelo aniversário";
  }
  
  // Deals urgentes
  const urgentDeals = getUrgentDeals(client);
  if (urgentDeals.length > 0) {
    const deal = urgentDeals[0];
    return `🚨 ${urgentDeals.length} negócio${urgentDeals.length > 1 ? 's' : ''} urgente${urgentDeals.length > 1 ? 's' : ''}`;
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
};

// =========================================
// 💰 VALORES E FORMATAÇÃO
// =========================================

/**
 * Formatar valor monetário
 * @param {number} value - Valor a formatar
 * @param {string} currency - Moeda (default: EUR)
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value, currency = 'EUR') => {
  if (!value || isNaN(value)) return '€0';
  
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Calcular valor total dos deals do cliente
 * @param {Object} client - Dados do cliente
 * @returns {number} Valor total dos deals
 */
export const getTotalDealsValue = (client) => {
  if (!client?.deals?.length) return 0;
  
  return client.deals
    .filter(deal => deal.valor && !isNaN(deal.valor))
    .reduce((total, deal) => total + deal.valor, 0);
};

/**
 * Calcular valor médio dos deals
 * @param {Object} client - Dados do cliente  
 * @returns {number} Valor médio dos deals
 */
export const getAverageDealsValue = (client) => {
  if (!client?.deals?.length) return 0;
  
  const dealsWithValue = client.deals.filter(deal => deal.valor && !isNaN(deal.valor));
  if (dealsWithValue.length === 0) return 0;
  
  return getTotalDealsValue(client) / dealsWithValue.length;
};

// =========================================
// 🏷️ LABELS E FORMATAÇÃO
// =========================================

/**
 * Obter cor do engagement score
 * @param {number} score - Score de engagement (0-100)
 * @returns {string} Classe CSS da cor
 */
export const getEngagementColor = (score) => {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-blue-600 bg-blue-100';
  if (score >= 40) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

/**
 * Obter label do engagement score
 * @param {number} score - Score de engagement (0-100)
 * @returns {string} Label descritivo
 */
export const getEngagementLabel = (score) => {
  if (score >= 80) return 'Muito Engajado';
  if (score >= 60) return 'Engajado';
  if (score >= 40) return 'Moderado';
  return 'Precisa Atenção';
};

/**
 * Obter cor do role
 * @param {string} role - Role do cliente
 * @returns {string} Classe CSS da cor
 */
export const getRoleColor = (role) => {
  const colors = {
    [ClientRole.COMPRADOR]: 'bg-blue-100 text-blue-800',
    [ClientRole.VENDEDOR]: 'bg-green-100 text-green-800', 
    [ClientRole.INVESTIDOR]: 'bg-purple-100 text-purple-800',
    [ClientRole.SENHORIO]: 'bg-orange-100 text-orange-800',
    [ClientRole.INQUILINO]: 'bg-cyan-100 text-cyan-800'
  };
  
  return colors[role] || 'bg-gray-100 text-gray-800';
};

// =========================================
// 🔧 UTILITIES GERAIS
// =========================================

/**
 * Obter valor aninhado de objeto
 * @param {Object} obj - Objeto fonte
 * @param {string} path - Caminho separado por pontos
 * @returns {any} Valor encontrado ou undefined
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Formatar número de telefone
 * @param {string} phone - Número de telefone
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remover caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formato português: +351 XXX XXX XXX
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    return `+351 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  // Formato internacional
  if (cleaned.length > 9) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  
  return phone;
};

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Gerar iniciais do nome
 * @param {string} name - Nome completo
 * @returns {string} Iniciais (máx 2 caracteres)
 */
export const getNameInitials = (name) => {
  if (!name) return '??';
  
  const parts = name.trim().split(' ').filter(part => part.length > 0);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

/**
 * Formatar data relativa (há X dias, etc.)
 * @param {Date|string} date - Data a formatar
 * @returns {string} Data formatada
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'Nunca';
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now - targetDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;
  
  return `Há ${Math.floor(diffDays / 365)} anos`;
};

export default {
  // Engagement
  calculateEngagementScore,
  calculateDataCompletionRate,
  
  // Datas
  getLastContactDate,
  isBirthdayThisMonth,
  isBirthdayToday,
  calculateAge,
  
  // Ações
  hasUrgentActions,
  getUrgentDeals,
  getNextRecommendedAction,
  
  // Valores
  formatCurrency,
  getTotalDealsValue,
  getAverageDealsValue,
  
  // Labels
  getEngagementColor,
  getEngagementLabel,
  getRoleColor,
  
  // Utils
  getNestedValue,
  formatPhone,
  isValidEmail,
  getNameInitials,
  formatRelativeDate
};
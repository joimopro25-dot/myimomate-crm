// =========================================
// 🧠 CLIENT UTILS - INTELIGÊNCIA DO SISTEMA
// =========================================
// Funções auxiliares que transformam dados em insights
// O coração da inteligência do MyImoMate

import { format, isToday, isThisMonth, differenceInDays, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

// Enums para fallbacks seguros
const ClientRoleLabels = {
  'comprador': 'Comprador',
  'vendedor': 'Vendedor', 
  'investidor': 'Investidor',
  'inquilino': 'Inquilino',
  'senhorio': 'Senhorio'
};

const ClientRoleColors = {
  'comprador': 'blue',
  'vendedor': 'green', 
  'investidor': 'purple',
  'inquilino': 'orange',
  'senhorio': 'red'
};

// =========================================
// 🎯 ENGAGEMENT & SCORING
// =========================================

/**
 * Calcula o score de engagement do cliente (0-100)
 * Considera: última comunicação, deals ativos, documentos, interações
 */
export const calculateEngagementScore = (client) => {
  if (!client) return 0;

  let score = 0;
  
  // Base score: cliente ativo
  if (client.ativo !== false) {
    score += 20;
  }

  // Última comunicação (30 pontos)
  const lastContact = getLastContactDate(client);
  if (lastContact) {
    const daysSinceContact = differenceInDays(new Date(), new Date(lastContact));
    if (daysSinceContact <= 7) score += 30;
    else if (daysSinceContact <= 30) score += 20;
    else if (daysSinceContact <= 90) score += 10;
  }

  // Deals ativos (25 pontos)
  const activeDeals = getActiveDeals(client);
  if (activeDeals.length > 0) {
    score += 25;
    if (activeDeals.length > 1) score += 5; // Bonus para múltiplos deals
  }

  // Completude de dados (15 pontos)
  score += calculateDataCompleteness(client) * 0.15;

  // Documentos carregados (10 pontos)
  if (client.documentos && client.documentos.length > 0) {
    score += Math.min(10, client.documentos.length * 2);
  }

  return Math.min(100, Math.round(score));
};

/**
 * Retorna a cor baseada no score de engagement
 */
export const getEngagementColor = (score) => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'blue';
  if (score >= 40) return 'yellow';
  return 'red';
};

/**
 * Retorna o label baseado no score de engagement
 */
export const getEngagementLabel = (score) => {
  if (score >= 80) return 'Hot';
  if (score >= 60) return 'Warm';
  if (score >= 40) return 'Cool';
  return 'Cold';
};

// =========================================
// 📊 DEALS & FINANCIAL
// =========================================

/**
 * Calcula o valor total dos deals do cliente
 */
export const getTotalDealsValue = (client) => {
  if (!client?.deals || !Array.isArray(client.deals)) return 0;
  
  return client.deals.reduce((total, deal) => {
    const value = parseFloat(deal.valor) || 0;
    return total + value;
  }, 0);
};

/**
 * Retorna deals ativos do cliente
 */
export const getActiveDeals = (client) => {
  if (!client?.deals || !Array.isArray(client.deals)) return [];
  
  const activeStatuses = ['ativo', 'proposta_enviada', 'negociacao', 'em_processo'];
  return client.deals.filter(deal => 
    activeStatuses.includes(deal.status)
  );
};

/**
 * Formata valores monetários
 */
export const formatCurrency = (value, currency = 'EUR') => {
  if (typeof value !== 'number' || isNaN(value)) return '€0';
  
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// =========================================
// 📅 DATES & COMMUNICATIONS
// =========================================

/**
 * Verifica se cliente faz aniversário hoje
 */
export const isBirthdayToday = (client) => {
  if (!client?.dadosPessoais?.dataNascimento) return false;
  
  try {
    const birthDate = new Date(client.dadosPessoais.dataNascimento);
    const today = new Date();
    
    return birthDate.getDate() === today.getDate() && 
           birthDate.getMonth() === today.getMonth();
  } catch {
    return false;
  }
};

/**
 * Verifica se cliente faz aniversário este mês
 */
export const isBirthdayThisMonth = (client) => {
  if (!client?.dadosPessoais?.dataNascimento) return false;
  
  try {
    const birthDate = new Date(client.dadosPessoais.dataNascimento);
    return isThisMonth(birthDate);
  } catch {
    return false;
  }
};

/**
 * Retorna a data da última comunicação
 */
export const getLastContactDate = (client) => {
  if (!client?.historicoComunicacao || !Array.isArray(client.historicoComunicacao)) {
    return null;
  }
  
  const communications = client.historicoComunicacao
    .filter(comm => comm.data)
    .sort((a, b) => new Date(b.data) - new Date(a.data));
    
  return communications.length > 0 ? communications[0].data : null;
};

/**
 * Formata datas de forma relativa (há 2 dias, há 1 semana, etc.)
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'Nunca';
  
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : date;
    const daysDiff = differenceInDays(new Date(), targetDate);
    
    if (daysDiff === 0) return 'Hoje';
    if (daysDiff === 1) return 'Ontem';
    if (daysDiff < 7) return `Há ${daysDiff} dias`;
    if (daysDiff < 30) return `Há ${Math.floor(daysDiff / 7)} semanas`;
    if (daysDiff < 365) return `Há ${Math.floor(daysDiff / 30)} meses`;
    
    return format(targetDate, 'dd/MM/yyyy', { locale: pt });
  } catch {
    return 'Data inválida';
  }
};

// =========================================
// 🚨 URGENCY & ACTIONS
// =========================================

/**
 * Verifica se o cliente tem ações urgentes
 */
export const hasUrgentActions = (client) => {
  if (!client) return false;
  
  // Aniversário hoje = urgente
  if (isBirthdayToday(client)) return true;
  
  // Sem comunicação há mais de 30 dias = urgente
  const lastContact = getLastContactDate(client);
  if (lastContact) {
    const daysSinceContact = differenceInDays(new Date(), new Date(lastContact));
    if (daysSinceContact > 30) return true;
  }
  
  // Deals ativos sem atualização recente = urgente
  const activeDeals = getActiveDeals(client);
  if (activeDeals.length > 0) {
    const hasStaleDeals = activeDeals.some(deal => {
      if (!deal.updatedAt) return true;
      const daysSinceUpdate = differenceInDays(new Date(), new Date(deal.updatedAt));
      return daysSinceUpdate > 14;
    });
    if (hasStaleDeals) return true;
  }
  
  return false;
};

/**
 * Sugere próxima ação recomendada para o cliente
 */
export const getNextRecommendedAction = (client) => {
  if (!client) return 'Revisar dados do cliente';
  
  if (isBirthdayToday(client)) {
    return 'Parabenizar aniversário! 🎉';
  }
  
  if (isBirthdayThisMonth(client)) {
    return 'Aniversário este mês - agendar contacto';
  }
  
  const lastContact = getLastContactDate(client);
  if (!lastContact) {
    return 'Realizar primeiro contacto';
  }
  
  const daysSinceContact = differenceInDays(new Date(), new Date(lastContact));
  if (daysSinceContact > 30) {
    return 'Contacto urgente - sem comunicação há ' + daysSinceContact + ' dias';
  }
  
  if (daysSinceContact > 14) {
    return 'Agendar follow-up';
  }
  
  const activeDeals = getActiveDeals(client);
  if (activeDeals.length > 0) {
    return 'Atualizar status dos negócios';
  }
  
  if (calculateDataCompleteness(client) < 80) {
    return 'Completar dados do cliente';
  }
  
  return 'Agendar próximo contacto';
};

// =========================================
// 🎨 FORMATTING & UI HELPERS
// =========================================

/**
 * Gera iniciais do nome
 */
export const getNameInitials = (name) => {
  if (!name || typeof name !== 'string') return '??';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  if (words.length === 0) return '??';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Formata número de telefone
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove tudo que não seja dígito
  const digits = phone.replace(/\D/g, '');
  
  // Se começa com 351, formato internacional
  if (digits.startsWith('351') && digits.length === 12) {
    return `+351 ${digits.substring(3, 6)} ${digits.substring(6, 9)} ${digits.substring(9)}`;
  }
  
  // Formato nacional (9 dígitos)
  if (digits.length === 9) {
    return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }
  
  return phone; // Retorna original se não conseguir formatar
};

/**
 * Retorna cor para o role do cliente
 */
export const getRoleColor = (role) => {
  return ClientRoleColors[role] || 'gray';
};

/**
 * Retorna label para o role do cliente
 */
export const getRoleLabel = (role) => {
  return ClientRoleLabels[role] || role || 'Desconhecido';
};

// =========================================
// 📈 STATISTICS & ANALYTICS
// =========================================

/**
 * Calcula completude dos dados do cliente (0-100)
 */
export const calculateDataCompleteness = (client) => {
  if (!client) return 0;
  
  const requiredFields = [
    'dadosPessoais.nome',
    'dadosPessoais.email', 
    'dadosPessoais.telefone',
    'roles'
  ];
  
  const optionalFields = [
    'dadosPessoais.dataNascimento',
    'dadosPessoais.nif',
    'dadosBancarios.banco',
    'dadosBancarios.iban',
    'avatar',
    'notas'
  ];
  
  let score = 0;
  let totalFields = requiredFields.length + optionalFields.length;
  
  // Campos obrigatórios (peso maior)
  requiredFields.forEach(field => {
    if (getNestedValue(client, field)) {
      score += 2; // Peso dobrado para campos obrigatórios
      totalFields += 1; // Ajustar peso total
    }
  });
  
  // Campos opcionais
  optionalFields.forEach(field => {
    if (getNestedValue(client, field)) {
      score += 1;
    }
  });
  
  return Math.round((score / totalFields) * 100);
};

/**
 * Calcula estatísticas gerais dos clientes
 */
export const calculateClientsStats = (clients) => {
  if (!clients || !Array.isArray(clients)) {
    return {
      total: 0,
      ativos: 0,
      inativos: 0,
      novosEsteMes: 0,
      birthdayToday: 0,
      urgentActions: 0,
      hotClients: 0,
      coldClients: 0,
      totalValue: 0,
      avgEngagement: 0,
      activeDeals: 0
    };
  }
  
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  let totalEngagement = 0;
  let totalValue = 0;
  let activeDealsCount = 0;
  
  const stats = {
    total: clients.length,
    ativos: 0,
    inativos: 0,
    novosEsteMes: 0,
    birthdayToday: 0,
    urgentActions: 0,
    hotClients: 0,
    coldClients: 0,
    totalValue: 0,
    avgEngagement: 0,
    activeDeals: 0
  };
  
  clients.forEach(client => {
    // Status ativo/inativo
    if (client.ativo !== false) {
      stats.ativos++;
    } else {
      stats.inativos++;
    }
    
    // Novos este mês
    if (client.createdAt) {
      const createdDate = new Date(client.createdAt);
      if (createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear) {
        stats.novosEsteMes++;
      }
    }
    
    // Aniversários hoje
    if (isBirthdayToday(client)) {
      stats.birthdayToday++;
    }
    
    // Ações urgentes
    if (hasUrgentActions(client)) {
      stats.urgentActions++;
    }
    
    // Engagement
    const engagement = calculateEngagementScore(client);
    totalEngagement += engagement;
    
    if (engagement >= 80) {
      stats.hotClients++;
    } else if (engagement < 40) {
      stats.coldClients++;
    }
    
    // Valor total
    const clientValue = getTotalDealsValue(client);
    totalValue += clientValue;
    
    // Deals ativos
    const activeDeals = getActiveDeals(client);
    activeDealsCount += activeDeals.length;
  });
  
  // Médias e totais
  stats.avgEngagement = clients.length > 0 ? Math.round(totalEngagement / clients.length) : 0;
  stats.totalValue = totalValue;
  stats.activeDeals = activeDealsCount;
  
  return stats;
};

// =========================================
// 🔍 SEARCH & FILTERING
// =========================================

/**
 * Filtra clientes por termo de pesquisa
 */
export const filterClientsBySearch = (clients, searchTerm) => {
  if (!clients || !Array.isArray(clients)) return [];
  if (!searchTerm || typeof searchTerm !== 'string') return clients;
  
  const term = searchTerm.toLowerCase().trim();
  if (term === '') return clients;
  
  return clients.filter(client => {
    // Buscar em nome
    if (client.dadosPessoais?.nome?.toLowerCase().includes(term)) return true;
    
    // Buscar em email
    if (client.dadosPessoais?.email?.toLowerCase().includes(term)) return true;
    
    // Buscar em telefone (remover formatação)
    if (client.dadosPessoais?.telefone?.replace(/\D/g, '').includes(term.replace(/\D/g, ''))) return true;
    
    // Buscar em NIF
    if (client.dadosPessoais?.nif?.includes(term)) return true;
    
    // Buscar em roles
    if (client.roles?.some(role => getRoleLabel(role).toLowerCase().includes(term))) return true;
    
    // Buscar em notas
    if (client.notas?.toLowerCase().includes(term)) return true;
    
    return false;
  });
};

/**
 * Ordena clientes por critério específico
 */
export const sortClients = (clients, sortBy) => {
  if (!clients || !Array.isArray(clients)) return [];
  
  const sortedClients = [...clients];
  
  switch (sortBy) {
    case 'name':
      return sortedClients.sort((a, b) => {
        const nameA = a.dadosPessoais?.nome || '';
        const nameB = b.dadosPessoais?.nome || '';
        return nameA.localeCompare(nameB, 'pt-PT');
      });
      
    case 'engagement':
      return sortedClients.sort((a, b) => {
        const scoreA = calculateEngagementScore(a);
        const scoreB = calculateEngagementScore(b);
        return scoreB - scoreA; // Descendente
      });
      
    case 'value':
      return sortedClients.sort((a, b) => {
        const valueA = getTotalDealsValue(a);
        const valueB = getTotalDealsValue(b);
        return valueB - valueA; // Descendente
      });
      
    case 'date':
      return sortedClients.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Mais recentes primeiro
      });
      
    case 'lastContact':
      return sortedClients.sort((a, b) => {
        const contactA = getLastContactDate(a);
        const contactB = getLastContactDate(b);
        
        if (!contactA && !contactB) return 0;
        if (!contactA) return 1; // Sem contacto vai para o fim
        if (!contactB) return -1;
        
        return new Date(contactB) - new Date(contactA); // Mais recentes primeiro
      });
      
    default:
      return sortedClients;
  }
};

// =========================================
// 🛠️ UTILITY HELPERS
// =========================================

/**
 * Acessa valores aninhados de forma segura
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * Debounce function para pesquisas
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// =========================================
// 📤 EXPORTS DEFAULT
// =========================================

const clientUtils = {
  // Engagement
  calculateEngagementScore,
  getEngagementColor,
  getEngagementLabel,
  
  // Financial
  getTotalDealsValue,
  getActiveDeals,
  formatCurrency,
  
  // Dates
  isBirthdayToday,
  isBirthdayThisMonth,
  getLastContactDate,
  formatRelativeDate,
  
  // Actions
  hasUrgentActions,
  getNextRecommendedAction,
  
  // Formatting
  getNameInitials,
  formatPhone,
  getRoleColor,
  getRoleLabel,
  
  // Analytics
  calculateDataCompleteness,
  calculateClientsStats,
  
  // Search & Sort
  filterClientsBySearch,
  sortClients,
  
  // Utils
  debounce
};

export default clientUtils;
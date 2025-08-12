// =========================================
// 🔥 FIREBASE SERVICE - MÓDULO CLIENTES
// =========================================
// Service para operações CRUD dos clientes no Firestore
// Inclui paginação, filtros, estatísticas e operações avançadas

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getCountFromServer,
  writeBatch,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/shared/services/firebase/config';
import { PAGINATION } from '../types/enums';

// =========================================
// 🏗️ CONFIGURAÇÕES BASE
// =========================================

const COLLECTION_NAME = 'clients';
const getClientsCollection = (userId) => collection(db, 'users', userId, COLLECTION_NAME);

// =========================================
// 🔍 FUNÇÕES DE QUERY BUILDER
// =========================================

/**
 * Constrói query do Firestore baseada nos filtros
 */
const buildQuery = (userId, filters = {}, pagination = {}) => {
  let q = query(getClientsCollection(userId));
  
  // ===== FILTROS =====
  
  // Filtro por status ativo
  if (filters.ativo !== null && filters.ativo !== undefined) {
    q = query(q, where('ativo', '==', filters.ativo));
  }
  
  // Filtro por roles (array-contains-any)
  if (filters.roles && filters.roles.length > 0) {
    q = query(q, where('roles', 'array-contains-any', filters.roles));
  }
  
  // Filtro por estado civil
  if (filters.estadoCivil && filters.estadoCivil.length > 0) {
    q = query(q, where('dadosPessoais.estadoCivil', 'in', filters.estadoCivil));
  }
  
  // Filtro por responsável
  if (filters.responsavel) {
    q = query(q, where('responsavel', '==', filters.responsavel));
  }
  
  // Filtro por origem
  if (filters.origem && filters.origem.length > 0) {
    q = query(q, where('origem', 'in', filters.origem));
  }
  
  // Filtro por data de criação (range)
  if (filters.dataInicio) {
    q = query(q, where('createdAt', '>=', new Date(filters.dataInicio)));
  }
  
  if (filters.dataFim) {
    q = query(q, where('createdAt', '<=', new Date(filters.dataFim)));
  }
  
  // ===== ORDENAÇÃO =====
  q = query(q, orderBy('createdAt', 'desc'));
  
  // ===== PAGINAÇÃO =====
  if (pagination.limit) {
    q = query(q, limit(pagination.limit));
  }
  
  if (pagination.startAfter) {
    q = query(q, startAfter(pagination.startAfter));
  }
  
  return q;
};

/**
 * Aplica filtros de pesquisa em memória (para campos que não são indexados)
 */
const applyInMemoryFilters = (clients, filters) => {
  let filtered = [...clients];
  
  // Pesquisa por texto (nome, email, telefone)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(client => {
      const nome = client.dadosPessoais?.nome?.toLowerCase() || '';
      const email = client.dadosPessoais?.email?.toLowerCase() || '';
      const telefone = client.dadosPessoais?.telefone?.toLowerCase() || '';
      
      return nome.includes(searchLower) || 
             email.includes(searchLower) || 
             telefone.includes(searchLower);
    });
  }
  
  // Filtro por ter deals ativos
  if (filters.temDeals !== null && filters.temDeals !== undefined) {
    filtered = filtered.filter(client => {
      const hasDeals = client.deals && client.deals.length > 0;
      return filters.temDeals ? hasDeals : !hasDeals;
    });
  }
  
  // Filtro por status dos deals
  if (filters.statusDeals && filters.statusDeals.length > 0) {
    filtered = filtered.filter(client => {
      if (!client.deals || client.deals.length === 0) return false;
      return client.deals.some(deal => filters.statusDeals.includes(deal.status));
    });
  }
  
  return filtered;
};

// =========================================
// 🔥 OPERAÇÕES CRUD PRINCIPAIS
// =========================================

/**
 * Buscar lista de clientes com filtros e paginação
 */
export const getClients = async (userId, options = {}) => {
  try {
    const {
      filters = {},
      page = 1,
      limit = PAGINATION.DEFAULT_LIMIT,
      startAfterDoc = null
    } = options;
    
    // Construir query
    const q = buildQuery(userId, filters, { 
      limit: limit + 1, // +1 para verificar se há mais páginas
      startAfter: startAfterDoc 
    });
    
    // Executar query
    const snapshot = await getDocs(q);
    
    // Processar resultados
    let clients = [];
    snapshot.forEach(doc => {
      clients.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });
    
    // Verificar se há mais páginas
    const hasMore = clients.length > limit;
    if (hasMore) {
      clients = clients.slice(0, limit); // Remover o item extra
    }
    
    // Aplicar filtros em memória
    clients = applyInMemoryFilters(clients, filters);
    
    // Obter contagem total (apenas na primeira página)
    let total = 0;
    if (page === 1) {
      const countQuery = buildQuery(userId, filters);
      const countSnapshot = await getCountFromServer(countQuery);
      total = countSnapshot.data().count;
    }
    
    return {
      data: clients,
      total,
      page,
      limit,
      hasMore: hasMore && clients.length === limit,
      lastDoc: clients.length > 0 ? snapshot.docs[clients.length - 1] : null
    };
    
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw new Error(`Falha ao carregar clientes: ${error.message}`);
  }
};

/**
 * Buscar cliente específico por ID
 */
export const getClient = async (userId, clientId) => {
  try {
    const clientRef = doc(getClientsCollection(userId), clientId);
    const snapshot = await getDoc(clientRef);
    
    if (!snapshot.exists()) {
      throw new Error('Cliente não encontrado');
    }
    
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
    
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    throw new Error(`Falha ao carregar cliente: ${error.message}`);
  }
};

/**
 * Criar novo cliente
 */
export const createClient = async (userId, clientData) => {
  try {
    // Preparar dados com timestamps
    const dataToSave = {
      ...clientData,
      ativo: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
      updatedBy: userId,
      // Garantir arrays vazios se não existirem
      documentos: clientData.documentos || [],
      deals: clientData.deals || [],
      historicoComunicacao: clientData.historicoComunicacao || []
    };
    
    // Criar documento
    const docRef = await addDoc(getClientsCollection(userId), dataToSave);
    
    // Buscar o documento criado para retornar com dados completos
    const createdClient = await getClient(userId, docRef.id);
    
    return createdClient;
    
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw new Error(`Falha ao criar cliente: ${error.message}`);
  }
};

/**
 * Atualizar cliente existente
 */
export const updateClient = async (userId, clientId, updates) => {
  try {
    const clientRef = doc(getClientsCollection(userId), clientId);
    
    // Preparar dados de atualização
    const dataToUpdate = {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: userId
    };
    
    // Atualizar documento
    await updateDoc(clientRef, dataToUpdate);
    
    // Retornar cliente atualizado
    const updatedClient = await getClient(userId, clientId);
    return updatedClient;
    
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw new Error(`Falha ao atualizar cliente: ${error.message}`);
  }
};

/**
 * Deletar cliente
 */
export const deleteClient = async (userId, clientId) => {
  try {
    const clientRef = doc(getClientsCollection(userId), clientId);
    await deleteDoc(clientRef);
    
    return { success: true, message: 'Cliente deletado com sucesso' };
    
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    throw new Error(`Falha ao deletar cliente: ${error.message}`);
  }
};

/**
 * Deletar múltiplos clientes (batch operation)
 */
export const deleteMultipleClients = async (userId, clientIds) => {
  try {
    const batch = writeBatch(db);
    
    clientIds.forEach(clientId => {
      const clientRef = doc(getClientsCollection(userId), clientId);
      batch.delete(clientRef);
    });
    
    await batch.commit();
    
    return { 
      success: true, 
      message: `${clientIds.length} clientes deletados com sucesso` 
    };
    
  } catch (error) {
    console.error('Erro ao deletar múltiplos clientes:', error);
    throw new Error(`Falha ao deletar clientes: ${error.message}`);
  }
};

// =========================================
// 📊 OPERAÇÕES DE ESTATÍSTICAS
// =========================================

/**
 * Buscar estatísticas dos clientes
 */
export const getClientStats = async (userId) => {
  try {
    // Buscar todos os clientes (sem limite para estatísticas)
    const q = query(
      getClientsCollection(userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    const clients = [];
    snapshot.forEach(doc => {
      clients.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    // Calcular estatísticas
    const stats = {
      total: clients.length,
      ativos: clients.filter(c => c.ativo !== false).length,
      inativos: clients.filter(c => c.ativo === false).length,
      novosEsteMes: 0,
      porRole: {},
      porEstadoCivil: {},
      porOrigem: {},
      totalDeals: 0,
      dealsAtivos: 0,
      valorTotalDeals: 0
    };
    
    // Calcular novos este mês
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);
    
    stats.novosEsteMes = clients.filter(c => 
      c.createdAt && c.createdAt >= inicioMes
    ).length;
    
    // Calcular estatísticas por categoria
    clients.forEach(client => {
      // Por role
      if (client.roles) {
        client.roles.forEach(role => {
          stats.porRole[role] = (stats.porRole[role] || 0) + 1;
        });
      }
      
      // Por estado civil
      const estadoCivil = client.dadosPessoais?.estadoCivil;
      if (estadoCivil) {
        stats.porEstadoCivil[estadoCivil] = (stats.porEstadoCivil[estadoCivil] || 0) + 1;
      }
      
      // Por origem
      const origem = client.origem;
      if (origem) {
        stats.porOrigem[origem] = (stats.porOrigem[origem] || 0) + 1;
      }
      
      // Deals
      if (client.deals) {
        stats.totalDeals += client.deals.length;
        
        client.deals.forEach(deal => {
          if (deal.status !== 'concluido' && deal.status !== 'cancelado') {
            stats.dealsAtivos += 1;
          }
          
          if (deal.valor) {
            stats.valorTotalDeals += deal.valor;
          }
        });
      }
    });
    
    return stats;
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw new Error(`Falha ao carregar estatísticas: ${error.message}`);
  }
};

// =========================================
// 📄 OPERAÇÕES DE DOCUMENTOS
// =========================================

/**
 * Adicionar documento ao cliente
 */
export const addDocumentToClient = async (userId, clientId, documentData) => {
  try {
    const clientRef = doc(getClientsCollection(userId), clientId);
    
    // Adicionar documento ao array
    await updateDoc(clientRef, {
      documentos: arrayUnion({
        ...documentData,
        id: `doc_${Date.now()}`,
        dataUpload: serverTimestamp(),
        uploadedBy: userId
      }),
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
    
    return { success: true, message: 'Documento adicionado com sucesso' };
    
  } catch (error) {
    console.error('Erro ao adicionar documento:', error);
    throw new Error(`Falha ao adicionar documento: ${error.message}`);
  }
};

/**
 * Remover documento do cliente
 */
export const removeDocumentFromClient = async (userId, clientId, documentData) => {
  try {
    const clientRef = doc(getClientsCollection(userId), clientId);
    
    // Remover documento do array
    await updateDoc(clientRef, {
      documentos: arrayRemove(documentData),
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
    
    return { success: true, message: 'Documento removido com sucesso' };
    
  } catch (error) {
    console.error('Erro ao remover documento:', error);
    throw new Error(`Falha ao remover documento: ${error.message}`);
  }
};

// =========================================
// 🤝 OPERAÇÕES DE DEALS
// =========================================

/**
 * Adicionar deal ao cliente
 */
export const addDealToClient = async (userId, clientId, dealData) => {
  try {
    const clientRef = doc(getClientsCollection(userId), clientId);
    
    const dealToAdd = {
      ...dealData,
      id: `deal_${Date.now()}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Adicionar deal ao array
    await updateDoc(clientRef, {
      deals: arrayUnion(dealToAdd),
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
    
    return { success: true, deal: dealToAdd };
    
  } catch (error) {
    console.error('Erro ao adicionar deal:', error);
    throw new Error(`Falha ao adicionar negócio: ${error.message}`);
  }
};

/**
 * Atualizar deal do cliente
 */
export const updateClientDeal = async (userId, clientId, dealId, updates) => {
  try {
    // Buscar cliente atual
    const client = await getClient(userId, clientId);
    
    // Encontrar e atualizar o deal
    const updatedDeals = client.deals.map(deal => {
      if (deal.id === dealId) {
        return {
          ...deal,
          ...updates,
          updatedAt: new Date()
        };
      }
      return deal;
    });
    
    // Atualizar cliente com deals modificados
    const clientRef = doc(getClientsCollection(userId), clientId);
    await updateDoc(clientRef, {
      deals: updatedDeals,
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
    
    return { success: true, message: 'Deal atualizado com sucesso' };
    
  } catch (error) {
    console.error('Erro ao atualizar deal:', error);
    throw new Error(`Falha ao atualizar negócio: ${error.message}`);
  }
};

// =========================================
// 📞 OPERAÇÕES DE COMUNICAÇÃO
// =========================================

/**
 * Adicionar registro de comunicação
 */
export const addCommunicationToClient = async (userId, clientId, communicationData) => {
  try {
    const clientRef = doc(getClientsCollection(userId), clientId);
    
    const communicationToAdd = {
      ...communicationData,
      id: `comm_${Date.now()}`,
      data: serverTimestamp(),
      responsavel: userId,
      lida: false
    };
    
    // Adicionar comunicação ao histórico
    await updateDoc(clientRef, {
      historicoComunicacao: arrayUnion(communicationToAdd),
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
    
    return { success: true, communication: communicationToAdd };
    
  } catch (error) {
    console.error('Erro ao adicionar comunicação:', error);
    throw new Error(`Falha ao registrar comunicação: ${error.message}`);
  }
};

// =========================================
// 🔍 OPERAÇÕES DE PESQUISA AVANÇADA
// =========================================

/**
 * Pesquisa avançada de clientes
 */
export const searchClients = async (userId, searchTerm, options = {}) => {
  try {
    // Para pesquisa por texto, precisamos buscar todos e filtrar em memória
    // Em produção, consideraria usar Algolia ou similar para pesquisa full-text
    
    const { limit = 20 } = options;
    
    // Buscar todos os clientes
    const q = query(
      getClientsCollection(userId),
      orderBy('createdAt', 'desc'),
      limit(100) // Limite maior para pesquisa
    );
    
    const snapshot = await getDocs(q);
    
    let clients = [];
    snapshot.forEach(doc => {
      clients.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });
    
    // Aplicar pesquisa em memória
    const searchLower = searchTerm.toLowerCase();
    const filtered = clients.filter(client => {
      const nome = client.dadosPessoais?.nome?.toLowerCase() || '';
      const email = client.dadosPessoais?.email?.toLowerCase() || '';
      const telefone = client.dadosPessoais?.telefone?.replace(/\s/g, '') || '';
      const nif = client.dadosPessoais?.nif || '';
      const notas = client.notas?.toLowerCase() || '';
      
      return nome.includes(searchLower) || 
             email.includes(searchLower) || 
             telefone.includes(searchTerm.replace(/\s/g, '')) ||
             nif.includes(searchTerm) ||
             notas.includes(searchLower);
    });
    
    return {
      data: filtered.slice(0, limit),
      total: filtered.length,
      hasMore: filtered.length > limit
    };
    
  } catch (error) {
    console.error('Erro na pesquisa:', error);
    throw new Error(`Falha na pesquisa: ${error.message}`);
  }
};

// =========================================
// 🏷️ OPERAÇÕES DE EXPORT/IMPORT
// =========================================

/**
 * Exportar clientes para CSV/JSON
 */
export const exportClients = async (userId, format = 'json', filters = {}) => {
  try {
    // Buscar todos os clientes filtrados
    const result = await getClients(userId, { 
      filters, 
      limit: 1000 // Limite alto para export
    });
    
    if (format === 'json') {
      return {
        data: result.data,
        format: 'json',
        timestamp: new Date().toISOString()
      };
    }
    
    // Para CSV, seria necessário converter os dados
    // Esta é uma implementação básica
    if (format === 'csv') {
      const csvData = result.data.map(client => ({
        id: client.id,
        nome: client.dadosPessoais?.nome || '',
        email: client.dadosPessoais?.email || '',
        telefone: client.dadosPessoais?.telefone || '',
        roles: client.roles?.join(', ') || '',
        ativo: client.ativo ? 'Sim' : 'Não',
        createdAt: client.createdAt?.toLocaleDateString() || ''
      }));
      
      return {
        data: csvData,
        format: 'csv',
        timestamp: new Date().toISOString()
      };
    }
    
    throw new Error('Formato não suportado');
    
  } catch (error) {
    console.error('Erro no export:', error);
    throw new Error(`Falha no export: ${error.message}`);
  }
};

// Export default com todas as funções
export default {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  deleteMultipleClients,
  getClientStats,
  addDocumentToClient,
  removeDocumentFromClient,
  addDealToClient,
  updateClientDeal,
  addCommunicationToClient,
  searchClients,
  exportClients
};
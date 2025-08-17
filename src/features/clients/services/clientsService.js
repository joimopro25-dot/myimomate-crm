// =========================================
// 🔥 FIREBASE SERVICE - MÓDULO CLIENTES CORRIGIDO
// =========================================
// Service para operações CRUD dos clientes no Firestore
// CORREÇÃO: Conflito de nome 'limit' resolvido
// Arquivo: src/features/clients/services/clientsService.js

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
  limit as firestoreLimit, // 🔥 CORREÇÃO: Renomear import
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
    q = query(q, firestoreLimit(pagination.limit)); // 🔥 CORREÇÃO: Usar firestoreLimit
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
      limitParam = PAGINATION.DEFAULT_LIMIT, // 🔥 CORREÇÃO: Renomear parâmetro
      startAfterDoc = null
    } = options;
    
    // Construir query
    const q = buildQuery(userId, filters, { 
      limit: limitParam + 1, // +1 para verificar se há mais páginas
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
    const hasMore = clients.length > limitParam;
    if (hasMore) {
      clients = clients.slice(0, limitParam); // Remover o item extra
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
      limit: limitParam,
      hasMore: hasMore && clients.length === limitParam,
      lastDoc: clients.length > 0 ? snapshot.docs[clients.length - 1] : null
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error);
    throw new Error(`Falha ao buscar clientes: ${error.message}`);
  }
};

/**
 * Buscar cliente por ID
 */
export const getClient = async (userId, clientId) => {
  try {
    const docRef = doc(getClientsCollection(userId), clientId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Cliente não encontrado');
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate()
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error);
    throw new Error(`Falha ao buscar cliente: ${error.message}`);
  }
};

/**
 * Criar novo cliente
 */
export const createClient = async (userId, clientData) => {
  try {
    console.log('✨ Criando novo cliente...', { userId, clientData });
    
    // Preparar dados com timestamp
    const newClientData = {
      ...clientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ativo: true
    };
    
    // Criar documento
    const docRef = await addDoc(getClientsCollection(userId), newClientData);
    
    // Buscar documento criado para retornar com dados completos
    const createdClient = await getClient(userId, docRef.id);
    
    console.log('✅ Cliente criado com sucesso:', { id: docRef.id, nome: clientData.dadosPessoais?.nome });
    
    return createdClient;
    
  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error);
    throw new Error(`Falha ao criar cliente: ${error.message}`);
  }
};

/**
 * Atualizar cliente existente
 */
export const updateClient = async (userId, clientId, updates) => {
  try {
    console.log('📝 Atualizando cliente...', { userId, clientId, updates });
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    const docRef = doc(getClientsCollection(userId), clientId);
    await updateDoc(docRef, updateData);
    
    // Retornar cliente atualizado
    const updatedClient = await getClient(userId, clientId);
    
    console.log('✅ Cliente atualizado com sucesso:', { id: clientId });
    
    return updatedClient;
    
  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error);
    throw new Error(`Falha ao atualizar cliente: ${error.message}`);
  }
};

/**
 * Deletar cliente
 */
export const deleteClient = async (userId, clientId) => {
  try {
    console.log('🗑️ Deletando cliente...', { userId, clientId });
    
    const docRef = doc(getClientsCollection(userId), clientId);
    await deleteDoc(docRef);
    
    console.log('✅ Cliente deletado com sucesso:', { id: clientId });
    
    return { success: true, id: clientId };
    
  } catch (error) {
    console.error('❌ Erro ao deletar cliente:', error);
    throw new Error(`Falha ao deletar cliente: ${error.message}`);
  }
};

/**
 * Deletar múltiplos clientes
 */
export const deleteMultipleClients = async (userId, clientIds) => {
  try {
    console.log('🗑️ Deletando múltiplos clientes...', { userId, count: clientIds.length });
    
    const batch = writeBatch(db);
    
    clientIds.forEach(clientId => {
      const docRef = doc(getClientsCollection(userId), clientId);
      batch.delete(docRef);
    });
    
    await batch.commit();
    
    console.log('✅ Múltiplos clientes deletados com sucesso:', { count: clientIds.length });
    
    return { success: true, deletedCount: clientIds.length };
    
  } catch (error) {
    console.error('❌ Erro ao deletar múltiplos clientes:', error);
    throw new Error(`Falha ao deletar clientes: ${error.message}`);
  }
};

// =========================================
// 📊 ESTATÍSTICAS E ANALYTICS
// =========================================

/**
 * Buscar estatísticas dos clientes
 */
export const getClientStats = async (userId) => {
  try {
    console.log('📊 Buscando estatísticas dos clientes...', { userId });
    
    // Buscar todos os clientes para calcular estatísticas
    const q = query(getClientsCollection(userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const clients = [];
    snapshot.forEach(doc => {
      clients.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });
    
    // Calcular estatísticas
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const stats = {
      total: clients.length,
      ativos: clients.filter(c => c.ativo !== false).length,
      inativos: clients.filter(c => c.ativo === false).length,
      novosEsteMes: clients.filter(c => c.createdAt >= thisMonth).length,
      
      // Por role
      compradores: clients.filter(c => c.roles?.includes('comprador')).length,
      vendedores: clients.filter(c => c.roles?.includes('vendedor')).length,
      investidores: clients.filter(c => c.roles?.includes('investidor')).length,
      
      // Por origem
      origemLead: clients.filter(c => c.origem === 'lead').length,
      origemReferencia: clients.filter(c => c.origem === 'referencia').length,
      origemWebsite: clients.filter(c => c.origem === 'website').length,
      
      // Crescimento mensal
      crescimentoMensal: 0 // Será calculado comparando com mês anterior
    };
    
    // Calcular crescimento mensal
    const clientesUltimoMes = clients.filter(c => {
      return c.createdAt >= lastMonth && c.createdAt < thisMonth;
    }).length;
    
    if (clientesUltimoMes > 0) {
      stats.crescimentoMensal = ((stats.novosEsteMes - clientesUltimoMes) / clientesUltimoMes) * 100;
    }
    
    console.log('✅ Estatísticas calculadas:', stats);
    
    return stats;
    
  } catch (error) {
    console.error('❌ Erro ao calcular estatísticas:', error);
    throw new Error(`Falha ao calcular estatísticas: ${error.message}`);
  }
};

// =========================================
// 🔍 PESQUISA AVANÇADA
// =========================================

/**
 * Pesquisa avançada de clientes
 */
export const searchClients = async (userId, searchTerm, options = {}) => {
  try {
    // Para pesquisa por texto, precisamos buscar todos e filtrar em memória
    // Em produção, consideraria usar Algolia ou similar para pesquisa full-text
    
    const { limit: limitParam = 20 } = options; // 🔥 CORREÇÃO: Renomear parâmetro
    
    // Buscar todos os clientes
    const q = query(
      getClientsCollection(userId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(100) // 🔥 CORREÇÃO: Usar firestoreLimit
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
      data: filtered.slice(0, limitParam), // 🔥 CORREÇÃO: Usar limitParam
      total: filtered.length,
      hasMore: filtered.length > limitParam // 🔥 CORREÇÃO: Usar limitParam
    };
    
  } catch (error) {
    console.error('Erro na pesquisa:', error);
    throw new Error(`Falha na pesquisa: ${error.message}`);
  }
};

// =========================================
// 🎯 OPERAÇÕES ESPECIAIS
// =========================================

/**
 * Adicionar tag a um cliente
 */
export const addTagToClient = async (userId, clientId, tag) => {
  try {
    const docRef = doc(getClientsCollection(userId), clientId);
    await updateDoc(docRef, {
      tags: arrayUnion(tag),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erro ao adicionar tag:', error);
    throw new Error(`Falha ao adicionar tag: ${error.message}`);
  }
};

/**
 * Remover tag de um cliente
 */
export const removeTagFromClient = async (userId, clientId, tag) => {
  try {
    const docRef = doc(getClientsCollection(userId), clientId);
    await updateDoc(docRef, {
      tags: arrayRemove(tag),
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erro ao remover tag:', error);
    throw new Error(`Falha ao remover tag: ${error.message}`);
  }
};

// =========================================
// 📤 EXPORTS
// =========================================

// Export default com todas as funções
export default {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  deleteMultipleClients,
  getClientStats,
  searchClients,
  addTagToClient,
  removeTagFromClient
};
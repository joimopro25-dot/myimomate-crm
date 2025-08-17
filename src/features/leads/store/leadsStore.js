// src/store/leadsStore.js
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  // Dados principais
  leads: [],
  leadsStats: {
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    converted: 0,
    lost: 0,
    newThisMonth: 0,
    averageScore: 0,
    conversionRate: 0
  },
  
  // Estados de controle
  loading: false,
  error: null,
  lastFetch: null,
  
  // Filtros e busca
  filters: {
    status: null,
    score: null,
    dateRange: null,
    tags: []
  },
  searchTerm: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  
  // Paginação
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
  
  // Cache e otimização
  cache: {
    timestamp: null,
    duration: 5 * 60 * 1000, // 5 minutos
    isValid: false
  }
};

export const use
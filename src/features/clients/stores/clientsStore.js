import { create } from 'zustand';

export const useClientsStore = create((set) => ({
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  
  setClients: (clients) => set({ clients }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
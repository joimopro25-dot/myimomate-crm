// =========================================
// 🎣 HOOK DOCUMENTOS - useClientDocuments
// =========================================
// Hook para gestão de documentos dos clientes
// Upload, organização, visualização e remoção

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useClientsStore } from '../stores/clientsStore';
import documentsService from '../services/documentsService';
import { DocumentCategory, FILE_LIMITS } from '../types/enums';

/**
 * Hook para gestão de documentos de clientes
 * @param {string} clientId - ID do cliente
 * @param {Object} options - Opções de configuração
 * @returns {Object} Estado e ações dos documentos
 */
export const useClientDocuments = (clientId, options = {}) => {
  const {
    autoFetch = true,
    enablePreview = true,
    enableDragDrop = true,
    maxFiles = 10,
    categoria = DocumentCategory.OUTROS
  } = options;

  const { user } = useAuth();
  const userId = user?.uid;

  // Store state
  const { selectedClient, updateClient } = useClientsStore();

  // Local state
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [previewDocument, setPreviewDocument] = useState(null);

  // =========================================
  // 📄 DOCUMENT MANAGEMENT
  // =========================================

  /**
   * Carregar documentos do cliente
   */
  const fetchDocuments = useCallback(async () => {
    if (!userId || !clientId) return;

    try {
      setLoading(true);
      setError(null);

      // Se cliente está carregado no store, usar documentos de lá
      if (selectedClient?.id === clientId && selectedClient.documentos) {
        setDocuments(selectedClient.documentos);
        return selectedClient.documentos;
      }

      // Caso contrário, buscar do Firebase Storage
      const docs = await documentsService.listClientDocuments(userId, clientId);
      
      // Se retornou objeto organizado por categoria, achatar
      const flatDocs = Array.isArray(docs) ? docs : Object.values(docs).flat();
      
      setDocuments(flatDocs);
      return flatDocs;

    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar documentos:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, clientId, selectedClient]);

  /**
   * Upload de documento único
   */
  const uploadDocument = useCallback(async (file, cat = categoria, onProgress = null) => {
    if (!userId || !clientId) throw new Error('Parâmetros inválidos');

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      // Validar arquivo
      const validation = documentsService.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Callback de progresso combinado
      const progressCallback = (progress) => {
        setUploadProgress(progress.progress);
        if (onProgress) onProgress(progress);
      };

      // Fazer upload
      const documentData = await documentsService.uploadDocument(
        userId,
        clientId,
        file,
        cat,
        progressCallback
      );

      // Atualizar estado local
      setDocuments(prev => [...prev, documentData]);

      // Atualizar no store/Firestore
      if (selectedClient?.id === clientId) {
        const updatedDocs = [...(selectedClient.documentos || []), documentData];
        await updateClient(clientId, { documentos: updatedDocs });
      }

      return documentData;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [userId, clientId, categoria, selectedClient, updateClient]);

  /**
   * Upload múltiplo de documentos
   */
  const uploadMultipleDocuments = useCallback(async (files, cat = categoria) => {
    if (!userId || !clientId) throw new Error('Parâmetros inválidos');

    try {
      setUploading(true);
      setError(null);
      
      // Adicionar arquivos à queue
      const queueItems = Array.from(files).map(file => ({
        file,
        categoria: cat,
        status: 'pending',
        progress: 0,
        error: null
      }));
      
      setUploadQueue(queueItems);

      // Callback de progresso geral
      const overallProgress = (fileIndex, fileProgress) => {
        setUploadQueue(prev => prev.map((item, index) => 
          index === fileIndex 
            ? { ...item, progress: fileProgress.progress, status: 'uploading' }
            : item
        ));
        
        // Calcular progresso total
        const totalProgress = Math.round(((fileIndex + fileProgress.progress / 100) / files.length) * 100);
        setUploadProgress(totalProgress);
      };

      // Upload cada arquivo
      const results = await documentsService.uploadMultipleDocuments(
        userId,
        clientId,
        files,
        cat,
        overallProgress
      );

      // Atualizar queue com resultados
      setUploadQueue(prev => prev.map((item, index) => ({
        ...item,
        status: results.results[index] ? 'completed' : 'error',
        error: results.errors[index] || null
      })));

      // Atualizar documentos locais
      setDocuments(prev => [...prev, ...results.results]);

      // Atualizar no store
      if (selectedClient?.id === clientId) {
        const updatedDocs = [...(selectedClient.documentos || []), ...results.results];
        await updateClient(clientId, { documentos: updatedDocs });
      }

      return results;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Limpar queue após delay
      setTimeout(() => setUploadQueue([]), 3000);
    }
  }, [userId, clientId, categoria, selectedClient, updateClient]);

  /**
   * Deletar documento
   */
  const deleteDocument = useCallback(async (documentId, storagePath) => {
    if (!userId || !clientId) throw new Error('Parâmetros inválidos');

    try {
      setLoading(true);
      setError(null);

      // Deletar do Storage
      if (storagePath) {
        await documentsService.deleteDocument(storagePath);
      }

      // Atualizar estado local
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));

      // Atualizar no store
      if (selectedClient?.id === clientId) {
        const updatedDocs = selectedClient.documentos?.filter(doc => doc.id !== documentId) || [];
        await updateClient(clientId, { documentos: updatedDocs });
      }

      return { success: true };

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, clientId, selectedClient, updateClient]);

  /**
   * Deletar múltiplos documentos
   */
  const deleteMultipleDocuments = useCallback(async (documentIds) => {
    if (!userId || !clientId) throw new Error('Parâmetros inválidos');

    try {
      setLoading(true);
      setError(null);

      const results = { deleted: 0, errors: [] };

      for (const docId of documentIds) {
        try {
          const doc = documents.find(d => d.id === docId);
          if (doc?.storagePath) {
            await documentsService.deleteDocument(doc.storagePath);
          }
          results.deleted++;
        } catch (err) {
          results.errors.push(`${docId}: ${err.message}`);
        }
      }

      // Atualizar estado local
      setDocuments(prev => prev.filter(doc => !documentIds.includes(doc.id)));

      // Atualizar no store
      if (selectedClient?.id === clientId) {
        const updatedDocs = selectedClient.documentos?.filter(
          doc => !documentIds.includes(doc.id)
        ) || [];
        await updateClient(clientId, { documentos: updatedDocs });
      }

      return results;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, clientId, documents, selectedClient, updateClient]);

  // =========================================
  // 👁️ PREVIEW & VISUALIZATION
  // =========================================

  /**
   * Abrir preview de documento
   */
  const openPreview = useCallback((document) => {
    if (!enablePreview) return;
    setPreviewDocument(document);
  }, [enablePreview]);

  /**
   * Fechar preview
   */
  const closePreview = useCallback(() => {
    setPreviewDocument(null);
  }, []);

  /**
   * Download de documento
   */
  const downloadDocument = useCallback(async (document) => {
    try {
      // Criar link temporário para download
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.nome;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Erro no download:', err);
      // Fallback: abrir em nova aba
      window.open(document.url, '_blank');
    }
  }, []);

  // =========================================
  // 📊 ORGANIZATION & STATS
  // =========================================

  /**
   * Organizar documentos por categoria
   */
  const organizeByCategory = useCallback(() => {
    const organized = {};
    
    Object.values(DocumentCategory).forEach(cat => {
      organized[cat] = documents.filter(doc => doc.categoria === cat);
    });
    
    return organized;
  }, [documents]);

  /**
   * Obter estatísticas de armazenamento
   */
  const getStorageStats = useCallback(() => {
    const stats = {
      totalFiles: documents.length,
      totalSize: documents.reduce((sum, doc) => sum + (doc.tamanho || 0), 0),
      byCategory: {},
      byType: {}
    };

    // Por categoria
    Object.values(DocumentCategory).forEach(cat => {
      const categoryDocs = documents.filter(doc => doc.categoria === cat);
      stats.byCategory[cat] = {
        count: categoryDocs.length,
        size: categoryDocs.reduce((sum, doc) => sum + (doc.tamanho || 0), 0)
      };
    });

    // Por tipo
    documents.forEach(doc => {
      const type = doc.tipo || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }, [documents]);

  // =========================================
  // 🎛️ DRAG & DROP
  // =========================================

  /**
   * Handler para drag & drop
   */
  const handleDrop = useCallback(async (droppedFiles) => {
    if (!enableDragDrop) return;

    try {
      const files = Array.from(droppedFiles);
      
      // Validar quantidade
      if (files.length > maxFiles) {
        throw new Error(`Máximo ${maxFiles} arquivos por vez`);
      }

      // Validar cada arquivo
      const validFiles = [];
      const errors = [];

      files.forEach(file => {
        const validation = documentsService.validateFile(file);
        if (validation.isValid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${validation.errors.join(', ')}`);
        }
      });

      if (errors.length > 0) {
        setError(`Alguns arquivos são inválidos:\n${errors.join('\n')}`);
      }

      if (validFiles.length > 0) {
        await uploadMultipleDocuments(validFiles);
      }

    } catch (err) {
      setError(err.message);
    }
  }, [enableDragDrop, maxFiles, uploadMultipleDocuments]);

  // =========================================
  // 🔄 EFFECTS
  // =========================================

  // Fetch inicial
  useEffect(() => {
    if (autoFetch && clientId) {
      fetchDocuments();
    }
  }, [autoFetch, clientId, fetchDocuments]);

  // Limpar preview ao mudar cliente
  useEffect(() => {
    setPreviewDocument(null);
  }, [clientId]);

  // =========================================
  // 📊 COMPUTED VALUES
  // =========================================

  const computedValues = useMemo(() => {
    const organized = organizeByCategory();
    const stats = getStorageStats();

    return {
      // Organization
      documentsByCategory: organized,
      
      // Stats
      totalDocuments: documents.length,
      totalSize: stats.totalSize,
      formattedSize: documentsService.formatFileSize(stats.totalSize),
      categoryStats: stats.byCategory,
      typeStats: stats.byType,
      
      // Status
      hasDocuments: documents.length > 0,
      isEmpty: documents.length === 0 && !loading,
      canUpload: !uploading && documents.length < FILE_LIMITS.MAX_FILES_PER_CLIENT,
      
      // Queue status
      queueActive: uploadQueue.length > 0,
      queueCompleted: uploadQueue.filter(item => item.status === 'completed').length,
      queueErrors: uploadQueue.filter(item => item.status === 'error').length,
      
      // Preview
      hasPreview: !!previewDocument,
      isPreviewImage: previewDocument && documentsService.isImageFile(previewDocument),
      isPreviewDocument: previewDocument && documentsService.isDocumentFile(previewDocument)
    };
  }, [documents, loading, uploading, uploadQueue, previewDocument, organizeByCategory, getStorageStats]);

  // =========================================
  // 🎯 RETURN OBJECT
  // =========================================

  return {
    // Data
    documents,
    previewDocument,
    uploadQueue,
    
    // Status
    loading,
    error,
    uploading,
    uploadProgress,
    
    // Computed
    ...computedValues,
    
    // Actions
    fetchDocuments,
    uploadDocument,
    uploadMultipleDocuments,
    deleteDocument,
    deleteMultipleDocuments,
    
    // Preview
    openPreview,
    closePreview,
    downloadDocument,
    
    // Organization
    organizeByCategory,
    getStorageStats,
    
    // Drag & Drop
    handleDrop,
    
    // Utils
    clearError: () => setError(null),
    clearQueue: () => setUploadQueue([])
  };
};

// =========================================
// 🎯 SPECIALIZED HOOKS
// =========================================

/**
 * Hook para categoria específica de documentos
 */
export const useCategoryDocuments = (clientId, categoria) => {
  const { documents, loading, error, ...rest } = useClientDocuments(clientId, {
    categoria,
    autoFetch: true
  });

  const categoryDocuments = useMemo(() => {
    return documents.filter(doc => doc.categoria === categoria);
  }, [documents, categoria]);

  return {
    documents: categoryDocuments,
    loading,
    error,
    ...rest
  };
};

/**
 * Hook para upload simples
 */
export const useSimpleUpload = (clientId) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const upload = useCallback(async (file, categoria = DocumentCategory.OUTROS) => {
    if (!user?.uid || !clientId) throw new Error('Parâmetros inválidos');

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const result = await documentsService.uploadDocument(
        user.uid,
        clientId,
        file,
        categoria,
        (progress) => setProgress(progress.progress)
      );

      return result;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [user?.uid, clientId]);

  return {
    upload,
    uploading,
    progress,
    error,
    clearError: () => setError(null)
  };
};

/**
 * Hook para visualização de documentos
 */
export const useDocumentViewer = () => {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDocument = useCallback((document) => {
    setCurrentDocument(document);
    setIsOpen(true);
  }, []);

  const closeDocument = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setCurrentDocument(null), 300); // Delay para animação
  }, []);

  const nextDocument = useCallback((documents) => {
    if (!currentDocument || !documents) return;
    
    const currentIndex = documents.findIndex(doc => doc.id === currentDocument.id);
    const nextIndex = (currentIndex + 1) % documents.length;
    setCurrentDocument(documents[nextIndex]);
  }, [currentDocument]);

  const prevDocument = useCallback((documents) => {
    if (!currentDocument || !documents) return;
    
    const currentIndex = documents.findIndex(doc => doc.id === currentDocument.id);
    const prevIndex = currentIndex === 0 ? documents.length - 1 : currentIndex - 1;
    setCurrentDocument(documents[prevIndex]);
  }, [currentDocument]);

  return {
    currentDocument,
    isOpen,
    openDocument,
    closeDocument,
    nextDocument,
    prevDocument
  };
};

export default useClientDocuments;
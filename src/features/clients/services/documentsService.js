// =========================================
// 📄 DOCUMENTS SERVICE - FIREBASE STORAGE
// =========================================
// Service completo para gestão de documentos dos clientes
// Firebase Storage + Firestore metadata

import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';

import {
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

import { storage, db, getUserStoragePath, getUserCollection } from '@/shared/services/firebase/config';

// =========================================
// 🎯 CONFIGURAÇÕES E CONSTANTES
// =========================================

export const DocumentCategory = {
  IDENTIDADE: 'identidade',
  FINANCEIRO: 'financeiro',
  JURIDICO: 'juridico',
  IMOVEL: 'imovel',
  CONTRATO: 'contrato',
  OUTROS: 'outros'
};

export const DocumentStatus = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  READY: 'ready',
  ERROR: 'error'
};

// Tipos de arquivo permitidos
export const ALLOWED_FILE_TYPES = {
  // Documentos
  'application/pdf': { ext: '.pdf', icon: '📄', maxSize: 10 },
  'application/msword': { ext: '.doc', icon: '📝', maxSize: 10 },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: '.docx', icon: '📝', maxSize: 10 },
  
  // Imagens
  'image/jpeg': { ext: '.jpg', icon: '🖼️', maxSize: 5 },
  'image/png': { ext: '.png', icon: '🖼️', maxSize: 5 },
  'image/webp': { ext: '.webp', icon: '🖼️', maxSize: 5 },
  
  // Planilhas
  'application/vnd.ms-excel': { ext: '.xls', icon: '📊', maxSize: 10 },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: '.xlsx', icon: '📊', maxSize: 10 },
  
  // Outros
  'text/plain': { ext: '.txt', icon: '📋', maxSize: 1 }
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_UPLOAD = 10;

// =========================================
// 🔍 UTILITY FUNCTIONS
// =========================================

/**
 * Validar arquivo antes do upload
 */
export const validateFile = (file) => {
  const errors = [];
  
  // Verificar se é um arquivo
  if (!file || !(file instanceof File)) {
    errors.push('Arquivo inválido');
    return { isValid: false, errors };
  }
  
  // Verificar tipo
  const allowedType = ALLOWED_FILE_TYPES[file.type];
  if (!allowedType) {
    errors.push(`Tipo de arquivo não permitido: ${file.type}`);
  }
  
  // Verificar tamanho
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  
  // Verificar nome
  if (!file.name || file.name.length > 255) {
    errors.push('Nome do arquivo inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: allowedType
  };
};

/**
 * Gerar nome único para o arquivo
 */
export const generateUniqueFileName = (originalName, clientId) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  return `${clientId}_${timestamp}_${random}_${safeName}.${extension}`;
};

/**
 * Verificar se é arquivo de imagem
 */
export const isImageFile = (file) => {
  if (typeof file === 'string') {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
  }
  return file?.type?.startsWith('image/');
};

/**
 * Verificar se é documento
 */
export const isDocumentFile = (file) => {
  if (typeof file === 'string') {
    return /\.(pdf|doc|docx|txt)$/i.test(file);
  }
  return file?.type?.includes('pdf') || 
         file?.type?.includes('document') || 
         file?.type?.includes('text');
};

/**
 * Obter ícone do arquivo baseado no tipo
 */
export const getFileIcon = (fileName, mimeType) => {
  if (mimeType && ALLOWED_FILE_TYPES[mimeType]) {
    return ALLOWED_FILE_TYPES[mimeType].icon;
  }
  
  const ext = fileName?.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return '📄';
    case 'doc':
    case 'docx': return '📝';
    case 'xls':
    case 'xlsx': return '📊';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp': return '🖼️';
    default: return '📋';
  }
};

/**
 * Formatar tamanho do arquivo
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// =========================================
// 📤 OPERAÇÕES DE UPLOAD
// =========================================

/**
 * Upload de documento único
 */
export const uploadDocument = async (userId, clientId, file, categoria = DocumentCategory.OUTROS, onProgress = null) => {
  try {
    // Validar parâmetros
    if (!userId || !clientId || !file) {
      throw new Error('Parâmetros obrigatórios: userId, clientId, file');
    }
    
    // Validar arquivo
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(`Arquivo inválido: ${validation.errors.join(', ')}`);
    }
    
    // Gerar nome único
    const uniqueFileName = generateUniqueFileName(file.name, clientId);
    const storagePath = `${getUserStoragePath(userId, 'documents')}/${clientId}/${categoria}/${uniqueFileName}`;
    
    // Criar referência no Storage
    const storageRef = ref(storage, storagePath);
    
    // Metadados do arquivo
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        clientId: clientId,
        categoria: categoria,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString()
      }
    };
    
    // Upload com progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        // Progress callback
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress({
              progress: Math.round(progress),
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              state: snapshot.state
            });
          }
        },
        // Error callback
        (error) => {
          console.error('Erro no upload:', error);
          reject(new Error(`Falha no upload: ${error.message}`));
        },
        // Success callback
        async () => {
          try {
            // Obter URL de download
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Criar documento no Firestore
            const documentData = {
              id: uniqueFileName.split('.')[0], // ID único sem extensão
              nome: file.name,
              nomeUnico: uniqueFileName,
              categoria: categoria,
              tipo: file.type,
              tamanho: file.size,
              url: downloadURL,
              storagePath: storagePath,
              clientId: clientId,
              status: DocumentStatus.READY,
              uploadedBy: userId,
              uploadedAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              metadata: {
                originalName: file.name,
                fileExtension: file.name.split('.').pop(),
                isImage: isImageFile(file),
                isDocument: isDocumentFile(file),
                icon: getFileIcon(file.name, file.type),
                sizeFormatted: formatFileSize(file.size)
              }
            };
            
            // Salvar metadados no Firestore
            const documentsCollection = collection(db, getUserCollection(userId, 'documents'));
            const docRef = await addDoc(documentsCollection, documentData);
            
            const finalDocument = {
              ...documentData,
              id: docRef.id,
              firestoreId: docRef.id
            };
            
            resolve(finalDocument);
            
          } catch (error) {
            console.error('Erro ao salvar metadados:', error);
            reject(new Error(`Falha ao salvar metadados: ${error.message}`));
          }
        }
      );
    });
    
  } catch (error) {
    console.error('Erro no uploadDocument:', error);
    throw new Error(`Falha no upload: ${error.message}`);
  }
};

/**
 * Upload múltiplo de documentos
 */
export const uploadMultipleDocuments = async (userId, clientId, files, categoria = DocumentCategory.OUTROS, callbacks = {}) => {
  try {
    const { onProgress, onFileComplete, onAllComplete } = callbacks;
    
    // Validar parâmetros
    if (!userId || !clientId || !files || files.length === 0) {
      throw new Error('Parâmetros inválidos');
    }
    
    // Verificar limite de arquivos
    if (files.length > MAX_FILES_PER_UPLOAD) {
      throw new Error(`Máximo ${MAX_FILES_PER_UPLOAD} arquivos por upload`);
    }
    
    const results = [];
    const errors = [];
    
    // Upload sequencial para melhor controle
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await uploadDocument(userId, clientId, file, categoria, (progress) => {
          const fileProgress = progress.progress / files.length;
          const currentTotal = (i * 100 + progress.progress) / files.length;
          
          if (onProgress) {
            onProgress({
              currentFile: i + 1,
              totalFiles: files.length,
              fileName: file.name,
              fileProgress: progress.progress,
              totalProgress: Math.round(currentTotal),
              bytesTransferred: progress.bytesTransferred,
              totalBytes: progress.totalBytes
            });
          }
        });
        
        results.push(result);
        
        if (onFileComplete) {
          onFileComplete(file.name, result, null);
        }
        
      } catch (error) {
        const errorInfo = { 
          fileName: file.name, 
          error: error.message,
          index: i 
        };
        errors.push(errorInfo);
        
        if (onFileComplete) {
          onFileComplete(file.name, null, error.message);
        }
      }
    }
    
    const finalResult = {
      success: results,
      errors,
      totalUploaded: results.length,
      totalFailed: errors.length,
      totalFiles: files.length
    };
    
    if (onAllComplete) {
      onAllComplete(finalResult);
    }
    
    return finalResult;
    
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    throw new Error(`Falha no upload múltiplo: ${error.message}`);
  }
};

// =========================================
// 📥 OPERAÇÕES DE LISTAGEM E DOWNLOAD
// =========================================

/**
 * Listar documentos de um cliente
 */
export const getClientDocuments = async (userId, clientId, filters = {}) => {
  try {
    if (!userId || !clientId) {
      throw new Error('userId e clientId são obrigatórios');
    }
    
    const documentsCollection = collection(db, getUserCollection(userId, 'documents'));
    
    // Construir query
    let q = query(
      documentsCollection,
      where('clientId', '==', clientId),
      orderBy('uploadedAt', 'desc')
    );
    
    // Aplicar filtros
    if (filters.categoria) {
      q = query(q, where('categoria', '==', filters.categoria));
    }
    
    if (filters.tipo) {
      q = query(q, where('tipo', '==', filters.tipo));
    }
    
    // Executar query
    const snapshot = await getDocs(q);
    
    const documents = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      documents.push({
        ...data,
        id: doc.id,
        firestoreId: doc.id,
        uploadedAt: data.uploadedAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });
    
    return documents;
    
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    throw new Error(`Falha ao carregar documentos: ${error.message}`);
  }
};

/**
 * Obter documento específico
 */
export const getDocument = async (userId, documentId) => {
  try {
    if (!userId || !documentId) {
      throw new Error('userId e documentId são obrigatórios');
    }
    
    const docRef = doc(db, getUserCollection(userId, 'documents'), documentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Documento não encontrado');
    }
    
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      uploadedAt: data.uploadedAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
    
  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    throw new Error(`Falha ao carregar documento: ${error.message}`);
  }
};

/**
 * Obter URL de download (já está disponível nos metadados)
 */
export const getDownloadUrl = async (userId, documentId) => {
  try {
    const document = await getDocument(userId, documentId);
    
    if (!document.url) {
      throw new Error('URL de download não disponível');
    }
    
    return {
      url: document.url,
      fileName: document.nome,
      contentType: document.tipo,
      size: document.tamanho
    };
    
  } catch (error) {
    console.error('Erro ao obter URL de download:', error);
    throw new Error(`Falha ao obter URL: ${error.message}`);
  }
};

// =========================================
// 🗑️ OPERAÇÕES DE REMOÇÃO
// =========================================

/**
 * Deletar documento
 */
export const deleteDocument = async (userId, documentId) => {
  try {
    if (!userId || !documentId) {
      throw new Error('userId e documentId são obrigatórios');
    }
    
    // Buscar dados do documento
    const documentData = await getDocument(userId, documentId);
    
    // Deletar do Storage
    if (documentData.storagePath) {
      const storageRef = ref(storage, documentData.storagePath);
      await deleteObject(storageRef);
    }
    
    // Deletar metadados do Firestore
    const docRef = doc(db, getUserCollection(userId, 'documents'), documentId);
    await deleteDoc(docRef);
    
    return { 
      success: true, 
      message: 'Documento deletado com sucesso',
      deletedDocument: documentData
    };
    
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    throw new Error(`Falha ao deletar documento: ${error.message}`);
  }
};

/**
 * Deletar múltiplos documentos
 */
export const deleteMultipleDocuments = async (userId, documentIds) => {
  try {
    if (!userId || !documentIds || documentIds.length === 0) {
      throw new Error('Parâmetros inválidos');
    }
    
    const results = [];
    const errors = [];
    
    // Deletar sequencialmente
    for (const documentId of documentIds) {
      try {
        const result = await deleteDocument(userId, documentId);
        results.push({ documentId, ...result });
      } catch (error) {
        errors.push({ 
          documentId, 
          error: error.message 
        });
      }
    }
    
    return {
      success: results,
      errors,
      totalDeleted: results.length,
      totalFailed: errors.length,
      totalProcessed: documentIds.length
    };
    
  } catch (error) {
    console.error('Erro ao deletar múltiplos documentos:', error);
    throw new Error(`Falha na deleção múltipla: ${error.message}`);
  }
};

// =========================================
// 📊 OPERAÇÕES DE ESTATÍSTICAS
// =========================================

/**
 * Obter estatísticas de documentos do cliente
 */
export const getDocumentStats = async (userId, clientId) => {
  try {
    if (!userId || !clientId) {
      throw new Error('userId e clientId são obrigatórios');
    }
    
    const documents = await getClientDocuments(userId, clientId);
    
    // Calcular estatísticas
    const stats = documents.reduce((acc, doc) => {
      acc.total++;
      acc.totalSize += doc.tamanho || 0;
      
      // Por categoria
      acc.byCategory[doc.categoria] = (acc.byCategory[doc.categoria] || 0) + 1;
      
      // Por tipo
      const fileType = doc.tipo?.split('/')[0] || 'unknown';
      acc.byType[fileType] = (acc.byType[fileType] || 0) + 1;
      
      // Por status
      acc.byStatus[doc.status] = (acc.byStatus[doc.status] || 0) + 1;
      
      return acc;
    }, {
      total: 0,
      totalSize: 0,
      totalSizeFormatted: '',
      byCategory: {},
      byType: {},
      byStatus: {},
      lastUpload: null
    });
    
    // Formatar tamanho total
    stats.totalSizeFormatted = formatFileSize(stats.totalSize);
    
    // Último upload
    if (documents.length > 0) {
      stats.lastUpload = documents[0].uploadedAt; // Já ordenado por data desc
    }
    
    return stats;
    
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    throw new Error(`Falha ao calcular estatísticas: ${error.message}`);
  }
};

// =========================================
// 🔄 OPERAÇÕES DE ORGANIZAÇÃO
// =========================================

/**
 * Organizar documentos por categoria
 */
export const organizeByCategory = (documents) => {
  return documents.reduce((acc, doc) => {
    const categoria = doc.categoria || DocumentCategory.OUTROS;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(doc);
    return acc;
  }, {});
};

/**
 * Atualizar categoria de documento
 */
export const updateDocumentCategory = async (userId, documentId, newCategory) => {
  try {
    if (!userId || !documentId || !newCategory) {
      throw new Error('Parâmetros obrigatórios');
    }
    
    if (!Object.values(DocumentCategory).includes(newCategory)) {
      throw new Error('Categoria inválida');
    }
    
    const docRef = doc(db, getUserCollection(userId, 'documents'), documentId);
    await updateDoc(docRef, {
      categoria: newCategory,
      updatedAt: serverTimestamp()
    });
    
    return await getDocument(userId, documentId);
    
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    throw new Error(`Falha ao atualizar categoria: ${error.message}`);
  }
};

/**
 * Mover documento para nova categoria (com reorganização no Storage)
 */
export const moveDocumentToCategory = async (userId, documentId, newCategory) => {
  try {
    if (!userId || !documentId || !newCategory) {
      throw new Error('Parâmetros obrigatórios');
    }
    
    // Buscar documento atual
    const document = await getDocument(userId, documentId);
    
    if (!document.storagePath) {
      // Se não tem storage path, apenas atualizar categoria
      return await updateDocumentCategory(userId, documentId, newCategory);
    }
    
    // Criar novo path no Storage
    const pathParts = document.storagePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const clientId = document.clientId;
    
    const newStoragePath = `${getUserStoragePath(userId, 'documents')}/${clientId}/${newCategory}/${fileName}`;
    
    // Se o path já é o mesmo, apenas atualizar metadados
    if (document.storagePath === newStoragePath) {
      return await updateDocumentCategory(userId, documentId, newCategory);
    }
    
    // Copiar arquivo para novo local
    const oldRef = ref(storage, document.storagePath);
    const newRef = ref(storage, newStoragePath);
    
    // Por limitações do Firebase, precisamos baixar e fazer re-upload
    // Em ambiente real, consideraria usar Cloud Functions para isso
    const url = await getDownloadURL(oldRef);
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Upload para novo local
    await uploadBytesResumable(newRef, blob);
    
    // Obter nova URL
    const newUrl = await getDownloadURL(newRef);
    
    // Atualizar documento no Firestore
    const docRef = doc(db, getUserCollection(userId, 'documents'), documentId);
    await updateDoc(docRef, {
      categoria: newCategory,
      storagePath: newStoragePath,
      url: newUrl,
      updatedAt: serverTimestamp()
    });
    
    // Deletar arquivo antigo
    await deleteObject(oldRef);
    
    return await getDocument(userId, documentId);
    
  } catch (error) {
    console.error('Erro ao mover documento:', error);
    throw new Error(`Falha ao mover documento: ${error.message}`);
  }
};

// =========================================
// 🔍 OPERAÇÕES DE PESQUISA
// =========================================

/**
 * Pesquisar documentos por nome
 */
export const searchDocuments = async (userId, clientId, searchTerm, options = {}) => {
  try {
    if (!userId || !searchTerm?.trim()) {
      return [];
    }
    
    // Buscar todos os documentos do cliente
    const documents = await getClientDocuments(userId, clientId);
    
    const term = searchTerm.toLowerCase().trim();
    
    // Filtrar por termo de pesquisa
    const filtered = documents.filter(doc => {
      const nameMatch = doc.nome?.toLowerCase().includes(term);
      const categoryMatch = doc.categoria?.toLowerCase().includes(term);
      const typeMatch = doc.tipo?.toLowerCase().includes(term);
      
      return nameMatch || categoryMatch || typeMatch;
    });
    
    // Aplicar filtros adicionais
    let result = filtered;
    
    if (options.categoria) {
      result = result.filter(doc => doc.categoria === options.categoria);
    }
    
    if (options.tipo) {
      result = result.filter(doc => doc.tipo?.includes(options.tipo));
    }
    
    if (options.dateFrom) {
      result = result.filter(doc => doc.uploadedAt >= options.dateFrom);
    }
    
    if (options.dateTo) {
      result = result.filter(doc => doc.uploadedAt <= options.dateTo);
    }
    
    // Ordenar por relevância (nome exato primeiro)
    result.sort((a, b) => {
      const aNameExact = a.nome?.toLowerCase() === term;
      const bNameExact = b.nome?.toLowerCase() === term;
      
      if (aNameExact && !bNameExact) return -1;
      if (!aNameExact && bNameExact) return 1;
      
      // Por data se relevância igual
      return b.uploadedAt - a.uploadedAt;
    });
    
    return result;
    
  } catch (error) {
    console.error('Erro na pesquisa de documentos:', error);
    throw new Error(`Falha na pesquisa: ${error.message}`);
  }
};

// =========================================
// 🔄 OPERAÇÕES DE SINCRONIZAÇÃO
// =========================================

/**
 * Sincronizar documentos (verificar integridade)
 */
export const syncDocuments = async (userId, clientId) => {
  try {
    if (!userId || !clientId) {
      throw new Error('userId e clientId são obrigatórios');
    }
    
    // Buscar documentos no Firestore
    const firestoreDocuments = await getClientDocuments(userId, clientId);
    
    const syncResults = {
      total: firestoreDocuments.length,
      valid: 0,
      invalid: 0,
      orphaned: 0,
      errors: []
    };
    
    // Verificar cada documento
    for (const doc of firestoreDocuments) {
      try {
        if (doc.storagePath) {
          // Verificar se arquivo existe no Storage
          const storageRef = ref(storage, doc.storagePath);
          await getMetadata(storageRef);
          syncResults.valid++;
        } else {
          // Documento sem storage path
          syncResults.orphaned++;
          syncResults.errors.push({
            documentId: doc.id,
            issue: 'Missing storage path',
            fileName: doc.nome
          });
        }
      } catch (error) {
        // Arquivo não existe no Storage
        syncResults.invalid++;
        syncResults.errors.push({
          documentId: doc.id,
          issue: 'File not found in storage',
          fileName: doc.nome,
          error: error.message
        });
      }
    }
    
    return syncResults;
    
  } catch (error) {
    console.error('Erro na sincronização:', error);
    throw new Error(`Falha na sincronização: ${error.message}`);
  }
};

/**
 * Limpar documentos órfãos (metadados sem arquivo)
 */
export const cleanOrphanedDocuments = async (userId, clientId) => {
  try {
    const syncResults = await syncDocuments(userId, clientId);
    
    const orphanedIds = syncResults.errors
      .filter(error => error.issue === 'File not found in storage')
      .map(error => error.documentId);
    
    if (orphanedIds.length === 0) {
      return { message: 'Nenhum documento órfão encontrado', cleaned: 0 };
    }
    
    // Deletar apenas os metadados (arquivo já não existe)
    const deleteResults = [];
    for (const docId of orphanedIds) {
      try {
        const docRef = doc(db, getUserCollection(userId, 'documents'), docId);
        await deleteDoc(docRef);
        deleteResults.push(docId);
      } catch (error) {
        console.error(`Erro ao deletar documento órfão ${docId}:`, error);
      }
    }
    
    return {
      message: `${deleteResults.length} documentos órfãos removidos`,
      cleaned: deleteResults.length,
      errors: orphanedIds.length - deleteResults.length
    };
    
  } catch (error) {
    console.error('Erro na limpeza de órfãos:', error);
    throw new Error(`Falha na limpeza: ${error.message}`);
  }
};

// =========================================
// 📋 OPERAÇÕES BATCH
// =========================================

/**
 * Operação batch para múltiplas ações
 */
export const batchDocumentOperations = async (userId, operations) => {
  try {
    if (!userId || !operations || operations.length === 0) {
      throw new Error('Parâmetros inválidos');
    }
    
    const results = [];
    const errors = [];
    
    for (const operation of operations) {
      try {
        let result;
        
        switch (operation.type) {
          case 'delete':
            result = await deleteDocument(userId, operation.documentId);
            break;
          case 'updateCategory':
            result = await updateDocumentCategory(userId, operation.documentId, operation.categoria);
            break;
          case 'move':
            result = await moveDocumentToCategory(userId, operation.documentId, operation.categoria);
            break;
          default:
            throw new Error(`Operação não suportada: ${operation.type}`);
        }
        
        results.push({
          operation: operation.type,
          documentId: operation.documentId,
          success: true,
          result
        });
        
      } catch (error) {
        errors.push({
          operation: operation.type,
          documentId: operation.documentId,
          success: false,
          error: error.message
        });
      }
    }
    
    return {
      results,
      errors,
      totalProcessed: operations.length,
      successCount: results.length,
      errorCount: errors.length
    };
    
  } catch (error) {
    console.error('Erro na operação batch:', error);
    throw new Error(`Falha na operação batch: ${error.message}`);
  }
};

// =========================================
// 🎯 EXPORTS
// =========================================

export default {
  // Upload operations
  uploadDocument,
  uploadMultipleDocuments,
  
  // List and fetch operations
  getClientDocuments,
  getDocument,
  getDownloadUrl,
  
  // Delete operations
  deleteDocument,
  deleteMultipleDocuments,
  
  // Organization operations
  organizeByCategory,
  updateDocumentCategory,
  moveDocumentToCategory,
  
  // Search operations
  searchDocuments,
  
  // Stats operations
  getDocumentStats,
  
  // Sync operations
  syncDocuments,
  cleanOrphanedDocuments,
  
  // Batch operations
  batchDocumentOperations,
  
  // Utility functions
  validateFile,
  isImageFile,
  isDocumentFile,
  getFileIcon,
  formatFileSize,
  generateUniqueFileName,
  
  // Constants
  DocumentCategory,
  DocumentStatus,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES_PER_UPLOAD
};
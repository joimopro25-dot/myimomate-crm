// =========================================
// 📄 FIREBASE SERVICE - DOCUMENTOS
// =========================================
// Service para gestão de documentos no Firebase Storage
// Upload, download, organização e metadados

import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  getMetadata
} from 'firebase/storage';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp 
} from 'firebase/firestore';
import { storage, db } from '@/shared/services/firebase/config';
import { DocumentCategory, FILE_LIMITS } from '../types/enums';

// =========================================
// 🏗️ CONFIGURAÇÕES BASE
// =========================================

const STORAGE_PATHS = {
  DOCUMENTS: 'documents',
  TEMP: 'temp',
  THUMBNAILS: 'thumbnails'
};

/**
 * Obter path do storage para documento do cliente
 */
const getDocumentPath = (userId, clientId, fileName) => {
  return `users/${userId}/${STORAGE_PATHS.DOCUMENTS}/${clientId}/${fileName}`;
};

/**
 * Obter path do storage para thumbnail
 */
const getThumbnailPath = (userId, clientId, fileName) => {
  const nameWithoutExt = fileName.split('.').slice(0, -1).join('.');
  return `users/${userId}/${STORAGE_PATHS.THUMBNAILS}/${clientId}/${nameWithoutExt}_thumb.jpg`;
};

/**
 * Obter referência da coleção de clientes
 */
const getClientDoc = (userId, clientId) => {
  return doc(db, 'users', userId, 'clients', clientId);
};

// =========================================
// 🔍 VALIDAÇÃO DE ARQUIVOS
// =========================================

/**
 * Validar arquivo antes do upload
 */
export const validateFile = (file) => {
  const errors = [];
  
  // Verificar tamanho
  if (file.size > FILE_LIMITS.MAX_SIZE) {
    errors.push(`Arquivo muito grande. Máximo: ${formatFileSize(FILE_LIMITS.MAX_SIZE)}`);
  }
  
  // Verificar tipo
  if (!FILE_LIMITS.ALLOWED_TYPES.includes(file.type)) {
    errors.push('Tipo de arquivo não permitido');
  }
  
  // Verificar nome
  if (!file.name || file.name.length > 255) {
    errors.push('Nome do arquivo inválido');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Gerar nome único para arquivo
 */
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
  
  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
};

/**
 * Categorizar documento automaticamente baseado no nome
 */
export const categorizeDocument = (fileName) => {
  const nameLower = fileName.toLowerCase();
  
  if (nameLower.includes('cartao') || nameLower.includes('cc') || nameLower.includes('cidadao')) {
    return DocumentCategory.CARTAO_CIDADAO;
  }
  
  if (nameLower.includes('nif') || nameLower.includes('contribuinte')) {
    return DocumentCategory.NIF;
  }
  
  if (nameLower.includes('morada') || nameLower.includes('residencia') || nameLower.includes('comprovativo')) {
    return DocumentCategory.COMPROVATIVO_MORADA;
  }
  
  if (nameLower.includes('iban') || nameLower.includes('banco') || nameLower.includes('conta')) {
    return DocumentCategory.COMPROVATIVO_IBAN;
  }
  
  if (nameLower.includes('salario') || nameLower.includes('vencimento') || nameLower.includes('rendimento')) {
    return DocumentCategory.COMPROVATIVO_RENDIMENTOS;
  }
  
  if (nameLower.includes('contrato')) {
    return DocumentCategory.CONTRATO;
  }
  
  return DocumentCategory.OUTROS;
};

// =========================================
// 🔥 OPERAÇÕES DE UPLOAD
// =========================================

/**
 * Upload de documento com progress tracking
 */
export const uploadDocument = async (userId, clientId, file, options = {}) => {
  try {
    const {
      categoria = categorizeDocument(file.name),
      onProgress = null,
      generateThumbnail = false
    } = options;
    
    // Validar arquivo
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Gerar nome único
    const uniqueFileName = generateUniqueFileName(file.name);
    const storagePath = getDocumentPath(userId, clientId, uniqueFileName);
    const storageRef = ref(storage, storagePath);
    
    // Upload com progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress callback
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Error callback
          console.error('Erro no upload:', error);
          reject(new Error(`Falha no upload: ${error.message}`));
        },
        async () => {
          try {
            // Success callback
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const metadata = await getMetadata(uploadTask.snapshot.ref);
            
            // Criar objeto documento
            const documentData = {
              id: `doc_${Date.now()}`,
              nome: file.name,
              nomeUnico: uniqueFileName,
              categoria,
              tipo: file.type,
              tamanho: file.size,
              url: downloadURL,
              storagePath,
              uploadedAt: serverTimestamp(),
              uploadedBy: userId,
              metadata: {
                contentType: metadata.contentType,
                timeCreated: metadata.timeCreated,
                updated: metadata.updated
              }
            };
            
            // Atualizar documento do cliente no Firestore
            const clientDocRef = getClientDoc(userId, clientId);
            await updateDoc(clientDocRef, {
              documentos: arrayUnion(documentData),
              updatedAt: serverTimestamp(),
              updatedBy: userId
            });
            
            resolve(documentData);
            
          } catch (error) {
            reject(new Error(`Falha ao salvar metadados: ${error.message}`));
          }
        }
      );
    });
    
  } catch (error) {
    console.error('Erro no upload de documento:', error);
    throw new Error(`Falha no upload: ${error.message}`);
  }
};

/**
 * Upload múltiplo de documentos
 */
export const uploadMultipleDocuments = async (userId, clientId, files, options = {}) => {
  try {
    const {
      onProgress = null,
      onFileComplete = null
    } = options;
    
    const results = [];
    const errors = [];
    let totalProgress = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await uploadDocument(userId, clientId, file, {
          onProgress: (progress) => {
            const fileProgress = progress / files.length;
            const currentTotal = (i * 100 + progress) / files.length;
            
            if (onProgress) {
              onProgress(currentTotal);
            }
          }
        });
        
        results.push(result);
        
        if (onFileComplete) {
          onFileComplete(file.name, result, null);
        }
        
      } catch (error) {
        errors.push({ fileName: file.name, error: error.message });
        
        if (onFileComplete) {
          onFileComplete(file.name, null, error.message);
        }
      }
    }
    
    return {
      success: results,
      errors,
      totalUploaded: results.length,
      totalFailed: errors.length
    };
    
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    throw new Error(`Falha no upload múltiplo: ${error.message}`);
  }
};

// =========================================
// 📥 OPERAÇÕES DE DOWNLOAD
// =========================================

/**
 * Obter URL de download temporária
 */
export const getDownloadUrl = async (userId, clientId, documentId) => {
  try {
    // Esta operação já retorna a URL permanente do Firebase
    // Para URLs temporárias, usaríamos Cloud Functions
    
    // Por agora, retornamos a URL permanente que já está salva
    // Em produção, consideraria implementar Cloud Functions para URLs assinadas
    
    return {
      url: documentData.url, // URL já está disponível nos metadados
      expires: new Date(Date.now() + 3600000).toISOString() // 1 hora
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
export const deleteDocument = async (userId, clientId, documentData) => {
  try {
    // Deletar do Storage
    const storageRef = ref(storage, documentData.storagePath);
    await deleteObject(storageRef);
    
    // Remover do Firestore
    const clientDocRef = getClientDoc(userId, clientId);
    await updateDoc(clientDocRef, {
      documentos: arrayRemove(documentData),
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
    
    return { success: true, message: 'Documento deletado com sucesso' };
    
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    throw new Error(`Falha ao deletar documento: ${error.message}`);
  }
};

/**
 * Deletar múltiplos documentos
 */
export const deleteMultipleDocuments = async (userId, clientId, documentsData) => {
  try {
    const results = [];
    const errors = [];
    
    for (const documentData of documentsData) {
      try {
        await deleteDocument(userId, clientId, documentData);
        results.push(documentData.nome);
      } catch (error) {
        errors.push({ fileName: documentData.nome, error: error.message });
      }
    }
    
    return {
      success: results,
      errors,
      totalDeleted: results.length,
      totalFailed: errors.length
    };
    
  } catch (error) {
    console.error('Erro ao deletar múltiplos documentos:', error);
    throw new Error(`Falha na remoção múltipla: ${error.message}`);
  }
};

// =========================================
// 📋 OPERAÇÕES DE LISTAGEM
// =========================================

/**
 * Listar documentos de um cliente
 */
export const listClientDocuments = async (userId, clientId) => {
  try {
    // Os documentos já estão listados no documento do cliente no Firestore
    // Esta função é principalmente para verificar se os arquivos ainda existem no Storage
    
    const documentsPath = `users/${userId}/${STORAGE_PATHS.DOCUMENTS}/${clientId}/`;
    const documentsRef = ref(storage, documentsPath);
    
    const result = await listAll(documentsRef);
    
    const documents = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated
        };
      })
    );
    
    return documents;
    
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    throw new Error(`Falha ao listar documentos: ${error.message}`);
  }
};

// =========================================
// 🎨 OPERAÇÕES DE PREVIEW
// =========================================

/**
 * Gerar preview do documento
 */
export const generatePreview = async (file) => {
  try {
    if (file.type.startsWith('image/')) {
      // Para imagens, criar preview local
      return {
        type: 'image',
        url: URL.createObjectURL(file),
        cleanup: () => URL.revokeObjectURL(url)
      };
    }
    
    if (file.type === 'application/pdf') {
      // Para PDFs, em produção usaríamos PDF.js ou similar
      return {
        type: 'pdf',
        icon: '📄',
        pages: 'Desconhecido',
        preview: null
      };
    }
    
    // Para outros tipos, retornar ícone baseado no tipo
    return {
      type: 'file',
      icon: getFileIcon(file.type),
      preview: null
    };
    
  } catch (error) {
    console.error('Erro ao gerar preview:', error);
    return null;
  }
};

// =========================================
// 🔧 FUNÇÕES UTILITÁRIAS
// =========================================

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

/**
 * Obter ícone do tipo de arquivo
 */
export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
  if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
  return '📁';
};

/**
 * Obter extensão do arquivo
 */
export const getFileExtension = (fileName) => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Verificar se arquivo é imagem
 */
export const isImageFile = (fileType) => {
  return fileType.startsWith('image/');
};

/**
 * Verificar se arquivo é PDF
 */
export const isPdfFile = (fileType) => {
  return fileType === 'application/pdf';
};

// Export default com todas as funções
export default {
  validateFile,
  categorizeDocument,
  uploadDocument,
  uploadMultipleDocuments,
  getDownloadUrl,
  deleteDocument,
  deleteMultipleDocuments,
  listClientDocuments,
  generatePreview,
  formatFileSize,
  getFileIcon,
  getFileExtension,
  isImageFile,
  isPdfFile
};
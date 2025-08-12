// =========================================
// 📄 DOCUMENTS SERVICE - MÓDULO CLIENTES
// =========================================
// Service para upload, gestão e organização de documentos
// Firebase Storage + Firestore para metadados

import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from '@/shared/services/firebase/config';
import { FILE_LIMITS, DocumentCategory } from '../types/enums';

// =========================================
// 🏗️ CONFIGURAÇÕES E HELPERS
// =========================================

/**
 * Gerar caminho único para o arquivo no Storage
 */
const generateStoragePath = (userId, clientId, fileName, categoria) => {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `users/${userId}/clients/${clientId}/documents/${categoria}/${timestamp}_${cleanFileName}`;
};

/**
 * Validar arquivo antes do upload
 */
const validateFile = (file) => {
  const errors = [];
  
  // Verificar tamanho
  if (file.size > FILE_LIMITS.MAX_SIZE) {
    errors.push(`Arquivo muito grande. Máximo permitido: ${FILE_LIMITS.MAX_SIZE / 1024 / 1024}MB`);
  }
  
  // Verificar tipo
  if (!FILE_LIMITS.ALLOWED_TYPES.includes(file.type)) {
    errors.push(`Tipo de arquivo não permitido: ${file.type}`);
  }
  
  // Verificar se arquivo existe
  if (!file || file.size === 0) {
    errors.push('Arquivo inválido ou vazio');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Extrair informações do arquivo
 */
const extractFileInfo = (file) => {
  return {
    nome: file.name,
    tipo: file.type,
    tamanho: file.size,
    ultimaModificacao: new Date(file.lastModified)
  };
};

/**
 * Gerar thumbnail/preview (para imagens)
 */
const generatePreview = (file) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

// =========================================
// 📤 OPERAÇÕES DE UPLOAD
// =========================================

/**
 * Upload de documento único com progress
 */
export const uploadDocument = async (
  userId,
  clientId,
  file,
  categoria = DocumentCategory.OUTROS,
  onProgress = null
) => {
  try {
    // Validar arquivo
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Gerar caminho único
    const storagePath = generateStoragePath(userId, clientId, file.name, categoria);
    const storageRef = ref(storage, storagePath);
    
    // Extrair informações do arquivo
    const fileInfo = extractFileInfo(file);
    
    // Gerar preview se for imagem
    const preview = await generatePreview(file);
    
    // Criar task de upload com progress
    const uploadTask = uploadBytesResumable(storageRef, file, {
      customMetadata: {
        clientId,
        categoria,
        uploadedBy: userId,
        originalName: file.name
      }
    });
    
    // Promise para monitorar o upload
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
            
            // Obter metadados completos
            const metadata = await getMetadata(uploadTask.snapshot.ref);
            
            // Montar objeto do documento
            const documentData = {
              id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              nome: fileInfo.nome,
              tipo: fileInfo.tipo,
              categoria,
              url: downloadURL,
              tamanho: fileInfo.tamanho,
              storagePath,
              preview,
              metadata: {
                timeCreated: metadata.timeCreated,
                updated: metadata.updated,
                md5Hash: metadata.md5Hash,
                etag: metadata.etag
              },
              dataUpload: new Date(),
              uploadedBy: userId
            };
            
            resolve(documentData);
            
          } catch (error) {
            reject(new Error(`Erro ao finalizar upload: ${error.message}`));
          }
        }
      );
    });
    
  } catch (error) {
    console.error('Erro no upload de documento:', error);
    throw error;
  }
};

/**
 * Upload múltiplo de documentos
 */
export const uploadMultipleDocuments = async (
  userId,
  clientId,
  files,
  categoria = DocumentCategory.OUTROS,
  onProgress = null
) => {
  try {
    const results = [];
    const errors = [];
    
    // Validar todos os arquivos primeiro
    for (let i = 0; i < files.length; i++) {
      const validation = validateFile(files[i]);
      if (!validation.isValid) {
        errors.push(`${files[i].name}: ${validation.errors.join(', ')}`);
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Arquivos inválidos:\n${errors.join('\n')}`);
    }
    
    // Upload cada arquivo
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await uploadDocument(
          userId,
          clientId,
          file,
          categoria,
          (fileProgress) => {
            if (onProgress) {
              onProgress({
                fileIndex: i,
                fileName: file.name,
                fileProgress: fileProgress.progress,
                overallProgress: Math.round(((i + fileProgress.progress / 100) / files.length) * 100),
                totalFiles: files.length,
                completedFiles: i
              });
            }
          }
        );
        
        results.push(result);
        
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`);
      }
    }
    
    return {
      success: results.length > 0,
      results,
      errors,
      total: files.length,
      uploaded: results.length,
      failed: errors.length
    };
    
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    throw error;
  }
};

// =========================================
// 🗑️ OPERAÇÕES DE REMOÇÃO
// =========================================

/**
 * Deletar documento do Storage
 */
export const deleteDocument = async (storagePath) => {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    return {
      success: true,
      message: 'Documento deletado com sucesso'
    };
    
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    
    // Se arquivo não existe, considerar como sucesso
    if (error.code === 'storage/object-not-found') {
      return {
        success: true,
        message: 'Documento já foi removido'
      };
    }
    
    throw new Error(`Falha ao deletar documento: ${error.message}`);
  }
};

/**
 * Deletar múltiplos documentos
 */
export const deleteMultipleDocuments = async (storagePaths) => {
  try {
    const results = [];
    const errors = [];
    
    for (const path of storagePaths) {
      try {
        await deleteDocument(path);
        results.push(path);
      } catch (error) {
        errors.push(`${path}: ${error.message}`);
      }
    }
    
    return {
      success: results.length > 0,
      deleted: results.length,
      failed: errors.length,
      errors
    };
    
  } catch (error) {
    console.error('Erro ao deletar múltiplos documentos:', error);
    throw error;
  }
};

/**
 * Limpar todos os documentos de um cliente
 */
export const clearClientDocuments = async (userId, clientId) => {
  try {
    const basePath = `users/${userId}/clients/${clientId}/documents`;
    const baseRef = ref(storage, basePath);
    
    // Listar todos os arquivos
    const listResult = await listAll(baseRef);
    
    // Deletar cada arquivo
    const deletePromises = listResult.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
    
    // Deletar pastas de categorias se existirem
    for (const category of Object.values(DocumentCategory)) {
      try {
        const categoryRef = ref(storage, `${basePath}/${category}`);
        const categoryList = await listAll(categoryRef);
        const categoryDeletePromises = categoryList.items.map(itemRef => deleteObject(itemRef));
        await Promise.all(categoryDeletePromises);
      } catch (error) {
        // Ignorar se pasta não existir
        if (error.code !== 'storage/object-not-found') {
          console.warn(`Erro ao limpar categoria ${category}:`, error);
        }
      }
    }
    
    return {
      success: true,
      deletedCount: listResult.items.length,
      message: 'Todos os documentos do cliente foram removidos'
    };
    
  } catch (error) {
    console.error('Erro ao limpar documentos do cliente:', error);
    throw new Error(`Falha ao limpar documentos: ${error.message}`);
  }
};

// =========================================
// 📁 OPERAÇÕES DE LISTAGEM E ORGANIZAÇÃO
// =========================================

/**
 * Listar documentos de um cliente por categoria
 */
export const listClientDocuments = async (userId, clientId, categoria = null) => {
  try {
    const basePath = categoria 
      ? `users/${userId}/clients/${clientId}/documents/${categoria}`
      : `users/${userId}/clients/${clientId}/documents`;
    
    const baseRef = ref(storage, basePath);
    const listResult = await listAll(baseRef);
    
    // Obter metadados de cada arquivo
    const documentsPromises = listResult.items.map(async (itemRef) => {
      try {
        const metadata = await getMetadata(itemRef);
        const downloadURL = await getDownloadURL(itemRef);
        
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url: downloadURL,
          size: metadata.size,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated,
          contentType: metadata.contentType,
          customMetadata: metadata.customMetadata,
          md5Hash: metadata.md5Hash
        };
      } catch (error) {
        console.warn(`Erro ao obter metadados de ${itemRef.name}:`, error);
        return null;
      }
    });
    
    const documents = (await Promise.all(documentsPromises)).filter(doc => doc !== null);
    
    // Organizar por categoria se não foi especificada
    if (!categoria) {
      const organized = {};
      
      documents.forEach(doc => {
        const pathParts = doc.fullPath.split('/');
        const docCategory = pathParts[pathParts.length - 2] || 'outros';
        
        if (!organized[docCategory]) {
          organized[docCategory] = [];
        }
        organized[docCategory].push(doc);
      });
      
      return organized;
    }
    
    return documents;
    
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    throw new Error(`Falha ao listar documentos: ${error.message}`);
  }
};

/**
 * Obter estatísticas de armazenamento do cliente
 */
export const getClientStorageStats = async (userId, clientId) => {
  try {
    const documents = await listClientDocuments(userId, clientId);
    
    let totalSize = 0;
    let totalFiles = 0;
    const byCategory = {};
    const byType = {};
    
    // Se documents é objeto organizado por categoria
    if (typeof documents === 'object' && !Array.isArray(documents)) {
      Object.entries(documents).forEach(([category, files]) => {
        byCategory[category] = {
          count: files.length,
          size: 0
        };
        
        files.forEach(file => {
          totalSize += file.size || 0;
          totalFiles += 1;
          byCategory[category].size += file.size || 0;
          
          const type = file.contentType || 'unknown';
          byType[type] = (byType[type] || 0) + 1;
        });
      });
    }
    
    return {
      totalSize,
      totalFiles,
      byCategory,
      byType,
      formattedSize: formatFileSize(totalSize)
    };
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw new Error(`Falha ao obter estatísticas: ${error.message}`);
  }
};

// =========================================
// 🔄 OPERAÇÕES DE CONVERSÃO E PROCESSAMENTO
// =========================================

/**
 * Redimensionar imagem (client-side)
 */
export const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file); // Retornar arquivo original se não for imagem
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular novas dimensões mantendo aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      // Configurar canvas
      canvas.width = width;
      canvas.height = height;
      
      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height);
      
      // Converter para blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Criar novo arquivo com mesmo nome
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Falha ao redimensionar imagem'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Falha ao carregar imagem'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Extrair texto de PDF (básico)
 */
export const extractTextFromPDF = async (file) => {
  try {
    // Esta é uma implementação básica
    // Em produção, usaria biblioteca como pdf-parse ou PDF.js
    console.warn('Extração de texto PDF não implementada ainda');
    
    return {
      text: '',
      pages: 0,
      hasText: false
    };
    
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
    return null;
  }
};

// =========================================
// 🛠️ FUNÇÕES UTILITÁRIAS
// =========================================

/**
 * Formatar tamanho de arquivo
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Obter ícone baseado no tipo de arquivo
 */
export const getFileIcon = (contentType) => {
  const iconMap = {
    'application/pdf': '📄',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'image/jpeg': '🖼️',
    'image/png': '🖼️',
    'image/gif': '🖼️',
    'text/plain': '📄',
    'application/zip': '🗜️',
    'application/x-rar-compressed': '🗜️'
  };
  
  return iconMap[contentType] || '📎';
};

/**
 * Validar se arquivo é imagem
 */
export const isImageFile = (file) => {
  return file && file.type && file.type.startsWith('image/');
};

/**
 * Validar se arquivo é documento
 */
export const isDocumentFile = (file) => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  
  return file && file.type && documentTypes.includes(file.type);
};

/**
 * Gerar nome único para arquivo
 */
export const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(`.${extension}`, '');
  
  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
};

// =========================================
// 📋 EXPORT DEFAULT
// =========================================

export default {
  // Upload
  uploadDocument,
  uploadMultipleDocuments,
  
  // Delete
  deleteDocument,
  deleteMultipleDocuments,
  clearClientDocuments,
  
  // List/Stats
  listClientDocuments,
  getClientStorageStats,
  
  // Processing
  resizeImage,
  extractTextFromPDF,
  
  // Utils
  formatFileSize,
  getFileIcon,
  isImageFile,
  isDocumentFile,
  generateUniqueFileName,
  validateFile
};
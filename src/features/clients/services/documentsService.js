// =========================================
// 📄 SERVICE - Documentos (Mock Temporário)
// =========================================
// Service temporário para gestão de documentos
// Será substituído pela integração Firebase Storage real

/**
 * Simular delay de rede
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Service para gestão de documentos (Mock)
 */
const documentsService = {
  /**
   * Upload de documento
   */
  async uploadDocument(userId, clientId, file, category) {
    await delay(1500); // Simular upload
    
    // Simular validação de arquivo
    if (file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido');
    }

    // Simular sucesso do upload
    const mockDocument = {
      id: Date.now().toString(),
      nome: file.name,
      categoria: category,
      tipo: file.type,
      tamanho: file.size,
      url: `/docs/${clientId}/${file.name}`, // URL simulada
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId
    };

    return mockDocument;
  },

  /**
   * Buscar documentos de um cliente
   */
  async getClientDocuments(userId, clientId) {
    await delay(300);
    
    // Retornar documentos simulados
    return [
      {
        id: '1',
        nome: 'cartao_cidadao.pdf',
        categoria: 'cartao_cidadao',
        tipo: 'application/pdf',
        tamanho: 245760,
        url: `/docs/${clientId}/cartao_cidadao.pdf`,
        uploadedAt: '2024-08-10T10:00:00Z',
        uploadedBy: userId
      },
      {
        id: '2',
        nome: 'comprovativo_morada.pdf',
        categoria: 'comprovativo_morada',
        tipo: 'application/pdf',
        tamanho: 180234,
        url: `/docs/${clientId}/comprovativo_morada.pdf`,
        uploadedAt: '2024-08-11T14:30:00Z',
        uploadedBy: userId
      }
    ];
  },

  /**
   * Deletar documento
   */
  async deleteDocument(userId, clientId, documentId) {
    await delay(500);
    
    // Simular sucesso
    return { success: true };
  },

  /**
   * Download de documento
   */
  async downloadDocument(userId, clientId, documentId) {
    await delay(200);
    
    // Retornar URL simulada para download
    return {
      url: `/api/docs/download/${documentId}`,
      expires: new Date(Date.now() + 3600000).toISOString() // 1 hora
    };
  },

  /**
   * Categorizar documento automaticamente
   */
  async categorizeDocument(fileName, fileType) {
    await delay(100);
    
    const nameLower = fileName.toLowerCase();
    
    if (nameLower.includes('cartao') || nameLower.includes('cc')) {
      return 'cartao_cidadao';
    }
    
    if (nameLower.includes('nif') || nameLower.includes('contribuinte')) {
      return 'nif';
    }
    
    if (nameLower.includes('morada') || nameLower.includes('residencia')) {
      return 'comprovativo_morada';
    }
    
    if (nameLower.includes('iban') || nameLower.includes('banco')) {
      return 'comprovativo_iban';
    }
    
    if (nameLower.includes('salario') || nameLower.includes('vencimento')) {
      return 'comprovativo_rendimentos';
    }
    
    return 'outros';
  },

  /**
   * Validar arquivo
   */
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Tamanho máximo: 10MB'
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido'
      };
    }

    return { valid: true };
  },

  /**
   * Gerar preview do documento (se aplicável)
   */
  async generatePreview(file) {
    await delay(800);
    
    if (file.type.startsWith('image/')) {
      // Para imagens, retornar URL de preview
      return {
        type: 'image',
        url: URL.createObjectURL(file)
      };
    }
    
    if (file.type === 'application/pdf') {
      // Para PDFs, simular geração de thumbnail
      return {
        type: 'pdf',
        thumbnail: '/api/pdf-thumbnail/' + Date.now(),
        pages: Math.floor(Math.random() * 10) + 1
      };
    }
    
    return null;
  },

  /**
   * Formatar tamanho do arquivo
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Obter ícone do tipo de arquivo
   */
  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    return '📁';
  },

  /**
   * Listar documentos do cliente (mock)
   */
  async listClientDocuments(userId, clientId) {
    await delay(300);
    
    // Retornar documentos simulados
    return [
      {
        id: '1',
        nome: 'cartao_cidadao.pdf',
        categoria: 'cartao_cidadao',
        tipo: 'application/pdf',
        tamanho: 245760,
        url: `/docs/${clientId}/cartao_cidadao.pdf`,
        uploadedAt: '2024-08-10T10:00:00Z',
        uploadedBy: userId
      }
    ];
  }
};

export default documentsService;
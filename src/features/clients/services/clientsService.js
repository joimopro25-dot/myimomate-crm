// =========================================
// 🔥 SERVICE - Clientes (Mock Temporário)
// =========================================
// Service temporário para desenvolvimento
// Será substituído pela integração Firebase real

/**
 * Mock data para desenvolvimento
 */
const mockClients = [
  {
    id: '1',
    dadosPessoais: {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '912345678',
      morada: 'Rua das Flores, 123, Aveiro',
      dataNascimento: '1985-03-15',
      naturalidade: 'Aveiro',
      nacionalidade: 'Portuguesa',
      residencia: 'Aveiro',
      nif: '123456789',
      contribuinte: '123456789',
      numCartaoCidadao: '12345678 9 ZZ0',
      estadoCivil: 'casado'
    },
    roles: ['comprador', 'investidor'],
    origem: 'website',
    ativo: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-12T10:00:00Z',
    deals: [
      {
        id: 'deal1',
        tipo: 'compra',
        status: 'proposta_enviada',
        valor: 250000,
        updatedAt: '2024-08-10T10:00:00Z'
      }
    ],
    historicoComunicacao: [
      {
        id: 'comm1',
        tipo: 'email',
        data: '2024-08-10T14:30:00Z',
        assunto: 'Proposta de Compra'
      }
    ],
    documentos: [
      {
        id: 'doc1',
        nome: 'CC_JoaoSilva.pdf',
        categoria: 'cartao_cidadao',
        url: '/docs/cc_joao.pdf'
      }
    ]
  },
  {
    id: '2',
    dadosPessoais: {
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '923456789',
      morada: 'Avenida Central, 456, Porto',
      dataNascimento: '1990-07-22',
      naturalidade: 'Porto',
      nacionalidade: 'Portuguesa',
      residencia: 'Porto',
      nif: '987654321',
      contribuinte: '987654321',
      numCartaoCidadao: '98765432 1 AA9',
      estadoCivil: 'solteiro'
    },
    roles: ['vendedor'],
    origem: 'referencia',
    ativo: true,
    createdAt: '2024-02-20T15:00:00Z',
    updatedAt: '2024-08-11T15:00:00Z',
    deals: [
      {
        id: 'deal2',
        tipo: 'venda',
        status: 'escritura_agendada',
        valor: 180000,
        updatedAt: '2024-08-11T15:00:00Z'
      }
    ],
    historicoComunicacao: [
      {
        id: 'comm2',
        tipo: 'telefone',
        data: '2024-08-11T16:00:00Z',
        assunto: 'Agendamento Escritura'
      }
    ],
    documentos: []
  },
  {
    id: '3',
    dadosPessoais: {
      nome: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      telefone: '934567890',
      morada: 'Rua do Sol, 789, Lisboa',
      dataNascimento: '1995-08-12',
      naturalidade: 'Lisboa',
      nacionalidade: 'Portuguesa',
      residencia: 'Lisboa',
      nif: '456789123',
      contribuinte: '456789123',
      numCartaoCidadao: '45678912 3 BB8',
      estadoCivil: 'solteiro'
    },
    roles: ['inquilino'],
    origem: 'redes_sociais',
    ativo: true,
    createdAt: '2024-08-12T09:00:00Z',
    updatedAt: '2024-08-12T09:00:00Z',
    deals: [],
    historicoComunicacao: [],
    documentos: []
  }
];

/**
 * Simular delay de rede
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Service para gestão de clientes (Mock)
 */
const clientsService = {
  /**
   * Buscar lista de clientes
   */
  async getClients(userId, options = {}) {
    await delay(500); // Simular latência
    
    const {
      page = 1,
      limit = 20,
      search = '',
      filters = {}
    } = options;

    let filteredClients = [...mockClients];

    // Aplicar pesquisa
    if (search) {
      const searchLower = search.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.dadosPessoais?.nome?.toLowerCase().includes(searchLower) ||
        client.dadosPessoais?.email?.toLowerCase().includes(searchLower) ||
        client.dadosPessoais?.telefone?.includes(search)
      );
    }

    // Aplicar filtros
    if (filters.roles && filters.roles.length > 0) {
      filteredClients = filteredClients.filter(client =>
        client.roles?.some(role => filters.roles.includes(role))
      );
    }

    if (filters.status === 'active') {
      filteredClients = filteredClients.filter(client => client.ativo);
    } else if (filters.status === 'inactive') {
      filteredClients = filteredClients.filter(client => !client.ativo);
    }

    // Paginação
    const total = filteredClients.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    return {
      data: paginatedClients,
      total,
      page,
      limit,
      hasMore: endIndex < total,
      hasPrev: page > 1
    };
  },

  /**
   * Buscar cliente específico
   */
  async getClient(userId, clientId) {
    await delay(300);
    
    const client = mockClients.find(c => c.id === clientId);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    
    return client;
  },

  /**
   * Criar novo cliente
   */
  async createClient(userId, clientData) {
    await delay(800);
    
    const newClient = {
      id: Date.now().toString(),
      ...clientData,
      ativo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deals: [],
      historicoComunicacao: [],
      documentos: []
    };

    // Adicionar à lista mock
    mockClients.unshift(newClient);
    
    return newClient;
  },

  /**
   * Atualizar cliente
   */
  async updateClient(userId, clientId, updates) {
    await delay(600);
    
    const clientIndex = mockClients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      throw new Error('Cliente não encontrado');
    }
    
    const updatedClient = {
      ...mockClients[clientIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    mockClients[clientIndex] = updatedClient;
    
    return updatedClient;
  },

  /**
   * Deletar cliente
   */
  async deleteClient(userId, clientId) {
    await delay(400);
    
    const clientIndex = mockClients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      throw new Error('Cliente não encontrado');
    }
    
    mockClients.splice(clientIndex, 1);
    
    return { success: true };
  },

  /**
   * Buscar estatísticas
   */
  async getClientStats(userId) {
    await delay(200);
    
    const activeClients = mockClients.filter(c => c.ativo);
    const inactiveClients = mockClients.filter(c => !c.ativo);
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const newThisMonth = mockClients.filter(client => {
      const created = new Date(client.createdAt);
      return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
    });

    const birthdaysThisMonth = mockClients.filter(client => {
      if (!client.dadosPessoais?.dataNascimento) return false;
      const birthday = new Date(client.dadosPessoais.dataNascimento);
      return birthday.getMonth() === thisMonth;
    });

    const totalDealsValue = mockClients.reduce((sum, client) => {
      const clientDealsValue = client.deals?.reduce((dealSum, deal) => 
        dealSum + (deal.valor || 0), 0) || 0;
      return sum + clientDealsValue;
    }, 0);

    const totalDeals = mockClients.reduce((sum, client) => 
      sum + (client.deals?.length || 0), 0);

    return {
      total: mockClients.length,
      active: activeClients.length,
      inactive: inactiveClients.length,
      newThisMonth: newThisMonth.length,
      birthdaysThisMonth: birthdaysThisMonth.length,
      hotClients: activeClients.filter(c => 
        (c.deals?.length || 0) > 0
      ).length,
      avgDealsValue: totalDeals > 0 ? totalDealsValue / totalDeals : 0
    };
  },

  /**
   * Pesquisar clientes
   */
  async searchClients(userId, query) {
    await delay(300);
    
    const searchLower = query.toLowerCase();
    
    return mockClients.filter(client =>
      client.dadosPessoais?.nome?.toLowerCase().includes(searchLower) ||
      client.dadosPessoais?.email?.toLowerCase().includes(searchLower) ||
      client.dadosPessoais?.telefone?.includes(query)
    );
  }
};

export default clientsService;
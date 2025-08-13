// =========================================
// 🎯 TYPES & INTERFACES - MÓDULO CLIENTES EXPANDIDO
// =========================================
// Definições de tipos para o sistema de clientes
// Estrutura completa com dados expandidos para imobiliário

/**
 * @typedef {Object} DadosPessoais
 * @property {string} nome - Nome completo
 * @property {string} morada - Morada completa
 * @property {string} telefone - Número de telefone
 * @property {string} email - Email principal
 * @property {Date|string} dataNascimento - Data de nascimento
 * @property {string} naturalidade - Local de nascimento
 * @property {string} nacionalidade - Nacionalidade
 * @property {string} residencia - Local de residência atual
 * @property {string} nif - Número de Identificação Fiscal
 * @property {string} contribuinte - Número de contribuinte
 * @property {string} numCartaoCidadao - Número do cartão de cidadão
 * @property {EstadoCivil} estadoCivil - Estado civil atual
 * @property {string} profissao - Profissão atual
 * @property {string} empresa - Nome da empresa onde trabalha
 * @property {RendimentoAnual} rendimentoAnual - Faixa de rendimento anual
 * @property {TipoHabitacao} habitacaoAtual - Tipo de habitação onde vive
 * @property {RegimeHabitacao} regimeHabitacao - Proprietário/Arrendatário/Outro
 */

/**
 * @typedef {Object} DadosConjuge
 * @property {string} nome - Nome completo do cônjuge
 * @property {string} email - Email do cônjuge
 * @property {string} telefone - Telefone do cônjuge
 * @property {string} nif - NIF do cônjuge
 * @property {string} contribuinte - Contribuinte do cônjuge
 * @property {string} numCartaoCidadao - Cartão cidadão do cônjuge
 * @property {Date|string} dataNascimento - Data nascimento cônjuge
 * @property {string} naturalidade - Naturalidade do cônjuge
 * @property {string} nacionalidade - Nacionalidade do cônjuge
 * @property {string} profissao - Profissão do cônjuge
 * @property {string} empresa - Empresa do cônjuge
 * @property {RendimentoAnual} rendimentoAnual - Rendimento do cônjuge
 */

/**
 * @typedef {Object} DadosBancarios
 * @property {string} banco - Nome do banco
 * @property {string} iban - Número IBAN
 * @property {string} swift - Código SWIFT (opcional)
 * @property {string} titular - Nome do titular da conta
 * @property {string} morada - Morada do banco
 * @property {boolean} contaConjunta - Se é conta conjunta
 * @property {number} capacidadeFinanceira - Capacidade financeira estimada
 */

/**
 * @typedef {Object} PerfilImobiliario
 * @property {OrcamentoFaixa} orcamentoMinimo - Orçamento mínimo
 * @property {OrcamentoFaixa} orcamentoMaximo - Orçamento máximo
 * @property {TipoImovel[]} tiposInteresse - Tipos de imóvel de interesse
 * @property {string[]} zonasPreferidas - Zonas geográficas preferidas
 * @property {MotivacoesCompra} motivacaoPrincipal - Motivação principal
 * @property {PrioridadesImovel} prioridades - Prioridades na escolha
 * @property {UrgenciaCompra} urgencia - Urgência da compra/venda
 * @property {boolean} precisaFinanciamento - Se precisa de financiamento
 * @property {number} percentagemEntrada - % para entrada (se financiamento)
 * @property {boolean} temImovelVenda - Se tem imóvel para vender
 */

/**
 * @typedef {Object} Documento
 * @property {string} id - ID único do documento
 * @property {string} nome - Nome do arquivo
 * @property {string} tipo - Tipo do documento
 * @property {string} categoria - Categoria (CC, NIF, Comp.Morada, etc.)
 * @property {number} tamanho - Tamanho em bytes
 * @property {string} url - URL para acesso
 * @property {Date} uploadedAt - Data do upload
 * @property {string} uploadedBy - Quem fez upload
 * @property {boolean} verificado - Se foi verificado
 * @property {Date} dataExpiracao - Data de expiração (se aplicável)
 */

/**
 * @typedef {Object} ConfiguracoesComunicacao
 * @property {boolean} enviarAniversario - Enviar email de aniversário
 * @property {boolean} lembretesVisitas - Lembretes de visitas
 * @property {boolean} lembretesPagamentos - Lembretes de pagamentos
 * @property {boolean} eventos - Notificações de eventos
 * @property {boolean} marketing - Receber material de marketing
 * @property {boolean} sms - Permitir SMS
 * @property {boolean} whatsapp - Permitir WhatsApp
 * @property {string} horaPreferida - Hora preferida para contacto
 * @property {string[]} diasPreferidos - Dias preferidos para contacto
 * @property {FrequenciaContacto} frequenciaContacto - Frequência de contacto
 * @property {MeioContactoPreferido} meioPreferido - Meio de contacto preferido
 */

/**
 * @typedef {Object} DadosContacto
 * @property {Date} dataPrimeiroContacto - Data do primeiro contacto
 * @property {MeioContacto} meioPrimeiroContacto - Como foi o primeiro contacto
 * @property {Date} dataUltimoContacto - Data do último contacto
 * @property {number} numeroContactos - Número total de contactos
 * @property {string} origemContacto - De onde veio o contacto
 * @property {string} responsavelContacto - Quem fez o primeiro contacto
 * @property {boolean} clienteAtivo - Se cliente está ativo
 * @property {TemperaturaCliente} temperatura - Quente/Morno/Frio
 * @property {number} scoreEngajamento - Score de engajamento (0-100)
 */

/**
 * @typedef {Object} Cliente - Estrutura completa do cliente
 * @property {string} id - ID único do cliente
 * @property {DadosPessoais} dadosPessoais - Dados pessoais
 * @property {DadosConjuge} conjuge - Dados do cônjuge (se aplicável)
 * @property {ComunhaoBens} comunhaoBens - Regime de bens (se casado)
 * @property {DadosBancarios} dadosBancarios - Dados bancários
 * @property {PerfilImobiliario} perfilImobiliario - Perfil imobiliário
 * @property {ConfiguracoesComunicacao} comunicacoes - Preferências comunicação
 * @property {DadosContacto} dadosContacto - Histórico de contactos
 * @property {Documento[]} documentos - Documentos anexados
 * @property {ClientRole[]} roles - Roles do cliente (comprador, vendedor, etc.)
 * @property {Deal[]} deals - Negócios associados
 * @property {string} notas - Notas internas
 * @property {ClientSource} origem - Origem do cliente
 * @property {string} responsavel - ID do responsável
 * @property {boolean} ativo - Se cliente está ativo
 * @property {string} avatar - URL do avatar
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 * @property {Object} metadata - Metadados adicionais
 */

// =========================================
// 🎯 ENUMS E CONSTANTES EXPANDIDAS
// =========================================

/**
 * @typedef {'solteiro' | 'casado' | 'uniao_facto' | 'divorciado' | 'viuvo' | 'separado'} EstadoCivil
 */

/**
 * @typedef {'ate_25k' | '25k_50k' | '50k_75k' | '75k_100k' | '100k_150k' | '150k_plus'} RendimentoAnual
 */

/**
 * @typedef {'apartamento' | 'moradia' | 'quarto' | 'estudios' | 'outro'} TipoHabitacao
 */

/**
 * @typedef {'proprietario' | 'arrendatario' | 'familiares' | 'outro'} RegimeHabitacao
 */

/**
 * @typedef {'ate_100k' | '100k_200k' | '200k_300k' | '300k_500k' | '500k_750k' | '750k_1m' | '1m_plus'} OrcamentoFaixa
 */

/**
 * @typedef {'apartamento' | 'moradia' | 'terreno' | 'comercial' | 'industrial' | 'investimento'} TipoImovel
 */

/**
 * @typedef {'primeira_habitacao' | 'investimento' | 'mudanca_zona' | 'upgrade_casa' | 'divorcio' | 'heranca' | 'outro'} MotivacoesCompra
 */

/**
 * @typedef {'localizacao' | 'preco' | 'tamanho' | 'condicao' | 'transportes' | 'escolas' | 'seguranca'} PrioridadesImovel
 */

/**
 * @typedef {'urgente' | 'moderada' | 'flexivel' | 'sem_pressa'} UrgenciaCompra
 */

/**
 * @typedef {'email' | 'telefone' | 'sms' | 'whatsapp' | 'presencial'} MeioContactoPreferido
 */

/**
 * @typedef {'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'trimestral' | 'apenas_necessario'} FrequenciaContacto
 */

/**
 * @typedef {'telefone' | 'email' | 'whatsapp' | 'sms' | 'presencial' | 'redes_sociais' | 'referencia'} MeioContacto
 */

/**
 * @typedef {'quente' | 'morno' | 'frio' | 'inativo'} TemperaturaCliente
 */

/**
 * @typedef {'comprador' | 'vendedor' | 'investidor' | 'inquilino' | 'senhorio'} ClientRole
 */

/**
 * @typedef {'website' | 'referencia' | 'redes_sociais' | 'publicidade' | 'imoveis_online' | 'contacto_direto' | 'evento' | 'parceiro' | 'recomendacao' | 'outro'} ClientSource
 */

/**
 * @typedef {'geral' | 'separacao' | 'adquiridos'} ComunhaoBens
 */

// =========================================
// 🏠 NEGÓCIOS E TRANSAÇÕES
// =========================================

/**
 * @typedef {Object} Deal
 * @property {string} id - ID único do negócio
 * @property {string} clienteId - ID do cliente
 * @property {TipoDeal} tipo - Tipo de negócio
 * @property {string} imovelId - ID do imóvel (se aplicável)
 * @property {number} valor - Valor do negócio
 * @property {StatusDeal} status - Status atual
 * @property {Date} dataInicio - Data de início
 * @property {Date} dataFechamento - Data de fechamento (se aplicável)
 * @property {number} comissao - Valor da comissão
 * @property {string} responsavel - ID do responsável
 * @property {string} notas - Notas do negócio
 * @property {Object[]} historico - Histórico de mudanças
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * @typedef {'compra' | 'venda' | 'arrendamento' | 'consultoria' | 'avaliacao'} TipoDeal
 */

/**
 * @typedef {'prospecto' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'cancelado'} StatusDeal
 */

// =========================================
// 📊 ESTATÍSTICAS E FILTROS
// =========================================

/**
 * @typedef {Object} ClientFilters
 * @property {string} search - Termo de busca
 * @property {ClientRole[]} roles - Filtro por roles
 * @property {EstadoCivil[]} estadoCivil - Filtro por estado civil
 * @property {RendimentoAnual[]} rendimento - Filtro por rendimento
 * @property {ClientSource[]} origem - Filtro por origem
 * @property {TemperaturaCliente[]} temperatura - Filtro por temperatura
 * @property {boolean} ativo - Apenas ativos
 * @property {Date} dataInicioContacto - Data início para filtro
 * @property {Date} dataFimContacto - Data fim para filtro
 * @property {string} responsavel - Filtro por responsável
 * @property {OrcamentoFaixa[]} orcamento - Filtro por orçamento
 * @property {TipoImovel[]} tiposInteresse - Filtro por tipos de interesse
 */

/**
 * @typedef {Object} ClientStats
 * @property {number} total - Total de clientes
 * @property {number} ativos - Clientes ativos
 * @property {number} novosEsteMes - Novos este mês
 * @property {number} birthdayToday - Aniversários hoje
 * @property {number} urgentActions - Ações urgentes
 * @property {number} hotClients - Clientes quentes
 * @property {number} coldClients - Clientes frios
 * @property {Object} porRole - Estatísticas por role
 * @property {Object} porOrigem - Estatísticas por origem
 * @property {Object} porTemperatura - Estatísticas por temperatura
 * @property {Object} porRendimento - Estatísticas por rendimento
 * @property {number} totalDeals - Total de negócios
 * @property {number} dealsAtivos - Negócios ativos
 * @property {number} valorTotalDeals - Valor total dos negócios
 * @property {number} comissaoTotal - Comissão total
 * @property {number} ticketMedio - Ticket médio
 * @property {number} tempoMedioFechamento - Tempo médio fechamento (dias)
 */

// =========================================
// 🎯 FORMS & VALIDATION SCHEMAS
// =========================================

/**
 * @typedef {Object} ClientFormData
 * @property {DadosPessoais} dadosPessoais
 * @property {DadosConjuge} conjuge
 * @property {ComunhaoBens} comunhaoBens
 * @property {DadosBancarios} dadosBancarios
 * @property {PerfilImobiliario} perfilImobiliario
 * @property {ConfiguracoesComunicacao} comunicacoes
 * @property {DadosContacto} dadosContacto
 * @property {ClientRole[]} roles
 * @property {string} notas
 * @property {ClientSource} origem
 */

/**
 * @typedef {Object} ClientFormStep
 * @property {number} step - Número do passo atual (1-6)
 * @property {boolean} isValid - Se o passo está válido
 * @property {Object} errors - Erros de validação
 * @property {boolean} touched - Se foi tocado pelo utilizador
 * @property {string} title - Título do passo
 * @property {string} description - Descrição do passo
 */

// =========================================
// 🎯 API & SERVICE TYPES
// =========================================

/**
 * @typedef {Object} ClientsResponse
 * @property {Cliente[]} data - Lista de clientes
 * @property {number} total - Total de registos
 * @property {number} page - Página atual
 * @property {number} limit - Limite por página
 * @property {boolean} hasNext - Se há próxima página
 * @property {boolean} hasPrev - Se há página anterior
 * @property {ClientStats} stats - Estatísticas dos resultados
 */

/**
 * @typedef {Object} ClientResponse
 * @property {Cliente} data - Dados do cliente
 * @property {boolean} success - Se foi sucesso
 * @property {string} message - Mensagem de resposta
 * @property {ClientStats} relatedStats - Estatísticas relacionadas
 */

/**
 * @typedef {Object} UploadResponse
 * @property {string} url - URL do arquivo
 * @property {string} fileName - Nome do arquivo
 * @property {number} size - Tamanho em bytes
 * @property {boolean} success - Se foi sucesso
 * @property {string} category - Categoria do documento
 */

// =========================================
// 🎯 HOOKS TYPES
// =========================================

/**
 * @typedef {Object} UseClientsReturn
 * @property {Cliente[]} clients - Lista de clientes
 * @property {boolean} loading - Estado de carregamento
 * @property {string|null} error - Mensagem de erro
 * @property {ClientStats} stats - Estatísticas
 * @property {Function} refetch - Função para recarregar
 * @property {Function} loadMore - Carregar mais clientes
 * @property {boolean} hasMore - Se há mais clientes
 * @property {Function} createClient - Criar novo cliente
 * @property {Function} updateClient - Atualizar cliente
 * @property {Function} deleteClient - Deletar cliente
 */

/**
 * @typedef {Object} UseClientFormReturn
 * @property {number} currentStep - Passo atual (1-6)
 * @property {ClientFormData} formData - Dados do formulário
 * @property {Object} errors - Erros de validação
 * @property {boolean} isSubmitting - Se está submetendo
 * @property {Function} nextStep - Ir para próximo passo
 * @property {Function} prevStep - Voltar passo anterior
 * @property {Function} submitForm - Submeter formulário
 * @property {Function} updateField - Atualizar campo específico
 * @property {number} progressPercentage - Progresso em %
 * @property {boolean} isValid - Se formulário está válido
 */

export {
  // Tipos principais não precisam ser exportados explicitamente em JS
  // As definições JSDoc servem para documentação e IntelliSense
};
// =========================================
// 🎯 TYPES & INTERFACES - MÓDULO CLIENTES
// =========================================
// Definições de tipos para o sistema de clientes
// Estrutura completa com todos os campos aprovados

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
 */

/**
 * @typedef {Object} DadosBancarios
 * @property {string} banco - Nome do banco
 * @property {string} iban - Número IBAN
 * @property {string} swift - Código SWIFT (opcional)
 * @property {string} titular - Nome do titular da conta
 * @property {string} morada - Morada do banco
 */

/**
 * @typedef {Object} Documento
 * @property {string} id - ID único do documento
 * @property {string} nome - Nome do arquivo
 * @property {string} tipo - Tipo do documento
 * @property {string} categoria - Categoria (CC, NIF, Comp.Morada, etc.)
 * @property {string} url - URL do arquivo no Firebase Storage
 * @property {number} tamanho - Tamanho do arquivo em bytes
 * @property {Date|string} dataUpload - Data do upload
 * @property {string} uploadedBy - ID do utilizador que fez upload
 */

/**
 * @typedef {Object} ConfiguracoesComunicacao
 * @property {boolean} enviarAniversario - Enviar emails de aniversário
 * @property {boolean} lembretesVisitas - Lembretes de visitas
 * @property {boolean} lembretesPagamentos - Lembretes de pagamentos
 * @property {boolean} eventos - Notificações de eventos
 * @property {boolean} marketing - Aceita comunicações de marketing
 * @property {boolean} sms - Aceita SMS
 * @property {string} horaPreferida - Hora preferida para contacto
 * @property {string[]} diasPreferidos - Dias da semana preferidos
 */

/**
 * @typedef {Object} Deal
 * @property {string} id - ID único do negócio
 * @property {ClientRole} role - Role do cliente neste negócio
 * @property {DealType} tipo - Tipo de negócio
 * @property {DealStatus} status - Status atual
 * @property {string} propriedade - Descrição da propriedade
 * @property {string} moradaPropriedade - Morada da propriedade
 * @property {number} valor - Valor do negócio
 * @property {number} comissao - Comissão (%) (opcional)
 * @property {Date|string} dataInicio - Data de início
 * @property {Date|string} dataFim - Data de conclusão (opcional)
 * @property {string} notas - Observações
 * @property {Date|string} createdAt - Data de criação
 * @property {Date|string} updatedAt - Última atualização
 */

/**
 * @typedef {Object} HistoricoComunicacao
 * @property {string} id - ID único da comunicação
 * @property {CommunicationType} tipo - Tipo de comunicação
 * @property {string} assunto - Assunto/título
 * @property {string} conteudo - Conteúdo da comunicação
 * @property {Date|string} data - Data da comunicação
 * @property {string} responsavel - Quem fez a comunicação
 * @property {boolean} lida - Se foi lida pelo cliente
 * @property {string[]} anexos - URLs de anexos (opcional)
 */

/**
 * @typedef {Object} Cliente
 * @property {string} id - ID único do cliente
 * @property {DadosPessoais} dadosPessoais - Dados pessoais completos
 * @property {DadosConjuge|null} conjuge - Dados do cônjuge (se casado)
 * @property {ComunhaoBens|null} comunhaoBens - Regime de bens (se casado)
 * @property {DadosBancarios} dadosBancarios - Informações bancárias
 * @property {Documento[]} documentos - Lista de documentos
 * @property {ConfiguracoesComunicacao} comunicacoes - Preferências
 * @property {ClientRole[]} roles - Roles do cliente (múltiplos)
 * @property {Deal[]} deals - Negócios do cliente
 * @property {HistoricoComunicacao[]} historicoComunicacao - Histórico
 * @property {string} avatar - URL da foto (opcional)
 * @property {string} notas - Observações gerais
 * @property {boolean} ativo - Se o cliente está ativo
 * @property {ClientSource} origem - Como chegou até nós
 * @property {string} responsavel - Consultor responsável
 * @property {Date|string} createdAt - Data de criação
 * @property {Date|string} updatedAt - Última atualização
 * @property {string} createdBy - ID do utilizador que criou
 * @property {string} updatedBy - ID do último utilizador que atualizou
 */

/**
 * @typedef {Object} ClientFilters
 * @property {string} search - Pesquisa por nome/email/telefone
 * @property {ClientRole[]} roles - Filtro por roles
 * @property {EstadoCivil[]} estadoCivil - Filtro por estado civil
 * @property {boolean} ativo - Filtro por status ativo
 * @property {string} responsavel - Filtro por consultor
 * @property {Date|string} dataInicio - Data criação início
 * @property {Date|string} dataFim - Data criação fim
 * @property {ClientSource[]} origem - Filtro por origem
 * @property {boolean} temDeals - Se tem negócios ativos
 * @property {DealStatus[]} statusDeals - Status dos negócios
 */

/**
 * @typedef {Object} ClientStats
 * @property {number} total - Total de clientes
 * @property {number} ativos - Clientes ativos
 * @property {number} inativos - Clientes inativos
 * @property {number} novosEsteMes - Novos este mês
 * @property {Object} porRole - Estatísticas por role
 * @property {Object} porEstadoCivil - Por estado civil
 * @property {Object} porOrigem - Por origem
 * @property {number} totalDeals - Total de negócios
 * @property {number} dealsAtivos - Negócios ativos
 * @property {number} valorTotalDeals - Valor total dos negócios
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
 * @property {ConfiguracoesComunicacao} comunicacoes
 * @property {ClientRole[]} roles
 * @property {string} notas
 * @property {ClientSource} origem
 */

/**
 * @typedef {Object} ClientFormStep
 * @property {number} step - Número do passo atual
 * @property {boolean} isValid - Se o passo está válido
 * @property {Object} errors - Erros de validação
 * @property {boolean} touched - Se foi tocado pelo utilizador
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
 */

/**
 * @typedef {Object} ClientResponse
 * @property {Cliente} data - Dados do cliente
 * @property {boolean} success - Se foi sucesso
 * @property {string} message - Mensagem de resposta
 */

/**
 * @typedef {Object} UploadResponse
 * @property {string} url - URL do arquivo
 * @property {string} fileName - Nome do arquivo
 * @property {number} size - Tamanho em bytes
 * @property {boolean} success - Se foi sucesso
 */

// =========================================
// 🎯 STORE TYPES (ZUSTAND)
// =========================================

/**
 * @typedef {Object} ClientsStore
 * @property {Cliente[]} clients - Lista de clientes
 * @property {Cliente|null} selectedClient - Cliente selecionado
 * @property {ClientFilters} filters - Filtros aplicados
 * @property {ClientStats} stats - Estatísticas
 * @property {boolean} loading - Estado de carregamento
 * @property {string|null} error - Mensagem de erro
 * @property {number} page - Página atual
 * @property {number} limit - Limite por página
 * @property {number} total - Total de registos
 * 
 * @property {Function} fetchClients - Buscar clientes
 * @property {Function} fetchClient - Buscar cliente específico
 * @property {Function} createClient - Criar novo cliente
 * @property {Function} updateClient - Atualizar cliente
 * @property {Function} deleteClient - Deletar cliente
 * @property {Function} setFilters - Definir filtros
 * @property {Function} clearFilters - Limpar filtros
 * @property {Function} setSelectedClient - Selecionar cliente
 * @property {Function} clearError - Limpar erro
 * @property {Function} fetchStats - Buscar estatísticas
 */

// =========================================
// 🎯 HOOK TYPES
// =========================================

/**
 * @typedef {Object} UseClientsReturn
 * @property {Cliente[]} clients
 * @property {boolean} loading
 * @property {string|null} error
 * @property {Function} refetch
 * @property {Function} loadMore
 * @property {boolean} hasMore
 */

/**
 * @typedef {Object} UseClientFormReturn
 * @property {Object} formData
 * @property {Function} updateFormData
 * @property {Function} validateStep
 * @property {Function} submitForm
 * @property {boolean} isValid
 * @property {Object} errors
 * @property {boolean} isSubmitting
 */

/**
 * @typedef {Object} UseClientDocumentsReturn
 * @property {Documento[]} documents
 * @property {Function} uploadDocument
 * @property {Function} deleteDocument
 * @property {boolean} uploading
 * @property {number} uploadProgress
 * @property {string|null} uploadError
 */

export {
  // Tipos principais não precisam ser exportados explicitamente em JS
  // As definições JSDoc servem para documentação e IntelliSense
};
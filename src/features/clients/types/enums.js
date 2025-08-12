// src/features/clients/types/enums.js
// 🔧 CORREÇÃO DE EXPORTS - PROBLEMA CONSOLE RESOLVIDO

// =========================================
// 🏷️ ESTADO CIVIL
// =========================================
export const EstadoCivil = {
  SOLTEIRO: 'solteiro',
  CASADO: 'casado',
  DIVORCIADO: 'divorciado',
  VIUVO: 'viuvo',
  UNIAO_FACTO: 'uniao_facto',
  SEPARADO: 'separado'
};

export const EstadoCivilLabels = {
  [EstadoCivil.SOLTEIRO]: 'Solteiro(a)',
  [EstadoCivil.CASADO]: 'Casado(a)',
  [EstadoCivil.DIVORCIADO]: 'Divorciado(a)',
  [EstadoCivil.VIUVO]: 'Viúvo(a)',
  [EstadoCivil.UNIAO_FACTO]: 'União de Facto',
  [EstadoCivil.SEPARADO]: 'Separado(a)'
};

// 🔧 EXPORT LEGACY para compatibilidade
export const ESTADOS_CIVIS = Object.entries(EstadoCivilLabels).map(([value, label]) => ({
  value,
  label
}));

// =========================================
// 👥 ROLES DO CLIENTE
// =========================================
export const ClientRole = {
  INVESTIDOR: 'investidor',
  COMPRADOR: 'comprador',
  VENDEDOR: 'vendedor',
  SENHORIO: 'senhorio',
  INQUILINO: 'inquilino',
  PROMOTOR: 'promotor',
  INTERMEDIARIO: 'intermediario'
};

export const ClientRoleLabels = {
  [ClientRole.INVESTIDOR]: 'Investidor',
  [ClientRole.COMPRADOR]: 'Comprador',
  [ClientRole.VENDEDOR]: 'Vendedor',
  [ClientRole.SENHORIO]: 'Senhorio',
  [ClientRole.INQUILINO]: 'Inquilino',
  [ClientRole.PROMOTOR]: 'Promotor',
  [ClientRole.INTERMEDIARIO]: 'Intermediário'
};

export const ClientRoleColors = {
  [ClientRole.INVESTIDOR]: 'bg-purple-100 text-purple-800',
  [ClientRole.COMPRADOR]: 'bg-green-100 text-green-800',
  [ClientRole.VENDEDOR]: 'bg-blue-100 text-blue-800',
  [ClientRole.SENHORIO]: 'bg-yellow-100 text-yellow-800',
  [ClientRole.INQUILINO]: 'bg-orange-100 text-orange-800',
  [ClientRole.PROMOTOR]: 'bg-red-100 text-red-800',
  [ClientRole.INTERMEDIARIO]: 'bg-gray-100 text-gray-800'
};

// =========================================
// 💍 COMUNHÃO DE BENS
// =========================================
export const ComunhaoBens = {
  COMUNHAO_GERAL: 'comunhao_geral',
  SEPARACAO_BENS: 'separacao_bens',
  COMUNHAO_ADQUIRIDOS: 'comunhao_adquiridos',
  REGIME_MISTO: 'regime_misto'
};

export const ComunhaoBensLabels = {
  [ComunhaoBens.COMUNHAO_GERAL]: 'Comunhão Geral de Bens',
  [ComunhaoBens.SEPARACAO_BENS]: 'Separação de Bens',
  [ComunhaoBens.COMUNHAO_ADQUIRIDOS]: 'Comunhão de Adquiridos',
  [ComunhaoBens.REGIME_MISTO]: 'Regime Misto'
};

// =========================================
// 🤝 TIPOS DE NEGÓCIO
// =========================================
export const DealType = {
  COMPRA: 'compra',
  VENDA: 'venda',
  ARRENDAMENTO: 'arrendamento',
  INVESTIMENTO: 'investimento',
  PERMUTA: 'permuta',
  AVALIACAO: 'avaliacao',
  CONSULTORIA: 'consultoria'
};

export const DealTypeLabels = {
  [DealType.COMPRA]: 'Compra',
  [DealType.VENDA]: 'Venda',
  [DealType.ARRENDAMENTO]: 'Arrendamento',
  [DealType.INVESTIMENTO]: 'Investimento',
  [DealType.PERMUTA]: 'Permuta',
  [DealType.AVALIACAO]: 'Avaliação',
  [DealType.CONSULTORIA]: 'Consultoria'
};

// =========================================
// 📊 STATUS DOS NEGÓCIOS
// =========================================
export const DealStatus = {
  PROSPECTO: 'prospecto',
  QUALIFICADO: 'qualificado',
  EM_NEGOCIACAO: 'em_negociacao',
  PROPOSTA_ENVIADA: 'proposta_enviada',
  PROPOSTA_ACEITE: 'proposta_aceite',
  CPCV_ASSINADO: 'cpcv_assinado',
  ESCRITURA_AGENDADA: 'escritura_agendada',
  CONCLUIDO: 'concluido',
  CANCELADO: 'cancelado',
  SUSPENSO: 'suspenso',
  PROCURA_ATIVA: 'procura_ativa',
  VISITAS_AGENDADAS: 'visitas_agendadas',
  FINANCIAMENTO_PENDENTE: 'financiamento_pendente',
  FINANCIAMENTO_APROVADO: 'financiamento_aprovado',
  AVALIACAO_PENDENTE: 'avaliacao_pendente',
  CMI_ASSINADO: 'cmi_assinado',
  MARKETING_ATIVO: 'marketing_ativo',
  VISITAS_MARCADAS: 'visitas_marcadas',
  CONTRATO_ASSINADO: 'contrato_assinado',
  CAUÇÃO_PAGA: 'caucao_paga'
};

export const DealStatusLabels = {
  [DealStatus.PROSPECTO]: 'Prospeto',
  [DealStatus.QUALIFICADO]: 'Qualificado',
  [DealStatus.EM_NEGOCIACAO]: 'Em Negociação',
  [DealStatus.PROPOSTA_ENVIADA]: 'Proposta Enviada',
  [DealStatus.PROPOSTA_ACEITE]: 'Proposta Aceite',
  [DealStatus.CPCV_ASSINADO]: 'CPCV Assinado',
  [DealStatus.ESCRITURA_AGENDADA]: 'Escritura Agendada',
  [DealStatus.CONCLUIDO]: 'Concluído',
  [DealStatus.CANCELADO]: 'Cancelado',
  [DealStatus.SUSPENSO]: 'Suspenso',
  [DealStatus.PROCURA_ATIVA]: 'Procura Ativa',
  [DealStatus.VISITAS_AGENDADAS]: 'Visitas Agendadas',
  [DealStatus.FINANCIAMENTO_PENDENTE]: 'Financiamento Pendente',
  [DealStatus.FINANCIAMENTO_APROVADO]: 'Financiamento Aprovado',
  [DealStatus.AVALIACAO_PENDENTE]: 'Avaliação Pendente',
  [DealStatus.CMI_ASSINADO]: 'CMI Assinado',
  [DealStatus.MARKETING_ATIVO]: 'Marketing Ativo',
  [DealStatus.VISITAS_MARCADAS]: 'Visitas Marcadas',
  [DealStatus.CONTRATO_ASSINADO]: 'Contrato Assinado',
  [DealStatus.CAUÇÃO_PAGA]: 'Caução Paga'
};

export const DealStatusColors = {
  [DealStatus.PROSPECTO]: 'bg-gray-100 text-gray-800',
  [DealStatus.QUALIFICADO]: 'bg-blue-100 text-blue-800',
  [DealStatus.EM_NEGOCIACAO]: 'bg-yellow-100 text-yellow-800',
  [DealStatus.PROPOSTA_ENVIADA]: 'bg-orange-100 text-orange-800',
  [DealStatus.PROPOSTA_ACEITE]: 'bg-green-100 text-green-800',
  [DealStatus.CPCV_ASSINADO]: 'bg-green-200 text-green-900',
  [DealStatus.ESCRITURA_AGENDADA]: 'bg-emerald-100 text-emerald-800',
  [DealStatus.CONCLUIDO]: 'bg-emerald-200 text-emerald-900',
  [DealStatus.CANCELADO]: 'bg-red-100 text-red-800',
  [DealStatus.SUSPENSO]: 'bg-gray-200 text-gray-700',
  [DealStatus.PROCURA_ATIVA]: 'bg-blue-100 text-blue-800',
  [DealStatus.VISITAS_AGENDADAS]: 'bg-purple-100 text-purple-800',
  [DealStatus.FINANCIAMENTO_PENDENTE]: 'bg-yellow-100 text-yellow-800',
  [DealStatus.FINANCIAMENTO_APROVADO]: 'bg-green-100 text-green-800',
  [DealStatus.AVALIACAO_PENDENTE]: 'bg-orange-100 text-orange-800',
  [DealStatus.CMI_ASSINADO]: 'bg-blue-100 text-blue-800',
  [DealStatus.MARKETING_ATIVO]: 'bg-purple-100 text-purple-800',
  [DealStatus.VISITAS_MARCADAS]: 'bg-indigo-100 text-indigo-800',
  [DealStatus.CONTRATO_ASSINADO]: 'bg-green-100 text-green-800',
  [DealStatus.CAUÇÃO_PAGA]: 'bg-emerald-100 text-emerald-800'
};

// =========================================
// 📱 TIPOS DE COMUNICAÇÃO
// =========================================
export const CommunicationType = {
  EMAIL: 'email',
  TELEFONE: 'telefone',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  PRESENCIAL: 'presencial',
  VIDEOCHAMADA: 'videochamada',
  CARTA: 'carta',
  NOTA: 'nota'
};

export const CommunicationTypeLabels = {
  [CommunicationType.EMAIL]: 'Email',
  [CommunicationType.TELEFONE]: 'Telefone',
  [CommunicationType.SMS]: 'SMS',
  [CommunicationType.WHATSAPP]: 'WhatsApp',
  [CommunicationType.PRESENCIAL]: 'Presencial',
  [CommunicationType.VIDEOCHAMADA]: 'Videochamada',
  [CommunicationType.CARTA]: 'Carta',
  [CommunicationType.NOTA]: 'Nota'
};

// =========================================
// 📄 CATEGORIAS DE DOCUMENTOS
// =========================================
export const DocumentCategory = {
  IDENTIFICACAO: 'identificacao',
  COMPROVATIVO_MORADA: 'comprovativo_morada',
  COMPROVATIVO_RENDIMENTOS: 'comprovativo_rendimentos',
  DOCUMENTOS_BANCARIOS: 'documentos_bancarios',
  PROPRIEDADES: 'propriedades',
  CONTRATOS: 'contratos',
  OUTROS: 'outros'
};

export const DocumentCategoryLabels = {
  [DocumentCategory.IDENTIFICACAO]: 'Identificação',
  [DocumentCategory.COMPROVATIVO_MORADA]: 'Comprovativo de Morada',
  [DocumentCategory.COMPROVATIVO_RENDIMENTOS]: 'Comprovativo de Rendimentos',
  [DocumentCategory.DOCUMENTOS_BANCARIOS]: 'Documentos Bancários',
  [DocumentCategory.PROPRIEDADES]: 'Propriedades',
  [DocumentCategory.CONTRATOS]: 'Contratos',
  [DocumentCategory.OUTROS]: 'Outros'
};

// 🔧 EXPORT LEGACY para TIPOS_DOCUMENTO
export const TIPOS_DOCUMENTO = Object.entries(DocumentCategoryLabels).map(([value, label]) => ({
  value,
  label
}));

// =========================================
// 🎯 ORIGEM DOS CLIENTES
// =========================================
export const ClientSource = {
  WEBSITE: 'website',
  REFERENCIA: 'referencia',
  REDES_SOCIAIS: 'redes_sociais',
  PUBLICIDADE: 'publicidade',
  IMOVEIS_ONLINE: 'imoveis_online',
  CONTACTO_DIRETO: 'contacto_direto',
  EVENTO: 'evento',
  PARCEIRO: 'parceiro',
  RECOMENDACAO: 'recomendacao',
  OUTRO: 'outro'
};

export const ClientSourceLabels = {
  [ClientSource.WEBSITE]: 'Website',
  [ClientSource.REFERENCIA]: 'Referência',
  [ClientSource.REDES_SOCIAIS]: 'Redes Sociais',
  [ClientSource.PUBLICIDADE]: 'Publicidade',
  [ClientSource.IMOVEIS_ONLINE]: 'Imóveis Online',
  [ClientSource.CONTACTO_DIRETO]: 'Contacto Direto',
  [ClientSource.EVENTO]: 'Evento',
  [ClientSource.PARCEIRO]: 'Parceiro',
  [ClientSource.RECOMENDACAO]: 'Recomendação',
  [ClientSource.OUTRO]: 'Outro'
};

// =========================================
// ⚙️ CONFIGURAÇÕES E CONSTANTES
// =========================================

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 5
};

export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};

export const REQUIRED_FIELDS = {
  STEP_1: ['nome', 'email', 'telefone'],
  STEP_2: [],
  STEP_3: [],
  STEP_4: [],
  STEP_5: ['roles']
};

export const INPUT_MASKS = {
  TELEFONE: '+351 ### ### ###',
  NIF: '### ### ###',
  IBAN: 'PT50 #### #### #### #### ####',
  CARTAO_CIDADAO: '######## # AA#'
};

export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONE: /^(\+351)?[0-9]{9}$/,
  NIF: /^[0-9]{9}$/,
  IBAN: /^PT50[0-9]{19}$/,
  CARTAO_CIDADAO: /^[0-9]{8}[0-9][A-Z]{2}[0-9]$/
};

export const ESTADOS_COM_CONJUGE = [
  EstadoCivil.CASADO,
  EstadoCivil.UNIAO_FACTO
];

export const ROLES_COM_DEALS = [
  ClientRole.COMPRADOR,
  ClientRole.VENDEDOR,
  ClientRole.INVESTIDOR,
  ClientRole.SENHORIO,
  ClientRole.INQUILINO
];

// =========================================
// 📦 EXPORT PRINCIPAL
// =========================================
export const ClientEnums = {
  EstadoCivil,
  EstadoCivilLabels,
  ClientRole,
  ClientRoleLabels,
  ClientRoleColors,
  ComunhaoBens,
  ComunhaoBensLabels,
  DealType,
  DealTypeLabels,
  DealStatus,
  DealStatusLabels,
  DealStatusColors,
  CommunicationType,
  CommunicationTypeLabels,
  DocumentCategory,
  DocumentCategoryLabels,
  ClientSource,
  ClientSourceLabels,
  PAGINATION,
  FILE_LIMITS,
  REQUIRED_FIELDS,
  INPUT_MASKS,
  VALIDATION_REGEX,
  ESTADOS_COM_CONJUGE,
  ROLES_COM_DEALS,
  // Legacy exports
  ESTADOS_CIVIS,
  TIPOS_DOCUMENTO
};
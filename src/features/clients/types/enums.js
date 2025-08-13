// =========================================
// 🎯 ENUMS & CONSTANTES - MÓDULO CLIENTES EXPANDIDO
// =========================================
// Todas as enumerações e constantes para o sistema de clientes
// Estrutura completa para CRM imobiliário profissional

// =========================================
// 👤 DADOS PESSOAIS E FAMILIARES
// =========================================

export const EstadoCivil = {
  SOLTEIRO: 'solteiro',
  CASADO: 'casado',
  UNIAO_FACTO: 'uniao_facto',
  DIVORCIADO: 'divorciado',
  VIUVO: 'viuvo',
  SEPARADO: 'separado'
};

export const EstadoCivilLabels = {
  [EstadoCivil.SOLTEIRO]: 'Solteiro(a)',
  [EstadoCivil.CASADO]: 'Casado(a)',
  [EstadoCivil.UNIAO_FACTO]: 'União de Facto',
  [EstadoCivil.DIVORCIADO]: 'Divorciado(a)',
  [EstadoCivil.VIUVO]: 'Viúvo(a)',
  [EstadoCivil.SEPARADO]: 'Separado(a)'
};

export const ComunhaoBens = {
  GERAL: 'geral',
  SEPARACAO: 'separacao',
  ADQUIRIDOS: 'adquiridos'
};

export const ComunhaoBensLabels = {
  [ComunhaoBens.GERAL]: 'Comunhão Geral',
  [ComunhaoBens.SEPARACAO]: 'Separação de Bens',
  [ComunhaoBens.ADQUIRIDOS]: 'Comunhão de Adquiridos'
};

// Estados que requerem dados do cônjuge
export const ESTADOS_COM_CONJUGE = [
  EstadoCivil.CASADO,
  EstadoCivil.UNIAO_FACTO
];

// =========================================
// 💰 DADOS FINANCEIROS
// =========================================

export const RendimentoAnual = {
  ATE_25K: 'ate_25k',
  R25K_50K: '25k_50k',
  R50K_75K: '50k_75k',
  R75K_100K: '75k_100k',
  R100K_150K: '100k_150k',
  R150K_PLUS: '150k_plus'
};

export const RendimentoAnualLabels = {
  [RendimentoAnual.ATE_25K]: 'Até 25.000€',
  [RendimentoAnual.R25K_50K]: '25.000€ - 50.000€',
  [RendimentoAnual.R50K_75K]: '50.000€ - 75.000€',
  [RendimentoAnual.R75K_100K]: '75.000€ - 100.000€',
  [RendimentoAnual.R100K_150K]: '100.000€ - 150.000€',
  [RendimentoAnual.R150K_PLUS]: 'Mais de 150.000€'
};

export const OrcamentoFaixa = {
  ATE_100K: 'ate_100k',
  O100K_200K: '100k_200k',
  O200K_300K: '200k_300k',
  O300K_500K: '300k_500k',
  O500K_750K: '500k_750k',
  O750K_1M: '750k_1m',
  O1M_PLUS: '1m_plus'
};

export const OrcamentoFaixaLabels = {
  [OrcamentoFaixa.ATE_100K]: 'Até 100.000€',
  [OrcamentoFaixa.O100K_200K]: '100.000€ - 200.000€',
  [OrcamentoFaixa.O200K_300K]: '200.000€ - 300.000€',
  [OrcamentoFaixa.O300K_500K]: '300.000€ - 500.000€',
  [OrcamentoFaixa.O500K_750K]: '500.000€ - 750.000€',
  [OrcamentoFaixa.O750K_1M]: '750.000€ - 1.000.000€',
  [OrcamentoFaixa.O1M_PLUS]: 'Mais de 1.000.000€'
};

// =========================================
// 🏠 HABITAÇÃO E IMÓVEIS
// =========================================

export const TipoHabitacao = {
  APARTAMENTO: 'apartamento',
  MORADIA: 'moradia',
  QUARTO: 'quarto',
  ESTUDIO: 'estudio',
  OUTRO: 'outro'
};

export const TipoHabitacaoLabels = {
  [TipoHabitacao.APARTAMENTO]: 'Apartamento',
  [TipoHabitacao.MORADIA]: 'Moradia',
  [TipoHabitacao.QUARTO]: 'Quarto',
  [TipoHabitacao.ESTUDIO]: 'Estúdio',
  [TipoHabitacao.OUTRO]: 'Outro'
};

export const RegimeHabitacao = {
  PROPRIETARIO: 'proprietario',
  ARRENDATARIO: 'arrendatario',
  FAMILIARES: 'familiares',
  OUTRO: 'outro'
};

export const RegimeHabitacaoLabels = {
  [RegimeHabitacao.PROPRIETARIO]: 'Proprietário',
  [RegimeHabitacao.ARRENDATARIO]: 'Arrendatário',
  [RegimeHabitacao.FAMILIARES]: 'Casa de Familiares',
  [RegimeHabitacao.OUTRO]: 'Outro'
};

export const TipoImovel = {
  APARTAMENTO: 'apartamento',
  MORADIA: 'moradia',
  TERRENO: 'terreno',
  COMERCIAL: 'comercial',
  INDUSTRIAL: 'industrial',
  INVESTIMENTO: 'investimento'
};

export const TipoImovelLabels = {
  [TipoImovel.APARTAMENTO]: 'Apartamento',
  [TipoImovel.MORADIA]: 'Moradia',
  [TipoImovel.TERRENO]: 'Terreno',
  [TipoImovel.COMERCIAL]: 'Espaço Comercial',
  [TipoImovel.INDUSTRIAL]: 'Espaço Industrial',
  [TipoImovel.INVESTIMENTO]: 'Investimento'
};

// =========================================
// 🎯 MOTIVAÇÕES E PRIORIDADES
// =========================================

export const MotivacoesCompra = {
  PRIMEIRA_HABITACAO: 'primeira_habitacao',
  INVESTIMENTO: 'investimento',
  MUDANCA_ZONA: 'mudanca_zona',
  UPGRADE_CASA: 'upgrade_casa',
  DIVORCIO: 'divorcio',
  HERANCA: 'heranca',
  FAMILIA_CRESCEU: 'familia_cresceu',
  TRABALHO: 'trabalho',
  OUTRO: 'outro'
};

export const MotivacoesCompraLabels = {
  [MotivacoesCompra.PRIMEIRA_HABITACAO]: 'Primeira Habitação',
  [MotivacoesCompra.INVESTIMENTO]: 'Investimento',
  [MotivacoesCompra.MUDANCA_ZONA]: 'Mudança de Zona',
  [MotivacoesCompra.UPGRADE_CASA]: 'Casa Maior/Melhor',
  [MotivacoesCompra.DIVORCIO]: 'Divórcio/Separação',
  [MotivacoesCompra.HERANCA]: 'Herança',
  [MotivacoesCompra.FAMILIA_CRESCEU]: 'Família Cresceu',
  [MotivacoesCompra.TRABALHO]: 'Mudança de Trabalho',
  [MotivacoesCompra.OUTRO]: 'Outro'
};

export const PrioridadesImovel = {
  LOCALIZACAO: 'localizacao',
  PRECO: 'preco',
  TAMANHO: 'tamanho',
  CONDICAO: 'condicao',
  TRANSPORTES: 'transportes',
  ESCOLAS: 'escolas',
  SEGURANCA: 'seguranca',
  COMERCIOS: 'comercios',
  ESTACIONAMENTO: 'estacionamento'
};

export const PrioridadesImovelLabels = {
  [PrioridadesImovel.LOCALIZACAO]: 'Localização',
  [PrioridadesImovel.PRECO]: 'Preço',
  [PrioridadesImovel.TAMANHO]: 'Tamanho',
  [PrioridadesImovel.CONDICAO]: 'Condição do Imóvel',
  [PrioridadesImovel.TRANSPORTES]: 'Transportes Públicos',
  [PrioridadesImovel.ESCOLAS]: 'Proximidade a Escolas',
  [PrioridadesImovel.SEGURANCA]: 'Segurança da Zona',
  [PrioridadesImovel.COMERCIOS]: 'Comércio Local',
  [PrioridadesImovel.ESTACIONAMENTO]: 'Estacionamento'
};

export const UrgenciaCompra = {
  URGENTE: 'urgente',
  MODERADA: 'moderada', 
  FLEXIVEL: 'flexivel',
  SEM_PRESSA: 'sem_pressa'
};

export const UrgenciaCompraLabels = {
  [UrgenciaCompra.URGENTE]: 'Urgente (< 3 meses)',
  [UrgenciaCompra.MODERADA]: 'Moderada (3-6 meses)',
  [UrgenciaCompra.FLEXIVEL]: 'Flexível (6-12 meses)',
  [UrgenciaCompra.SEM_PRESSA]: 'Sem Pressa (> 1 ano)'
};

// =========================================
// 📞 COMUNICAÇÃO E CONTACTOS
// =========================================

export const MeioContactoPreferido = {
  EMAIL: 'email',
  TELEFONE: 'telefone',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  PRESENCIAL: 'presencial'
};

export const MeioContactoPreferidoLabels = {
  [MeioContactoPreferido.EMAIL]: 'Email',
  [MeioContactoPreferido.TELEFONE]: 'Telefone',
  [MeioContactoPreferido.SMS]: 'SMS',
  [MeioContactoPreferido.WHATSAPP]: 'WhatsApp',
  [MeioContactoPreferido.PRESENCIAL]: 'Presencial'
};

export const FrequenciaContacto = {
  DIARIA: 'diaria',
  SEMANAL: 'semanal',
  QUINZENAL: 'quinzenal',
  MENSAL: 'mensal',
  TRIMESTRAL: 'trimestral',
  APENAS_NECESSARIO: 'apenas_necessario'
};

export const FrequenciaContactoLabels = {
  [FrequenciaContacto.DIARIA]: 'Diária',
  [FrequenciaContacto.SEMANAL]: 'Semanal',
  [FrequenciaContacto.QUINZENAL]: 'Quinzenal',
  [FrequenciaContacto.MENSAL]: 'Mensal',
  [FrequenciaContacto.TRIMESTRAL]: 'Trimestral',
  [FrequenciaContacto.APENAS_NECESSARIO]: 'Apenas Quando Necessário'
};

export const MeioContacto = {
  TELEFONE: 'telefone',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  SMS: 'sms',
  PRESENCIAL: 'presencial',
  REDES_SOCIAIS: 'redes_sociais',
  REFERENCIA: 'referencia',
  WEBSITE: 'website'
};

export const MeioContactoLabels = {
  [MeioContacto.TELEFONE]: 'Telefone',
  [MeioContacto.EMAIL]: 'Email',
  [MeioContacto.WHATSAPP]: 'WhatsApp',
  [MeioContacto.SMS]: 'SMS',
  [MeioContacto.PRESENCIAL]: 'Presencial',
  [MeioContacto.REDES_SOCIAIS]: 'Redes Sociais',
  [MeioContacto.REFERENCIA]: 'Referência',
  [MeioContacto.WEBSITE]: 'Website'
};

export const TemperaturaCliente = {
  QUENTE: 'quente',
  MORNO: 'morno',
  FRIO: 'frio',
  INATIVO: 'inativo'
};

export const TemperaturaClienteLabels = {
  [TemperaturaCliente.QUENTE]: 'Quente',
  [TemperaturaCliente.MORNO]: 'Morno',
  [TemperaturaCliente.FRIO]: 'Frio',
  [TemperaturaCliente.INATIVO]: 'Inativo'
};

export const TemperaturaClienteColors = {
  [TemperaturaCliente.QUENTE]: 'red',
  [TemperaturaCliente.MORNO]: 'orange',
  [TemperaturaCliente.FRIO]: 'blue',
  [TemperaturaCliente.INATIVO]: 'gray'
};

// =========================================
// 🎭 ROLES E ORIGENS
// =========================================

export const ClientRole = {
  COMPRADOR: 'comprador',
  VENDEDOR: 'vendedor',
  INVESTIDOR: 'investidor',
  INQUILINO: 'inquilino',
  SENHORIO: 'senhorio'
};

export const ClientRoleLabels = {
  [ClientRole.COMPRADOR]: 'Comprador',
  [ClientRole.VENDEDOR]: 'Vendedor',
  [ClientRole.INVESTIDOR]: 'Investidor',
  [ClientRole.INQUILINO]: 'Inquilino',
  [ClientRole.SENHORIO]: 'Senhorio'
};

export const ClientRoleColors = {
  [ClientRole.COMPRADOR]: 'green',
  [ClientRole.VENDEDOR]: 'blue',
  [ClientRole.INVESTIDOR]: 'purple',
  [ClientRole.INQUILINO]: 'orange',
  [ClientRole.SENHORIO]: 'pink'
};

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
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  IDEALISTA: 'idealista',
  OUTRO: 'outro'
};

export const ClientSourceLabels = {
  [ClientSource.WEBSITE]: 'Website',
  [ClientSource.REFERENCIA]: 'Referência',
  [ClientSource.REDES_SOCIAIS]: 'Redes Sociais',
  [ClientSource.PUBLICIDADE]: 'Publicidade',
  [ClientSource.IMOVEIS_ONLINE]: 'Portais Imobiliários',
  [ClientSource.CONTACTO_DIRETO]: 'Contacto Direto',
  [ClientSource.EVENTO]: 'Evento',
  [ClientSource.PARCEIRO]: 'Parceiro',
  [ClientSource.RECOMENDACAO]: 'Recomendação',
  [ClientSource.GOOGLE]: 'Google',
  [ClientSource.FACEBOOK]: 'Facebook',
  [ClientSource.INSTAGRAM]: 'Instagram',
  [ClientSource.IDEALISTA]: 'Idealista',
  [ClientSource.OUTRO]: 'Outro'
};

// =========================================
// 📄 DOCUMENTOS
// =========================================

export const DocumentCategory = {
  CC: 'cc',
  NIF: 'nif',
  COMPROVATIVO_MORADA: 'comprovativo_morada',
  COMPROVATIVO_RENDIMENTOS: 'comprovativo_rendimentos',
  EXTRACTO_BANCARIO: 'extracto_bancario',
  AUTORIZAÇÃO_CREDITO: 'autorizacao_credito',
  CONTRATO_TRABALHO: 'contrato_trabalho',
  DECLARACAO_IRS: 'declaracao_irs',
  ESCRITURA: 'escritura',
  CADERNETA_PREDIAL: 'caderneta_predial',
  CERTIDAO_PERMANENTE: 'certidao_permanente',
  OUTRO: 'outro'
};

export const DocumentCategoryLabels = {
  [DocumentCategory.CC]: 'Cartão de Cidadão',
  [DocumentCategory.NIF]: 'Cartão de Contribuinte',
  [DocumentCategory.COMPROVATIVO_MORADA]: 'Comprovativo de Morada',
  [DocumentCategory.COMPROVATIVO_RENDIMENTOS]: 'Comprovativo de Rendimentos',
  [DocumentCategory.EXTRACTO_BANCARIO]: 'Extracto Bancário',
  [DocumentCategory.AUTORIZAÇÃO_CREDITO]: 'Autorização de Crédito',
  [DocumentCategory.CONTRATO_TRABALHO]: 'Contrato de Trabalho',
  [DocumentCategory.DECLARACAO_IRS]: 'Declaração de IRS',
  [DocumentCategory.ESCRITURA]: 'Escritura',
  [DocumentCategory.CADERNETA_PREDIAL]: 'Caderneta Predial',
  [DocumentCategory.CERTIDAO_PERMANENTE]: 'Certidão Permanente',
  [DocumentCategory.OUTRO]: 'Outro'
};

// =========================================
// 💼 NEGÓCIOS E TRANSAÇÕES
// =========================================

export const TipoDeal = {
  COMPRA: 'compra',
  VENDA: 'venda',
  ARRENDAMENTO: 'arrendamento',
  CONSULTORIA: 'consultoria',
  AVALIACAO: 'avaliacao'
};

export const TipoDealLabels = {
  [TipoDeal.COMPRA]: 'Compra',
  [TipoDeal.VENDA]: 'Venda',
  [TipoDeal.ARRENDAMENTO]: 'Arrendamento',
  [TipoDeal.CONSULTORIA]: 'Consultoria',
  [TipoDeal.AVALIACAO]: 'Avaliação'
};

export const StatusDeal = {
  PROSPECTO: 'prospecto',
  QUALIFICADO: 'qualificado',
  PROPOSTA: 'proposta',
  NEGOCIACAO: 'negociacao',
  FECHADO: 'fechado',
  CANCELADO: 'cancelado'
};

export const StatusDealLabels = {
  [StatusDeal.PROSPECTO]: 'Prospecto',
  [StatusDeal.QUALIFICADO]: 'Qualificado',
  [StatusDeal.PROPOSTA]: 'Proposta Enviada',
  [StatusDeal.NEGOCIACAO]: 'Em Negociação',
  [StatusDeal.FECHADO]: 'Fechado',
  [StatusDeal.CANCELADO]: 'Cancelado'
};

export const StatusDealColors = {
  [StatusDeal.PROSPECTO]: 'gray',
  [StatusDeal.QUALIFICADO]: 'blue',
  [StatusDeal.PROPOSTA]: 'yellow',
  [StatusDeal.NEGOCIACAO]: 'orange',
  [StatusDeal.FECHADO]: 'green',
  [StatusDeal.CANCELADO]: 'red'
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
  STEP_1: ['nome', 'email', 'telefone'], // Dados pessoais essenciais
  STEP_2: [], // Cônjuge (condicional)
  STEP_3: [], // Dados bancários (opcional)
  STEP_4: ['dataPrimeiroContacto', 'meioPrimeiroContacto'], // Dados de contacto
  STEP_5: ['orcamentoMinimo', 'orcamentoMaximo'], // Perfil imobiliário
  STEP_6: ['roles'] // Roles (obrigatório)
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
  IBAN: /^PT50[0-9]{21}$/,
  CARTAO_CIDADAO: /^[0-9]{8}[0-9][A-Z]{2}[0-9]$/
};

export const SCORE_WEIGHTS = {
  DADOS_PESSOAIS: 0.2,
  DADOS_BANCARIOS: 0.15,
  PERFIL_IMOBILIARIO: 0.25,
  DOCUMENTOS: 0.15,
  CONTACTOS_RECENTES: 0.15,
  DEALS_ATIVOS: 0.1
};

// =========================================
// 📊 ARRAYS PARA SELECTS E DROPDOWNS
// =========================================

export const ESTADOS_CIVIS = Object.entries(EstadoCivilLabels).map(([value, label]) => ({
  value,
  label
}));

export const RENDIMENTOS_ANUAIS = Object.entries(RendimentoAnualLabels).map(([value, label]) => ({
  value,
  label
}));

export const ORCAMENTOS_FAIXAS = Object.entries(OrcamentoFaixaLabels).map(([value, label]) => ({
  value,
  label
}));

export const TIPOS_HABITACAO = Object.entries(TipoHabitacaoLabels).map(([value, label]) => ({
  value,
  label
}));

export const REGIMES_HABITACAO = Object.entries(RegimeHabitacaoLabels).map(([value, label]) => ({
  value,
  label
}));

export const TIPOS_IMOVEL = Object.entries(TipoImovelLabels).map(([value, label]) => ({
  value,
  label
}));

export const MOTIVACOES_COMPRA = Object.entries(MotivacoesCompraLabels).map(([value, label]) => ({
  value,
  label
}));

export const PRIORIDADES_IMOVEL = Object.entries(PrioridadesImovelLabels).map(([value, label]) => ({
  value,
  label
}));

export const URGENCIAS_COMPRA = Object.entries(UrgenciaCompraLabels).map(([value, label]) => ({
  value,
  label
}));

export const MEIOS_CONTACTO_PREFERIDO = Object.entries(MeioContactoPreferidoLabels).map(([value, label]) => ({
  value,
  label
}));

export const FREQUENCIAS_CONTACTO = Object.entries(FrequenciaContactoLabels).map(([value, label]) => ({
  value,
  label
}));

export const TEMPERATURAS_CLIENTE = Object.entries(TemperaturaClienteLabels).map(([value, label]) => ({
  value,
  label,
  color: TemperaturaClienteColors[value]
}));

export const CLIENT_ROLES = Object.entries(ClientRoleLabels).map(([value, label]) => ({
  value,
  label,
  color: ClientRoleColors[value]
}));

export const CLIENT_SOURCES = Object.entries(ClientSourceLabels).map(([value, label]) => ({
  value,
  label
}));

export const TIPOS_DOCUMENTO = Object.entries(DocumentCategoryLabels).map(([value, label]) => ({
  value,
  label
}));

export const TIPOS_DEAL = Object.entries(TipoDealLabels).map(([value, label]) => ({
  value,
  label
}));

export const STATUS_DEALS = Object.entries(StatusDealLabels).map(([value, label]) => ({
  value,
  label,
  color: StatusDealColors[value]
}));

// =========================================
// 🎯 FORM STEPS CONFIGURATION
// =========================================

export const FORM_STEPS = {
  1: {
    title: 'Dados Pessoais',
    description: 'Informações básicas do cliente',
    icon: 'User',
    fields: ['nome', 'email', 'telefone', 'dataNascimento', 'profissao', 'empresa']
  },
  2: {
    title: 'Dados do Cônjuge',
    description: 'Informações do cônjuge (se aplicável)',
    icon: 'Users',
    conditional: true,
    fields: ['conjuge.*']
  },
  3: {
    title: 'Dados Bancários',
    description: 'Informações bancárias e financeiras',
    icon: 'CreditCard',
    fields: ['dadosBancarios.*', 'rendimentoAnual']
  },
  4: {
    title: 'Histórico de Contacto',
    description: 'Dados do primeiro contacto e preferências',
    icon: 'Phone',
    fields: ['dataPrimeiroContacto', 'meioPrimeiroContacto', 'origem']
  },
  5: {
    title: 'Perfil Imobiliário',
    description: 'Preferências e necessidades imobiliárias',
    icon: 'Home',
    fields: ['perfilImobiliario.*']
  },
  6: {
    title: 'Roles e Finalização',
    description: 'Definir roles e configurações finais',
    icon: 'CheckCircle',
    fields: ['roles', 'comunicacoes.*', 'notas']
  }
};

// =========================================
// 🎨 CORES E TEMAS
// =========================================

export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  }
};
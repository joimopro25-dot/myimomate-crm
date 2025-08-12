// src/features/clients/types/schemas.js
// 🔧 SCHEMA ZOD PARA VALIDAÇÃO DE CLIENTES

import { z } from 'zod';
import { EstadoCivil, ClientRole, ComunhaoBens } from './enums';

// =========================================
// 🔍 REGEX VALIDATIONS
// =========================================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefoneRegex = /^(\+351\s?)?[9][1236]\s?\d{3}\s?\d{3}\s?\d{3}$/;
const nifRegex = /^[0-9]{9}$/;
const ibanRegex = /^PT50\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{3}$/;
const cartaoCidadaoRegex = /^[0-9]{8}\s?[0-9]\s?[A-Z]{2}[0-9]$/;

// =========================================
// 🎯 DADOS PESSOAIS SCHEMA
// =========================================
const dadosPessoaisSchema = z.object({
  nomeCompleto: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  
  email: z
    .string()
    .email('Email inválido')
    .refine((email) => emailRegex.test(email), 'Formato de email inválido'),
  
  telefone: z
    .string()
    .min(9, 'Telefone inválido')
    .refine((tel) => telefoneRegex.test(tel.replace(/\s/g, '')), 'Formato de telefone inválido (+351 9XX XXX XXX)'),
  
  dataNascimento: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 16 && age <= 120;
    }, 'Idade deve ser entre 16 e 120 anos'),
  
  naturalidade: z.string().optional(),
  
  nacionalidade: z.string().default('Portugal'),
  
  residencia: z.string().optional(),
  
  nif: z
    .string()
    .optional()
    .refine((nif) => !nif || nifRegex.test(nif), 'NIF deve ter 9 dígitos'),
  
  numeroCartaoCidadao: z
    .string()
    .optional()
    .refine((cc) => !cc || cartaoCidadaoRegex.test(cc), 'Formato de Cartão de Cidadão inválido'),
  
  estadoCivil: z
    .enum(Object.values(EstadoCivil))
    .default(EstadoCivil.SOLTEIRO)
});

// =========================================
// 🤵 DADOS CÔNJUGE SCHEMA
// =========================================
const conjugeSchema = z.object({
  nomeConjuge: z.string().optional(),
  emailConjuge: z
    .string()
    .optional()
    .refine((email) => !email || emailRegex.test(email), 'Email do cônjuge inválido'),
  
  telefoneConjuge: z
    .string()
    .optional()
    .refine((tel) => !tel || telefoneRegex.test(tel.replace(/\s/g, '')), 'Telefone do cônjuge inválido'),
  
  dataNascimentoConjuge: z.string().optional(),
  naturalidadeConjuge: z.string().optional(),
  nacionalidadeConjuge: z.string().default('Portugal'),
  residenciaConjuge: z.string().optional(),
  nifConjuge: z
    .string()
    .optional()
    .refine((nif) => !nif || nifRegex.test(nif), 'NIF do cônjuge inválido'),
  
  numeroCartaoCidadaoConjuge: z
    .string()
    .optional()
    .refine((cc) => !cc || cartaoCidadaoRegex.test(cc), 'Cartão de Cidadão do cônjuge inválido'),
  
  comunhaoBens: z
    .enum(Object.values(ComunhaoBens))
    .optional()
});

// =========================================
// 🏦 DADOS BANCÁRIOS SCHEMA
// =========================================
const dadosBancariosSchema = z.object({
  banco: z.string().optional(),
  
  iban: z
    .string()
    .optional()
    .refine((iban) => !iban || ibanRegex.test(iban.replace(/\s/g, '')), 'IBAN inválido (formato: PT50 XXXX XXXX XXXX XXXX XXX)'),
  
  swift: z
    .string()
    .optional()
    .max(11, 'Código SWIFT muito longo')
});

// =========================================
// ⚙️ CONFIGURAÇÕES SCHEMA
// =========================================
const configuracoesSchema = z.object({
  enviarEmailsAniversario: z.boolean().default(true),
  lembretesVisitas: z.boolean().default(true),
  lembretesPagamentos: z.boolean().default(true),
  eventosGerais: z.boolean().default(true)
});

// =========================================
// 🎯 SCHEMA PRINCIPAL DO CLIENTE
// =========================================
export const clientSchema = z.object({
  // Dados Pessoais (obrigatórios)
  nomeCompleto: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  
  email: z
    .string()
    .email('Email inválido')
    .refine((email) => emailRegex.test(email), 'Formato de email inválido'),
  
  telefone: z
    .string()
    .min(9, 'Telefone inválido')
    .refine((tel) => telefoneRegex.test(tel.replace(/\s/g, '')), 'Formato de telefone inválido (+351 9XX XXX XXX)'),
  
  // Dados Pessoais (opcionais)
  dataNascimento: z.string().optional(),
  naturalidade: z.string().optional(),
  nacionalidade: z.string().default('Portugal'),
  residencia: z.string().optional(),
  
  nif: z
    .string()
    .optional()
    .refine((nif) => !nif || nifRegex.test(nif), 'NIF deve ter 9 dígitos'),
  
  numeroCartaoCidadao: z
    .string()
    .optional()
    .refine((cc) => !cc || cartaoCidadaoRegex.test(cc), 'Formato de Cartão de Cidadão inválido'),
  
  estadoCivil: z
    .enum(Object.values(EstadoCivil))
    .default(EstadoCivil.SOLTEIRO),
  
  // Dados do Cônjuge (condicionais)
  nomeConjuge: z.string().optional(),
  emailConjuge: z
    .string()
    .optional()
    .refine((email) => !email || emailRegex.test(email), 'Email do cônjuge inválido'),
  
  telefoneConjuge: z
    .string()
    .optional()
    .refine((tel) => !tel || telefoneRegex.test(tel.replace(/\s/g, '')), 'Telefone do cônjuge inválido'),
  
  dataNascimentoConjuge: z.string().optional(),
  naturalidadeConjuge: z.string().optional(),
  nacionalidadeConjuge: z.string().optional(),
  residenciaConjuge: z.string().optional(),
  nifConjuge: z
    .string()
    .optional()
    .refine((nif) => !nif || nifRegex.test(nif), 'NIF do cônjuge inválido'),
  
  numeroCartaoCidadaoConjuge: z
    .string()
    .optional()
    .refine((cc) => !cc || cartaoCidadaoRegex.test(cc), 'Cartão de Cidadão do cônjuge inválido'),
  
  comunhaoBens: z
    .enum(Object.values(ComunhaoBens))
    .optional(),
  
  // Dados Bancários (opcionais)
  banco: z.string().optional(),
  iban: z
    .string()
    .optional()
    .refine((iban) => !iban || ibanRegex.test(iban.replace(/\s/g, '')), 'IBAN inválido'),
  
  swift: z.string().optional(),
  
  // Configurações
  configuracoes: configuracoesSchema.optional().default({}),
  
  // Roles (obrigatório pelo menos um)
  roles: z
    .array(z.enum(Object.values(ClientRole)))
    .min(1, 'Pelo menos um role é obrigatório'),
  
  // Observações
  observacoes: z.string().optional()
})
.refine((data) => {
  // Validação condicional: se casado, cônjuge deve ter nome
  if ([EstadoCivil.CASADO, EstadoCivil.UNIAO_FACTO].includes(data.estadoCivil)) {
    return data.nomeConjuge && data.nomeConjuge.trim().length > 0;
  }
  return true;
}, {
  message: 'Nome do cônjuge é obrigatório quando casado ou em união de facto',
  path: ['nomeConjuge']
})
.refine((data) => {
  // Validação condicional: se casado, regime de bens é obrigatório
  if ([EstadoCivil.CASADO, EstadoCivil.UNIAO_FACTO].includes(data.estadoCivil)) {
    return data.comunhaoBens;
  }
  return true;
}, {
  message: 'Regime de bens é obrigatório quando casado ou em união de facto',
  path: ['comunhaoBens']
});

// =========================================
// 📋 SCHEMAS ESPECÍFICOS PARA STEPS
// =========================================

// Step 1: Dados Pessoais
export const step1Schema = dadosPessoaisSchema;

// Step 2: Dados do Cônjuge  
export const step2Schema = conjugeSchema;

// Step 3: Dados Bancários
export const step3Schema = dadosBancariosSchema;

// Step 4: Configurações
export const step4Schema = configuracoesSchema;

// Step 5: Roles e Finalização
export const step5Schema = z.object({
  roles: z
    .array(z.enum(Object.values(ClientRole)))
    .min(1, 'Pelo menos um role é obrigatório'),
  
  observacoes: z.string().optional()
});

// =========================================
// 🔧 SCHEMAS AUXILIARES
// =========================================

// Schema para atualização parcial
export const clientUpdateSchema = clientSchema.partial();

// Schema para validação de campos únicos
export const uniqueFieldsSchema = z.object({
  email: z.string().email(),
  nif: z.string().regex(nifRegex).optional(),
  numeroCartaoCidadao: z.string().regex(cartaoCidadaoRegex).optional()
});

// Schema para busca e filtros
export const clientSearchSchema = z.object({
  query: z.string().optional(),
  roles: z.array(z.enum(Object.values(ClientRole))).optional(),
  estadoCivil: z.enum(Object.values(EstadoCivil)).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// =========================================
// 📤 EXPORTS
// =========================================
export default clientSchema;

// ✅ APENAS EXPORTS JavaScript (sem TypeScript types)
// Para futura migração para TypeScript, descomente as linhas abaixo:
// export type ClientFormData = z.infer<typeof clientSchema>;
// export type ClientUpdateData = z.infer<typeof clientUpdateSchema>;
// export type ClientSearchParams = z.infer<typeof clientSearchSchema>;
// =========================================
// 🎯 HOOK - useClientForm EXPANDIDO
// =========================================
// Hook para formulário de cliente com 6 passos
// Estrutura completa com dados expandidos para imobiliário

import { useState, useCallback, useMemo } from 'react';
import { useClients } from './useClients';

// Enums e constantes
import { 
  EstadoCivil, 
  ESTADOS_COM_CONJUGE, 
  REQUIRED_FIELDS,
  FORM_STEPS 
} from '../types/enums';

/**
 * useClientForm - Hook para formulário de cliente expandido
 * Responsabilidades:
 * - Gestão de estado do formulário (6 passos)
 * - Validação por passo e campo
 * - Navegação entre passos
 * - Submit com Firebase
 * - Dados expandidos para CRM imobiliário
 */
export const useClientForm = (initialData = null) => {
  // =========================================
  // 🎣 HOOKS & DEPENDENCIES
  // =========================================

  const { createClient, updateClient } = useClients({ autoFetch: false });

  // =========================================
  // 🗂️ FORM STATE - ESTRUTURA EXPANDIDA
  // =========================================

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // PASSO 1: Dados Pessoais Essenciais
    dadosPessoais: {
      nome: '',
      email: '',
      telefone: '',
      morada: '',
      dataNascimento: '',
      nif: '',
      numCartaoCidadao: '',
      estadoCivil: EstadoCivil.SOLTEIRO,
      profissao: '',
      empresa: '',
      rendimentoAnual: '',
      habitacaoAtual: '',
      regimeHabitacao: '',
      ...(initialData?.dadosPessoais || {})
    },

    // PASSO 2: Dados do Cônjuge (condicional)
    conjuge: {
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      nif: '',
      profissao: '',
      empresa: '',
      rendimentoAnual: '',
      ...(initialData?.conjuge || {})
    },
    comunhaoBens: initialData?.comunhaoBens || '',

    // PASSO 3: Dados Bancários e Financeiros
    dadosBancarios: {
      banco: '',
      iban: '',
      titular: '',
      contaConjunta: false,
      capacidadeFinanceira: 0,
      ...(initialData?.dadosBancarios || {})
    },

    // PASSO 4: Histórico de Contacto e Origem
    dadosContacto: {
      dataPrimeiroContacto: '',
      meioPrimeiroContacto: '',
      origemContacto: '',
      responsavelContacto: '',
      temperatura: 'morno',
      ...(initialData?.dadosContacto || {})
    },

    // PASSO 5: Perfil Imobiliário Completo
    perfilImobiliario: {
      orcamentoMinimo: '',
      orcamentoMaximo: '',
      tiposInteresse: [],
      zonasPreferidas: [],
      motivacaoPrincipal: '',
      prioridades: [],
      urgencia: 'moderada',
      precisaFinanciamento: false,
      percentagemEntrada: 20,
      temImovelVenda: false,
      ...(initialData?.perfilImobiliario || {})
    },

    // PASSO 6: Comunicações, Roles e Finalização
    comunicacoes: {
      enviarAniversario: true,
      lembretesVisitas: true,
      lembretesPagamentos: true,
      eventos: true,
      marketing: false,
      sms: true,
      whatsapp: true,
      meioPreferido: 'email',
      frequenciaContacto: 'semanal',
      horaPreferida: '09:00',
      diasPreferidos: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
      ...(initialData?.comunicacoes || {})
    },

    roles: initialData?.roles || [],
    notas: initialData?.notas || '',
    origem: initialData?.origem || 'website',
    ativo: initialData?.ativo !== undefined ? initialData.ativo : true
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // =========================================
  // 🔧 FIELD OPERATIONS
  // =========================================

  /**
   * Atualizar campo específico
   */
  const updateField = useCallback((fieldPath, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const parts = fieldPath.split('.');
      let current = newData;
      
      // Navegar até o penúltimo nível
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      // Definir valor final
      current[parts[parts.length - 1]] = value;
      return newData;
    });

    // Marcar como alterado
    setIsDirty(true);
    setTouched(prev => ({ ...prev, [fieldPath]: true }));

    // Limpar erro do campo
    if (errors[fieldPath]) {
      setErrors(prev => ({ ...prev, [fieldPath]: undefined }));
    }
  }, [errors]);

  /**
   * Atualizar múltiplos campos
   */
  const updateFields = useCallback((updates) => {
    setFormData(prev => {
      let newData = { ...prev };
      
      Object.entries(updates).forEach(([fieldPath, value]) => {
        const parts = fieldPath.split('.');
        let current = newData;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        current[parts[parts.length - 1]] = value;
      });
      
      return newData;
    });

    setIsDirty(true);
  }, []);

  /**
   * Obter valor de campo por path
   */
  const getFieldValue = useCallback((fieldPath) => {
    const parts = fieldPath.split('.');
    let value = formData;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }, [formData]);

  // =========================================
  // 🔍 VALIDATION
  // =========================================

  /**
   * Validar campo individual
   */
  const validateField = useCallback((fieldPath, value) => {
    const errors = [];
    
    // Validações básicas
    if (REQUIRED_FIELDS.STEP_1.includes(fieldPath.split('.').pop())) {
      if (!value || value.toString().trim() === '') {
        errors.push('Campo obrigatório');
        return errors;
      }
    }

    // Validações específicas
    switch (fieldPath) {
      case 'dadosPessoais.email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push('Email inválido');
        }
        break;
        
      case 'dadosPessoais.telefone':
        if (value && !/^(\+351)?[0-9]{9}$/.test(value.replace(/\s/g, ''))) {
          errors.push('Telefone inválido (formato: +351 123 456 789)');
        }
        break;
        
      case 'dadosPessoais.nif':
        if (value && !/^[0-9]{9}$/.test(value)) {
          errors.push('NIF deve ter 9 dígitos');
        }
        break;
        
      case 'dadosBancarios.iban':
        if (value && !/^PT50[0-9]{21}$/.test(value.replace(/\s/g, ''))) {
          errors.push('IBAN português inválido');
        }
        break;
        
      case 'dadosPessoais.dataNascimento':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          
          if (age < 18 || age > 120) {
            errors.push('Idade deve estar entre 18 e 120 anos');
          }
        }
        break;
    }

    return errors;
  }, []);

  /**
   * Validar passo completo
   */
  const validateStep = useCallback((step) => {
    const stepErrors = {};
    let isValid = true;

    // Validar campos obrigatórios do passo
    const requiredFields = REQUIRED_FIELDS[`STEP_${step}`] || [];
    
    requiredFields.forEach(field => {
      const value = getFieldValue(field);
      if (!value || value.toString().trim() === '') {
        stepErrors[field] = 'Campo obrigatório';
        isValid = false;
      }
    });

    // Validações específicas por passo
    switch (step) {
      case 1: // Dados Pessoais
        // Validar campos essenciais
        ['nome', 'email', 'telefone', 'dataNascimento'].forEach(field => {
          const fieldPath = `dadosPessoais.${field}`;
          const value = getFieldValue(fieldPath);
          const fieldErrors = validateField(fieldPath, value);
          
          if (fieldErrors.length > 0) {
            stepErrors[fieldPath] = fieldErrors[0];
            isValid = false;
          }
        });
        break;

      case 2: // Dados do Cônjuge
        // Só validar se estado civil requer cônjuge
        if (ESTADOS_COM_CONJUGE.includes(formData.dadosPessoais.estadoCivil)) {
          if (!formData.conjuge.nome?.trim()) {
            stepErrors['conjuge.nome'] = 'Nome do cônjuge é obrigatório';
            isValid = false;
          }
          if (!formData.comunhaoBens) {
            stepErrors['comunhaoBens'] = 'Regime de bens é obrigatório';
            isValid = false;
          }
        }
        break;

      case 3: // Dados Bancários
        // Validações opcionais mas se preenchidas devem estar corretas
        if (formData.dadosBancarios.iban) {
          const ibanErrors = validateField('dadosBancarios.iban', formData.dadosBancarios.iban);
          if (ibanErrors.length > 0) {
            stepErrors['dadosBancarios.iban'] = ibanErrors[0];
            isValid = false;
          }
        }
        break;

      case 4: // Dados de Contacto
        if (!formData.dadosContacto.dataPrimeiroContacto) {
          stepErrors['dadosContacto.dataPrimeiroContacto'] = 'Data do primeiro contacto é obrigatória';
          isValid = false;
        }
        if (!formData.dadosContacto.meioPrimeiroContacto) {
          stepErrors['dadosContacto.meioPrimeiroContacto'] = 'Meio do primeiro contacto é obrigatório';
          isValid = false;
        }
        break;

      case 5: // Perfil Imobiliário
        if (!formData.perfilImobiliario.orcamentoMinimo) {
          stepErrors['perfilImobiliario.orcamentoMinimo'] = 'Orçamento mínimo é obrigatório';
          isValid = false;
        }
        if (!formData.perfilImobiliario.orcamentoMaximo) {
          stepErrors['perfilImobiliario.orcamentoMaximo'] = 'Orçamento máximo é obrigatório';
          isValid = false;
        }
        // Validar que máximo > mínimo
        if (formData.perfilImobiliario.orcamentoMinimo && formData.perfilImobiliario.orcamentoMaximo) {
          if (formData.perfilImobiliario.orcamentoMaximo <= formData.perfilImobiliario.orcamentoMinimo) {
            stepErrors['perfilImobiliario.orcamentoMaximo'] = 'Orçamento máximo deve ser maior que o mínimo';
            isValid = false;
          }
        }
        break;

      case 6: // Roles e Finalização
        if (!formData.roles || formData.roles.length === 0) {
          stepErrors['roles'] = 'Selecione pelo menos um role';
          isValid = false;
        }
        break;
    }

    return { isValid, errors: stepErrors };
  }, [formData, getFieldValue, validateField]);

  // =========================================
  // 🧹 FORM ACTIONS
  // =========================================

  /**
   * Reset formulário
   */
  const resetForm = useCallback(() => {
    setFormData({
      dadosPessoais: {
        nome: '',
        email: '',
        telefone: '',
        morada: '',
        dataNascimento: '',
        nif: '',
        numCartaoCidadao: '',
        estadoCivil: EstadoCivil.SOLTEIRO,
        profissao: '',
        empresa: '',
        rendimentoAnual: '',
        habitacaoAtual: '',
        regimeHabitacao: ''
      },
      conjuge: {
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        nif: '',
        profissao: '',
        empresa: '',
        rendimentoAnual: ''
      },
      comunhaoBens: '',
      dadosBancarios: {
        banco: '',
        iban: '',
        titular: '',
        contaConjunta: false,
        capacidadeFinanceira: 0
      },
      dadosContacto: {
        dataPrimeiroContacto: '',
        meioPrimeiroContacto: '',
        origemContacto: '',
        responsavelContacto: '',
        temperatura: 'morno'
      },
      perfilImobiliario: {
        orcamentoMinimo: '',
        orcamentoMaximo: '',
        tiposInteresse: [],
        zonasPreferidas: [],
        motivacaoPrincipal: '',
        prioridades: [],
        urgencia: 'moderada',
        precisaFinanciamento: false,
        percentagemEntrada: 20,
        temImovelVenda: false
      },
      comunicacoes: {
        enviarAniversario: true,
        lembretesVisitas: true,
        lembretesPagamentos: true,
        eventos: true,
        marketing: false,
        sms: true,
        whatsapp: true,
        meioPreferido: 'email',
        frequenciaContacto: 'semanal',
        horaPreferida: '09:00',
        diasPreferidos: ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
      },
      roles: [],
      notas: '',
      origem: 'website',
      ativo: true,
      ...initialData
    });
    setCurrentStep(1);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData]);

  // =========================================
  // 🚀 NAVIGATION
  // =========================================

  /**
   * Ir para próximo passo
   */
  const nextStep = useCallback(async () => {
    const validation = validateStep(currentStep);
    
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, ...validation.errors }));
      return false;
    }
    
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    
    return false;
  }, [currentStep, validateStep]);

  /**
   * Voltar ao passo anterior
   */
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  /**
   * Ir para passo específico
   */
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  }, []);

  // =========================================
  // 💾 SUBMIT FUNCTIONS
  // =========================================

  /**
   * Submeter formulário
   */
  const submitForm = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Validar todos os passos
      let allValid = true;
      let allErrors = {};
      
      for (let step = 1; step <= 6; step++) {
        const validation = validateStep(step);
        if (!validation.isValid) {
          allValid = false;
          allErrors = { ...allErrors, ...validation.errors };
        }
      }
      
      if (!allValid) {
        setErrors(allErrors);
        throw new Error('Formulário contém erros. Verifique todos os campos.');
      }
      
      // Preparar dados para envio
      const dataToSubmit = {
        ...formData,
        // Limpar dados do cônjuge se não casado
        conjuge: ESTADOS_COM_CONJUGE.includes(formData.dadosPessoais.estadoCivil) 
          ? formData.conjuge 
          : null,
        comunhaoBens: ESTADOS_COM_CONJUGE.includes(formData.dadosPessoais.estadoCivil) 
          ? formData.comunhaoBens 
          : null,
        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Dados para submeter:', dataToSubmit);
      
      // Submit via Firebase
      const result = initialData?.id 
        ? await updateClient(initialData.id, dataToSubmit)
        : await createClient(dataToSubmit);
      
      return result;
      
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateStep, createClient, updateClient, initialData]);

  // =========================================
  // 📊 COMPUTED VALUES
  // =========================================

  const computedValues = useMemo(() => {
    const totalSteps = 6;
    const progressPercentage = (currentStep / totalSteps) * 100;
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === 6;
    
    return {
      totalSteps,
      progressPercentage,
      isFirstStep,
      isLastStep,
      hasErrors: Object.keys(errors).length > 0,
      isConjugeRequired: ESTADOS_COM_CONJUGE.includes(formData.dadosPessoais.estadoCivil),
      currentStepConfig: FORM_STEPS[currentStep]
    };
  }, [currentStep, errors, formData.dadosPessoais.estadoCivil]);

  // =========================================
  // 🎯 RETURN OBJECT
  // =========================================

  return {
    // Form Data
    formData,
    
    // Current State
    currentStep,
    errors,
    touched,
    isDirty,
    isSubmitting,
    
    // Computed
    ...computedValues,
    
    // Actions
    updateField,
    updateFields,
    resetForm,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    
    // Validation
    validateStep,
    validateField,
    getFieldValue,
    
    // Submit
    submitForm
  };
};

export default useClientForm;
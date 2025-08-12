import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { EstadoCivil, ComunhaoBens } from '../types/enums';

// =========================================
// 🔧 CONSTANTS
// =========================================

const ESTADOS_COM_CONJUGE = [EstadoCivil.CASADO, EstadoCivil.UNIAO_FACTO];

const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONE: /^(\+351\s?)?[9][1236]\s?\d{3}\s?\d{3}\s?\d{3}$/,
  NIF: /^[0-9]{9}$/,
  IBAN: /^PT50\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{3}$/,
  CARTAO_CIDADAO: /^[0-9]{8}\s?[0-9]\s?[A-Z]{2}[0-9]$/
};

const REQUIRED_FIELDS = {
  STEP_1: [
    'dadosPessoais.nome',
    'dadosPessoais.email',
    'dadosPessoais.telefone'
  ],
  STEP_2: [], // Dinâmico baseado no estado civil
  STEP_3: [], // Opcional
  STEP_4: [], // Opcional
  STEP_5: ['roles']
};

// =========================================
// 🎯 MAIN HOOK
// =========================================

export const useClientForm = (initialData = {}, user = null) => {
  
  // =========================================
  // 📊 STATE MANAGEMENT
  // =========================================

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Passo 1: Dados Pessoais
    dadosPessoais: {
      nome: '',
      email: '',
      telefone: '',
      morada: '',
      dataNascimento: '',
      naturalidade: '',
      nacionalidade: 'Portuguesa',
      residencia: '',
      nif: '',
      contribuinte: '',
      numCartaoCidadao: '',
      estadoCivil: EstadoCivil.SOLTEIRO
    },
    
    // Passo 2: Dados do Cônjuge
    conjuge: {
      nome: '',
      email: '',
      telefone: '',
      nif: '',
      contribuinte: '',
      numCartaoCidadao: '',
      dataNascimento: '',
      naturalidade: '',
      nacionalidade: 'Portuguesa',
      profissao: ''
    },
    comunhaoBens: null,
    
    // Passo 3: Dados Bancários
    dadosBancarios: {
      banco: '',
      iban: '',
      swift: '',
      titular: '',
      morada: ''
    },
    
    // Passo 4: Configurações de Comunicação
    comunicacoes: {
      enviarAniversario: true,
      lembretesVisitas: true,
      lembretesPagamentos: true,
      eventos: true,
      marketing: false,
      sms: true,
      horaPreferida: '09:00',
      diasPreferidos: ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
    },
    
    // Passo 5: Roles e Informações Gerais
    roles: [],
    notas: '',
    origem: 'website',
    responsavel: user?.uid || '',
    
    // Metadados
    ativo: true,
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // =========================================
  // 🔍 VALIDATION FUNCTIONS
  // =========================================

  /**
   * Validar campo específico
   */
  const validateField = useCallback((fieldPath, value) => {
    const fieldErrors = [];

    // Validações por campo
    switch (fieldPath) {
      case 'dadosPessoais.email':
        if (value && !VALIDATION_REGEX.EMAIL.test(value)) {
          fieldErrors.push('Email inválido');
        }
        break;
        
      case 'dadosPessoais.telefone':
        if (value && !VALIDATION_REGEX.TELEFONE.test(value.replace(/\s/g, ''))) {
          fieldErrors.push('Telefone inválido (formato: +351 xxx xxx xxx)');
        }
        break;
        
      case 'dadosPessoais.nif':
        if (value && !VALIDATION_REGEX.NIF.test(value)) {
          fieldErrors.push('NIF inválido (9 dígitos)');
        }
        break;
        
      case 'dadosBancarios.iban':
        if (value && !VALIDATION_REGEX.IBAN.test(value.replace(/\s/g, ''))) {
          fieldErrors.push('IBAN inválido (formato PT50...)');
        }
        break;
        
      case 'dadosPessoais.numCartaoCidadao':
        if (value && !VALIDATION_REGEX.CARTAO_CIDADAO.test(value)) {
          fieldErrors.push('Cartão de Cidadão inválido');
        }
        break;
    }

    return fieldErrors;
  }, []);

  /**
   * Validar passo específico
   */
  const validateStep = useCallback((step) => {
    const stepErrors = {};
    let isValid = true;

    // Campos obrigatórios por passo
    const requiredForStep = REQUIRED_FIELDS[`STEP_${step}`] || [];
    
    requiredForStep.forEach(fieldPath => {
      const value = getFieldValue(fieldPath);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        stepErrors[fieldPath] = ['Campo obrigatório'];
        isValid = false;
      }
    });

    // Validações específicas por passo
    switch (step) {
      case 1:
        // Validar dados pessoais
        Object.entries(formData.dadosPessoais).forEach(([field, value]) => {
          const fieldPath = `dadosPessoais.${field}`;
          const fieldErrors = validateField(fieldPath, value);
          if (fieldErrors.length > 0) {
            stepErrors[fieldPath] = fieldErrors;
            isValid = false;
          }
        });
        break;
        
      case 2:
        // Validar dados do cônjuge (se casado)
        if (ESTADOS_COM_CONJUGE.includes(formData.dadosPessoais.estadoCivil)) {
          if (!formData.conjuge.nome.trim()) {
            stepErrors['conjuge.nome'] = ['Nome do cônjuge é obrigatório'];
            isValid = false;
          }
          if (!formData.comunhaoBens) {
            stepErrors['comunhaoBens'] = ['Regime de bens é obrigatório'];
            isValid = false;
          }
        }
        break;
        
      case 3:
        // Validar dados bancários (opcionais, mas se preenchidos devem ser válidos)
        Object.entries(formData.dadosBancarios).forEach(([field, value]) => {
          if (value) {
            const fieldPath = `dadosBancarios.${field}`;
            const fieldErrors = validateField(fieldPath, value);
            if (fieldErrors.length > 0) {
              stepErrors[fieldPath] = fieldErrors;
              isValid = false;
            }
          }
        });
        break;
        
      case 5:
        // Validar roles (pelo menos um)
        if (!formData.roles || formData.roles.length === 0) {
          stepErrors['roles'] = ['Pelo menos um role é obrigatório'];
          isValid = false;
        }
        break;
    }

    return { isValid, errors: stepErrors };
  }, [formData, validateField]);

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
  // 🔄 FORM ACTIONS - CORREÇÃO FINAL
  // =========================================

  /**
   * ✅ ATUALIZAR CAMPO - SEM DEPENDÊNCIAS INSTÁVEIS!
   */
  const updateField = useCallback((fieldPath, value) => {
    // 1. Atualizar os dados
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
      
      // Definir o valor final
      current[parts[parts.length - 1]] = value;
      
      return newData;
    });
    
    // 2. Marcar como touched
    setTouched(prev => ({
      ...prev,
      [fieldPath]: true
    }));
    
    // 3. Marcar como dirty
    setIsDirty(true);
    
    // 4. Limpar erro específico deste campo
    setErrors(prev => {
      if (prev[fieldPath]) {
        const newErrors = { ...prev };
        delete newErrors[fieldPath];
        return newErrors;
      }
      return prev;
    });
  }, []); // 🚀 ARRAY VAZIO = SEM RE-RENDERS!

  /**
   * Atualizar múltiplos campos
   */
  const updateFields = useCallback((updates) => {
    Object.entries(updates).forEach(([fieldPath, value]) => {
      updateField(fieldPath, value);
    });
  }, [updateField]);

  /**
   * Reset do formulário
   */
  const resetForm = useCallback(() => {
    setFormData({
      dadosPessoais: {
        nome: '',
        email: '',
        telefone: '',
        morada: '',
        dataNascimento: '',
        naturalidade: '',
        nacionalidade: 'Portuguesa',
        residencia: '',
        nif: '',
        contribuinte: '',
        numCartaoCidadao: '',
        estadoCivil: EstadoCivil.SOLTEIRO
      },
      conjuge: {
        nome: '',
        email: '',
        telefone: '',
        nif: '',
        contribuinte: '',
        numCartaoCidadao: '',
        dataNascimento: '',
        naturalidade: '',
        nacionalidade: 'Portuguesa',
        profissao: ''
      },
      comunhaoBens: null,
      dadosBancarios: {
        banco: '',
        iban: '',
        swift: '',
        titular: '',
        morada: ''
      },
      comunicacoes: {
        enviarAniversario: true,
        lembretesVisitas: true,
        lembretesPagamentos: true,
        eventos: true,
        marketing: false,
        sms: true,
        horaPreferida: '09:00',
        diasPreferidos: ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
      },
      roles: [],
      notas: '',
      origem: 'website',
      responsavel: user?.uid || '',
      ativo: true,
      ...initialData
    });
    setCurrentStep(1);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData, user?.uid]);

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
    
    if (currentStep < 5) {
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
    if (step >= 1 && step <= 5) {
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
      
      for (let step = 1; step <= 5; step++) {
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
      
      // Aqui integraria com API/Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return dataToSubmit;
      
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateStep]);

  // =========================================
  // 📊 COMPUTED VALUES
  // =========================================

  const computedValues = useMemo(() => {
    const totalSteps = 5;
    const progressPercentage = (currentStep / totalSteps) * 100;
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === 5;
    
    return {
      totalSteps,
      progressPercentage,
      isFirstStep,
      isLastStep,
      hasErrors: Object.keys(errors).length > 0,
      isConjugeRequired: ESTADOS_COM_CONJUGE.includes(formData.dadosPessoais.estadoCivil)
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

// =========================================
// 🎯 SPECIALIZED HOOKS
// =========================================

/**
 * Hook para campo específico
 */
export const useFormField = (fieldPath, formHook) => {
  const { formData, updateField, errors, touched } = formHook;
  
  const value = formHook.getFieldValue(fieldPath);
  const error = errors[fieldPath];
  const isTouched = touched[fieldPath];
  
  const setValue = useCallback((newValue) => {
    updateField(fieldPath, newValue);
  }, [fieldPath, updateField]);
  
  return {
    value,
    setValue,
    error,
    isTouched,
    hasError: !!error,
    isValid: !error && isTouched
  };
};

/**
 * Hook para validação de passo
 */
export const useStepValidation = (step, formHook) => {
  const { validateStep, errors } = formHook;
  
  const validation = useMemo(() => {
    return validateStep(step);
  }, [step, validateStep]);
  
  const stepErrors = useMemo(() => {
    return Object.entries(errors).filter(([key]) => {
      // Filtrar erros relevantes para este passo
      switch (step) {
        case 1:
          return key.startsWith('dadosPessoais.');
        case 2:
          return key.startsWith('conjuge.') || key === 'comunhaoBens';
        case 3:
          return key.startsWith('dadosBancarios.');
        case 4:
          return key.startsWith('comunicacoes.');
        case 5:
          return key === 'roles' || key === 'origem';
        default:
          return false;
      }
    });
  }, [step, errors]);
  
  return {
    isValid: validation.isValid,
    errors: validation.errors,
    stepErrors,
    hasStepErrors: stepErrors.length > 0
  };
};

/**
 * Hook para auto-complete de moradas
 */
export const useAddressAutocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const searchAddress = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    try {
      setLoading(true);
      
      // Aqui integraria com serviço de geocoding (Google Maps, etc.)
      // Por agora simular com dados estáticos
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockSuggestions = [
        { address: `${query}, Lisboa`, coordinates: { lat: 38.7223, lng: -9.1393 } },
        { address: `${query}, Porto`, coordinates: { lat: 41.1579, lng: -8.6291 } },
        { address: `${query}, Braga`, coordinates: { lat: 41.5518, lng: -8.4229 } }
      ];
      
      setSuggestions(mockSuggestions);
      
    } catch (error) {
      console.error('Erro na pesquisa de morada:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    suggestions,
    loading,
    searchAddress
  };
};

export default useClientForm;
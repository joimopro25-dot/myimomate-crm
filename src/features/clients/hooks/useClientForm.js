// =========================================
// 🎣 HOOK FORMULÁRIOS - useClientForm
// =========================================
// Hook para gestão de formulários de clientes
// Multi-step form com validação e estado

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useClients } from './useClients';
import { 
  EstadoCivil, 
  ClientRole, 
  REQUIRED_FIELDS, 
  VALIDATION_REGEX,
  ESTADOS_COM_CONJUGE 
} from '../types/enums';

/**
 * Hook para gestão de formulários de clientes
 * CORRIGIDO: Sem re-renders desnecessários mantendo todas as funcionalidades
 * @param {Object} options - Opções de configuração
 * @returns {Object} Estado e ações do formulário
 */
export const useClientForm = (options = {}) => {
  const {
    initialData = null,
    mode = 'create', // 'create' | 'edit'
    onSuccess = null,
    onError = null,
    autoSave = false,
    autoSaveInterval = 30000 // 30 segundos
  } = options;

  const { user } = useAuth();
  const { createClient, updateClient } = useClients({ autoFetch: false });

  // =========================================
  // 📊 FORM STATE
  // =========================================

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => ({
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
    
    // Passo 2: Dados do Cônjuge (se aplicável)
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
  }));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // =========================================
  // 🔧 REFS PARA DEPENDÊNCIAS ESTÁVEIS
  // =========================================
  // CORREÇÃO: Usar refs para evitar re-renders
  const errorsRef = useRef(errors);
  const touchedRef = useRef(touched);

  // Manter refs atualizadas
  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  useEffect(() => {
    touchedRef.current = touched;
  }, [touched]);

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
  // 🔄 FORM ACTIONS (CORRIGIDAS)
  // =========================================

  /**
   * Atualizar campo do formulário
   * CORREÇÃO: Sem dependências instáveis
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
      
      // Definir o valor final
      current[parts[parts.length - 1]] = value;
      
      return newData;
    });
    
    // Marcar como touched (usando callback para evitar dependência)
    setTouched(prev => ({
      ...prev,
      [fieldPath]: true
    }));
    
    // Marcar como dirty
    setIsDirty(true);
    
    // Limpar erro deste campo (usando callback)
    setErrors(prev => {
      if (prev[fieldPath]) {
        const newErrors = { ...prev };
        delete newErrors[fieldPath];
        return newErrors;
      }
      return prev;
    });
  }, []); // 🔧 SEM DEPENDÊNCIAS!

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
          : null
      };
      
      let result;
      if (mode === 'create') {
        result = await createClient(dataToSubmit);
      } else {
        result = await updateClient(initialData.id, dataToSubmit);
      }
      
      setIsDirty(false);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
      
    } catch (error) {
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, mode, validateStep, createClient, updateClient, initialData?.id, onSuccess, onError]);

  // =========================================
  // 💾 AUTO SAVE
  // =========================================

  useEffect(() => {
    if (!autoSave || !isDirty || mode !== 'edit') return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        await updateClient(initialData.id, formData);
        setIsDirty(false);
      } catch (error) {
        console.error('Erro no auto-save:', error);
      }
    }, autoSaveInterval);

    return () => clearTimeout(autoSaveTimer);
  }, [autoSave, isDirty, mode, autoSaveInterval, formData, updateClient, initialData?.id]);

  // =========================================
  // 📊 COMPUTED VALUES
  // =========================================

  const computedValues = useMemo(() => {
    const currentStepValidation = validateStep(currentStep);
    
    return {
      // Step info
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === 5,
      canGoNext: currentStepValidation.isValid,
      canGoPrev: currentStep > 1,
      
      // Form status
      hasErrors: Object.keys(errors).length > 0,
      isValid: Object.keys(errors).length === 0,
      
      // Conditional fields
      needsSpouseData: ESTADOS_COM_CONJUGE.includes(formData.dadosPessoais.estadoCivil),
      
      // Progress
      completedSteps: Array.from({ length: 5 }, (_, i) => {
        const stepNum = i + 1;
        const stepValidation = validateStep(stepNum);
        return stepValidation.isValid;
      }),
      
      progressPercentage: Math.round((currentStep / 5) * 100)
    };
  }, [currentStep, validateStep, errors, formData.dadosPessoais.estadoCivil]);

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
      // Por agora, mock de sugestões
      const mockSuggestions = [
        `${query} - Rua Principal, Porto`,
        `${query} - Avenida Central, Lisboa`,
        `${query} - Praça da República, Coimbra`
      ];
      
      setSuggestions(mockSuggestions);
      
    } catch (error) {
      console.error('Erro na pesquisa de moradas:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);
  
  return {
    suggestions,
    loading,
    searchAddress,
    clearSuggestions
  };
};

/**
 * Hook para upload de avatar
 */
export const useAvatarUpload = (clientId) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const uploadAvatar = useCallback(async (file) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);
      
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas imagens são permitidas');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Imagem muito grande (máx 5MB)');
      }
      
      // Simular upload com progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      
      // Aqui faria o upload real para Firebase Storage
      // const result = await documentsService.uploadDocument(userId, clientId, file, 'avatar');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Mock URL
      const avatarURL = URL.createObjectURL(file);
      
      return avatarURL;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [clientId]);
  
  return {
    uploadAvatar,
    uploading,
    progress,
    error
  };
};

// =========================================
// 🛠️ UTILITY FUNCTIONS
// =========================================

/**
 * Gerar dados de teste para formulário
 */
export const generateMockClientData = () => {
  return {
    dadosPessoais: {
      nome: 'João Silva Santos',
      email: 'joao.silva@email.com',
      telefone: '+351 912 345 678',
      morada: 'Rua das Flores, 123, 4º Esq, 1000-100 Lisboa',
      dataNascimento: '1985-03-15',
      naturalidade: 'Lisboa',
      nacionalidade: 'Portuguesa',
      residencia: 'Lisboa',
      nif: '123456789',
      contribuinte: '123456789',
      numCartaoCidadao: '12345678 9 ZZ4',
      estadoCivil: EstadoCivil.CASADO
    },
    conjuge: {
      nome: 'Maria Santos Silva',
      email: 'maria.santos@email.com',
      telefone: '+351 913 456 789',
      nif: '987654321',
      contribuinte: '987654321',
      numCartaoCidadao: '87654321 1 XX8',
      dataNascimento: '1987-07-22',
      naturalidade: 'Porto',
      nacionalidade: 'Portuguesa',
      profissao: 'Enfermeira'
    },
    comunhaoBens: 'comunhao_adquiridos',
    dadosBancarios: {
      banco: 'Millennium BCP',
      iban: 'PT50 0033 0000 1234 5678 9012 3',
      swift: 'BCOMPTPL',
      titular: 'João Silva Santos',
      morada: 'Av. da Liberdade, 195, Lisboa'
    },
    comunicacoes: {
      enviarAniversario: true,
      lembretesVisitas: true,
      lembretesPagamentos: true,
      eventos: true,
      marketing: false,
      sms: true,
      horaPreferida: '14:00',
      diasPreferidos: ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
    },
    roles: [ClientRole.COMPRADOR, ClientRole.INVESTIDOR],
    notas: 'Cliente interessado em imóveis na zona de Lisboa. Orçamento até 300k.',
    origem: 'referencia'
  };
};

/**
 * Validar NIF português
 */
export const validateNIF = (nif) => {
  if (!nif || nif.length !== 9) return false;
  
  const digits = nif.split('').map(Number);
  const checkDigit = digits[8];
  
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * (9 - i);
  }
  
  const remainder = sum % 11;
  const expectedDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return checkDigit === expectedDigit;
};

/**
 * Formatar telefone português
 */
export const formatPhone = (phone) => {
  const clean = phone.replace(/\D/g, '');
  
  if (clean.startsWith('351')) {
    const number = clean.substring(3);
    return `+351 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  
  if (clean.length === 9) {
    return `+351 ${clean.substring(0, 3)} ${clean.substring(3, 6)} ${clean.substring(6)}`;
  }
  
  return phone;
};

/**
 * Formatar IBAN português
 */
export const formatIBAN = (iban) => {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  
  if (clean.startsWith('PT50')) {
    return clean.replace(/(.{4})/g, '$1 ').trim();
  }
  
  return iban;
};

export default useClientForm;
// =========================================
// 🎨 COMPONENT - ClientForm COMPLETAMENTE CORRIGIDO
// =========================================
// Formulário multi-step com integração Firebase REAL
// TODAS AS CORREÇÕES IMPLEMENTADAS

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Building, FileText, MapPin,
  CheckCircle, AlertCircle, Heart, CreditCard, Bell, Users,
  ArrowLeft, ArrowRight, Eye, EyeOff, X, TrendingUp
} from 'lucide-react';
import { useClients } from '../../hooks/useClients';

// =========================================
// 🎯 HOOK INTERNO SIMPLIFICADO E FUNCIONAL
// =========================================

const useSimpleClientForm = (initialData = null) => {
  const { createClient } = useClients({ autoFetch: false }); // ✅ Conexão real com Firebase
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    dadosPessoais: {
      nome: '',
      email: '',
      telefone: '',
      morada: '',
      estadoCivil: 'solteiro',
      ...(initialData?.dadosPessoais || {})
    },
    conjuge: {
      nome: '',
      email: '',
      telefone: '',
      ...(initialData?.conjuge || {})
    },
    dadosBancarios: {
      banco: '',
      iban: '',
      titular: '',
      ...(initialData?.dadosBancarios || {})
    },
    comunicacoes: {
      enviarAniversario: true,
      lembretesVisitas: true,
      marketing: false,
      ...(initialData?.comunicacoes || {})
    },
    roles: initialData?.roles || [], // ✅ Inicializado como array vazio
    notas: initialData?.notas || '',
    origem: 'website',
    ativo: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Função para atualizar campos
  const updateField = useCallback((fieldPath, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const parts = fieldPath.split('.');
      let current = newData;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      current[parts[parts.length - 1]] = value;
      return newData;
    });

    // Limpar erro quando campo é alterado
    if (errors[fieldPath]) {
      setErrors(prev => ({ ...prev, [fieldPath]: undefined }));
    }
  }, [errors]);

  // ✅ Validação por passo
  const validateStep = useCallback((step) => {
    const stepErrors = {};

    switch (step) {
      case 1:
        if (!formData.dadosPessoais.nome?.trim()) {
          stepErrors['dadosPessoais.nome'] = 'Nome é obrigatório';
        }
        if (!formData.dadosPessoais.email?.trim()) {
          stepErrors['dadosPessoais.email'] = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.dadosPessoais.email)) {
          stepErrors['dadosPessoais.email'] = 'Email inválido';
        }
        if (!formData.dadosPessoais.telefone?.trim()) {
          stepErrors['dadosPessoais.telefone'] = 'Telefone é obrigatório';
        }
        break;
      
      case 5:
        if (!formData.roles || formData.roles.length === 0) {
          stepErrors.roles = 'Selecione pelo menos um role';
        }
        break;
    }

    return stepErrors;
  }, [formData]);

  // ✅ Navegação entre passos
  const nextStep = useCallback(() => {
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    
    setErrors({});
    
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    
    return false;
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  }, [currentStep]);

  // ✅ Submit do formulário - CORRIGIDO para Firebase
  const submitForm = useCallback(async () => {
    console.log('🚀 ClientForm: submitForm chamado');
    
    // Validar step final
    const finalErrors = validateStep(5);
    
    if (Object.keys(finalErrors).length > 0) {
      console.log('❌ Erros de validação:', finalErrors);
      setErrors(finalErrors);
      return { success: false, errors: finalErrors };
    }

    setIsSubmitting(true);
    
    try {
      console.log('📡 Enviando dados para Firebase:', formData);
      
      // ✅ USAR HOOK REAL DO FIREBASE
      const newClient = await createClient(formData);
      
      console.log('✅ Cliente criado com sucesso:', newClient);
      
      setIsSubmitting(false);
      return { success: true, data: newClient };
      
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      setIsSubmitting(false);
      setErrors({ submit: error.message });
      return { success: false, error: error.message };
    }
  }, [formData, validateStep, createClient]); // ✅ Dependências corretas

  return {
    currentStep,
    formData,
    errors,
    totalSteps: 5,
    progressPercentage: (currentStep / 5) * 100,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 5,
    nextStep,
    prevStep,
    submitForm,
    isSubmitting,
    updateField
  };
};

// =========================================
// 🎨 COMPONENTES DE CAMPOS REUTILIZÁVEIS
// =========================================

const FloatingInput = ({ name, label, icon: Icon, type = "text", value, onChange, error, placeholder, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const hasValue = value && value.length > 0;
  const actualType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="relative">
      <div className="relative">
        <input
          type={actualType}
          id={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ''}
          className={`
            peer w-full px-4 py-4 pl-12 pr-4 text-gray-900 bg-white border-2 rounded-xl 
            focus:outline-none focus:ring-0 transition-all duration-200
            ${error 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
            }
          `}
          {...props}
        />
        
        <Icon className={`
          absolute left-4 top-4 w-5 h-5 transition-colors duration-200
          ${error ? 'text-red-400' : focused ? 'text-blue-500' : 'text-gray-400'}
        `} />
        
        <label
          htmlFor={name}
          className={`
            absolute left-12 transition-all duration-200 pointer-events-none
            ${focused || hasValue
              ? 'top-1 text-xs text-blue-600 font-medium'
              : 'top-4 text-gray-500'
            }
          `}
        >
          {label}
        </label>
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

const SelectField = ({ name, label, icon: Icon, value, onChange, error, options, placeholder }) => {
  return (
    <div className="relative">
      <div className="relative">
        <select
          id={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-4 pl-12 pr-4 text-gray-900 bg-white border-2 rounded-xl 
            focus:outline-none focus:ring-0 transition-all duration-200 appearance-none
            ${error 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
            }
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <Icon className={`
          absolute left-4 top-4 w-5 h-5 transition-colors duration-200
          ${error ? 'text-red-400' : 'text-gray-400'}
        `} />
        
        <label
          htmlFor={name}
          className="absolute left-12 top-1 text-xs text-blue-600 font-medium"
        >
          {label}
        </label>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

const TextAreaField = ({ name, label, icon: Icon, value, onChange, error, placeholder, rows = 4 }) => {
  return (
    <div className="relative">
      <div className="relative">
        <textarea
          id={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`
            w-full px-4 py-4 pl-12 pr-4 text-gray-900 bg-white border-2 rounded-xl 
            focus:outline-none focus:ring-0 transition-all duration-200 resize-none
            ${error 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
            }
          `}
        />
        
        <Icon className={`
          absolute left-4 top-4 w-5 h-5 transition-colors duration-200
          ${error ? 'text-red-400' : 'text-gray-400'}
        `} />
        
        <label
          htmlFor={name}
          className="absolute left-12 top-1 text-xs text-blue-600 font-medium"
        >
          {label}
        </label>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// =========================================
// 🔢 COMPONENTES DOS PASSOS
// =========================================

const Step1DadosPessoais = ({ formData, updateField, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Dados Pessoais</h3>
      <p className="text-gray-600">Informações básicas do cliente</p>
    </div>

    <div className="space-y-6">
      <FloatingInput
        name="nome"
        label="Nome Completo"
        icon={User}
        value={formData.dadosPessoais.nome}
        onChange={(value) => updateField('dadosPessoais.nome', value)}
        error={errors['dadosPessoais.nome']}
        placeholder="Ex: João Silva Santos"
      />

      <FloatingInput
        name="email"
        label="Email"
        icon={Mail}
        type="email"
        value={formData.dadosPessoais.email}
        onChange={(value) => updateField('dadosPessoais.email', value)}
        error={errors['dadosPessoais.email']}
        placeholder="Ex: joao@exemplo.com"
      />

      <FloatingInput
        name="telefone"
        label="Telefone"
        icon={Phone}
        value={formData.dadosPessoais.telefone}
        onChange={(value) => updateField('dadosPessoais.telefone', value)}
        error={errors['dadosPessoais.telefone']}
        placeholder="Ex: +351 912 345 678"
      />

      <FloatingInput
        name="morada"
        label="Morada"
        icon={MapPin}
        value={formData.dadosPessoais.morada}
        onChange={(value) => updateField('dadosPessoais.morada', value)}
        error={errors['dadosPessoais.morada']}
        placeholder="Ex: Rua das Flores, 123, Lisboa"
      />

      <SelectField
        name="estadoCivil"
        label="Estado Civil"
        icon={Heart}
        value={formData.dadosPessoais.estadoCivil}
        onChange={(value) => updateField('dadosPessoais.estadoCivil', value)}
        error={errors['dadosPessoais.estadoCivil']}
        placeholder="Selecione o estado civil"
        options={[
          { value: 'solteiro', label: 'Solteiro(a)' },
          { value: 'casado', label: 'Casado(a)' },
          { value: 'divorciado', label: 'Divorciado(a)' },
          { value: 'viuvo', label: 'Viúvo(a)' },
          { value: 'uniao_facto', label: 'União de Facto' }
        ]}
      />
    </div>
  </motion.div>
);

const Step2DadosConjuge = ({ formData, updateField, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Dados do Cônjuge</h3>
      <p className="text-gray-600">Informações do cônjuge ou companheiro(a)</p>
    </div>

    {['casado', 'uniao_facto'].includes(formData.dadosPessoais.estadoCivil) ? (
      <div className="space-y-6">
        <FloatingInput
          name="conjuge_nome"
          label="Nome do Cônjuge"
          icon={User}
          value={formData.conjuge.nome}
          onChange={(value) => updateField('conjuge.nome', value)}
          error={errors['conjuge.nome']}
          placeholder="Nome completo do cônjuge"
        />

        <FloatingInput
          name="conjuge_email"
          label="Email do Cônjuge"
          icon={Mail}
          type="email"
          value={formData.conjuge.email}
          onChange={(value) => updateField('conjuge.email', value)}
          error={errors['conjuge.email']}
          placeholder="Email do cônjuge"
        />

        <FloatingInput
          name="conjuge_telefone"
          label="Telefone do Cônjuge"
          icon={Phone}
          value={formData.conjuge.telefone}
          onChange={(value) => updateField('conjuge.telefone', value)}
          error={errors['conjuge.telefone']}
          placeholder="Telefone do cônjuge"
        />
      </div>
    ) : (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Dados do cônjuge não são necessários para o estado civil selecionado.</p>
      </div>
    )}
  </motion.div>
);

const Step3DadosBancarios = ({ formData, updateField, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Dados Bancários</h3>
      <p className="text-gray-600">Informações bancárias (opcionais)</p>
    </div>

    <div className="space-y-6">
      <FloatingInput
        name="banco"
        label="Banco"
        icon={Building}
        value={formData.dadosBancarios.banco}
        onChange={(value) => updateField('dadosBancarios.banco', value)}
        error={errors['dadosBancarios.banco']}
        placeholder="Ex: Banco Millennium"
      />

      <FloatingInput
        name="iban"
        label="IBAN"
        icon={CreditCard}
        value={formData.dadosBancarios.iban}
        onChange={(value) => updateField('dadosBancarios.iban', value)}
        error={errors['dadosBancarios.iban']}
        placeholder="Ex: PT50 0002 0123 1234 5678 9012 3"
      />

      <FloatingInput
        name="titular"
        label="Titular da Conta"
        icon={User}
        value={formData.dadosBancarios.titular}
        onChange={(value) => updateField('dadosBancarios.titular', value)}
        error={errors['dadosBancarios.titular']}
        placeholder="Nome do titular da conta"
      />
    </div>
  </motion.div>
);

const Step4Comunicacoes = ({ formData, updateField, errors }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Comunicações</h3>
      <p className="text-gray-600">Preferências de comunicação</p>
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-medium">Enviar felicitações de aniversário</p>
            <p className="text-sm text-gray-500">Emails automáticos no aniversário</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={formData.comunicacoes.enviarAniversario}
          onChange={(e) => updateField('comunicacoes.enviarAniversario', e.target.checked)}
          className="w-5 h-5 text-blue-600"
        />
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium">Lembretes de visitas</p>
            <p className="text-sm text-gray-500">Notificações sobre agendamentos</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={formData.comunicacoes.lembretesVisitas}
          onChange={(e) => updateField('comunicacoes.lembretesVisitas', e.target.checked)}
          className="w-5 h-5 text-blue-600"
        />
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <div>
            <p className="font-medium">Marketing e promoções</p>
            <p className="text-sm text-gray-500">Ofertas e novidades do mercado</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={formData.comunicacoes.marketing}
          onChange={(e) => updateField('comunicacoes.marketing', e.target.checked)}
          className="w-5 h-5 text-blue-600"
        />
      </div>
    </div>
  </motion.div>
);

const Step5Finalizacao = ({ formData, updateField, errors }) => {
  const roles = [
    { value: 'comprador', label: 'Comprador', icon: Users },
    { value: 'vendedor', label: 'Vendedor', icon: TrendingUp },
    { value: 'investidor', label: 'Investidor', icon: Building },
    { value: 'inquilino', label: 'Inquilino', icon: User }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Finalização</h3>
        <p className="text-gray-600">Últimas informações</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Roles do Cliente *
          </label>
          <div className="grid grid-cols-2 gap-4">
            {roles.map(({ value, label, icon: Icon }) => {
              const isSelected = formData.roles.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    const currentRoles = formData.roles || [];
                    const newRoles = isSelected
                      ? currentRoles.filter(role => role !== value)
                      : [...currentRoles, value];
                    updateField('roles', newRoles);
                  }}
                  className={`
                    p-4 rounded-xl border-2 text-center transition-all
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
          {errors.roles && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.roles}
            </p>
          )}
        </div>

        <TextAreaField
          name="notas"
          label="Observações"
          icon={FileText}
          value={formData.notas}
          onChange={(value) => updateField('notas', value)}
          error={errors.notas}
          placeholder="Adicione informações relevantes sobre o cliente..."
          rows={4}
        />
      </div>
    </motion.div>
  );
};

// =========================================
// 🔥 COMPONENTE PRINCIPAL
// =========================================

const ClientForm = ({ 
  client = null, 
  onSuccess,
  onCancel, 
  isLoading = false
}) => {
  
  const formHook = useSimpleClientForm(client);
  
  const {
    currentStep,
    formData,
    errors,
    totalSteps,
    progressPercentage,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    submitForm,
    isSubmitting,
    updateField
  } = formHook;

  const steps = useMemo(() => [
    { id: 1, component: Step1DadosPessoais, title: "Dados Pessoais" },
    { id: 2, component: Step2DadosConjuge, title: "Dados do Cônjuge" },
    { id: 3, component: Step3DadosBancarios, title: "Dados Bancários" },
    { id: 4, component: Step4Comunicacoes, title: "Comunicações" },
    { id: 5, component: Step5Finalizacao, title: "Finalização" }
  ], []);

  const handleNext = useCallback(async () => {
    const success = nextStep();
    if (!success) {
      console.log('Erro na validação do passo atual');
    }
  }, [nextStep]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      console.log('🚀 ClientForm: handleSubmit chamado');
      const result = await submitForm();
      console.log('📋 Resultado do submit:', result);
      
      if (result.success) {
        console.log('✅ Sucesso! Chamando onSuccess...');
        onSuccess?.(result.data);
      }
    } catch (error) {
      console.error('❌ Erro no handleSubmit:', error);
    }
  }, [submitForm, onSuccess]);

  const currentStepComponent = steps.find(step => step.id === currentStep);
  const StepComponent = currentStepComponent.component;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Passo {currentStep} de {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% completo</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <StepComponent 
          key={currentStep}
          formData={formData}
          updateField={updateField}
          errors={errors}
        />
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={prevStep}
          disabled={isFirstStep}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
            ${isFirstStep 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          <ArrowLeft className="w-5 h-5" />
          Anterior
        </button>

        {isLastStep ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium
              transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              ${isSubmitting ? 'animate-pulse' : ''}
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Criando Cliente...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Criar Cliente
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium transition-all hover:bg-blue-700"
          >
            Próximo
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Error Display */}
      {errors.submit && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Erro ao criar cliente:</span>
          </div>
          <p className="mt-1 text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Debug Info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Debug Info:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Passo atual: {currentStep}</p>
            <p>Roles selecionados: {JSON.stringify(formData.roles)}</p>
            <p>Erros: {JSON.stringify(errors)}</p>
            <p>Submetendo: {isSubmitting ? 'Sim' : 'Não'}</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default ClientForm;
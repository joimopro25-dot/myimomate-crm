// =========================================
// 🎨 COMPONENT - ClientForm CORRIGIDO
// =========================================
// CORREÇÃO: Imports corretos

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CreditCard,
  Heart,
  Users,
  FileText,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Info,
  Star,
  Gift,
  Zap,
  Target,
  Save,
  Send,
  Camera,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { useClientForm } from '../../hooks/useClientForm'; // 🔧 IMPORT CORRETO
import { 
  EstadoCivil, 
  EstadoCivilLabels,
  ComunhaoBens,
  ComunhaoBensLabels,
  ClientRole,
  ClientRoleLabels,
  ClientRoleColors,
  ClientSource,
  ClientSourceLabels,
  ESTADOS_COM_CONJUGE 
} from '../../types/enums';

/**
 * ClientForm - O formulário mais inteligente e cativante
 * Transforma criação de clientes numa experiência envolvente
 */
const ClientForm = ({ 
  initialData = null,
  mode = 'create', // 'create' | 'edit'
  onSuccess,
  onCancel,
  className = ''
}) => {
  const {
    formData,
    currentStep,
    errors,
    isDirty,
    isSubmitting,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrev,
    needsSpouseData,
    progressPercentage,
    completedSteps,
    updateField,
    updateFields,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    resetForm
  } = useClientForm({
    initialData,
    mode,
    onSuccess,
    autoSave: mode === 'edit'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // =========================================
  // 🎯 STEP CONFIGURATIONS
  // =========================================

  const steps = [
    {
      id: 1,
      title: 'Dados Pessoais',
      subtitle: 'Vamos conhecer o seu cliente',
      icon: User,
      color: 'blue',
      fields: ['nome', 'email', 'telefone']
    },
    {
      id: 2,
      title: 'Informações Familiares',
      subtitle: 'Detalhes do estado civil e cônjuge',
      icon: Heart,
      color: 'pink',
      fields: ['estadoCivil', 'conjuge', 'comunhaoBens']
    },
    {
      id: 3,
      title: 'Dados Bancários',
      subtitle: 'Informações financeiras (opcional)',
      icon: CreditCard,
      color: 'green',
      fields: ['banco', 'iban']
    },
    {
      id: 4,
      title: 'Configurações',
      subtitle: 'Preferências de comunicação',
      icon: FileText,
      color: 'purple',
      fields: ['comunicacoes']
    },
    {
      id: 5,
      title: 'Finalização',
      subtitle: 'Roles e informações gerais',
      icon: Sparkles,
      color: 'yellow',
      fields: ['roles', 'origem']
    }
  ];

  const currentStepConfig = steps[currentStep - 1];

  // =========================================
  // 🎨 COMPONENTES INTERNOS
  // =========================================

  const ProgressHeader = () => (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Novo Cliente' : 'Editar Cliente'}
            </h2>
            <div className="text-sm text-gray-500">
              Passo {currentStep} de {steps.length}
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToStep(step.id)}
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 font-medium text-sm
                    ${currentStep === step.id 
                      ? getStepActiveClass(step.color)
                      : completedSteps[index]
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }
                  `}
                >
                  {completedSteps[index] ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                  
                  {currentStep === step.id && (
                    <motion.div
                      layoutId="activeStep"
                      className={`absolute inset-0 rounded-full ${getStepBgClass(step.color)} opacity-20 scale-125`}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </motion.button>
                
                {index < steps.length - 1 && (
                  <div className={`
                    h-1 w-12 rounded transition-all duration-300
                    ${completedSteps[index] ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          
          {/* Animated Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full ${getProgressGradient(currentStepConfig.color)}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
        
        {/* Step Header */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${getStepHeaderClass(currentStepConfig.color)} mb-4`}>
            <currentStepConfig.icon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {currentStepConfig.title}
          </h3>
          <p className="text-gray-600">
            {currentStepConfig.subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );

  // 🔧 FORMFIELD EXTRAÍDO E MEMORIZADO
  const FormField = React.memo(({ 
    label, 
    name, 
    type = 'text', 
    required = false, 
    placeholder,
    icon: Icon,
    help,
    value,
    onChange,
    options = [],
    className = ''
  }) => {
    const error = errors[name];
    const hasError = !!error;

    return (
      <div className={`space-y-2 ${className}`}>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {Icon && <Icon className="w-4 h-4" />}
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="relative">
          {type === 'select' ? (
            <select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all
                ${hasError 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
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
          ) : type === 'textarea' ? (
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all resize-none
                ${hasError 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
            />
          ) : (
            <input
              type={type}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`
                w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all
                ${hasError 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }
              `}
            />
          )}
        </div>
        
        {help && !hasError && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {help}
          </p>
        )}
        
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {Array.isArray(error) ? error.join(', ') : error}
          </motion.p>
        )}
      </div>
    );
  });

  // =========================================
  // 📝 STEP COMPONENTS
  // =========================================

  const Step1PersonalData = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Nome Completo"
          name="dadosPessoais.nome"
          required
          icon={User}
          placeholder="Ex: João Silva Santos"
          value={formData.dadosPessoais.nome}
          onChange={(value) => updateField('dadosPessoais.nome', value)}
          help="Nome completo como aparece no documento de identificação"
        />
        
        <FormField
          label="Email"
          name="dadosPessoais.email"
          type="email"
          required
          icon={Mail}
          placeholder="joao@exemplo.com"
          value={formData.dadosPessoais.email}
          onChange={(value) => updateField('dadosPessoais.email', value)}
        />
        
        <FormField
          label="Telefone"
          name="dadosPessoais.telefone"
          type="tel"
          required
          icon={Phone}
          placeholder="+351 912 345 678"
          value={formData.dadosPessoais.telefone}
          onChange={(value) => updateField('dadosPessoais.telefone', value)}
          help="Formato: +351 XXX XXX XXX"
        />
        
        <FormField
          label="Data de Nascimento"
          name="dadosPessoais.dataNascimento"
          type="date"
          icon={Calendar}
          value={formData.dadosPessoais.dataNascimento}
          onChange={(value) => updateField('dadosPessoais.dataNascimento', value)}
        />
        
        <FormField
          label="NIF"
          name="dadosPessoais.nif"
          icon={FileText}
          placeholder="123 456 789"
          value={formData.dadosPessoais.nif}
          onChange={(value) => updateField('dadosPessoais.nif', value)}
          help="Número de Identificação Fiscal"
        />
        
        <FormField
          label="Nacionalidade"
          name="dadosPessoais.nacionalidade"
          value={formData.dadosPessoais.nacionalidade}
          onChange={(value) => updateField('dadosPessoais.nacionalidade', value)}
          placeholder="Portuguesa"
        />
      </div>
      
      <FormField
        label="Morada Completa"
        name="dadosPessoais.morada"
        icon={MapPin}
        placeholder="Rua das Flores, 123, 4º Esq, 1000-100 Lisboa"
        value={formData.dadosPessoais.morada}
        onChange={(value) => updateField('dadosPessoais.morada', value)}
        help="Morada completa com código postal"
      />
    </motion.div>
  );

  const Step2FamilyData = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <FormField
        label="Estado Civil"
        name="dadosPessoais.estadoCivil"
        type="select"
        icon={Heart}
        value={formData.dadosPessoais.estadoCivil}
        onChange={(value) => updateField('dadosPessoais.estadoCivil', value)}
        options={Object.entries(EstadoCivilLabels).map(([key, label]) => ({
          value: key,
          label
        }))}
        placeholder="Selecione o estado civil"
      />
      
      <AnimatePresence>
        {needsSpouseData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 p-6 bg-pink-50 rounded-2xl border border-pink-200"
          >
            <div className="flex items-center gap-2 text-pink-700">
              <Users className="w-5 h-5" />
              <h4 className="font-medium">Dados do Cônjuge</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Nome do Cônjuge"
                name="conjuge.nome"
                required={needsSpouseData}
                icon={User}
                placeholder="Maria Silva Santos"
                value={formData.conjuge.nome}
                onChange={(value) => updateField('conjuge.nome', value)}
              />
              
              <FormField
                label="Email do Cônjuge"
                name="conjuge.email"
                type="email"
                icon={Mail}
                placeholder="maria@exemplo.com"
                value={formData.conjuge.email}
                onChange={(value) => updateField('conjuge.email', value)}
              />
              
              <FormField
                label="Telefone do Cônjuge"
                name="conjuge.telefone"
                type="tel"
                icon={Phone}
                placeholder="+351 913 456 789"
                value={formData.conjuge.telefone}
                onChange={(value) => updateField('conjuge.telefone', value)}
              />
              
              <FormField
                label="NIF do Cônjuge"
                name="conjuge.nif"
                icon={FileText}
                placeholder="987 654 321"
                value={formData.conjuge.nif}
                onChange={(value) => updateField('conjuge.nif', value)}
              />
            </div>
            
            <FormField
              label="Regime de Bens"
              name="comunhaoBens"
              type="select"
              required={needsSpouseData}
              icon={Heart}
              value={formData.comunhaoBens}
              onChange={(value) => updateField('comunhaoBens', value)}
              options={Object.entries(ComunhaoBensLabels).map(([key, label]) => ({
                value: key,
                label
              }))}
              placeholder="Selecione o regime de bens"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const Step3BankingData = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-green-700 mb-4">
          <Info className="w-5 h-5" />
          <span className="font-medium">Informação Opcional</span>
        </div>
        <p className="text-green-600 text-sm">
          Os dados bancários são opcionais mas ajudam a agilizar processos futuros.
          Todas as informações são armazenadas de forma segura.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Banco"
          name="dadosBancarios.banco"
          icon={CreditCard}
          placeholder="Ex: Millennium BCP"
          value={formData.dadosBancarios.banco}
          onChange={(value) => updateField('dadosBancarios.banco', value)}
        />
        
        <FormField
          label="Titular da Conta"
          name="dadosBancarios.titular"
          icon={User}
          placeholder="Nome do titular"
          value={formData.dadosBancarios.titular}
          onChange={(value) => updateField('dadosBancarios.titular', value)}
        />
      </div>
      
      <FormField
        label="IBAN"
        name="dadosBancarios.iban"
        icon={CreditCard}
        placeholder="PT50 0000 0000 0000 0000 0000 0"
        value={formData.dadosBancarios.iban}
        onChange={(value) => updateField('dadosBancarios.iban', value)}
        help="Formato: PT50 seguido de 19 dígitos"
      />
    </motion.div>
  );

  const Step4Communications = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
        <h4 className="font-medium text-purple-900 mb-4">Preferências de Comunicação</h4>
        <p className="text-purple-700 text-sm mb-4">
          Configure como e quando prefere ser contactado pelo nosso sistema.
        </p>
        
        <div className="space-y-4">
          {[
            { key: 'enviarAniversario', label: 'Emails de aniversário', icon: Gift },
            { key: 'lembretesVisitas', label: 'Lembretes de visitas', icon: Calendar },
            { key: 'lembretesPagamentos', label: 'Lembretes de pagamentos', icon: CreditCard },
            { key: 'eventos', label: 'Notificações de eventos', icon: Star },
            { key: 'marketing', label: 'Comunicações de marketing', icon: Target },
            { key: 'sms', label: 'Mensagens SMS', icon: Phone }
          ].map((pref) => (
            <label key={pref.key} className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={formData.comunicacoes[pref.key] || false}
                onChange={(e) => updateField(`comunicacoes.${pref.key}`, e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <pref.icon className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const Step5Finalization = () => (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Roles do Cliente</span>
          <span className="text-red-500">*</span>
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(ClientRoleLabels).map(([key, label]) => {
            const isSelected = formData.roles?.includes(key);
            const colorClass = ClientRoleColors[key];
            
            return (
              <motion.label
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? `${colorClass} border-current` 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    const currentRoles = formData.roles || [];
                    const newRoles = e.target.checked
                      ? [...currentRoles, key]
                      : currentRoles.filter(role => role !== key);
                    updateField('roles', newRoles);
                  }}
                  className="sr-only"
                />
                <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-current' : 'bg-gray-300'}`} />
                <span className="font-medium">{label}</span>
              </motion.label>
            );
          })}
        </div>
        
        {errors.roles && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {Array.isArray(errors.roles) ? errors.roles.join(', ') : errors.roles}
          </motion.p>
        )}
      </div>
      
      <FormField
        label="Como chegou até nós?"
        name="origem"
        type="select"
        icon={Target}
        value={formData.origem}
        onChange={(value) => updateField('origem', value)}
        options={Object.entries(ClientSourceLabels).map(([key, label]) => ({
          value: key,
          label
        }))}
        placeholder="Selecione a origem"
      />
      
      <FormField
        label="Observações"
        name="notas"
        type="textarea"
        icon={FileText}
        placeholder="Adicione notas ou observações sobre este cliente..."
        value={formData.notas}
        onChange={(value) => updateField('notas', value)}
      />
    </motion.div>
  );

  // =========================================
  // 🎮 NAVIGATION FUNCTIONS
  // =========================================

  const handleNext = async () => {
    setIsAnimating(true);
    const success = await nextStep();
    setIsAnimating(false);
    
    if (!success) {
      // Scroll para o primeiro erro
      const firstError = document.querySelector('.text-red-600');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsAnimating(true);
      await submitForm();
    } catch (error) {
      console.error('Erro ao submeter:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  // =========================================
  // 🎨 UTILITY FUNCTIONS
  // =========================================

  const getStepActiveClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 text-white shadow-lg',
      pink: 'bg-pink-500 text-white shadow-lg',
      green: 'bg-green-500 text-white shadow-lg',
      purple: 'bg-purple-500 text-white shadow-lg',
      yellow: 'bg-yellow-500 text-white shadow-lg'
    };
    return colorMap[color] || 'bg-blue-500 text-white shadow-lg';
  };

  const getStepBgClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      pink: 'bg-pink-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500'
    };
    return colorMap[color] || 'bg-blue-500';
  };

  const getProgressGradient = (color) => {
    const colorMap = {
      blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
      pink: 'bg-gradient-to-r from-pink-400 to-pink-600',
      green: 'bg-gradient-to-r from-green-400 to-green-600',
      purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
      yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    };
    return colorMap[color] || 'bg-gradient-to-r from-blue-400 to-blue-600';
  };

  const getStepHeaderClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      pink: 'bg-pink-100 text-pink-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colorMap[color] || 'bg-blue-100 text-blue-600';
  };

  const getButtonClass = (color, isDisabled) => {
    if (isDisabled) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    
    const colorMap = {
      blue: 'bg-blue-600 text-white hover:bg-blue-700',
      pink: 'bg-pink-600 text-white hover:bg-pink-700',
      green: 'bg-green-600 text-white hover:bg-green-700',
      purple: 'bg-purple-600 text-white hover:bg-purple-700',
      yellow: 'bg-yellow-600 text-white hover:bg-yellow-700'
    };
    return colorMap[color] || 'bg-blue-600 text-white hover:bg-blue-700';
  };

  // =========================================
  // 🎨 RENDER PRINCIPAL
  // =========================================

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <ProgressHeader />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && <Step1PersonalData />}
              {currentStep === 2 && <Step2FamilyData />}
              {currentStep === 3 && <Step3BankingData />}
              {currentStep === 4 && <Step4Communications />}
              {currentStep === 5 && <Step5Finalization />}
            </AnimatePresence>
          </div>
          
          {/* Navigation Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isFirstStep && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    disabled={isAnimating}
                    className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Anterior</span>
                  </motion.button>
                )}
                
                {isDirty && mode === 'edit' && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Save className="w-4 h-4" />
                    <span>Auto-salvamento ativo</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {onCancel && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCancel}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                )}
                
                {!isLastStep ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    disabled={!canGoNext || isAnimating}
                    className={`
                      flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all
                      ${getButtonClass(currentStepConfig.color, !canGoNext || isAnimating)}
                    `}
                  >
                    <span>Continuar</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canGoNext}
                    className={`
                      flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all
                      ${isSubmitting || !canGoNext
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{mode === 'create' ? 'Criar Cliente' : 'Salvar Alterações'}</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
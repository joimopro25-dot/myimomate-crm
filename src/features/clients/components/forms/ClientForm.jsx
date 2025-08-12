// =========================================
// 🎨 COMPONENT - ClientForm COMPLETO CORRIGIDO
// =========================================
// Formulário multi-step funcional sem re-renders

import React, { useState } from 'react';
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
  Target,
  Save,
  Send
} from 'lucide-react';
import { useClientForm } from '../../hooks/useClientForm';
import FormField from './FormField';
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

const ClientForm = ({ 
  initialData = null, 
  mode = 'create', 
  onSuccess, 
  onCancel 
}) => {
  const {
    formData,
    currentStep,
    errors,
    isDirty,
    isSubmitting,
    isFirstStep,
    isLastStep,
    progressPercentage,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    submitForm
  } = useClientForm({
    initialData,
    mode,
    onSuccess
  });

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
      color: 'blue'
    },
    {
      id: 2,
      title: 'Informações Familiares',
      subtitle: 'Detalhes do estado civil e cônjuge',
      icon: Heart,
      color: 'pink'
    },
    {
      id: 3,
      title: 'Dados Bancários',
      subtitle: 'Informações financeiras (opcional)',
      icon: CreditCard,
      color: 'green'
    },
    {
      id: 4,
      title: 'Configurações',
      subtitle: 'Preferências de comunicação',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 5,
      title: 'Finalização',
      subtitle: 'Roles e informações gerais',
      icon: Sparkles,
      color: 'yellow'
    }
  ];

  const currentStepConfig = steps[currentStep - 1];

  // Computed values para o progress
  const completedSteps = steps.map((_, index) => index + 1 < currentStep);
  const isConjugeRequired = ESTADOS_COM_CONJUGE.includes(formData.dadosPessoais?.estadoCivil);

  // =========================================
  // 🎨 PROGRESS HEADER
  // =========================================

  const ProgressHeader = () => (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Novo Cliente' : 'Editar Cliente'}
            </h2>
            <span className="text-sm text-gray-500">
              Passo {currentStep} de {steps.length}
            </span>
          </div>
          
          {/* Step Navigation */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.button
                  onClick={() => goToStep(step.id)}
                  disabled={isAnimating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all duration-200
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
          
          {/* Progress Bar */}
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
          value={formData.dadosPessoais?.nome || ''}
          onChange={(value) => updateField('dadosPessoais.nome', value)}
          error={errors['dadosPessoais.nome']}
          help="Nome completo como aparece no documento de identificação"
        />
        
        <FormField
          label="Email"
          name="dadosPessoais.email"
          type="email"
          required
          icon={Mail}
          placeholder="joao@exemplo.com"
          value={formData.dadosPessoais?.email || ''}
          onChange={(value) => updateField('dadosPessoais.email', value)}
          error={errors['dadosPessoais.email']}
        />
        
        <FormField
          label="Telefone"
          name="dadosPessoais.telefone"
          type="tel"
          required
          icon={Phone}
          placeholder="+351 912 345 678"
          value={formData.dadosPessoais?.telefone || ''}
          onChange={(value) => updateField('dadosPessoais.telefone', value)}
          error={errors['dadosPessoais.telefone']}
          help="Formato: +351 XXX XXX XXX"
        />
        
        <FormField
          label="Data de Nascimento"
          name="dadosPessoais.dataNascimento"
          type="date"
          icon={Calendar}
          value={formData.dadosPessoais?.dataNascimento || ''}
          onChange={(value) => updateField('dadosPessoais.dataNascimento', value)}
          error={errors['dadosPessoais.dataNascimento']}
        />
        
        <FormField
          label="NIF"
          name="dadosPessoais.nif"
          icon={FileText}
          placeholder="123 456 789"
          value={formData.dadosPessoais?.nif || ''}
          onChange={(value) => updateField('dadosPessoais.nif', value)}
          error={errors['dadosPessoais.nif']}
          help="Número de Identificação Fiscal"
        />
        
        <FormField
          label="Estado Civil"
          name="dadosPessoais.estadoCivil"
          type="select"
          required
          icon={Heart}
          value={formData.dadosPessoais?.estadoCivil || EstadoCivil.SOLTEIRO}
          onChange={(value) => updateField('dadosPessoais.estadoCivil', value)}
          error={errors['dadosPessoais.estadoCivil']}
          options={Object.entries(EstadoCivilLabels).map(([key, label]) => ({
            value: key,
            label
          }))}
        />
      </div>
      
      <FormField
        label="Morada Completa"
        name="dadosPessoais.morada"
        icon={MapPin}
        placeholder="Rua, número, código postal, cidade"
        value={formData.dadosPessoais?.morada || ''}
        onChange={(value) => updateField('dadosPessoais.morada', value)}
        error={errors['dadosPessoais.morada']}
      />
    </motion.div>
  );

  const Step2FamilyInfo = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {isConjugeRequired ? (
        <>
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-pink-900">
                Informações do Cônjuge
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Nome do Cônjuge"
                name="conjuge.nome"
                required
                icon={User}
                placeholder="Nome completo do cônjuge"
                value={formData.conjuge?.nome || ''}
                onChange={(value) => updateField('conjuge.nome', value)}
                error={errors['conjuge.nome']}
              />
              
              <FormField
                label="Email do Cônjuge"
                name="conjuge.email"
                type="email"
                icon={Mail}
                placeholder="email@exemplo.com"
                value={formData.conjuge?.email || ''}
                onChange={(value) => updateField('conjuge.email', value)}
                error={errors['conjuge.email']}
              />
              
              <FormField
                label="NIF do Cônjuge"
                name="conjuge.nif"
                icon={FileText}
                placeholder="123 456 789"
                value={formData.conjuge?.nif || ''}
                onChange={(value) => updateField('conjuge.nif', value)}
                error={errors['conjuge.nif']}
              />
            </div>
          </div>
          
          <FormField
            label="Regime de Bens"
            name="comunhaoBens"
            type="select"
            required
            icon={Heart}
            value={formData.comunhaoBens || ''}
            onChange={(value) => updateField('comunhaoBens', value)}
            error={errors['comunhaoBens']}
            options={Object.entries(ComunhaoBensLabels).map(([key, label]) => ({
              value: key,
              label
            }))}
            placeholder="Selecione o regime de bens"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Estado Civil: {EstadoCivilLabels[formData.dadosPessoais?.estadoCivil]}
          </h3>
          <p className="text-gray-600">
            Não são necessárias informações de cônjuge para este estado civil.
          </p>
        </div>
      )}
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-800">
          <Info className="w-5 h-5" />
          <span className="text-sm">
            Estes dados são opcionais e servem para facilitar transações futuras.
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="IBAN"
          name="dadosBancarios.iban"
          icon={CreditCard}
          placeholder="PT50 0000 0000 0000 0000 000"
          value={formData.dadosBancarios?.iban || ''}
          onChange={(value) => updateField('dadosBancarios.iban', value)}
          error={errors['dadosBancarios.iban']}
          help="Número IBAN da conta bancária"
        />
        
        <FormField
          label="Nome do Banco"
          name="dadosBancarios.banco"
          icon={CreditCard}
          placeholder="Ex: Banco Santander"
          value={formData.dadosBancarios?.banco || ''}
          onChange={(value) => updateField('dadosBancarios.banco', value)}
          error={errors['dadosBancarios.banco']}
        />
        
        <FormField
          label="Titular da Conta"
          name="dadosBancarios.titular"
          icon={User}
          placeholder="Nome do titular"
          value={formData.dadosBancarios?.titular || ''}
          onChange={(value) => updateField('dadosBancarios.titular', value)}
          error={errors['dadosBancarios.titular']}
        />
      </div>
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
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Preferências de Comunicação
        </h3>
        <p className="text-purple-700 text-sm mb-6">
          Configure como e quando deseja ser contactado.
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
                name={`comunicacoes.${pref.key}`}
                checked={formData.comunicacoes?.[pref.key] || false}
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
                  name={`roles.${key}`}
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
                <span className="text-sm font-medium">{label}</span>
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
            {Array.isArray(errors.roles) ? 
              errors.roles.join(', ') : errors.roles}
          </motion.p>
        )}
      </div>
      
      <FormField
        label="Como chegou até nós?"
        name="origem"
        type="select"
        icon={Target}
        value={formData.origem || ''}
        onChange={(value) => updateField('origem', value)}
        error={errors['origem']}
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
        value={formData.notas || ''}
        onChange={(value) => updateField('notas', value)}
        error={errors['notas']}
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
      const firstError = document.querySelector('[role="alert"]');
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
    <div className="min-h-screen bg-gray-50">
      <ProgressHeader />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && <Step1PersonalData />}
              {currentStep === 2 && <Step2FamilyInfo />}
              {currentStep === 3 && <Step3BankingData />}
              {currentStep === 4 && <Step4Communications />}
              {currentStep === 5 && <Step5Finalization />}
            </AnimatePresence>
          </div>
          
          {/* Navigation Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={prevStep}
                disabled={isFirstStep || isAnimating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                  ${isFirstStep 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </motion.button>
              
              <div className="flex items-center gap-3">
                {onCancel && (
                  <motion.button
                    onClick={onCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Cancelar
                  </motion.button>
                )}
                
                {isLastStep ? (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isAnimating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all
                      ${getButtonClass(currentStepConfig.color, isSubmitting || isAnimating)}
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {mode === 'create' ? 'Criar Cliente' : 'Guardar Alterações'}
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleNext}
                    disabled={isAnimating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                      ${getButtonClass(currentStepConfig.color, isAnimating)}
                    `}
                  >
                    {isAnimating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        Próximo
                        <ChevronRight className="w-4 h-4" />
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
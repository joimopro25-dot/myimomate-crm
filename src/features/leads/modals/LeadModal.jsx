// =========================================
// 🎯 MODAL - LeadModal COMPLETO
// =========================================
// Modal funcional para gestão de leads

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Phone, Mail, MapPin, Euro, Home, 
  MessageSquare, Target, CheckCircle, Zap
} from 'lucide-react';

// =========================================
// 🛠️ HELPER FUNCTIONS
// =========================================

const calculateLeadScore = (data) => {
  let score = 0;
  
  // Dados pessoais (30 pontos)
  if (data.name?.trim()) score += 10;
  if (data.email?.trim()) score += 10;
  if (data.phone?.trim()) score += 10;
  
  // Localização (20 pontos)
  if (data.location?.trim()) score += 10;
  if (data.district?.trim()) score += 10;
  
  // Interesse imobiliário (30 pontos)
  if (data.propertyType) score += 10;
  if (data.budget?.trim()) score += 10;
  if (data.timeframe) score += 10;
  
  // Contexto adicional (20 pontos)
  if (data.source) score += 5;
  if (data.message?.trim()) score += 10;
  if (data.urgency === 'high' || data.urgency === 'urgent') score += 5;
  
  return Math.min(score, 100);
};

const calculateTemperature = (score) => {
  if (score >= 80) return 'fervendo';
  if (score >= 60) return 'quente';
  if (score >= 40) return 'morno';
  return 'frio';
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^(\+351\s?)?[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// =========================================
// 🎯 COMPONENTE PRINCIPAL
// =========================================

const LeadModal = ({
  isOpen = false,
  onClose,
  lead = null,
  mode = 'create',
  onLeadCreate,
  onLeadUpdate,
  onLeadDelete,
  loading = false
}) => {
  // =========================================
  // 🎣 STATE
  // =========================================

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    district: '',
    propertyType: 'apartamento',
    budget: '',
    timeframe: '3months',
    source: 'website',
    message: '',
    urgency: 'medium',
    temperature: 'frio',
    score: 0
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================
  // 🔄 EFFECTS
  // =========================================

  useEffect(() => {
    console.log('🎯 Modal useEffect:', { isOpen, mode, lead: !!lead });
    
    if (isOpen) {
      if (lead && mode !== 'create') {
        console.log('📝 Carregando dados do lead existente');
        setFormData({
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          location: lead.location || '',
          district: lead.district || '',
          propertyType: lead.propertyType || 'apartamento',
          budget: lead.budget || '',
          timeframe: lead.timeframe || '3months',
          source: lead.source || 'website',
          message: lead.message || '',
          urgency: lead.urgency || 'medium',
          temperature: lead.temperature || 'frio',
          score: lead.score || 0
        });
      } else {
        console.log('✨ Resetando form para novo lead');
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          district: '',
          propertyType: 'apartamento',
          budget: '',
          timeframe: '3months',
          source: 'website',
          message: '',
          urgency: 'medium',
          temperature: 'frio',
          score: 0
        });
      }
      
      setErrors({});
      setCurrentStep(1);
    }
  }, [isOpen, lead, mode]);

  // =========================================
  // 📋 HANDLERS
  // =========================================

  const handleInputChange = useCallback((field, value) => {
    console.log('📝 Campo alterado:', field, '→', value);
    
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Calcular score e temperatura automaticamente
      const score = calculateLeadScore(newData);
      const temperature = calculateTemperature(score);
      
      return {
        ...newData,
        score,
        temperature
      };
    });
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Campos obrigatórios
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    
    // Validações específicas
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    console.log('🚀 Submit do form:', { mode, formData });
    
    if (!validateForm()) {
      console.log('❌ Validação falhou:', errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const leadData = {
        ...formData,
        status: 'novo',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('💾 Dados para salvar:', leadData);
      
      if (mode === 'create') {
        console.log('✨ Chamando onLeadCreate...');
        await onLeadCreate?.(leadData);
        console.log('✅ Lead criado com sucesso!');
      } else if (mode === 'edit') {
        console.log('🔄 Chamando onLeadUpdate...');
        await onLeadUpdate?.(lead.id, leadData);
        console.log('✅ Lead atualizado com sucesso!');
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Erro ao salvar lead:', error);
      alert('Erro ao salvar lead. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, mode, lead?.id, onLeadCreate, onLeadUpdate, onClose, errors]);

  // =========================================
  // 🎨 RENDER STEPS
  // =========================================

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Dados Pessoais
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            mode === 'view' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
          }`}
          placeholder="Nome completo do lead"
          disabled={mode === 'view' || loading || isSubmitting}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                mode === 'view' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
              }`}
              placeholder="email@exemplo.com"
              disabled={mode === 'view' || loading || isSubmitting}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                mode === 'view' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
              }`}
              placeholder="+351 912 345 678"
              disabled={mode === 'view' || loading || isSubmitting}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localização
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Porto, Lisboa..."
              disabled={mode === 'view'}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distrito
          </label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cedofeita, Alvalade..."
            disabled={mode === 'view'}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Home className="w-5 h-5" />
        Interesse Imobiliário
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Propriedade
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={mode === 'view'}
          >
            <option value="apartamento">Apartamento</option>
            <option value="moradia">Moradia</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Orçamento
          </label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex: 200.000 - 300.000"
              disabled={mode === 'view'}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prazo para Compra
        </label>
        <select
          value={formData.timeframe}
          onChange={(e) => handleInputChange('timeframe', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={mode === 'view'}
        >
          <option value="immediate">Imediato</option>
          <option value="1month">1 mês</option>
          <option value="3months">3 meses</option>
          <option value="6months">6 meses</option>
          <option value="1year">1 ano</option>
          <option value="noplan">Sem pressa</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Detalhes Adicionais
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fonte do Lead
          </label>
          <select
            value={formData.source}
            onChange={(e) => handleInputChange('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={mode === 'view'}
          >
            <option value="website">Website</option>
            <option value="phone">Telefone</option>
            <option value="referral">Referência</option>
            <option value="social">Redes Sociais</option>
            <option value="advertising">Publicidade</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgência
          </label>
          <select
            value={formData.urgency}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={mode === 'view'}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensagem / Observações
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={3}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Informações adicionais sobre o lead..."
            disabled={mode === 'view'}
          />
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Avaliação Automática
        </h4>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Score: {formData.score}/100</span>
          <span className={`text-sm font-medium capitalize ${
            formData.temperature === 'fervendo' ? 'text-red-600' :
            formData.temperature === 'quente' ? 'text-orange-600' :
            formData.temperature === 'morno' ? 'text-yellow-600' : 'text-blue-600'
          }`}>
            🌡️ {formData.temperature}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              formData.score >= 80 ? 'bg-red-500' :
              formData.score >= 60 ? 'bg-orange-500' :
              formData.score >= 40 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${formData.score}%` }}
          />
        </div>
      </div>
    </div>
  );

  // =========================================
  // 🎨 MAIN RENDER
  // =========================================

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block w-full max-w-2xl px-6 py-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl sm:align-middle"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' && 'Novo Lead'}
                {mode === 'edit' && 'Editar Lead'}
                {mode === 'view' && 'Detalhes do Lead'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Debug Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-xs">
              <strong>Debug:</strong> Mode: {mode} | Loading: {loading.toString()} | Submitting: {isSubmitting.toString()} | Lead: {lead ? 'exists' : 'null'}
            </div>

            {/* Step Indicator */}
            {mode !== 'view' && (
              <div className="flex items-center justify-center mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Steps */}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {/* View Mode - All Data */}
              {mode === 'view' && (
                <div className="space-y-6">
                  {renderStep1()}
                  <hr className="border-gray-200" />
                  {renderStep2()}
                  <hr className="border-gray-200" />
                  {renderStep3()}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  {currentStep > 1 && mode !== 'view' && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {mode === 'view' ? 'Fechar' : 'Cancelar'}
                  </button>

                  {mode !== 'view' && (
                    <>
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(currentStep + 1)}
                          disabled={isSubmitting}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          Próximo
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting || loading}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
                        >
                          {(isSubmitting || loading) && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          )}
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {mode === 'create' ? 'Criar Lead' : 'Atualizar Lead'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default LeadModal;
// =========================================
// 🎯 MODAL - LeadModal CRUD COMPLETO
// =========================================
// Modal responsivo para criar, editar e visualizar leads

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  Target,
  Calendar,
  Euro,
  Home,
  AlertCircle,
  Trash2
} from 'lucide-react';

/**
 * LeadModal - Modal para gestão completa de leads
 * @param {boolean} isOpen - Se o modal está aberto
 * @param {function} onClose - Função para fechar modal
 * @param {object} lead - Lead para edição (null para criação)
 * @param {string} mode - Modo: 'create' | 'edit' | 'view'
 * @param {function} onLeadCreate - Callback para criar lead
 * @param {function} onLeadUpdate - Callback para atualizar lead
 * @param {function} onLeadDelete - Callback para deletar lead
 * @param {boolean} loading - Estado de carregamento
 */
const LeadModal = ({
  isOpen,
  onClose,
  lead,
  mode = 'create',
  onLeadCreate,
  onLeadUpdate,
  onLeadDelete,
  loading = false
}) => {
  // =========================================
  // 🎣 STATE LOCAL
  // =========================================

  const [formData, setFormData] = useState({
    // Dados pessoais
    name: '',
    email: '',
    phone: '',
    
    // Localização
    address: '',
    city: '',
    district: '',
    postalCode: '',
    
    // Preferências imobiliárias
    propertyType: 'apartamento', // apartamento, moradia, terreno, comercial
    budget: '',
    rooms: '',
    location: '',
    
    // Lead info
    source: 'website', // website, phone, referral, social, other
    status: 'novo',
    priority: 'normal', // low, normal, high, urgent
    notes: '',
    
    // Contacto
    preferredContact: 'phone', // phone, email, whatsapp
    availableTime: 'any' // morning, afternoon, evening, any
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // =========================================
  // 🔄 EFFECTS
  // =========================================

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      if (lead && (mode === 'edit' || mode === 'view')) {
        // Carregar dados do lead
        setFormData({
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          address: lead.address || '',
          city: lead.city || '',
          district: lead.district || '',
          postalCode: lead.postalCode || '',
          propertyType: lead.propertyType || 'apartamento',
          budget: lead.budget || '',
          rooms: lead.rooms || '',
          location: lead.location || '',
          source: lead.source || 'website',
          status: lead.status || 'novo',
          priority: lead.priority || 'normal',
          notes: lead.notes || '',
          preferredContact: lead.preferredContact || 'phone',
          availableTime: lead.availableTime || 'any'
        });
      } else {
        // Reset para novo lead
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          district: '',
          postalCode: '',
          propertyType: 'apartamento',
          budget: '',
          rooms: '',
          location: '',
          source: 'website',
          status: 'novo',
          priority: 'normal',
          notes: '',
          preferredContact: 'phone',
          availableTime: 'any'
        });
      }
      setErrors({});
      setCurrentStep(1);
    }
  }, [isOpen, lead, mode]);

  // =========================================
  // 📋 HANDLERS
  // =========================================

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Campos obrigatórios
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'create') {
        await onLeadCreate(formData);
      } else if (mode === 'edit') {
        await onLeadUpdate(lead.id, formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      setErrors({ submit: 'Erro ao salvar lead. Tente novamente.' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar este lead?')) {
      try {
        await onLeadDelete(lead.id);
        onClose();
      } catch (error) {
        console.error('Erro ao deletar lead:', error);
        setErrors({ submit: 'Erro ao deletar lead. Tente novamente.' });
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // =========================================
  // 🎨 RENDER HELPERS
  // =========================================

  const renderStepIndicator = () => (
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
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2" />
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
          disabled={mode === 'view'}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } ${mode === 'view' ? 'bg-gray-50' : ''}`}
          placeholder="Nome completo do lead"
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
              disabled={mode === 'view'}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              placeholder="email@exemplo.com"
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
              disabled={mode === 'view'}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              placeholder="+351 912 345 678"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Morada
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={mode === 'view'}
            rows={2}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 resize-none ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
            placeholder="Rua, número, andar..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
            placeholder="Porto, Lisboa..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distrito
          </label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
            placeholder="Cedofeita, Alvalade..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código Postal
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
            placeholder="4000-000"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Home className="w-5 h-5 mr-2" />
        Preferências Imobiliárias
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Propriedade
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
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
              disabled={mode === 'view'}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                mode === 'view' ? 'bg-gray-50' : ''
              }`}
              placeholder="ex: 200.000 - 300.000"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quartos
          </label>
          <select
            value={formData.rooms}
            onChange={(e) => handleInputChange('rooms', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
          >
            <option value="">Qualquer</option>
            <option value="1">T1</option>
            <option value="2">T2</option>
            <option value="3">T3</option>
            <option value="4">T4</option>
            <option value="5+">T5+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localização Preferida
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
            placeholder="Centro, Boavista, Matosinhos..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2" />
        Informações do Lead
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Origem
          </label>
          <select
            value={formData.source}
            onChange={(e) => handleInputChange('source', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
          >
            <option value="website">Website</option>
            <option value="phone">Telefone</option>
            <option value="referral">Referência</option>
            <option value="social">Redes Sociais</option>
            <option value="advertising">Publicidade</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridade
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
          >
            <option value="low">Baixa</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contacto Preferido
          </label>
          <select
            value={formData.preferredContact}
            onChange={(e) => handleInputChange('preferredContact', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
          >
            <option value="phone">Telefone</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Disponibilidade
          </label>
          <select
            value={formData.availableTime}
            onChange={(e) => handleInputChange('availableTime', e.target.value)}
            disabled={mode === 'view'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
          >
            <option value="any">Qualquer hora</option>
            <option value="morning">Manhã</option>
            <option value="afternoon">Tarde</option>
            <option value="evening">Noite</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <div className="relative">
          <MessageCircle className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            disabled={mode === 'view'}
            rows={3}
            className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              mode === 'view' ? 'bg-gray-50' : ''
            }`}
            placeholder="Informações adicionais sobre o lead..."
          />
        </div>
      </div>

      {errors.submit && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700 text-sm">{errors.submit}</p>
        </div>
      )}
    </div>
  );

  const renderButtons = () => (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      <div className="flex items-center space-x-3">
        {currentStep > 1 && mode !== 'view' && (
          <button
            type="button"
            onClick={prevStep}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Anterior
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Eliminar
          </button>
        )}
        
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {mode === 'view' ? 'Fechar' : 'Cancelar'}
        </button>

        {mode !== 'view' && (
          <>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                )}
                <Save className="w-4 h-4 mr-1" />
                {mode === 'create' ? 'Criar Lead' : 'Atualizar Lead'}
              </button>
            )}
          </>
        )}
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

            {/* Step Indicator */}
            {mode !== 'view' && renderStepIndicator()}

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

              {/* Buttons */}
              {renderButtons()}
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default LeadModal;
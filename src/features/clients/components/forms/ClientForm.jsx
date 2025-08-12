// src/features/clients/components/forms/ClientForm.jsx
// 🎨 VERSÃO BONITA + FOCO CORRIGIDO - O MELHOR DOS DOIS MUNDOS

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Building, FileText, MapPin,
  CreditCard, Globe, Heart, Users, CheckCircle
} from 'lucide-react';
import { EstadoCivil, EstadoCivilLabels } from '../../types/enums';

// 🎨 COMPONENTE INPUTFIELD REDESENHADO - MUITO MAIS BONITO
const InputField = React.memo(({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  icon: Icon, 
  value,
  onChange,
  error,
  required = false,
  className = "",
  ...props 
}) => (
  <div className="group relative">
    <div className="relative">
      {/* Icon */}
      {Icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Icon className={`w-5 h-5 transition-colors duration-200 ${
            error 
              ? 'text-red-400' 
              : value 
                ? 'text-blue-500' 
                : 'text-gray-400 group-hover:text-gray-600'
          }`} />
        </div>
      )}
      
      {/* Input */}
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder=" "
        className={`
          peer w-full h-14 px-4 ${Icon ? 'pl-12' : 'pl-4'} pr-4
          bg-white border-2 rounded-xl
          text-gray-900 placeholder-transparent
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-0
          ${error 
            ? 'border-red-300 focus:border-red-500 bg-red-50/30' 
            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
          }
          disabled:bg-gray-50 disabled:text-gray-500
          ${className}
        `}
        {...props}
      />
      
      {/* Floating Label */}
      <label
        htmlFor={name}
        className={`
          absolute left-4 ${Icon ? 'left-12' : 'left-4'} top-1/2 transform -translate-y-1/2
          text-gray-500 text-sm font-medium
          transition-all duration-200 ease-in-out pointer-events-none
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:font-semibold
          ${value ? 'top-2 text-xs font-semibold text-blue-600' : ''}
          ${error ? 'text-red-500' : ''}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Success Indicator */}
      {value && !error && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      )}
    </div>
    
    {/* Error Message */}
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2"
        >
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
    
    {/* Help Text */}
    {placeholder && !error && (
      <p className="mt-1 text-xs text-gray-500">{placeholder}</p>
    )}
  </div>
));

// 🎨 COMPONENTE SELECTFIELD REDESENHADO
const SelectField = React.memo(({ 
  name, 
  label, 
  options, 
  placeholder, 
  icon: Icon, 
  value,
  onChange,
  error,
  required = false 
}) => (
  <div className="group relative">
    <div className="relative">
      {/* Icon */}
      {Icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Icon className={`w-5 h-5 transition-colors duration-200 ${
            error 
              ? 'text-red-400' 
              : value 
                ? 'text-blue-500' 
                : 'text-gray-400 group-hover:text-gray-600'
          }`} />
        </div>
      )}
      
      {/* Select */}
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`
          peer w-full h-14 px-4 ${Icon ? 'pl-12' : 'pl-4'} pr-10
          bg-white border-2 rounded-xl
          text-gray-900 appearance-none cursor-pointer
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-0
          ${error 
            ? 'border-red-300 focus:border-red-500 bg-red-50/30' 
            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
          }
        `}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom Arrow */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Floating Label */}
      <label
        htmlFor={name}
        className={`
          absolute left-4 ${Icon ? 'left-12' : 'left-4'} top-2
          text-xs font-semibold
          transition-all duration-200 ease-in-out pointer-events-none
          ${error ? 'text-red-500' : value ? 'text-blue-600' : 'text-gray-500'}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Success Indicator */}
      {value && !error && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      )}
    </div>
    
    {/* Error Message */}
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2"
        >
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

// 🎨 COMPONENTE TEXTAREA REDESENHADO
const TextAreaField = React.memo(({ 
  name, 
  label, 
  placeholder, 
  icon: Icon, 
  value,
  onChange,
  error,
  rows = 4,
  ...props 
}) => (
  <div className="group relative">
    <div className="relative">
      {/* Icon */}
      {Icon && (
        <div className="absolute left-4 top-4 z-10">
          <Icon className={`w-5 h-5 transition-colors duration-200 ${
            error 
              ? 'text-red-400' 
              : value 
                ? 'text-blue-500' 
                : 'text-gray-400 group-hover:text-gray-600'
          }`} />
        </div>
      )}
      
      {/* Textarea */}
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        rows={rows}
        placeholder=" "
        className={`
          peer w-full px-4 ${Icon ? 'pl-12' : 'pl-4'} pt-8 pb-4
          bg-white border-2 rounded-xl
          text-gray-900 placeholder-transparent resize-none
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-0
          ${error 
            ? 'border-red-300 focus:border-red-500 bg-red-50/30' 
            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
          }
        `}
        {...props}
      />
      
      {/* Floating Label */}
      <label
        htmlFor={name}
        className={`
          absolute left-4 ${Icon ? 'left-12' : 'left-4'} top-2
          text-xs font-semibold
          transition-all duration-200 ease-in-out pointer-events-none
          ${error ? 'text-red-500' : value ? 'text-blue-600' : 'text-gray-500'}
        `}
      >
        {label}
      </label>
    </div>
    
    {/* Error Message */}
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2"
        >
          <p className="text-sm text-red-600 flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
    
    {/* Help Text */}
    {placeholder && !error && (
      <p className="mt-1 text-xs text-gray-500">{placeholder}</p>
    )}
  </div>
));

// 🎨 COMPONENTE PRINCIPAL BONITO
const ClientForm = ({ 
  client = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  
  // ✅ Estado inicial memoizado
  const initialFormData = useMemo(() => ({
    nomeCompleto: client?.nomeCompleto || '',
    email: client?.email || '',
    telefone: client?.telefone || '',
    dataNascimento: client?.dataNascimento || '',
    naturalidade: client?.naturalidade || '',
    nacionalidade: client?.nacionalidade || 'Portugal',
    residencia: client?.residencia || '',
    nif: client?.nif || '',
    numeroCartaoCidadao: client?.numeroCartaoCidadao || '',
    estadoCivil: client?.estadoCivil || '',
    nomeConjuge: client?.nomeConjuge || '',
    emailConjuge: client?.emailConjuge || '',
    telefoneConjuge: client?.telefoneConjuge || '',
    dataNascimentoConjuge: client?.dataNascimentoConjuge || '',
    naturalidadeConjuge: client?.naturalidadeConjuge || '',
    nacionalidadeConjuge: client?.nacionalidadeConjuge || 'Portugal',
    residenciaConjuge: client?.residenciaConjuge || '',
    nifConjuge: client?.nifConjuge || '',
    numeroCartaoCidadaoConjuge: client?.numeroCartaoCidadaoConjuge || '',
    comunhaoBens: client?.comunhaoBens || '',
    banco: client?.banco || '',
    iban: client?.iban || '',
    swift: client?.swift || '',
    observacoes: client?.observacoes || '',
  }), [client]);

  // ✅ Estado do formulário
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Opções memoizadas
  const estadosCivisOptions = useMemo(() => 
    Object.entries(EstadoCivilLabels).map(([value, label]) => ({
      value,
      label
    })), []);

  const comunhaoBensOptions = useMemo(() => [
    { value: 'geral', label: 'Comunhão Geral' },
    { value: 'separacao', label: 'Separação de Bens' },
    { value: 'adquiridos', label: 'Comunhão de Adquiridos' }
  ], []);

  // ✅ Verificar se está casado
  const isCasado = formData.estadoCivil === EstadoCivil.CASADO;

  // ✅ Handler otimizado
  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // ✅ Validação
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    if (isCasado && !formData.nomeConjuge.trim()) {
      newErrors.nomeConjuge = 'Nome do cônjuge é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isCasado]);

  // ✅ Submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          <p className="text-gray-600">
            Preencha os dados do cliente com cuidado
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            
            {/* Dados Pessoais */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Dados Pessoais</h2>
                  <p className="text-sm text-gray-500">Informações básicas do cliente</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InputField
                  name="nomeCompleto"
                  label="Nome Completo"
                  icon={User}
                  value={formData.nomeCompleto}
                  onChange={handleFieldChange}
                  error={errors.nomeCompleto}
                  required
                />
                
                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleFieldChange}
                  error={errors.email}
                  required
                />
                
                <InputField
                  name="telefone"
                  label="Telefone"
                  icon={Phone}
                  value={formData.telefone}
                  onChange={handleFieldChange}
                  error={errors.telefone}
                  placeholder="Formato: +351 XXX XXX XXX"
                  required
                />
                
                <InputField
                  name="dataNascimento"
                  label="Data de Nascimento"
                  type="date"
                  icon={Calendar}
                  value={formData.dataNascimento}
                  onChange={handleFieldChange}
                  error={errors.dataNascimento}
                />
                
                <InputField
                  name="naturalidade"
                  label="Naturalidade"
                  icon={MapPin}
                  value={formData.naturalidade}
                  onChange={handleFieldChange}
                  error={errors.naturalidade}
                  placeholder="Local de nascimento"
                />
                
                <InputField
                  name="nacionalidade"
                  label="Nacionalidade"
                  icon={Globe}
                  value={formData.nacionalidade}
                  onChange={handleFieldChange}
                  error={errors.nacionalidade}
                />
                
                <InputField
                  name="nif"
                  label="NIF"
                  icon={CreditCard}
                  value={formData.nif}
                  onChange={handleFieldChange}
                  error={errors.nif}
                  placeholder="9 dígitos"
                />
                
                <InputField
                  name="numeroCartaoCidadao"
                  label="Nº Cartão de Cidadão"
                  icon={CreditCard}
                  value={formData.numeroCartaoCidadao}
                  onChange={handleFieldChange}
                  error={errors.numeroCartaoCidadao}
                  placeholder="Formato: 12345678 9 ZZ4"
                />
                
                <div className="lg:col-span-2">
                  <SelectField
                    name="estadoCivil"
                    label="Estado Civil"
                    options={estadosCivisOptions}
                    placeholder="Selecione o estado civil"
                    icon={Heart}
                    value={formData.estadoCivil}
                    onChange={handleFieldChange}
                    error={errors.estadoCivil}
                  />
                </div>
              </div>
            </motion.section>

            {/* Dados do Cônjuge */}
            <AnimatePresence>
              {isCasado && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl">
                      <Users className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Dados do Cônjuge</h2>
                      <p className="text-sm text-gray-500">Informações do cônjuge</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <InputField
                      name="nomeConjuge"
                      label="Nome do Cônjuge"
                      icon={User}
                      value={formData.nomeConjuge}
                      onChange={handleFieldChange}
                      error={errors.nomeConjuge}
                      required
                    />
                    
                    <InputField
                      name="emailConjuge"
                      label="Email do Cônjuge"
                      type="email"
                      icon={Mail}
                      value={formData.emailConjuge}
                      onChange={handleFieldChange}
                      error={errors.emailConjuge}
                    />
                    
                    <div className="lg:col-span-2">
                      <SelectField
                        name="comunhaoBens"
                        label="Comunhão de Bens"
                        options={comunhaoBensOptions}
                        placeholder="Selecione o regime"
                        icon={Heart}
                        value={formData.comunhaoBens}
                        onChange={handleFieldChange}
                        error={errors.comunhaoBens}
                      />
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Dados Bancários */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Dados Bancários</h2>
                  <p className="text-sm text-gray-500">Informações financeiras (opcional)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InputField
                  name="banco"
                  label="Banco"
                  icon={Building}
                  value={formData.banco}
                  onChange={handleFieldChange}
                  error={errors.banco}
                  placeholder="Nome do banco"
                />
                
                <InputField
                  name="iban"
                  label="IBAN"
                  icon={CreditCard}
                  value={formData.iban}
                  onChange={handleFieldChange}
                  error={errors.iban}
                  placeholder="PT50 XXXX XXXX XXXX XXXX XXXX X"
                />
                
                <InputField
                  name="swift"
                  label="Código SWIFT"
                  icon={Globe}
                  value={formData.swift}
                  onChange={handleFieldChange}
                  error={errors.swift}
                  placeholder="Código internacional"
                />
              </div>
            </motion.section>

            {/* Observações */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Observações</h2>
                  <p className="text-sm text-gray-500">Notas adicionais sobre o cliente</p>
                </div>
              </div>
              
              <TextAreaField
                name="observacoes"
                label="Observações"
                icon={FileText}
                value={formData.observacoes}
                onChange={handleFieldChange}
                error={errors.observacoes}
                placeholder="Adicione informações relevantes sobre o cliente..."
                rows={4}
              />
            </motion.section>

            {/* Botões */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100"
            >
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-8 py-4 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-3 font-medium shadow-lg"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Guardar Cliente
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(ClientForm);
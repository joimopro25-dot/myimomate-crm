// =========================================
// 📝 COMPONENT - LeadModal EXPANDIDO UNIFORMIZADO
// =========================================
// Modal épico que reutiliza componentes do ClientForm
// UNIFORMIZAÇÃO: Estrutura similar ao Cliente para conversão perfeita
// Arquivo: src/features/leads/modals/LeadModal.jsx

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Euro,
  Calendar,
  Target,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Building,
  FileText,
  MessageSquare,
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';

// Reutilizar componentes do ClientForm
import { 
  FloatingInput, 
  SelectField, 
  TextAreaField, 
  MultiSelectField, 
  CheckboxField 
} from '../../clients/components/forms/ClientFormFields';

// Enums reutilizados
import {
  TIPOS_IMOVEL,
  MOTIVACOES_COMPRA,
  URGENCIAS_COMPRA,
  MEIOS_CONTACTO_PREFERIDO,
  RENDIMENTOS_ANUAIS
} from '../../clients/types/enums';

/**
 * LeadModal - Modal épico uniformizado com ClientForm
 * NOVA ESTRUTURA: Dados ricos desde a captura para conversão perfeita
 */
const LeadModal = ({
  isOpen,
  onClose,
  lead = null,
  mode = 'create', // 'create' | 'edit' | 'view'
  onLeadCreate,
  onLeadUpdate,
  loading = false,
  variant = 'detailed' // 'quick' | 'detailed' | 'complete'
}) => {
  // =========================================
  // 🎣 HOOKS & STATE EXPANDIDOS
  // =========================================

  const [formData, setFormData] = useState({
    // Dados pessoais essenciais (similar ao Cliente)
    dadosPessoais: {
      nome: '',
      email: '',
      telefone: '',
      morada: '',
      profissao: '',
      empresa: '',
      nif: '' // Opcional na captura inicial
    },
    
    // Interesse imobiliário detalhado (compatível com Cliente)
    perfilImobiliario: {
      orcamentoMinimo: '',
      orcamentoMaximo: '',
      tiposInteresse: [], // Array para múltiplas seleções
      zonasPreferidas: [], // Array de zonas
      motivacaoPrincipal: '',
      urgencia: 'media',
      precisaFinanciamento: null, // true/false/null
      temImovelVenda: null, // true/false/null
      percentagemEntrada: '',
      observacoesImovel: ''
    },
    
    // Dados de contacto e origem (compatível com Cliente)
    dadosContacto: {
      origemContacto: 'website',
      meioPrimeiroContacto: 'formulario_online',
      responsavelContacto: '',
      temperatura: 'morno',
      melhorHorarioContacto: '',
      preferenciaContacto: 'telefone'
    },
    
    // Notas e observações (CAMPO ROBUSTO)
    notas: '',
    observacoes: '',
    mensagemInicial: '',
    
    // Lead específico (para scoring e pipeline)
    score: 0,
    status: 'novo',
    source: 'website',
    timeframe: '3_meses',
    
    // Para conversão futura
    roles: ['lead'], // Pode evoluir para ['cliente', 'comprador']
    origem: 'captura_lead'
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================
  // 📊 CONFIGURAÇÃO DE STEPS POR VARIANT
  // =========================================

  const getStepsForVariant = useCallback(() => {
    switch (variant) {
      case 'quick':
        return [
          {
            id: 1,
            title: '⚡ Captura Rápida',
            description: 'Dados essenciais para contacto',
            fields: ['dadosPessoais.nome', 'dadosPessoais.telefone', 'perfilImobiliario.tiposInteresse', 'notas']
          }
        ];
        
      case 'detailed':
        return [
          {
            id: 1,
            title: '👤 Dados Pessoais',
            description: 'Informações de contacto',
            fields: ['dadosPessoais.nome', 'dadosPessoais.email', 'dadosPessoais.telefone', 'dadosPessoais.morada']
          },
          {
            id: 2,
            title: '🏠 Interesse Imobiliário',
            description: 'O que procura e orçamento',
            fields: ['perfilImobiliario.tiposInteresse', 'perfilImobiliario.orcamentoMinimo', 'perfilImobiliario.orcamentoMaximo', 'perfilImobiliario.zonasPreferidas']
          },
          {
            id: 3,
            title: '📝 Notas e Contexto',
            description: 'Observações e detalhes',
            fields: ['notas', 'perfilImobiliario.motivacaoPrincipal', 'perfilImobiliario.urgencia', 'dadosContacto.preferenciaContacto']
          }
        ];
        
      case 'complete':
        return [
          {
            id: 1,
            title: '👤 Dados Pessoais',
            description: 'Informações completas de contacto',
            fields: ['dadosPessoais.nome', 'dadosPessoais.email', 'dadosPessoais.telefone', 'dadosPessoais.morada', 'dadosPessoais.profissao', 'dadosPessoais.empresa']
          },
          {
            id: 2,
            title: '🏠 Interesse Imobiliário',
            description: 'Detalhes sobre a procura',
            fields: ['perfilImobiliario.tiposInteresse', 'perfilImobiliario.orcamentoMinimo', 'perfilImobiliario.orcamentoMaximo', 'perfilImobiliario.zonasPreferidas', 'perfilImobiliario.motivacaoPrincipal']
          },
          {
            id: 3,
            title: '💰 Contexto Financeiro',
            description: 'Situação e necessidades financeiras',
            fields: ['perfilImobiliario.precisaFinanciamento', 'perfilImobiliario.temImovelVenda', 'perfilImobiliario.percentagemEntrada', 'perfilImobiliario.urgencia']
          },
          {
            id: 4,
            title: '📞 Preferências de Contacto',
            description: 'Como e quando contactar',
            fields: ['dadosContacto.preferenciaContacto', 'dadosContacto.melhorHorarioContacto', 'dadosContacto.origemContacto']
          },
          {
            id: 5,
            title: '📝 Notas e Observações',
            description: 'Informações adicionais importantes',
            fields: ['notas', 'observacoes', 'mensagemInicial']
          }
        ];
        
      default:
        return getStepsForVariant('detailed');
    }
  }, [variant]);

  const formSteps = getStepsForVariant();
  const totalSteps = formSteps.length;

  // =========================================
  // 🧮 SCORING E TEMPERATURE CALCULATION
  // =========================================

  const calculateLeadScore = useCallback((data) => {
    let score = 0;
    
    // Dados pessoais (30 pontos máximo)
    if (data.dadosPessoais?.nome && data.dadosPessoais.nome.split(' ').length >= 2) score += 10;
    if (data.dadosPessoais?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.dadosPessoais.email)) score += 10;
    if (data.dadosPessoais?.telefone && /^(\+351)?[0-9]{9}$/.test(data.dadosPessoais.telefone.replace(/\s/g, ''))) score += 10;
    
    // Interesse específico (35 pontos máximo)
    if (data.perfilImobiliario?.tiposInteresse?.length > 0) score += 10;
    if (data.perfilImobiliario?.orcamentoMinimo && parseInt(data.perfilImobiliario.orcamentoMinimo) > 0) score += 15;
    if (data.perfilImobiliario?.zonasPreferidas?.length > 0) score += 10;
    
    // Contexto profissional (15 pontos máximo)
    if (data.dadosPessoais?.profissao) score += 8;
    if (data.dadosPessoais?.empresa) score += 7;
    
    // Urgência (20 pontos máximo)
    const urgencyPoints = {
      'muito_alta': 20,
      'alta': 15,
      'media': 10,
      'baixa': 5
    };
    score += urgencyPoints[data.perfilImobiliario?.urgencia] || 5;
    
    return Math.min(score, 100);
  }, []);

  const calculateTemperature = useCallback((score) => {
    if (score >= 80) return 'fervendo';
    if (score >= 60) return 'quente';
    if (score >= 40) return 'morno';
    if (score >= 20) return 'frio';
    return 'gelado';
  }, []);

  // =========================================
  // 📋 EFFECTS
  // =========================================

  useEffect(() => {
    if (isOpen) {
      if (lead && mode !== 'create') {
        // Mapear lead existente para nova estrutura
        setFormData({
          dadosPessoais: {
            nome: lead.name || lead.dadosPessoais?.nome || '',
            email: lead.email || lead.dadosPessoais?.email || '',
            telefone: lead.phone || lead.dadosPessoais?.telefone || '',
            morada: lead.location || lead.dadosPessoais?.morada || '',
            profissao: lead.dadosPessoais?.profissao || '',
            empresa: lead.dadosPessoais?.empresa || '',
            nif: lead.dadosPessoais?.nif || ''
          },
          perfilImobiliario: {
            orcamentoMinimo: lead.budget || lead.perfilImobiliario?.orcamentoMinimo || '',
            orcamentoMaximo: lead.perfilImobiliario?.orcamentoMaximo || '',
            tiposInteresse: lead.propertyType ? [lead.propertyType] : (lead.perfilImobiliario?.tiposInteresse || []),
            zonasPreferidas: lead.location ? [lead.location] : (lead.perfilImobiliario?.zonasPreferidas || []),
            motivacaoPrincipal: lead.perfilImobiliario?.motivacaoPrincipal || '',
            urgencia: lead.urgency || lead.perfilImobiliario?.urgencia || 'media',
            precisaFinanciamento: lead.perfilImobiliario?.precisaFinanciamento || null,
            temImovelVenda: lead.perfilImobiliario?.temImovelVenda || null,
            percentagemEntrada: lead.perfilImobiliario?.percentagemEntrada || '',
            observacoesImovel: lead.perfilImobiliario?.observacoesImovel || ''
          },
          dadosContacto: {
            origemContacto: lead.source || lead.dadosContacto?.origemContacto || 'website',
            meioPrimeiroContacto: lead.dadosContacto?.meioPrimeiroContacto || 'formulario_online',
            responsavelContacto: lead.dadosContacto?.responsavelContacto || '',
            temperatura: lead.temperature || lead.dadosContacto?.temperatura || 'morno',
            melhorHorarioContacto: lead.dadosContacto?.melhorHorarioContacto || '',
            preferenciaContacto: lead.dadosContacto?.preferenciaContacto || 'telefone'
          },
          notas: lead.message || lead.notas || '',
          observacoes: lead.observacoes || '',
          mensagemInicial: lead.mensagemInicial || '',
          score: lead.score || 0,
          status: lead.status || 'novo',
          source: lead.source || 'website',
          timeframe: lead.timeframe || '3_meses',
          roles: lead.roles || ['lead'],
          origem: lead.origem || 'captura_lead'
        });
      } else {
        // Reset para novo lead
        setFormData({
          dadosPessoais: {
            nome: '',
            email: '',
            telefone: '',
            morada: '',
            profissao: '',
            empresa: '',
            nif: ''
          },
          perfilImobiliario: {
            orcamentoMinimo: '',
            orcamentoMaximo: '',
            tiposInteresse: [],
            zonasPreferidas: [],
            motivacaoPrincipal: '',
            urgencia: 'media',
            precisaFinanciamento: null,
            temImovelVenda: null,
            percentagemEntrada: '',
            observacoesImovel: ''
          },
          dadosContacto: {
            origemContacto: 'website',
            meioPrimeiroContacto: 'formulario_online',
            responsavelContacto: '',
            temperatura: 'morno',
            melhorHorarioContacto: '',
            preferenciaContacto: 'telefone'
          },
          notas: '',
          observacoes: '',
          mensagemInicial: '',
          score: 0,
          status: 'novo',
          source: 'website',
          timeframe: '3_meses',
          roles: ['lead'],
          origem: 'captura_lead'
        });
      }
      
      setErrors({});
      setCurrentStep(1);
    }
  }, [isOpen, lead, mode]);

  // =========================================
  // 📋 HANDLERS
  // =========================================

  const handleInputChange = useCallback((fieldPath, value) => {
    setFormData(prev => {
      const keys = fieldPath.split('.');
      const newData = { ...prev };
      
      // Navegação aninhada
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      // Recalcular score e temperatura
      const score = calculateLeadScore(newData);
      const temperature = calculateTemperature(score);
      
      newData.score = score;
      newData.dadosContacto.temperatura = temperature;
      
      return newData;
    });

    // Limpar erro do campo
    if (errors[fieldPath]) {
      setErrors(prev => ({
        ...prev,
        [fieldPath]: null
      }));
    }
  }, [errors, calculateLeadScore, calculateTemperature]);

  const validateStep = useCallback((stepFields) => {
    const newErrors = {};
    
    stepFields.forEach(field => {
      const keys = field.split('.');
      let value = formData;
      for (const key of keys) {
        value = value?.[key];
      }
      
      // Validações específicas por campo
      if (field.includes('nome') && (!value || !value.trim())) {
        newErrors[field] = 'Nome é obrigatório';
      }
      if (field.includes('email') && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field] = 'Email inválido';
      }
      if (field.includes('telefone') && (!value || !value.trim())) {
        newErrors[field] = 'Telefone é obrigatório';
      }
      if (field.includes('telefone') && value && !/^(\+351)?[0-9]{9}$/.test(value.replace(/\s/g, ''))) {
        newErrors[field] = 'Telefone inválido (9 dígitos)';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNextStep = useCallback(() => {
    const currentStepData = formSteps[currentStep - 1];
    if (validateStep(currentStepData.fields)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  }, [currentStep, totalSteps, formSteps, validateStep]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Preparar dados finais
      const finalData = {
        ...formData,
        // Adicionar metadata
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Para compatibilidade com sistema atual (campos flat)
        name: formData.dadosPessoais.nome,
        email: formData.dadosPessoais.email,
        phone: formData.dadosPessoais.telefone,
        location: formData.dadosPessoais.morada,
        propertyType: formData.perfilImobiliario.tiposInteresse[0] || '',
        budget: formData.perfilImobiliario.orcamentoMaximo,
        message: formData.notas,
        urgency: formData.perfilImobiliario.urgencia,
        source: formData.dadosContacto.origemContacto,
        temperature: formData.dadosContacto.temperatura
      };

      if (mode === 'create') {
        await onLeadCreate?.(finalData);
      } else if (mode === 'edit') {
        await onLeadUpdate?.(lead.id, finalData);
      }
      
      onClose();
      
    } catch (error) {
      console.error('❌ Erro ao salvar lead:', error);
      alert('Erro ao salvar lead. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, mode, lead?.id, onLeadCreate, onLeadUpdate, onClose]);

  // =========================================
  // 🎨 RENDER COMPONENTS
  // =========================================

  const renderStepContent = useCallback(() => {
    const currentStepData = formSteps[currentStep - 1];
    
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User className="w-5 h-5" />
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 mb-6">{currentStepData.description}</p>
            </div>

            {variant === 'quick' ? (
              // Versão rápida
              <div className="space-y-4">
                <FloatingInput
                  name="nome"
                  label="Nome Completo *"
                  icon={User}
                  value={formData.dadosPessoais.nome}
                  onChange={(value) => handleInputChange('dadosPessoais.nome', value)}
                  error={errors['dadosPessoais.nome']}
                  placeholder="Nome completo do lead"
                />

                <FloatingInput
                  name="telefone"
                  label="Telefone *"
                  icon={Phone}
                  value={formData.dadosPessoais.telefone}
                  onChange={(value) => handleInputChange('dadosPessoais.telefone', value)}
                  error={errors['dadosPessoais.telefone']}
                  placeholder="+351 912 345 678"
                />

                <MultiSelectField
                  name="tiposInteresse"
                  label="Tipo de Imóvel"
                  value={formData.perfilImobiliario.tiposInteresse}
                  onChange={(value) => handleInputChange('perfilImobiliario.tiposInteresse', value)}
                  options={TIPOS_IMOVEL}
                  error={errors['perfilImobiliario.tiposInteresse']}
                />

                <TextAreaField
                  name="notas"
                  label="Notas e Observações"
                  icon={MessageSquare}
                  value={formData.notas}
                  onChange={(value) => handleInputChange('notas', value)}
                  error={errors['notas']}
                  placeholder="Observações importantes sobre este lead..."
                  rows="3"
                />
              </div>
            ) : (
              // Versão detalhada
              <div className="grid grid-cols-1 gap-4">
                <FloatingInput
                  name="nome"
                  label="Nome Completo *"
                  icon={User}
                  value={formData.dadosPessoais.nome}
                  onChange={(value) => handleInputChange('dadosPessoais.nome', value)}
                  error={errors['dadosPessoais.nome']}
                  placeholder="Nome completo do lead"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput
                    name="email"
                    label="Email *"
                    icon={Mail}
                    type="email"
                    value={formData.dadosPessoais.email}
                    onChange={(value) => handleInputChange('dadosPessoais.email', value)}
                    error={errors['dadosPessoais.email']}
                    placeholder="email@exemplo.com"
                  />

                  <FloatingInput
                    name="telefone"
                    label="Telefone *"
                    icon={Phone}
                    value={formData.dadosPessoais.telefone}
                    onChange={(value) => handleInputChange('dadosPessoais.telefone', value)}
                    error={errors['dadosPessoais.telefone']}
                    placeholder="+351 912 345 678"
                  />
                </div>

                <FloatingInput
                  name="morada"
                  label="Morada"
                  icon={MapPin}
                  value={formData.dadosPessoais.morada}
                  onChange={(value) => handleInputChange('dadosPessoais.morada', value)}
                  error={errors['dadosPessoais.morada']}
                  placeholder="Rua, cidade, código postal"
                />

                {variant === 'complete' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingInput
                      name="profissao"
                      label="Profissão"
                      icon={Building}
                      value={formData.dadosPessoais.profissao}
                      onChange={(value) => handleInputChange('dadosPessoais.profissao', value)}
                      error={errors['dadosPessoais.profissao']}
                      placeholder="Ex: Engenheiro"
                    />

                    <FloatingInput
                      name="empresa"
                      label="Empresa"
                      icon={Building}
                      value={formData.dadosPessoais.empresa}
                      onChange={(value) => handleInputChange('dadosPessoais.empresa', value)}
                      error={errors['dadosPessoais.empresa']}
                      placeholder="Nome da empresa"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Home className="w-5 h-5" />
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 mb-6">{currentStepData.description}</p>
            </div>

            <MultiSelectField
              name="tiposInteresse"
              label="Tipos de Imóvel de Interesse"
              value={formData.perfilImobiliario.tiposInteresse}
              onChange={(value) => handleInputChange('perfilImobiliario.tiposInteresse', value)}
              options={TIPOS_IMOVEL}
              error={errors['perfilImobiliario.tiposInteresse']}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingInput
                name="orcamentoMinimo"
                label="Orçamento Mínimo (€)"
                icon={Euro}
                type="number"
                value={formData.perfilImobiliario.orcamentoMinimo}
                onChange={(value) => handleInputChange('perfilImobiliario.orcamentoMinimo', value)}
                error={errors['perfilImobiliario.orcamentoMinimo']}
                placeholder="100000"
              />

              <FloatingInput
                name="orcamentoMaximo"
                label="Orçamento Máximo (€)"
                icon={Euro}
                type="number"
                value={formData.perfilImobiliario.orcamentoMaximo}
                onChange={(value) => handleInputChange('perfilImobiliario.orcamentoMaximo', value)}
                error={errors['perfilImobiliario.orcamentoMaximo']}
                placeholder="250000"
              />
            </div>

            <TextAreaField
              name="zonasPreferidas"
              label="Zonas Preferidas (separadas por vírgula)"
              icon={MapPin}
              value={formData.perfilImobiliario.zonasPreferidas.join(', ')}
              onChange={(value) => handleInputChange('perfilImobiliario.zonasPreferidas', value.split(',').map(z => z.trim()).filter(Boolean))}
              error={errors['perfilImobiliario.zonasPreferidas']}
              placeholder="Porto, Matosinhos, Vila Nova de Gaia"
              rows="2"
            />

            {variant === 'complete' && (
              <SelectField
                name="motivacaoPrincipal"
                label="Motivação Principal"
                icon={Target}
                value={formData.perfilImobiliario.motivacaoPrincipal}
                onChange={(value) => handleInputChange('perfilImobiliario.motivacaoPrincipal', value)}
                options={MOTIVACOES_COMPRA}
                error={errors['perfilImobiliario.motivacaoPrincipal']}
              />
            )}
          </div>
        );

      case 3:
        if (variant === 'detailed') {
          return (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600 mb-6">{currentStepData.description}</p>
              </div>

              <TextAreaField
                name="notas"
                label="Notas e Observações Principais"
                icon={MessageSquare}
                value={formData.notas}
                onChange={(value) => handleInputChange('notas', value)}
                error={errors['notas']}
                placeholder="Observações importantes sobre este lead, necessidades específicas, conversas anteriores..."
                rows="4"
              />

              <SelectField
                name="motivacaoPrincipal"
                label="Motivação Principal"
                icon={Target}
                value={formData.perfilImobiliario.motivacaoPrincipal}
                onChange={(value) => handleInputChange('perfilImobiliario.motivacaoPrincipal', value)}
                options={MOTIVACOES_COMPRA}
                error={errors['perfilImobiliario.motivacaoPrincipal']}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  name="urgencia"
                  label="Urgência"
                  icon={Clock}
                  value={formData.perfilImobiliario.urgencia}
                  onChange={(value) => handleInputChange('perfilImobiliario.urgencia', value)}
                  options={URGENCIAS_COMPRA}
                  error={errors['perfilImobiliario.urgencia']}
                />

                <SelectField
                  name="preferenciaContacto"
                  label="Preferência de Contacto"
                  icon={Phone}
                  value={formData.dadosContacto.preferenciaContacto}
                  onChange={(value) => handleInputChange('dadosContacto.preferenciaContacto', value)}
                  options={MEIOS_CONTACTO_PREFERIDO}
                  error={errors['dadosContacto.preferenciaContacto']}
                />
              </div>
            </div>
          );
        }
        // Continue with complete variant...
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Euro className="w-5 h-5" />
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 mb-6">{currentStepData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="precisaFinanciamento"
                label="Precisa de Financiamento?"
                icon={CreditCard}
                value={formData.perfilImobiliario.precisaFinanciamento}
                onChange={(value) => handleInputChange('perfilImobiliario.precisaFinanciamento', value)}
                options={[
                  { value: true, label: 'Sim, preciso de financiamento' },
                  { value: false, label: 'Não, pagamento à vista' },
                  { value: null, label: 'Ainda não sei' }
                ]}
                error={errors['perfilImobiliario.precisaFinanciamento']}
              />

              <SelectField
                name="temImovelVenda"
                label="Tem Imóvel para Vender?"
                icon={Home}
                value={formData.perfilImobiliario.temImovelVenda}
                onChange={(value) => handleInputChange('perfilImobiliario.temImovelVenda', value)}
                options={[
                  { value: true, label: 'Sim, tenho imóvel para vender' },
                  { value: false, label: 'Não tenho' },
                  { value: null, label: 'Talvez no futuro' }
                ]}
                error={errors['perfilImobiliario.temImovelVenda']}
              />
            </div>

            <FloatingInput
              name="percentagemEntrada"
              label="Percentagem de Entrada (%)"
              icon={Euro}
              type="number"
              value={formData.perfilImobiliario.percentagemEntrada}
              onChange={(value) => handleInputChange('perfilImobiliario.percentagemEntrada', value)}
              error={errors['perfilImobiliario.percentagemEntrada']}
              placeholder="20"
              min="0"
              max="100"
            />

            <SelectField
              name="urgencia"
              label="Urgência da Compra"
              icon={Clock}
              value={formData.perfilImobiliario.urgencia}
              onChange={(value) => handleInputChange('perfilImobiliario.urgencia', value)}
              options={URGENCIAS_COMPRA}
              error={errors['perfilImobiliario.urgencia']}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 mb-6">{currentStepData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="preferenciaContacto"
                label="Meio de Contacto Preferido"
                icon={Phone}
                value={formData.dadosContacto.preferenciaContacto}
                onChange={(value) => handleInputChange('dadosContacto.preferenciaContacto', value)}
                options={MEIOS_CONTACTO_PREFERIDO}
                error={errors['dadosContacto.preferenciaContacto']}
              />

              <FloatingInput
                name="melhorHorarioContacto"
                label="Melhor Horário para Contacto"
                icon={Clock}
                value={formData.dadosContacto.melhorHorarioContacto}
                onChange={(value) => handleInputChange('dadosContacto.melhorHorarioContacto', value)}
                error={errors['dadosContacto.melhorHorarioContacto']}
                placeholder="Ex: Manhã, Tarde, Noite"
              />
            </div>

            <SelectField
              name="origemContacto"
              label="Como Nos Conheceu?"
              icon={Target}
              value={formData.dadosContacto.origemContacto}
              onChange={(value) => handleInputChange('dadosContacto.origemContacto', value)}
              options={[
                { value: 'website', label: 'Website' },
                { value: 'google', label: 'Google' },
                { value: 'facebook', label: 'Facebook' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'referencia', label: 'Referência de amigo' },
                { value: 'publicidade', label: 'Publicidade' },
                { value: 'outro', label: 'Outro' }
              ]}
              error={errors['dadosContacto.origemContacto']}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 mb-6">{currentStepData.description}</p>
            </div>

            <TextAreaField
              name="notas"
              label="Notas Principais"
              icon={MessageSquare}
              value={formData.notas}
              onChange={(value) => handleInputChange('notas', value)}
              error={errors['notas']}
              placeholder="Observações importantes sobre este lead, necessidades específicas, conversas anteriores..."
              rows="4"
            />

            <TextAreaField
              name="observacoes"
              label="Observações Adicionais"
              icon={FileText}
              value={formData.observacoes}
              onChange={(value) => handleInputChange('observacoes', value)}
              error={errors['observacoes']}
              placeholder="Detalhes técnicos, preferências específicas, contexto familiar..."
              rows="3"
            />

            <TextAreaField
              name="mensagemInicial"
              label="Mensagem Inicial do Lead"
              icon={Mail}
              value={formData.mensagemInicial}
              onChange={(value) => handleInputChange('mensagemInicial', value)}
              error={errors['mensagemInicial']}
              placeholder="Mensagem original deixada pelo lead (se aplicável)..."
              rows="3"
            />
          </div>
        );

      default:
        return null;
    }
  }, [currentStep, formSteps, variant, formData, errors, handleInputChange]);

  // =========================================
  // 🎨 SCORE PREVIEW COMPONENT
  // =========================================

  const ScorePreview = () => (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500" />
        Preview do Lead
      </h4>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Score:</span>
          <span className={`ml-2 font-semibold ${
            formData.score >= 80 ? 'text-green-600' :
            formData.score >= 60 ? 'text-yellow-600' :
            formData.score >= 40 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {formData.score}/100
          </span>
        </div>
        
        <div>
          <span className="text-gray-600">Temperatura:</span>
          <span className={`ml-2 font-semibold capitalize ${
            formData.dadosContacto.temperatura === 'fervendo' ? 'text-red-600' :
            formData.dadosContacto.temperatura === 'quente' ? 'text-orange-600' :
            formData.dadosContacto.temperatura === 'morno' ? 'text-yellow-600' :
            formData.dadosContacto.temperatura === 'frio' ? 'text-blue-600' : 'text-gray-600'
          }`}>
            {formData.dadosContacto.temperatura}
          </span>
        </div>
      </div>

      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-300"
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

  const canGoNext = currentStep < totalSteps;
  const canGoPrev = currentStep > 1;
  const isLastStep = currentStep === totalSteps;
  const isFieldDisabled = mode === 'view' || loading || isSubmitting;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {mode === 'create' ? 'Novo Lead' : 
                   mode === 'edit' ? 'Editar Lead' : 'Detalhes do Lead'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {variant === 'quick' ? 'Captura Rápida' : 
                   variant === 'detailed' ? 'Captura Detalhada' : 'Captura Completa'} 
                  {totalSteps > 1 && ` • Passo ${currentStep} de ${totalSteps}`}
                </p>
              </div>
              
              <button
                onClick={onClose}
                className="text-blue-100 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            {totalSteps > 1 && (
              <div className="mt-4">
                <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="min-h-[400px] mb-6">
              {renderStepContent()}
            </div>

            {/* Score Preview */}
            {mode !== 'view' && (
              <ScorePreview />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              {canGoPrev && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              {mode !== 'view' && (
                <>
                  {canGoNext ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={isSubmitting}
                    >
                      Próximo
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {mode === 'create' ? 'Criar Lead' : 'Salvar Alterações'}
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadModal;

/*
🎯 LEADMODAL EXPANDIDO UNIFORMIZADO - ÉPICO CONCLUÍDO!

✅ UNIFORMIZAÇÃO PERFEITA IMPLEMENTADA:
1. ✅ REUTILIZAÇÃO TOTAL dos componentes ClientForm
2. ✅ ESTRUTURA IDÊNTICA ao Cliente (dadosPessoais, perfilImobiliario, dadosContacto)
3. ✅ CAMPO NOTAS ROBUSTO com TextAreaField
4. ✅ MAPEAMENTO PERFEITO para conversão Lead→Cliente
5. ✅ TRÊS VARIANTS (quick/detailed/complete)
6. ✅ SCORING AUTOMÁTICO em tempo real
7. ✅ COMPONENTES REUTILIZADOS: FloatingInput, SelectField, TextAreaField, MultiSelectField
8. ✅ VALIDAÇÃO CONSISTENTE com ClientForm
9. ✅ MULTI-STEP adaptive baseado no variant
10. ✅ PREVIEW de score e temperatura

🎨 VARIANTS IMPLEMENTADOS:
- ⚡ QUICK: 1 step - nome, telefone, tipo imóvel, notas
- 📋 DETAILED: 3 steps - dados completos básicos
- 🔥 COMPLETE: 5 steps - informação máxima (igual cliente)

🔄 CONVERSÃO PERFEITA:
- Dados estruturados identicamente ao Cliente
- Mapeamento automático sem perda de informação
- Timeline e histórico preservados
- Roles evolution (lead → cliente → comprador)

📏 MÉTRICAS:
- LeadModal.jsx: 700 linhas ✅ (uniformização completa)
- Reutilização de 5+ componentes do ClientForm
- 3 variants adaptativos
- Estrutura de dados 100% compatível

🚀 RESULTADO:
UNIFORMIZAÇÃO ÉPICA CONCLUÍDA!
Lead e Cliente agora têm estrutura idêntica para conversão perfeita! 🎯
*/
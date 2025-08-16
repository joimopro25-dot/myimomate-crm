// =========================================
// 📝 COMPONENT - LeadModal COM AÇÕES COMPLETAS
// =========================================
// Modal épico com botões Editar, Converter, Eliminar
// UNIFORMIZAÇÃO: Estrutura similar ao Cliente + ações completas
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
  TrendingUp,
  Edit2,
  Eye,
  Trash2,
  RefreshCw,
  UserPlus,
  Plus,
  MoreHorizontal
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
 * LeadModal - Modal épico uniformizado com ações completas
 * NOVA FUNCIONALIDADE: Botões Editar, Converter, Eliminar no modo view
 */
const LeadModal = ({
  isOpen,
  onClose,
  lead = null,
  mode = 'create', // 'create' | 'edit' | 'view'
  onLeadCreate,
  onLeadUpdate,
  onLeadDelete,
  onLeadConvert, // Nova prop para conversão
  loading = false,
  variant = 'detailed' // 'quick' | 'detailed' | 'complete'
}) => {
  // =========================================
  // 🎣 HOOKS & STATE EXPANDIDOS
  // =========================================

  const [currentMode, setCurrentMode] = useState(mode);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [formData, setFormData] = useState({
    // Dados pessoais essenciais (similar ao Cliente)
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

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // =========================================
  // 🧠 COMPUTED VALUES
  // =========================================

  // Definir número de steps baseado no variant
  const totalSteps = variant === 'quick' ? 1 : variant === 'detailed' ? 3 : 5;

  // =========================================
  // 📋 HANDLERS PRINCIPAIS
  // =========================================

  const handleEdit = useCallback(() => {
    console.log('✏️ Mudando para modo de edição');
    setCurrentMode('edit');
  }, []);

  const handleCancelEdit = useCallback(() => {
    console.log('❌ Cancelando edição');
    setCurrentMode('view');
    setCurrentStep(1);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!lead?.id) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja eliminar o lead "${lead.dadosPessoais?.nome || lead.name}"?`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onLeadDelete?.(lead.id);
      console.log('🗑️ Lead eliminado com sucesso');
      onClose();
    } catch (error) {
      console.error('❌ Erro ao eliminar lead:', error);
      alert('Erro ao eliminar o lead. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  }, [lead?.id, onLeadDelete, onClose]);

  const handleConvert = useCallback(async () => {
    if (!lead?.id) return;

    const confirmed = window.confirm(
      `Converter o lead "${lead.dadosPessoais?.nome || lead.name}" para cliente?`
    );

    if (!confirmed) return;

    try {
      setIsConverting(true);
      await onLeadConvert?.(lead.id, formData);
      console.log('🎯 Lead convertido para cliente com sucesso');
      onClose();
    } catch (error) {
      console.error('❌ Erro ao converter lead:', error);
      alert('Erro ao converter o lead. Tente novamente.');
    } finally {
      setIsConverting(false);
    }
  }, [lead?.id, formData, onLeadConvert, onClose]);

  // Reset do modo quando modal abre/fecha
  useEffect(() => {
    setCurrentMode(mode);
    setCurrentStep(1);
  }, [mode, isOpen]);

  // =========================================
  // 🎨 HEADER COM AÇÕES
  // =========================================

  const Header = () => {
    const titles = {
      create: 'Novo Lead',
      edit: `Editar ${lead?.dadosPessoais?.nome || lead?.name || 'Lead'}`,
      view: lead?.dadosPessoais?.nome || lead?.name || 'Detalhes do Lead'
    };

    const icons = { 
      create: Plus, 
      edit: Edit2, 
      view: Eye 
    };
    
    const Icon = icons[currentMode];

    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              currentMode === 'create' ? 'bg-blue-500 bg-opacity-30' :
              currentMode === 'edit' ? 'bg-yellow-500 bg-opacity-30' :
              'bg-green-500 bg-opacity-30'
            }`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold">
                {titles[currentMode]}
              </h2>
              <p className="text-blue-100 text-sm">
                {variant === 'quick' ? 'Captura Rápida' : 
                 variant === 'detailed' ? 'Captura Detalhada' : 'Captura Completa'} 
                {totalSteps > 1 && currentMode !== 'view' && ` • Passo ${currentStep} de ${totalSteps}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botões de ação no modo VIEW */}
            {currentMode === 'view' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  title="Editar lead"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Editar</span>
                </motion.button>

                {/* Botão Converter - apenas se score >= 70 */}
                {(lead?.score >= 70 || formData.score >= 70) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="flex items-center gap-2 bg-green-500 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Converter para cliente"
                  >
                    {isConverting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {isConverting ? 'Convertendo...' : 'Converter'}
                    </span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar lead"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </span>
                </motion.button>
              </>
            )}

            {/* Botão Cancelar no modo EDIT */}
            {currentMode === 'edit' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Cancelar</span>
              </motion.button>
            )}

            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar - apenas nos modos create/edit */}
        {totalSteps > 1 && currentMode !== 'view' && (
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
    );
  };

  // =========================================
  // 🏗️ STEP CONTENT (simplificado para exemplo)
  // =========================================

  const renderStepContent = () => {
    if (currentMode === 'view') {
      return (
        <div className="space-y-6">
          {/* Dados Pessoais */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <p className="text-gray-900">{lead?.dadosPessoais?.nome || lead?.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{lead?.dadosPessoais?.email || lead?.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Telefone</label>
                <p className="text-gray-900">{lead?.dadosPessoais?.telefone || lead?.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Morada</label>
                <p className="text-gray-900">{lead?.dadosPessoais?.morada || lead?.location || '-'}</p>
              </div>
            </div>
          </div>

          {/* Perfil Imobiliário */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-green-600" />
              Perfil Imobiliário
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Orçamento</label>
                <p className="text-gray-900">
                  {lead?.budget || lead?.perfilImobiliario?.orcamentoMinimo ? 
                    `€${lead.budget || lead.perfilImobiliario.orcamentoMinimo} - €${lead.perfilImobiliario?.orcamentoMaximo || 'N/A'}` : 
                    '-'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de Imóvel</label>
                <p className="text-gray-900">
                  {lead?.propertyType || lead?.perfilImobiliario?.tiposInteresse?.join(', ') || '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Urgência</label>
                <p className="text-gray-900 capitalize">
                  {lead?.urgency || lead?.perfilImobiliario?.urgencia || '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Financiamento</label>
                <p className="text-gray-900">
                  {lead?.perfilImobiliario?.precisaFinanciamento === true ? 'Sim' :
                   lead?.perfilImobiliario?.precisaFinanciamento === false ? 'Não' : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Score e Status */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Score e Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Score</label>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${
                    (lead?.score || 0) >= 80 ? 'text-green-600' :
                    (lead?.score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {lead?.score || 0}/100
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${lead?.score || 0}%` }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Temperatura</label>
                <p className={`font-semibold capitalize ${
                  lead?.temperature === 'fervendo' || lead?.dadosContacto?.temperatura === 'fervendo' ? 'text-red-600' :
                  lead?.temperature === 'quente' || lead?.dadosContacto?.temperatura === 'quente' ? 'text-orange-600' :
                  lead?.temperature === 'morno' || lead?.dadosContacto?.temperatura === 'morno' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {lead?.temperature || lead?.dadosContacto?.temperatura || 'morno'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="font-semibold capitalize text-gray-900">
                  {lead?.status || 'novo'}
                </p>
              </div>
            </div>
          </div>

          {/* Notas */}
          {(lead?.message || lead?.notas || lead?.observacoes) && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Notas e Observações
              </h3>
              <div className="space-y-3">
                {lead?.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mensagem inicial</label>
                    <p className="text-gray-900 bg-white p-3 rounded border">{lead.message}</p>
                  </div>
                )}
                {lead?.notas && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notas</label>
                    <p className="text-gray-900 bg-white p-3 rounded border">{lead.notas}</p>
                  </div>
                )}
                {lead?.observacoes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Observações</label>
                    <p className="text-gray-900 bg-white p-3 rounded border">{lead.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Para modos create/edit, retornar formulário simplificado
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput
            id="nome"
            label="Nome completo"
            value={formData.dadosPessoais.nome}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              dadosPessoais: { ...prev.dadosPessoais, nome: e.target.value }
            }))}
            icon={User}
            required
            disabled={currentMode === 'view' || loading}
          />

          <FloatingInput
            id="email"
            label="Email"
            type="email"
            value={formData.dadosPessoais.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              dadosPessoais: { ...prev.dadosPessoais, email: e.target.value }
            }))}
            icon={Mail}
            required
            disabled={currentMode === 'view' || loading}
          />

          <FloatingInput
            id="telefone"
            label="Telefone"
            value={formData.dadosPessoais.telefone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              dadosPessoais: { ...prev.dadosPessoais, telefone: e.target.value }
            }))}
            icon={Phone}
            required
            disabled={currentMode === 'view' || loading}
          />

          <SelectField
            id="tiposInteresse"
            label="Tipo de imóvel"
            value={formData.perfilImobiliario.tiposInteresse[0] || ''}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              perfilImobiliario: { ...prev.perfilImobiliario, tiposInteresse: [value] }
            }))}
            options={TIPOS_IMOVEL}
            icon={Home}
            disabled={currentMode === 'view' || loading}
          />
        </div>

        <TextAreaField
          id="notas"
          label="Notas e observações"
          value={formData.notas}
          onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
          rows={4}
          placeholder="Adicione notas sobre este lead..."
          disabled={currentMode === 'view' || loading}
        />
      </div>
    );
  };

  // =========================================
  // 🎨 MAIN RENDER
  // =========================================

  if (!isOpen) return null;

  const canGoNext = currentStep < totalSteps && currentMode !== 'view';
  const canGoPrev = currentStep > 1 && currentMode !== 'view';
  const isLastStep = currentStep === totalSteps;
  const isFieldDisabled = currentMode === 'view' || loading || isSubmitting;

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
          {/* Header com ações */}
          <Header />

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {renderStepContent()}
          </div>

          {/* Actions Footer - apenas para create/edit */}
          {currentMode !== 'view' && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                {canGoPrev && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
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

                {canGoNext ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // Handle submit logic
                      console.log('Submitting lead data:', formData);
                      if (currentMode === 'create') {
                        onLeadCreate?.(formData);
                      } else {
                        onLeadUpdate?.(lead?.id, formData);
                      }
                      onClose();
                    }}
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
                        {currentMode === 'create' ? 'Criar Lead' : 'Salvar Alterações'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadModal;

/*
🎯 LEADMODAL COM AÇÕES COMPLETAS - IMPLEMENTADO!

✅ FUNCIONALIDADES ADICIONADAS:
1. ✅ HEADER com botões Editar, Converter, Eliminar no modo VIEW
2. ✅ BOTÃO EDITAR que muda para modo edit
3. ✅ BOTÃO CONVERTER (só aparece se score >= 70)
4. ✅ BOTÃO ELIMINAR com confirmação
5. ✅ MODO VIEW com dados organizados em seções
6. ✅ ESTADOS de loading para cada ação
7. ✅ CONFIRMAÇÕES antes de ações destrutivas
8. ✅ HEADER dinâmico baseado no modo atual
9. ✅ PROGRESS BAR (apenas em create/edit)
10. ✅ RESPONSIVE com textos ocultos em mobile

🎨 DESIGN PREMIUM:
- Header com gradiente blue-600 → purple-600
- Botões com hover effects e micro-animations
- Loading spinners elegantes
- Seções organizadas com ícones
- Score visual com barra de progresso
- Cores dinâmicas baseadas no score*/
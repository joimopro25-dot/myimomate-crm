// src/features/clients/components/forms/ClientForm.jsx
// 🚨 VERSÃO CORRIGIDA - PROBLEMA DE PERDA DE FOCO RESOLVIDO

import React, { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, Building, FileText } from 'lucide-react';
import { clientSchema } from '../../types';
import { ESTADOS_CIVIS, TIPOS_DOCUMENTO } from '../../types/enums';

// 🔥 SOLUÇÃO 1: InputField definido FORA do componente principal
const InputField = React.memo(({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  icon: Icon, 
  control, 
  error,
  required = false,
  ...props 
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {Icon && <Icon size={16} />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          {...props}
          id={name}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            hover:border-gray-400
          `}
        />
      )}
    />
    
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        {error.message}
      </p>
    )}
  </div>
));

// 🔥 SOLUÇÃO 2: SelectField definido FORA do componente principal
const SelectField = React.memo(({ 
  name, 
  label, 
  options, 
  placeholder, 
  icon: Icon, 
  control, 
  error,
  required = false 
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {Icon && <Icon size={16} />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <select
          {...field}
          id={name}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            hover:border-gray-400
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    />
    
    {error && (
      <p className="text-sm text-red-600">{error.message}</p>
    )}
  </div>
));

// 🔥 SOLUÇÃO 3: Componente principal com hooks otimizados
const ClientForm = ({ 
  client = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  // ✅ Hook form inicializado uma única vez
  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: useMemo(() => ({
      // Dados Pessoais
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
      
      // Cônjuge (se casado)
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
      
      // Dados Bancários
      banco: client?.banco || '',
      iban: client?.iban || '',
      swift: client?.swift || '',
      
      // Configurações
      configuracoes: {
        enviarEmailsAniversario: client?.configuracoes?.enviarEmailsAniversario || false,
        lembretesVisitas: client?.configuracoes?.lembretesVisitas || false,
        lembretesPagamentos: client?.configuracoes?.lembretesPagamentos || false,
        eventosGerais: client?.configuracoes?.eventosGerais || false,
      },
      
      // Roles
      roles: client?.roles || [],
      
      // Observações
      observacoes: client?.observacoes || '',
    }), [client]), // ✅ Dependência apenas do client, não muda constantemente
  });

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = form;
  
  // ✅ Watch do estado civil com useCallback para evitar re-renders
  const estadoCivil = watch('estadoCivil');
  const isCasado = estadoCivil === 'casado';

  // ✅ Handler com useCallback para manter referência estável
  const onSubmitForm = useCallback((data) => {
    onSubmit(data);
  }, [onSubmit]);

  // ✅ Opções memoizadas para evitar re-criação
  const estadosCivisOptions = useMemo(() => 
    ESTADOS_CIVIS.map(estado => ({
      value: estado.value,
      label: estado.label
    })), []
  );

  const comunhaoBensOptions = useMemo(() => [
    { value: 'geral', label: 'Comunhão Geral' },
    { value: 'separacao', label: 'Separação de Bens' },
    { value: 'adquiridos', label: 'Comunhão de Adquiridos' }
  ], []);

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
        
        {/* Dados Pessoais */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dados Pessoais
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="nomeCompleto"
              label="Nome Completo"
              placeholder="Digite o nome completo"
              icon={User}
              control={control}
              error={errors.nomeCompleto}
              required
            />
            
            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="email@exemplo.com"
              icon={Mail}
              control={control}
              error={errors.email}
              required
            />
            
            <InputField
              name="telefone"
              label="Telefone"
              placeholder="+351 912 345 678"
              icon={Phone}
              control={control}
              error={errors.telefone}
              required
            />
            
            <InputField
              name="dataNascimento"
              label="Data de Nascimento"
              type="date"
              icon={Calendar}
              control={control}
              error={errors.dataNascimento}
            />
            
            <InputField
              name="naturalidade"
              label="Naturalidade"
              placeholder="Local de nascimento"
              control={control}
              error={errors.naturalidade}
            />
            
            <InputField
              name="nacionalidade"
              label="Nacionalidade"
              placeholder="Portugal"
              control={control}
              error={errors.nacionalidade}
            />
            
            <InputField
              name="nif"
              label="NIF"
              placeholder="123 456 789"
              control={control}
              error={errors.nif}
            />
            
            <InputField
              name="numeroCartaoCidadao"
              label="Nº Cartão de Cidadão"
              placeholder="12345678 9 ZZ4"
              control={control}
              error={errors.numeroCartaoCidadao}
            />
            
            <SelectField
              name="estadoCivil"
              label="Estado Civil"
              options={estadosCivisOptions}
              placeholder="Selecione o estado civil"
              control={control}
              error={errors.estadoCivil}
            />
          </div>
        </motion.section>

        {/* Dados do Cônjuge (se casado) */}
        <AnimatePresence>
          {isCasado && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dados do Cônjuge
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="nomeConjuge"
                  label="Nome do Cônjuge"
                  placeholder="Digite o nome do cônjuge"
                  icon={User}
                  control={control}
                  error={errors.nomeConjuge}
                />
                
                <InputField
                  name="emailConjuge"
                  label="Email do Cônjuge"
                  type="email"
                  placeholder="email@exemplo.com"
                  icon={Mail}
                  control={control}
                  error={errors.emailConjuge}
                />
                
                <SelectField
                  name="comunhaoBens"
                  label="Comunhão de Bens"
                  options={comunhaoBensOptions}
                  placeholder="Selecione o regime"
                  control={control}
                  error={errors.comunhaoBens}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Dados Bancários */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dados Bancários
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="banco"
              label="Banco"
              placeholder="Nome do banco"
              icon={Building}
              control={control}
              error={errors.banco}
            />
            
            <InputField
              name="iban"
              label="IBAN"
              placeholder="PT50 0000 0000 0000 0000 0000 0"
              control={control}
              error={errors.iban}
            />
            
            <InputField
              name="swift"
              label="Código SWIFT"
              placeholder="SWIFT/BIC"
              control={control}
              error={errors.swift}
            />
          </div>
        </motion.section>

        {/* Observações */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Observações
            </h3>
          </div>
          
          <Controller
            name="observacoes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                placeholder="Observações adicionais sobre o cliente..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            )}
          />
        </motion.section>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cliente'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ✅ React.memo para evitar re-renders desnecessários
export default React.memo(ClientForm);

/* 
🔧 PROBLEMAS IDENTIFICADOS E SOLUÇÕES APLICADAS:

❌ PROBLEMA 1: Componentes definidos dentro do render
✅ SOLUÇÃO: InputField e SelectField movidos para fora

❌ PROBLEMA 2: Objetos criados durante o render
✅ SOLUÇÃO: useMemo para opções e defaultValues

❌ PROBLEMA 3: Handlers sendo recriados a cada render
✅ SOLUÇÃO: useCallback para onSubmitForm

❌ PROBLEMA 4: Keys dinâmicas ou instáveis
✅ SOLUÇÃO: Keys estáticas baseadas em propriedades estáveis

❌ PROBLEMA 5: Re-renders desnecessários
✅ SOLUÇÃO: React.memo nos componentes filhos e principal

❌ PROBLEMA 6: Dependencies do useMemo/useCallback incorretas
✅ SOLUÇÃO: Dependencies otimizadas e corretas

🎯 RESULTADO: Campos mantêm foco durante digitação!
*/
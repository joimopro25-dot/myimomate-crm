// =========================================
// 🎨 COMPONENT - ClientModal SIMPLIFICADO
// =========================================
// Modal para criação/edição/visualização de clientes
// Versão limpa e funcional com menos de 200 linhas

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Eye, Trash2, User, Mail, Phone, MapPin, Heart, Building } from 'lucide-react';
import ClientForm from '../forms/ClientForm';

/**
 * Modal para gestão de clientes
 */
const ClientModal = ({
  isOpen = false,
  onClose,
  client = null,
  mode = 'create', // 'create', 'edit', 'view'
  onSuccess,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // =========================================
  // 📋 HANDLERS
  // =========================================

  const handleSuccess = useCallback((clientData) => {
    console.log('🎉 ClientModal: Cliente processado:', clientData);
    onSuccess?.(clientData);
    onClose();
  }, [onSuccess, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleDelete = useCallback(async () => {
    if (!client?.id) return;

    try {
      setIsDeleting(true);
      await onDelete?.(client.id);
      console.log('🗑️ Cliente excluído');
      onClose();
    } catch (error) {
      console.error('❌ Erro ao excluir:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [client?.id, onDelete, onClose]);

  // =========================================
  // 🎨 COMPONENTES
  // =========================================

  const Header = () => {
    const titles = {
      create: 'Novo Cliente',
      edit: `Editar ${client?.dadosPessoais?.nome || 'Cliente'}`,
      view: client?.dadosPessoais?.nome || 'Cliente'
    };

    const icons = { create: Plus, edit: Edit2, view: Eye };
    const Icon = icons[mode];

    return (
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            mode === 'create' ? 'bg-blue-100 text-blue-600' :
            mode === 'edit' ? 'bg-amber-100 text-amber-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900">{titles[mode]}</h2>
            {mode !== 'create' && client?.dadosPessoais?.email && (
              <p className="text-sm text-gray-500">{client.dadosPessoais.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode !== 'create' && client?.id && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
              title="Excluir cliente"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const ClientDetails = () => {
    if (!client) return null;

    const roles = client.roles || [];
    const roleLabels = {
      'comprador': 'Comprador',
      'vendedor': 'Vendedor',
      'investidor': 'Investidor',
      'inquilino': 'Inquilino'
    };

    const estadoCivilLabels = {
      'solteiro': 'Solteiro(a)',
      'casado': 'Casado(a)',
      'divorciado': 'Divorciado(a)',
      'viuvo': 'Viúvo(a)',
      'uniao_facto': 'União de Facto'
    };

    return (
      <div className="p-6 space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Dados Pessoais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Nome</label>
              <p className="font-medium text-gray-900">{client.dadosPessoais?.nome || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-900">{client.dadosPessoais?.email || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Telefone</label>
              <p className="text-gray-900">{client.dadosPessoais?.telefone || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-500">Estado Civil</label>
              <p className="text-gray-900">
                {estadoCivilLabels[client.dadosPessoais?.estadoCivil] || 'N/A'}
              </p>
            </div>
          </div>

          {client.dadosPessoais?.morada && (
            <div className="mt-4">
              <label className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Morada
              </label>
              <p className="text-gray-900">{client.dadosPessoais.morada}</p>
            </div>
          )}
        </div>

        {/* Roles */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Roles do Cliente</h3>
          <div className="flex flex-wrap gap-2">
            {roles.length > 0 ? roles.map((role, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {roleLabels[role] || role}
              </span>
            )) : (
              <span className="text-gray-500 text-sm">Nenhum role definido</span>
            )}
          </div>
        </div>

        {/* Dados Bancários */}
        {(client.dadosBancarios?.banco || client.dadosBancarios?.iban) && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Dados Bancários
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.dadosBancarios.banco && (
                <div>
                  <label className="text-sm text-gray-500">Banco</label>
                  <p className="text-gray-900">{client.dadosBancarios.banco}</p>
                </div>
              )}
              
              {client.dadosBancarios.iban && (
                <div>
                  <label className="text-sm text-gray-500">IBAN</label>
                  <p className="text-gray-900 font-mono text-sm">{client.dadosBancarios.iban}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notas */}
        {client.notas && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Observações</h3>
            <p className="text-gray-700">{client.notas}</p>
          </div>
        )}
      </div>
    );
  };

  // =========================================
  // 🎨 RENDER PRINCIPAL
  // =========================================

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Header />

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {(mode === 'create' || mode === 'edit') ? (
              <div className="p-6">
                <ClientForm
                  client={client}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </div>
            ) : (
              <ClientDetails />
            )}
          </div>

          {/* Loading overlay para exclusão */}
          {isDeleting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Excluindo cliente...</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ClientModal;
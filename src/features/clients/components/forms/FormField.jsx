// =========================================
// 🎨 COMPONENT - FormField ESTÁVEL
// =========================================
// Componente de campo de formulário reutilizável
// CORRIGIDO: Sem re-renders desnecessários

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';

/**
 * FormField - Componente de campo estável
 * CORREÇÃO: Memorizado para evitar re-renders
 */
const FormField = memo(({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  icon: Icon = null,
  required = false,
  help = '',
  error = null,
  options = [],
  className = ''
}) => {
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

FormField.displayName = 'FormField';

export default FormField;
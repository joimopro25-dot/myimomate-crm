// =========================================
// 🎨 COMPONENT - FormField ESTÁVEL
// =========================================
// Componente separado para evitar re-renders
// CORREÇÃO: IDs únicos e acessibilidade

import React, { memo, useId } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';

/**
 * FormField - Componente estável e acessível
 * CORREÇÃO: Sem re-renders + IDs únicos
 */
const FormField = memo(({ 
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
  error = null,
  className = ''
}) => {
  // 🔧 CORREÇÃO: ID único para acessibilidade
  const fieldId = useId();
  const helpId = useId();
  const errorId = useId();
  
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={fieldId}
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {type === 'select' ? (
          <select
            id={fieldId}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={help ? helpId : hasError ? errorId : undefined}
            aria-invalid={hasError}
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
            id={fieldId}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            aria-describedby={help ? helpId : hasError ? errorId : undefined}
            aria-invalid={hasError}
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
            id={fieldId}
            name={name}
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-describedby={help ? helpId : hasError ? errorId : undefined}
            aria-invalid={hasError}
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
        <p id={helpId} className="text-xs text-gray-500 flex items-center gap-1">
          <Info className="w-3 h-3" />
          {help}
        </p>
      )}
      
      {hasError && (
        <motion.p
          id={errorId}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 flex items-center gap-1"
          role="alert"
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
// =========================================
// 📦 EXPORT BARREL - Forms Module
// =========================================
// Centralizador de exports para facilitar imports
// Responsabilidade: Organizar exports do módulo forms

// Componente principal
export { default as ClientForm } from './ClientForm';

// Componentes de campos reutilizáveis
export {
  FloatingInput,
  SelectField,
  TextAreaField,
  MultiSelectField,
  CheckboxField,
  RadioGroupField,
  NumberField
} from './ClientFormFields';

// Componentes dos passos
export {
  Step1DadosPessoais,
  Step2DadosConjuge,
  Step3DadosBancarios,
  Step4DadosContacto,
  Step5PerfilImobiliario,
  Step6Finalizacao
} from './ClientFormSteps';

/* 
🎯 INDEX.JS - EXPORT BARREL CONCLUÍDO!

✅ EXPORTS ORGANIZADOS:
1. ✅ ClientForm - Componente principal
2. ✅ Form Fields - 7 componentes reutilizáveis
3. ✅ Form Steps - 6 passos do formulário

🏗️ BENEFÍCIOS:
- Imports limpos e organizados
- Facilita reutilização de componentes
- Centraliza exports do módulo
- Melhor developer experience

📖 EXEMPLO DE USO:
```javascript
// Import simples do componente principal
import { ClientForm } from '@/features/clients/components/forms';

// Import de campos específicos para reutilização
import { FloatingInput, SelectField } from '@/features/clients/components/forms';

// Import de passos específicos se necessário
import { Step1DadosPessoais } from '@/features/clients/components/forms';
```

📏 MÉTRICAS: 50 linhas | Export barrel completo
*/
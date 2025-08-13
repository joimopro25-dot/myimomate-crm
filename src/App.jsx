// =========================================
// 🚀 APP.JSX CORRIGIDO - SEM ROUTER DUPLICADO
// =========================================
// Componente principal com Firebase Auth

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Removido BrowserRouter
import { AuthProvider, AuthGuard } from '@/shared/hooks/useAuth';

// Pages
import ClientsPage from '@/features/clients/pages/ClientsPage';

// =========================================
// 🎯 COMPONENTE PRINCIPAL
// =========================================

const App = () => {
  return (
    <AuthProvider>
      {/* ✅ REMOVIDO <Router> - Já existe no main.jsx */}
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<ClientsPage />} />
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="*" element={<ClientsPage />} />
          </Routes>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
};

export default App;

// =========================================
// 🔧 EXPLICAÇÃO DA CORREÇÃO
// =========================================

/*
🐛 PROBLEMA ORIGINAL:
- main.jsx tinha <BrowserRouter>
- App.jsx tinha <Router> (que é BrowserRouter renomeado)
- React Router não permite Router aninhados

✅ SOLUÇÃO:
- Mantido BrowserRouter apenas no main.jsx
- Removido Router duplicado do App.jsx
- Mantido apenas Routes e Route

🎯 ESTRUTURA CORRETA:
main.jsx:
  <BrowserRouter>
    <App />
  </BrowserRouter>

App.jsx:
  <AuthProvider>
    <AuthGuard>
      <Routes>
        <Route ... />
      </Routes>
    </AuthGuard>
  </AuthProvider>

🚀 PRÓXIMOS PASSOS:
1. Substitua o conteúdo do App.jsx por este código
2. O erro de Router duplicado será resolvido
3. A aplicação funcionará normalmente
*/
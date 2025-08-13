// =========================================
// 🔥 AUTENTICAÇÃO REAL FIREBASE - useAuth.jsx
// =========================================
// Hook com autenticação Firebase real
// ARQUIVO: src/shared/hooks/useAuth.jsx (RENOMEADO DE .js)

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/shared/services/firebase/config';

// =========================================
// 🔐 FIREBASE AUTH CONTEXT
// =========================================

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================
  // 🎯 AUTH FUNCTIONS
  // =========================================

  /**
   * Login com email e senha
   */
  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🔑 Tentando login com:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      console.log('✅ Login bem-sucedido:', result.user.uid);
      return result;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registro de novo usuário
   */
  const signUp = async (email, password, displayName = '') => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('👤 Criando usuário:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar nome se fornecido
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      console.log('✅ Usuário criado:', result.user.uid);
      return result;
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login com Google
   */
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log('✅ Login Google bem-sucedido:', result.user.uid);
      return result;
    } catch (error) {
      console.error('❌ Erro no login Google:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await signOut(auth);
      console.log('👋 Logout realizado');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      setError(error.message);
    }
  };

  /**
   * Login rápido para desenvolvimento
   */
  const quickDevLogin = async () => {
    const devEmail = 'olijack84@gmail.com';
    const devPassword = '123456';
    
    try {
      // Tentar login primeiro
      return await signIn(devEmail, devPassword);
    } catch (error) {
      // Se falhar, criar conta (não deve ser necessário já que você tem conta real)
      console.log('❌ Erro no login:', error.message);
      throw error;
    }
  };

  // =========================================
  // 🔄 AUTH STATE LISTENER
  // =========================================

  useEffect(() => {
    console.log('🚀 Inicializando Firebase Auth...');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔄 Auth state changed:', user ? user.uid : 'null');
      
      if (user) {
        // Usuário logado
        setUser({
          uid: user.uid,
          id: user.uid, // Compatibilidade
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        });
      } else {
        // Usuário não logado
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // =========================================
  // 🎯 CONTEXT VALUE
  // =========================================

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    userId: user?.uid,
    
    // Auth actions
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    quickDevLogin,
    
    // Utils
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =========================================
// 🎣 HOOK USEAUTH
// =========================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
};

// =========================================
// 🔐 COMPONENTE DE LOGIN
// =========================================

export const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('olijack84@gmail.com');
  const [password, setPassword] = useState('123456');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, quickDevLogin, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isRegistering) {
        await signUp(email, password, 'Novo Utilizador');
      } else {
        await signIn(email, password);
      }
      onSuccess?.();
    } catch (error) {
      console.error('❌ Erro no formulário:', error);
    }
  };

  const handleQuickLogin = async () => {
    try {
      await quickDevLogin();
      onSuccess?.();
    } catch (error) {
      console.error('❌ Erro no login rápido:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (error) {
      console.error('❌ Erro no login Google:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MyImomate CRM
          </h1>
          <p className="text-gray-600">
            {isRegistering ? 'Criar conta' : 'Entrar na sua conta'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 transition-all"
          >
            {loading ? 'Carregando...' : isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>

          <button
            onClick={handleQuickLogin}
            disabled={loading}
            className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 transition-all"
          >
            🚀 Login Rápido (Dev)
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {isRegistering 
              ? 'Já tem conta? Entrar' 
              : 'Não tem conta? Criar agora'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================
// 🛡️ COMPONENTE AUTH GUARD
// =========================================

export const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return children;
};

export default useAuth;
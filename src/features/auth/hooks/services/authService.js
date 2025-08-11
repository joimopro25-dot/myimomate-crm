// features/auth/services/authService.js
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../../../../shared/services/firebase.js';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Login com email e senha
  async signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error.code) 
      };
    }
  },

  // Registro de novo usuário
  async signUp(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar nome do usuário
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error.code) 
      };
    }
  },

  // Login com Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error.code) 
      };
    }
  },

  // Logout
  async signOut() {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Erro ao fazer logout' 
      };
    }
  },

  // Reset de senha
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        message: 'Email de recuperação enviado!' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error.code) 
      };
    }
  }
};

// Função para traduzir códigos de erro do Firebase
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Email inválido.',
    'auth/user-disabled': 'Esta conta foi desabilitada.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/popup-closed-by-user': 'Login cancelado pelo usuário.',
    'auth/cancelled-popup-request': 'Login cancelado.',
  };

  return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente.';
}
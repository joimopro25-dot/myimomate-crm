// features/auth/hooks/useAuth.js
import { useState } from 'react';
import { authService } from '../services/authService.js';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.signIn(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const signUp = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.signUp(email, password, displayName);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    const result = await authService.signInWithGoogle();
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    const result = await authService.signOut();
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.resetPassword(email);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const clearError = () => setError(null);

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    clearError,
    loading,
    error
  };
}
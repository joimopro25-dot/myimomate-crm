import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser({
        id: 'mock-user-id',
        email: 'dev@myimomate.com',
        name: 'Utilizador Desenvolvimento',
        role: 'admin'
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    userId: user?.id
  };
};

export default useAuth;
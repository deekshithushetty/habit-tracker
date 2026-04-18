import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api';
import { clearAccessToken } from '@/api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      setIsLoading(true);
      let nextUser = null;
      let nextIsAuthenticated = false;

      try {
        await authApi.refresh();
        if (!isMounted) return;

        const meResponse = await authApi.getMe();
        if (!isMounted) return;

        nextUser = meResponse.user;
        nextIsAuthenticated = true;
      } catch {
        clearAccessToken();
      } finally {
        if (isMounted) {
          setUser(nextUser);
          setIsAuthenticated(nextIsAuthenticated);
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login({ email, password });
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await authApi.register({ name, email, password });
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      clearAccessToken();
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const value = {
    user,
    isLoading,
    hasInitialized,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

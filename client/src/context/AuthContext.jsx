import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api';
import { setAccessToken, clearAccessToken } from '@/api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Try to restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh the token using httpOnly cookie
        const refreshResponse = await authApi.refresh();
        setAccessToken(refreshResponse.accessToken);

        // Get user data
        const meResponse = await authApi.getMe();
        setUser(meResponse.user);
        setIsAuthenticated(true);
      } catch (error) {
        // No valid session — that's fine
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
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
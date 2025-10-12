import { useState, useEffect, useCallback } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services/authService';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(() => {
    const authStatus = isAuthenticated();
    
    if (authStatus) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      // Force a re-check of authentication status
      setTimeout(() => {
        checkAuth();
      }, 100);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      // Force a re-check of authentication status
      setTimeout(() => {
        checkAuth();
      }, 100);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
    // Force a re-check of authentication status
    setTimeout(() => {
      checkAuth();
    }, 100);
  }, [checkAuth]);

  const result = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };
  
  return result;
}

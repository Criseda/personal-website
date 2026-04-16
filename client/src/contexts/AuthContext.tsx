import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/services/api';

const TOKEN_KEY = 'lofi_auth_token';

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (googleToken: string) => Promise<void>;
  logout: () => void;
  restoreToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore token from localStorage/cookies on mount
  useEffect(() => {
    const restoreToken = async () => {
      try {
        setIsLoading(true);
        const storedToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);

        if (storedToken) {
          // Verify token is still valid
          await api.verifyToken();
          setToken(storedToken);
          setError(null);
        }
      } catch (err) {
        setToken(null);
        setError(null); // Don't show error on initial load if token is expired
      } finally {
        setIsLoading(false);
      }
    };

    restoreToken();
  }, []);

  const login = async (googleToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.login(googleToken);
      const jwtToken = response.jwt || response.token || response.access_token;
      if (jwtToken) {
        setToken(jwtToken);
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setToken(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setToken(null);
    setError(null);
  };

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    logout,
    restoreToken: async () => {
      try {
        const storedToken = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          await api.verifyToken();
          setToken(storedToken);
        }
      } catch (err) {
        setToken(null);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

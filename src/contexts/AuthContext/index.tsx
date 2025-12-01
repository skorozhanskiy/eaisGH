'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Используем setTimeout для асинхронной установки состояния
    const initializeAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    // Откладываем инициализацию до следующего тика event loop
    const timer = setTimeout(initializeAuth, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      if (username === 'admin' && password === 'password') {
        const token = 'fake-jwt-token-' + Date.now();
        localStorage.setItem('auth_token', token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

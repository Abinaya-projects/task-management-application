import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DBStatus } from '../types/index.js';
import { authAPI, getAuthToken, setAuthToken, taskAPI } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  dbStatus: DBStatus | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
  refreshDBStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<DBStatus | null>(null);

  const refreshDBStatus = async () => {
    try {
      const status = await taskAPI.getDBStatus();
      setDbStatus(status);
    } catch {
      // ignore
    }
  };

  const refreshUser = async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authAPI.getMe();
      setUser(res.user);
      if (res.dbStatus) {
        setDbStatus(res.dbStatus);
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err);
      setAuthToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    refreshDBStatus();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login(credentials);
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshDBStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authAPI.register(data);
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshDBStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    } finally {
      setAuthToken(null);
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    const res = await authAPI.updateProfile(data);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        dbStatus,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        refreshDBStatus,
      }}
    >
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

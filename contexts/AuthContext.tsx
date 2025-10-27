import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import * as authService from '../services/authService';
import type { User } from '../services/authService';
import { useAdmin } from './AdminContext';
import { useToast } from './ToastContext';

const AUTH_SYSTEM_ENABLED = true;

interface AuthContextType {
  currentUser: User | null;
  loading: boolean; // Indicates initial auth check is in progress
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string) => Promise<void>;
  loginWithProvider: (provider: 'google' | 'facebook' | 'zalo') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start loading on mount
  const { isAdminVip } = useAdmin();
  const { addToast } = useToast();

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (!AUTH_SYSTEM_ENABLED) {
        // For development, auto-login as admin to bypass auth screen
        const devUser: User = { email: 'dev@example.com', isVip: true, isAdmin: true };
        setCurrentUser(devUser);
        setLoading(false);
        return;
      }
      
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Auth check failed", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const finalUser = useMemo(() => {
    if (!currentUser) return null;
    return {
      ...currentUser,
      // Admin VIP switch overrides user's actual VIP status
      isVip: currentUser.isVip || isAdminVip,
    };
  }, [currentUser, isAdminVip]);

  const handleAuth = async (authPromise: Promise<User>) => {
    try {
      const user = await authPromise;
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
      throw error;
    }
  };

  const login = useCallback(async (email: string, password?: string) => {
    if (!AUTH_SYSTEM_ENABLED) return Promise.resolve();
    await handleAuth(authService.login(email, password));
  }, []);

  const signup = useCallback(async (email: string, password?: string) => {
    if (!AUTH_SYSTEM_ENABLED) return Promise.resolve();
    await handleAuth(authService.signup(email, password));
  }, []);

  const loginWithProvider = useCallback(async (provider: 'google' | 'facebook' | 'zalo') => {
    if (!AUTH_SYSTEM_ENABLED) return Promise.resolve();
    await handleAuth(authService.loginWithProvider(provider));
  }, []);

  const logout = useCallback(async () => {
    if (!AUTH_SYSTEM_ENABLED) {
        addToast({ type: 'warning', title: 'Chế độ phát triển', message: 'Đăng xuất đã bị vô hiệu hóa.' });
        return;
    }
    
    try {
        await authService.logout();
        setCurrentUser(null);
    } catch (error: any) {
        console.error("Logout failed:", error);
        addToast({ type: 'error', title: 'Lỗi Đăng xuất', message: error.message || 'Không thể đăng xuất.' });
    }
  }, [addToast]);

  const value = { currentUser: finalUser, loading, login, signup, logout, loginWithProvider };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

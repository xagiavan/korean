import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';
import type { User } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: typeof authService.login;
  signup: typeof authService.signup;
  logout: typeof authService.logout;
  loginWithProvider: typeof authService.loginWithProvider;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login: authService.login,
    signup: authService.signup,
    logout: authService.logout,
    loginWithProvider: authService.loginWithProvider,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

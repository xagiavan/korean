import { apiClient } from './apiClient';

export interface User {
  email: string;
  isVip: boolean;
  isAdmin?: boolean;
}

export const login = async (email: string, password?: string): Promise<User> => {
  const user = await apiClient.post<{ email: string, password?: string }, User>('/api/auth/login', { email, password });
  apiClient.setToken(user.email); // Using email as a mock token
  return user;
};

export const signup = async (email: string, password?: string): Promise<User> => {
  const user = await apiClient.post<{ email: string, password?: string }, User>('/api/auth/signup', { email, password });
  apiClient.setToken(user.email); // Using email as a mock token
  return user;
};

export const loginWithProvider = async (provider: 'google' | 'facebook' | 'zalo'): Promise<User> => {
    // In a real app, this would involve a popup and OAuth flow.
    // Here, we'll just log in a mock VIP user for demonstration.
    const user = await apiClient.post<{ email: string, password?: string }, User>('/api/auth/login', { email: 'vip@example.com', password: 'password' });
    apiClient.setToken(user.email);
    return user;
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout', {});
  apiClient.setToken(null);
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (!apiClient.getToken()) {
      return null;
  }
  try {
    const user = await apiClient.get<User>('/api/auth/me');
    return user;
  } catch (error) {
    // Token is invalid, clear it
    apiClient.setToken(null);
    return null;
  }
};

// Admin functions (mocked) - In a real app, these would be protected admin endpoints.
export const getAllUsers = async (): Promise<User[]> => {
    // This functionality isn't fully implemented in the mock API router but we can simulate it.
    return Promise.resolve([
        { email: 'user@example.com', isVip: false, isAdmin: false },
        { email: 'vip@example.com', isVip: true, isAdmin: false },
        { email: 'admin@example.com', isVip: true, isAdmin: true },
    ]);
};

export const updateUser = async (email: string, updates: Partial<User>): Promise<User | null> => {
    console.log(`[Admin] MOCK: Updating ${email} with`, updates);
    // In a real app, this would be a PATCH/PUT to /api/users/:email
    return Promise.resolve({ email, isVip: false, ...updates } as User);
};
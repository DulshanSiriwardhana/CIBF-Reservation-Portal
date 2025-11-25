import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  businessName?: string;
  contactNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiService.login(username, password);
      
      // Handle different response formats
      const authData = response.token ? response : (response.data || response);
      const authToken = authData.token || authData.jwt;
      
      if (!authToken) {
        throw new Error('No token received from server');
      }

      // Store token
      localStorage.setItem('authToken', authToken);
      setToken(authToken);

      // Fetch user profile
      try {
        const profile = await apiService.getProfile();
        const userData = profile.data || profile;
        const userObj: User = {
          userId: userData.userId || authData.userId,
          username: userData.username || authData.username || username,
          email: userData.email || authData.email,
          role: userData.role || authData.role,
          businessName: userData.businessName,
          contactNumber: userData.contactNumber,
        };
        
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
      } catch (profileError) {
        // If profile fetch fails, use data from login response
        const userObj: User = {
          userId: authData.userId || '',
          username: authData.username || username,
          email: authData.email || '',
          role: authData.role || 'EMPLOYEE',
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
      }

      // Navigation will be handled by the component calling login
      return;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // Navigation will be handled by the component calling logout
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


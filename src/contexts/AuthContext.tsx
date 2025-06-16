'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'EMPLOYER' | 'ADMIN';
  isVerified: boolean;
  isApproved?: boolean;
  profile?: any;
}

interface AuthContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Only access localStorage on the client side
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try different endpoints based on stored user data or current path
      const endpoints = ['/api/employer/profile', '/api/user/profile'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            return;
          }
        } catch (error) {
          console.error(`Error checking ${endpoint}:`, error);
        }
      }

      // If all endpoints fail, remove token
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        isLoading, 
        setIsLoading, 
        checkAuthStatus, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

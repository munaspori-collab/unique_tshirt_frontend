'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (idToken: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUser(authToken: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(idToken: string) {
    try {
      console.log('Attempting login with API:', API_BASE_URL);
      console.log('Sending ID token (first 20 chars):', idToken.substring(0, 20) + '...');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Auth error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Authentication failed' };
        }
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      console.log('Auth successful, received data');
      const { token: jwtToken, user: userData } = data;

      // Save to localStorage
      localStorage.setItem('auth_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

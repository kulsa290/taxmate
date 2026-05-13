import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../utils/apiHelper';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getApiBaseUrl = useCallback(() => {
    const baseUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_BASE_URL || '';
    if (!baseUrl || baseUrl === '/') return '';
    return baseUrl.replace(/\/+$|^\s+|\s+$/g, '').replace(/\/+$/g, '');
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const token = auth.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const apiBaseUrl = getApiBaseUrl();
      const requestUrl = apiBaseUrl ? `${apiBaseUrl}/api/auth/me` : '/api/auth/me';
      const response = await fetch(requestUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('👤 User data fetched:', data);

        if (data.success && data.data && data.data.user) {
          setUser(data.data.user);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          console.log('✅ User loaded:', data.data.user.email);
        } else {
          throw new Error('Invalid user data response');
        }
      } else {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
    } catch (err) {
      console.error('❌ Failed to fetch user:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getApiBaseUrl]);

  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await auth.login(email, password);
      console.log('🔑 Login API response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response: missing token or user');
      }

      auth.setToken(token);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ Login successful for:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const register = async (name, email, password, role = 'client') => {
    try {
      console.log('🔐 Registering user:', { name, email, password: '***', role });
      const response = await auth.register(name, email, password, role);
      console.log('📨 Register API response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response: missing token or user');
      }

      auth.setToken(token);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ Registration successful for:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const requestUrl = apiBaseUrl ? `${apiBaseUrl}/api/auth/logout` : '/api/auth/logout';
      await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.log('Logout API call failed, but proceeding with local logout');
    }

    auth.logout();
    setUser(null);
    console.log('👋 User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
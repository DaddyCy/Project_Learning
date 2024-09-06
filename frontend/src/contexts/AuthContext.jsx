import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, refreshToken as refreshTokenApi, logoutUser } from '../services/AxiosApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { accessToken, refreshToken, ruolo } = response.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', ruolo);
      setUser({ role: ruolo });
      return ruolo;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      try {
        const response = await refreshTokenApi(storedRefreshToken);
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return true;
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout();
        return false;
      }
    }
    return false;
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      if (token && userRole) {
        setUser({ role: userRole });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const value = {
    user,
    login,
    logout,
    refreshToken,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { clearSession, readToken, readUser, saveSession } from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setToken(readToken());
    setUser(readUser());
    setStatus('ready');
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    saveSession(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(
    async (name, email, password, pokemon) => {
      const payload = { name, email, password };
      if (pokemon) payload.pokemon = pokemon;
      await api.post('/auth/register', payload);
      return login(email, password);
    },
    [login]
  );

  const patchUser = useCallback((partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...partial };
      saveSession(readToken(), merged);
      return merged;
    });
  }, []);

  const canManage = useCallback(
    (resource) => {
      if (!user || !resource) return false;
      const ownerId = resource.author?._id || resource.author || resource.user?._id || resource.user;
      if (!ownerId) return false;
      return String(ownerId) === String(user._id) || user.is_admin === true;
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.is_admin === true,
      login,
      register,
      logout,
      patchUser,
      canManage,
      errorMessage: (error) => (error instanceof ApiError ? error.message : 'Ocurrió un error inesperado')
    }),
    [user, token, status, login, register, logout, patchUser, canManage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}

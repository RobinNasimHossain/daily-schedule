import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './authContextValue';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => !!api.getToken());

  useEffect(() => {
    const token = api.getToken();
    if (!token) return;

    let cancelled = false;
    api
      .getMe()
      .then((userData) => {
        if (cancelled) return;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        api.removeToken();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await api.login(credentials);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await api.register(userData);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

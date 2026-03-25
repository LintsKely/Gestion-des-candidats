import { useState } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const newToken = await apiLogin(username, password);
      setToken(newToken);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setToken(null);
  };

  const isAuthenticated = !!token;

  return { token, isAuthenticated, loading, login, logout };
};
import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('zaiqa_user');
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (u) => {
    setUser(u);
    localStorage.setItem('zaiqa_user', JSON.stringify(u));
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    persist(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    persist(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zaiqa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

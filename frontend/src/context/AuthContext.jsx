import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get('/auth/profile')
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  async function authenticate(mode, fields) {
    const { data } = await api.post(`/auth/${mode}`, fields);
    setUser(data);
  }
  async function logout() {
    await api.post('/auth/logout', {});
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);

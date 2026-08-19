import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!api.getToken()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.auth.me();
      setUser(data as User);
    } catch {
      api.clearToken();
      setUser(null);
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    try {
      const data = await api.auth.me();
      setUser(data as User);
    } catch {
      // ignore
    }
  };

  const loginWithToken = async (token: string) => {
    api.setToken(token);
    const data = await api.auth.me();
    setUser(data as User);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signOut = () => {
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, loginWithToken, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

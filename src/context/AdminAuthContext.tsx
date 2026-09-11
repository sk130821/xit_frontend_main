import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, ADMIN_AUTH_UNAUTHORIZED_EVENT } from '@/lib/api';
import type { Admin } from '@/types';

interface AdminAuthContextType {
  admin: Admin | null;
  loading: boolean;
  refreshAdmin: () => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = async () => {
    if (!api.getAdminToken()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.adminAuth.me();
      setAdmin(data as Admin);
    } catch {
      api.clearAdminToken();
      setAdmin(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      setAdmin(null);
    };
    window.addEventListener(ADMIN_AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(ADMIN_AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const refreshAdmin = async () => {
    try {
      const data = await api.adminAuth.me();
      setAdmin(data as Admin);
    } catch {
      // ignore
    }
  };

  const loginWithToken = async (token: string) => {
    api.setAdminToken(token);
    const data = await api.adminAuth.me();
    setAdmin(data as Admin);
  };

  const signOut = () => {
    api.clearAdminToken();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, refreshAdmin, loginWithToken, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

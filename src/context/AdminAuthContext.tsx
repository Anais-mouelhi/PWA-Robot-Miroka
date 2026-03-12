import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'miroka_admin_auth';
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'enchanted2024';

interface AdminAuthContextValue {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, String(isAdmin));
  }, [isAdmin]);

  const login = (password: string) => {
    if (password === PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
  return ctx;
}

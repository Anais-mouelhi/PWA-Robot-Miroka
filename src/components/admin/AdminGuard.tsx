import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import type { ReactNode } from 'react';

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdminAuth();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

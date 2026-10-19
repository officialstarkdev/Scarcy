import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Protected({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

export function AdminOnly({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return children;
}

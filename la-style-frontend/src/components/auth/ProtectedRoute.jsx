// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const roles = useAuthStore((state) => state.roles) || [];
  const isAuthenticated = !!accessToken;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PageSpinner } from '@/components/ui';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, hasInitialized } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return children;
  }

  if (!hasInitialized || isLoading) {
    return <PageSpinner />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

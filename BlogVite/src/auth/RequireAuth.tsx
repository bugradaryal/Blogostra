import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './useAuth';

interface RequireAuthProps {
  role?: string;
}

const RequireAuth = ({ role }: RequireAuthProps) => {
  const { user, role: userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />;
  }
  if (!user) {
    return <Navigate to="/Login" replace state={{ from: location.pathname }} />;
  }
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default RequireAuth;

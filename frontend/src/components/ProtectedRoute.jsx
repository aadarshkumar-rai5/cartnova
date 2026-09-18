import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  return loading ? (
    <Loader />
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
}

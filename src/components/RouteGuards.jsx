import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
function Wait() { return <main className="section"><div className="container">Проверка на сесията…</div></main>; }
export function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Wait />;
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Wait />;
  return user ? <Navigate to="/my-repairs" replace /> : <Outlet />;
}

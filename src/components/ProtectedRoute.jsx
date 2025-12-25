import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

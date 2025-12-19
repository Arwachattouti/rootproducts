// frontend/src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// SUPPRIMER: import { useAuth } from '../context/AuthContext';
// PAR:
import { useSelector } from 'react-redux';
import { selectUser } from '../state/slices/userSlice'; 
// ...

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  // Remplacer l'ancien hook par la sélection d'état Redux
  const { isAuthenticated, user } = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
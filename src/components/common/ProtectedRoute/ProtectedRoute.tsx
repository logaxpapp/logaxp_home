// src/components/ProtectedRoute.tsx

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../../app/store';

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    // If no user is found, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If user exists, allow access to the protected route
  return <Outlet />;
};

export default ProtectedRoute;

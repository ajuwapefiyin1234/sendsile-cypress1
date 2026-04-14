import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('__user_access');
      setIsAuthenticated(!!token && token !== 'undefined' && token !== '');
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

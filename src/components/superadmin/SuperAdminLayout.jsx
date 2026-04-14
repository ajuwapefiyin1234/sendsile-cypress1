// src/components/SuperAdminLayout.js

import { useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { SUPER_ADMIN_PROTECTED_ROUTES } from '@/routes/superAdminRoutes';
import ScrollToTop from '../ScrollToTop';
import SuperAdminProtected from './SuperAdminProtected';

const SuperAdminLayout = () => {
  const location = useLocation();
  // console.log("state: ", stateSlice);
  useEffect(() => {
    if (
      location.pathname.includes('/login') ||
      location.pathname.includes('/register') ||
      location.pathname.includes('/forgot-password') ||
      location.pathname === '/'
    ) {
      localStorage.removeItem('lastVisitedRoute');
    }
  }, [location.pathname]);

  const isPathProtected = (path, protectedRoutes) => {
    return protectedRoutes.some((route) => {
      const regexPattern = route.replace(/:[^/]+/g, '([^/]+)');
      const regex = new RegExp(`^${regexPattern}(\\/)?$`);
      return regex.test(path);
    });
  };

  const isProtected = isPathProtected(
    location.pathname,
    SUPER_ADMIN_PROTECTED_ROUTES
  );

  return (
    <>
      <ScrollToTop />
      <Toaster />
      {isProtected ? (
        <SuperAdminProtected>
          <Outlet />
        </SuperAdminProtected>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default SuperAdminLayout;

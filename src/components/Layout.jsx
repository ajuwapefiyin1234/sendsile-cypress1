import { useLocation, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { protectedRoutes } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './ScrollToTop';

const Layout = () => {
  const location = useLocation();

  const isPathProtected = (path, protectedRoutes) => {
    return protectedRoutes.some((route) => {
      const regexPattern = route.replace(/:[^/]+/g, '([^/]+)');
      const regex = new RegExp(`^${regexPattern}(\\/)?$`);
      return regex.test(path);
    });
  };

  const isProtected = isPathProtected(location.pathname, protectedRoutes);

  return (
    <>
      <ScrollToTop />
      <Toaster />
      {isProtected ? (
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Layout;

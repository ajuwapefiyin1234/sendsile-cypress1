import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import PropTypes from 'prop-types';
import SuperAdminSidebar from './SuperAdminSidebar';
import TopNav from '../TopNav';
import { getWithExpiry } from '@/lib/action';
import { useLocation } from 'react-router-dom';

const SuperAdminProtected = ({ children, noNav = false }) => {
  const location = useLocation();
  const user = getWithExpiry('vendor-storage');
  // Get tokens from storage
  const jwtToken = user?.token;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.some((route) =>
      location.pathname.startsWith(route)
    );
    if (location.pathname === '/') {
      localStorage.removeItem('lastVisitedRoute');
    } else if (isPublicRoute) {
      localStorage.removeItem('lastVisitedRoute');
    } else {
      localStorage.setItem('lastVisitedRoute', location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!jwtToken) {
      toast.error('Session expired');
      localStorage.setItem('lastVisitedRoute', window.location.pathname);
      window.location.href = SUPER_ADMIN_ROUTES.login;
    }
  }, [jwtToken]);

  if (jwtToken) {
    return (
      <div className="min-h-screen ">
        <div className="flex relative min-h-screen ">
          <SuperAdminSidebar noNav={noNav} setOpen={setOpen} open={open} />
          <div
            id="transition-container"
            className="main-container !bg-[#F4F5FA] "
          >
            {!noNav && <TopNav setOpen={setOpen} open={open} />}
            <div className="main">{children}</div>
          </div>
        </div>
      </div>
    );
  } else return <></>;
};

SuperAdminProtected.propTypes = {
  children: PropTypes.node.isRequired,
  noNav: PropTypes.bool,
};

export default SuperAdminProtected;

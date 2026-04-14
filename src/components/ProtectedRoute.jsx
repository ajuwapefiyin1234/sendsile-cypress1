import { ROUTE } from "@/routes";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";
import TopNav from "./TopNav";
import { getWithExpiry } from "@/lib/action";
import { toast } from "sonner";
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, noNav = false }) => {
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
      window.location.href = ROUTE.login;
    }
  }, [jwtToken]);

  if (jwtToken) {
    return (
      <div className="min-h-screen ">
        <div className="flex relative min-h-screen ">
          <Sidebar noNav={noNav} setOpen={setOpen} open={open} />
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

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  noNav: PropTypes.bool,
};

export default ProtectedRoute;

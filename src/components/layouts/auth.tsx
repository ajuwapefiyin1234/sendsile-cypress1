import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';

import { AuthNavbar } from '../global/auth-navbar';
import { Footer } from '../sections/Footer';
// import TokenActive from "../auth/token-active";

export const Auth = () => {
  const { pathname } = useLocation();

  return (
    // <TokenActive>
    <div>
      <ScrollRestoration />
      <AuthNavbar />
      <Outlet />
      {pathname === '/pay-bills' && <Footer />}
    </div>
    // </TokenActive>
  );
};

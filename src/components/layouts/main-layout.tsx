import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Footer } from '../sections/Footer';
import { HomeNavbar } from '../global/main-navbar';
import { Cart } from '../ui/cart/cart';

export const MainPageLayout = () => {
  return (
    <>
      <ScrollRestoration />
      <HomeNavbar />
      <Outlet />
      <Cart />
      <Footer />
    </>
  );
};

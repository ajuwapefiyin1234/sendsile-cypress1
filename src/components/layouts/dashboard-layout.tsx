import { Outlet, ScrollRestoration } from 'react-router-dom';
import { SideBar } from '../global/side-bar';
import { Cart } from '../ui/cart/cart';

export const DashboardLayout = () => {
  return (
    <section className="flex">
      <ScrollRestoration />
      <SideBar />
      <Outlet />
      <Cart />
    </section>
  );
};

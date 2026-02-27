import { Outlet, ScrollRestoration } from 'react-router-dom';
import { CheckoutNavBar } from '../global/checkout-nav';

export const CheckoutLayout = () => {
  return (
    <div>
      <ScrollRestoration />
      <CheckoutNavBar />
      <Outlet />
    </div>
  );
};

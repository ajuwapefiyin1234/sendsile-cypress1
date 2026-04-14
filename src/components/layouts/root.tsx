import { Outlet, ScrollRestoration } from 'react-router-dom';
import { NavBar } from '../global/nav-bar';
import { Footer } from '../sections/Footer';

export const Root = () => {
  return (
    <main className="">
      <ScrollRestoration />
      <NavBar />
      <Outlet />
      <Footer />
    </main>
  );
};

import { NavLogo } from '../svgs/NavLogo';
import { Container } from './Container';
import { MobileNav } from './mobile-nav';

import { Link, NavLink, useLocation } from 'react-router-dom';

import { useLocationState } from '../../services/store/selectLocationStore';
import { navRoutes, ROUTES } from '../../utils/route-constants';
import { extractCategoryID, isLoggedIn, showCountryFlag } from '../../utils/helpers';
import { useEffect, useState } from 'react';
import { useSetCategoryIdStore } from '../../services/store/categoryIdStore';
import { ToastMessage } from '../ui/cart/toast-message';
import { useCartState } from '../../services/store/cartStore';
// import TimedBanner from "./timed-banner"

export const NavBar = () => {
  const { setId, categoryID } = useSetCategoryIdStore();
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const [, setID] = useState('');
  const locationpath = useLocation();

  useEffect(() => {
    async function loadCategoryID() {
      setID(`/groceries?category=${encodeURIComponent(categoryID)}`);
      const res = await extractCategoryID();
      setId(res?.id);
    }
    loadCategoryID();
  }, [categoryID, setId]);

  const location = useLocationState((state) => state.location);
  const setLocationModal = useLocationState((state) => state.updateModalOpen);

  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        <ToastMessage
          classname={`z-[99] transition-all duration-300 ${
            isToastOpen ? 'top-0' : '-translate-y-1/2'
          }`}
          message="Item added to your bag! Click the bag to checkout."
        />
        {/* <TimedBanner /> */}
        <header className="hidden w-full lg:block bg-navRadialGradient backdrop-blur-lg">
          <Container>
            <nav className="flex items-center z-[99] justify-between px-5 xl:px-[100px] py-[18.5px]">
              <Link to={'/'} className="w-[117px] h-[29px]">
                <NavLogo />
              </Link>
              {locationpath.pathname !== '/home' && (
                <div className="flex gap-8 items-center font-medium text-[#36454F]">
                  {navRoutes.map((route, index) => {
                    const { path, text, icon } = route;
                    if (text !== 'Contact')
                      return (
                        <NavLink
                          key={index + text}
                          to={
                            text === 'Groceries'
                              ? `/groceries?category=${encodeURIComponent(categoryID)}`
                              : path
                          }
                          onClick={(e) => {
                            if (text === 'Donation' && !isLoggedIn()) {
                              e.preventDefault();
                              sessionStorage.setItem(
                                'redirectAfterLogin',
                                ROUTES.dashboardDonations
                              );
                              window.location.href = '/login';
                            }
                          }}
                          className="text-base leading-[22px] z-10 flex gap-2 items-center"
                        >
                          {text}
                          <img src={icon} alt="nav-button icon" />
                        </NavLink>
                      );
                  })}
                </div>
              )}
              {locationpath.pathname !== '/home' && (
                <div className="flex items-center gap-5">
                  {isLoggedIn() ? (
                    <Link
                      to={ROUTES.dashboard}
                      className="z-10 font-medium bg-white rounded-[32px] border border-[#5F5F5F] shadow-[0px_4px_10px_0px] shadow-[#36454F1A] py-[10px] px-[44px]"
                    >
                      <p className="text-[15px] font-bold leading-[21px] text-[#00070C]">
                        My account
                      </p>
                    </Link>
                  ) : (
                    <Link
                      to={'/login'}
                      className="z-10 font-medium bg-white rounded-[32px] border border-[#5F5F5F] shadow-[0px_4px_10px_0px] shadow-[#36454F1A] py-[10px] px-[44px]"
                    >
                      <p className="text-[15px] font-bold leading-[21px] text-[#00070C]">Login</p>
                    </Link>
                  )}
                  <img
                    onClick={() => setLocationModal(true)}
                    src={showCountryFlag(location)}
                    alt="country flag"
                    className="w-[41px] h-[41px] cursor-pointer border-2 shadow-[0px_2px_2px_0px] shadow-[#26323826] rounded-full"
                  />
                </div>
              )}
            </nav>
          </Container>
        </header>
      </div>
      <MobileNav />
      {locationpath.pathname !== '/' && locationpath.pathname !== '/home' && (
        <div className="h-[134px]"></div>
      )}
    </>
  );
};

export default NavBar;

import { Link, useLocation } from 'react-router-dom';
import { Container } from './Container';
import { NavLogo } from '../svgs/NavLogo';
import { MobileNav } from './mobile-nav';

import { ROUTES } from '../../utils/route-constants';
import { useEffect, useState } from 'react';
import { useSetCategoryIdStore } from '../../services/store/categoryIdStore';
import { extractCategoryID } from '../../utils/helpers';

export const AuthNavbar = () => {
  const { pathname } = useLocation();
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  const { setId, categoryID } = useSetCategoryIdStore();
  const [, setID] = useState('');

  useEffect(() => {
    async function loadCategoryID() {
      setID(`/groceries?category=${encodeURIComponent(categoryID)}`);
      const res = await extractCategoryID();
      setId(res?.id);
    }
    loadCategoryID();
  }, [categoryID, setId]);

  return (
    <>
      <header
        className={`hidden lg:block fixed top-0 w-full z-50 backdrop-blur-md bg-transparent  ${
          pathname === ROUTES.payBills ? 'backdrop-blur-xl' : ''
        } `}
      >
        <Container>
          <nav
            className={`flex items-center z-[99] justify-between px-4 md:px-[100px] py-8 md:py-3 ${
              pathname === ROUTES.forgotPassword && 'hidden md:flex'
            }`}
          >
            <Link to={'/'} className="w-[100px] md:w-[117px] h-6 md:h-[29px]">
              <NavLogo />
            </Link>

            {isLoggedIn === 'true' ? (
              <Link
                to={ROUTES.dashboard}
                className="text-[15px] font-bold leading-[21px] text-[#00070C] bg-white rounded-[32px] border border-[#D4D4D4] md:border-[#5F5F5F] md:shadow-[0px_4px_10px_0px] md:shadow-[#36454F1A] py-[10px] px-[44px]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                {pathname === ROUTES.signUp ? (
                  <Link
                    to={ROUTES.login}
                    className="text-[15px] font-bold leading-[21px] text-[#00070C] bg-white rounded-[32px] border border-[#D4D4D4] md:border-[#5F5F5F] md:shadow-[0px_4px_10px_0px] md:shadow-[#36454F1A] py-[10px] px-[44px]"
                  >
                    Login
                  </Link>
                ) : (
                  <Link
                    to={ROUTES.signUp}
                    className="text-[15px] font-bold leading-[21px] text-[#00070C] bg-white rounded-[32px] border border-[#D4D4D4] md:border-[#5F5F5F] md:shadow-[0px_4px_10px_0px] md:shadow-[#36454F1A] py-[10px] px-6"
                  >
                    Get started
                  </Link>
                )}
              </>
            )}
          </nav>
        </Container>
      </header>
      {pathname !== ROUTES.forgotPassword && pathname !== ROUTES.emailVerification && <MobileNav />}
    </>
  );
};

import { Link, useNavigate } from 'react-router-dom';
import { Container } from './Container';
import { NavLogo } from '../svgs/NavLogo';
import { Close } from '../svgs/farm-product/close';
import { ButtonBack } from '../ui/buttons/button-back';

export const CheckoutNavBar = () => {
  const navigate = useNavigate();
  return (
    <>
      <header
        className={`hidden lg:block top-0 fixed w-full z-50 bg-white border-b border-b[#E3E6ED]`}
      >
        <Container>
          <nav className="flex items-center z-[99] justify-between px-4 lg:px-[100px] py-4">
            <Link to={'/'} className="w-[117px] h-[21px]">
              <NavLogo />
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="bg-[#F6F1E8] p-[11px] rounded-full w-fit"
            >
              <div className="w-[18px] h-[18px] cursor-pointer">
                <Close />
              </div>
            </button>
          </nav>
        </Container>
      </header>
      <div className="lg:hidden fixed w-full top-0 z-50 bg-white py-8 flex items-center px-4">
        <ButtonBack />
      </div>
    </>
  );
};

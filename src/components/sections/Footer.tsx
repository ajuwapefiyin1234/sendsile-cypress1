import { Container } from '../global/Container';
import Blur from '../../assets/images/blur2.png';
import { FooterLogo } from '../svgs/Footer';
import { Insta } from '../svgs/Insta';
import { X } from '../svgs/X';
import FooterImgText from '../../assets/images/footerImgText.png';
import FooterBlur2 from '../../assets/images/footerblur.png';
import FooterBlur22 from '../../assets/images/footerblur22.png';
import { footerLinks } from '../../utils/constants';
import { Link } from 'react-router-dom';
// import { ROUTES } from "../../utils/route-constants";
import { useSetCategoryIdStore } from '../../services/store/categoryIdStore';
import { isLoggedIn } from '../../utils/helpers';

export const Footer = () => {
  // const navigate = useNavigate();
  const { categoryID } = useSetCategoryIdStore();

  return (
    <section className="bg-[#191C1F] relative px-4 md:px-0">
      <Container>
        <footer className="md:pl-[102px] md:pr-[100px] pt-8 md:pt-[80px] flex flex-col xl:flex-row justify-between">
          <div className="w-full xl:w-[322px]">
            <h1 className="text-white text-[32px] md:text-[64px] leading-[32px] md:leading-[70px] font-besley font-normal italic w-full md:w-[406px]">
              Ready when you are
            </h1>
            <p className="pt-6 text-[#E5E9EE] text-base leading-[22px] font-normal">
              Take care of your family, anywhere you are in the world. Experience the peace that
              comes with ensuring your loved ones are well catered for during this Ramadan with
              Sendsile.
            </p>
            {/* <button
              onClick={() => navigate(ROUTES.signUp)}
              className="mt-6 text-[15px] leading-[21px] bg-[#202426] text-white font-bold py-3 px-[38.5px] rounded-[32px] border-[0.75px] border-[#74767E]"
            >
              Try Sendsile today
            </button> */}
          </div>
          <div className="mt-14 xl:mt-0 w-full xl:w-[596px] flex flex-wrap lg:flex-nowrap md:justify-between gap-x-[130px] gap-y-10 md:gap-y-0 md:gap-x-0 ">
            <div className="flex flex-col gap-[22px]">
              <h1 className="text-white text-[18px] leading-[25.2px] font-bold">Company</h1>
              {footerLinks[0].map((link, index) => {
                const { name, path } = link;
                return (
                  <Link
                    key={index}
                    to={
                      name === 'Groceries'
                        ? `/groceries?category=${encodeURIComponent(categoryID)}`
                        : path
                    }
                    target={name === 'Partners program' ? '_blank' : ''}
                    className="text-[16px] leading-[22.4px] text-[#E5E9EE] font-normal"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col gap-[22px]">
              <h1 className="text-white text-[18px] leading-[25.2px] font-bold">Explore</h1>
              {footerLinks[1].map((link, index) => {
                const { name, path } = link;
                return (
                  <Link
                    key={index}
                    to={
                      name === 'Groceries'
                        ? `/groceries?category=${encodeURIComponent(categoryID)}`
                        : path
                    }
                    onClick={(e) => {
                      if (name === 'Donations' && !isLoggedIn()) {
                        e.preventDefault();
                        sessionStorage.setItem('redirectAfterLogin', path);
                        window.location.href = '/login';
                      }
                    }}
                    className="text-[16px] leading-[22.4px] text-[#E5E9EE] font-normal"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col gap-[22px]">
              <h1 className="text-white text-[18px] leading-[25.2px] font-bold">Contact us</h1>
              {/* <Link
                to="tel:+2348012345678"
                className="text-[16px] leading-[22.4px] text-[#E5E9EE] font-normal"
              >
                +234 801 234 5678
              </Link> */}
              <Link
                to="mailto:team@sendsile.com"
                className="text-[16px] leading-[22.4px] text-[#E5E9EE] font-normal"
              >
                team@sendsile.com
              </Link>
            </div>
          </div>
        </footer>
        <div className="pt-10 md:pt-[95px] md:pl-[102px] md:pr-[111px] flex flex-wrap gap-y-6 sm:gap-y-11 justify-between">
          <div className="flex flex-col items-start gap-6 md:flex-row sm:gap-9 ms:items-center">
            <FooterLogo />
            <p className="text-[15px] sm:text-sm leading-5 text-[#E5E9EE] font-normal w-full lg:w-[774px]">
              Sendsile is a technology platform enhancing cross-border support. Sendsile partners
              with regulated and secured financial institutions to securely facilitate payment. We
              maintain a firm commitment to transparency, ensuring every service is delivered
              swiftly and safely every time. Your trust is our top priority. ©{' '}
              {new Date().getFullYear()} Sendsile All Rights Reserved.
            </p>
          </div>

          <div className="mt-0 border z-50 border-[#282C31] rounded-[10px] py-[14px] md:py-6 px-[27px] bg-[#131618] flex flex-wrap gap-8 items-center">
            <Link to="https://www.instagram.com/sendsile?igsh=NG0ycXhsb2MyM3Ay" target="_blank">
              <Insta />
            </Link>
            {/* <Facebook /> */}
            <Link to="https://x.com/Sendsilehq?t=aqVW0SRW4bMYVgi4zHHEIA&s=09" target="_blank">
              <X />
            </Link>
            {/* <LinkedIn /> */}
          </div>
        </div>
      </Container>
      <img className="w-full pt-6 sm:pt-[57px] md:pt-0" src={FooterImgText} alt="" />
      <img className="absolute bottom-0 right-0 hidden lg:flex" src={Blur} alt="blur" />
      <img className="absolute bottom-0 right-0 lg:hidden" src={FooterBlur2} alt="blur" />
      <img className="absolute bottom-0 right-0 lg:hidden" src={FooterBlur22} alt="blur" />
    </section>
  );
};

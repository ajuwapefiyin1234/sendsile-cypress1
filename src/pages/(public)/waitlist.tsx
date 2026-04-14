import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

import { useLocationState } from '../../services/store/selectLocationStore';
import { showCountryFlag } from '../../utils/helpers';
import { Container } from '../../components/global/Container';
import { carousel1, carousel2, carousel3 } from '../../assets/images';
import Blur from '../../assets/images/blur.png';
import AnimatedFlower from '../../components/ui/animatedFlower';
import WhatWeOffer from '../../components/ui/whatWeOffer';
import Footer from '../../components/ui/footer';
import { NavLogo } from '../../components/svgs/NavLogo';

const WaitlistPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocationState((state) => state.location);
  const setLocationModal = useLocationState((state) => state.updateModalOpen);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar className={`py-5 w-full ${isScrolled ? 'navbar scrolled' : 'navbar not-scroll'}`}>
        {!isScrolled && (
          <img src={Blur} className="-z-10 absolute -top-5 w-full left-0 right-0" alt="" />
        )}
        <Container>
          <div className="flex justify-between px-4 items-center ">
            <Link to={'/'} className="w-[117px] h-[29px]">
              <NavLogo />
            </Link>
            <Link
              to={'/join-waitlist'}
              className="z-10 font-medium bg-white rounded-[32px] border border-[#5F5F5F] shadow-[0px_4px_10px_0px] shadow-[#36454F1A] py-[10px] px-[44px]"
            >
              <p className="text-[15px] font-bold leading-[21px] text-[#00070C]">Join Waitlist</p>
            </Link>
            <img
              onClick={() => setLocationModal(true)}
              src={showCountryFlag(location)}
              alt="country flag"
              className="w-[41px] h-[41px] cursor-pointer border-2 shadow-[0px_2px_2px_0px] shadow-[#26323826] rounded-full"
            />
          </div>
        </Container>
      </Navbar>
      <div className="bg-[#FFFCF7]">
        <div className="max-w-[651px] px-5 mx-auto pt-32 pb-16 lg:pb-24 flex-col text-center items-center justify-center ">
          <h1 className="text-[#00070C] font-medium text-4xl lg:text-[88px] lg:leading-[96.8px] mx-auto mb-3 tracking-[-0.02em]">
            Bridging hearts <br /> across <span className="italic text-[#FFA900]"> miles</span>
          </h1>
          <p className="px-[10px] sm:px-0 text-lg sm:text-[20px] leading-6 sm:leading-7 text-[#36454F] font-normal">
            Sendsile connects you to trusted agents for personalized services—errands, healthcare,
            cleaning, and home care—helping you care for your loved ones, no matter the distance.
          </p>
          <button
            onClick={() => {
              navigate('/join-waitlist');
            }}
            className="mt-6 bg-[#000E25] hover:bg-white hover:text-prm-black border-[0.75px] border-[#74767E] transition-all ease-in-out duration-75 rounded-full text-[15px] leading-[21px] font-bold text-white py-[13.5px] px-[66.5px]"
          >
            Get Started
          </button>
        </div>
        <div className="w-full overflow-hidden">
          <div className=" flex w-fit gap-[18px] justify-center">
            <div className="flex w-max flex-nowrap  gap-[18px] each-section-sliding">
              <img src={carousel1} alt="" />
              <img src={carousel2} alt="" />
              <img src={carousel3} alt="" />
            </div>
            <div className="flex w-max flex-nowrap gap-[18px] each-section-sliding">
              <img src={carousel1} alt="" />
              <img src={carousel2} alt="" />
              <img src={carousel3} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div
        className=""
        style={{ background: 'linear-gradient(180deg, #FFFAF2 0%, #FFFAF3 48.97%, #FFFEFC 100%)' }}
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 py-16 px-4 lg:py-32 gap-y-5">
            <div className="items-center flex gap-0 lg:gap-8">
              <h4 className="text-[#00070C] font-medium text-2xl lg:text-5xl  lg:leading-[120%] w-72">
                Sendsile has you covered
              </h4>
              <div className="w-8 lg:w-24">
                <AnimatedFlower />
              </div>
            </div>
            <p className="text-[#00070C] text-[15px] lg:text-2xl">
              In today’s world, distance shouldn’t be a barrier to supporting loved ones. Through
              trusted agents, we provide reliable and professional services that bring peace of
              mind, no matter where you are.
            </p>
          </div>

          <div className="pb-16 px-4 lg:pb-24">
            <div className="w-full h-5 justify-start items-center gap-6 lg:gap-8 inline-flex mb-12">
              <div className="justify-start items-center gap-2 flex">
                <span className="text-gray-700 text-[17px] font-medium leading-tight uppercase">
                  What we offer
                </span>
              </div>
              <div className="grow shrink basis-0 h-[0px] border border-[#E1DFD0]"></div>
            </div>
            <WhatWeOffer />
          </div>
        </Container>
        <Footer />
      </div>
    </>
  );
};

const Navbar = styled.nav`
  &.not-scroll {
    background: #f3f4f2;
    /* background: radial-gradient(#FFF8EF 40%, #FFF8EF 0%); */
  }
  &.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: transparent; /* Initially transparent background */
    transition: background-color 1s ease; /* Smooth transition effect */
    z-index: 1000; /* Ensure it's on top of other content */
  }

  &.scrolled {
    background-color: rgba(
      255,
      255,
      255,
      0.4
    ); /* Add a semi-transparent background color when scrolled */
    backdrop-filter: blur(10px); /* Apply blur effect */
    -webkit-backdrop-filter: blur(10px); /* For Safari */
  }
`;

export default WaitlistPage;

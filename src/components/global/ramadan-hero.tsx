import { useLocation, useNavigate } from 'react-router-dom';

import { Container } from './Container';
import { hero, herobg } from '../../assets/images';
import { ROUTES } from '../../utils/route-constants';

const RamadanHero = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Container>
      <section className=" pt-14 px-4 lg:px-0 lg:pt-[88px] lg:mx-[100px]">
        <div className="relative flex flex-col pt-[80px] md:pt-[90px] w-full overflow-hidden rounded-[20px] sm:rounded-[40px] bg-[#F8F3F0]">
          <div className="absolute inset-0 w-full h-full overflow-hidden  rounded-[20px] sm:rounded-[40px]">
            <div
              className="absolute inset-0 w-full h-full bg-top bg-contain rounded-t-[40px]"
              style={{
                backgroundImage: `url(${herobg})`,
                backgroundSize: 'contain',
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div
              className="absolute inset-0 w-full h-full  rounded-[20px] sm:rounded-[40px]"
              style={{
                background:
                  'linear-gradient(179.71deg, rgba(255, 255, 255, 0) -20.38%, #FFFFFF 63.17%)',
              }}
            />
          </div>
          <div className="w-full relative px-[18px] md:w-[754px] text-center mx-auto z-10">
            <h1 className="pb-6 sm:pb-4 text-[36px] sm:text-[64px] text-prm-black leading-[43px] sm:leading-[77px]">
              Share the Blessings of <br />{' '}
              <span className="italic text-[#E4572E] font-besley">Ramadan</span>
            </h1>
            <p className="px-[10px] sm:px-0 text-lg sm:text-[20px] leading-6 sm:leading-7 text-[#36454F] font-normal">
              {location.pathname === '/'
                ? 'Celebrate the spirit of Ramadan with our handpicked fruit hampers. Thoughtfully curated and beautifully presented, because every gift is a blessing, no matter the distance.'
                : ' Surprise your loved ones with fresh, handpicked fruits for their Iftar. Send love across miles with our special Ramadan fruit baskets.'}
            </p>
            {location.pathname === '/' && (
              <button
                onClick={() => navigate(ROUTES.ramadanPackages)}
                className="mt-8 bg-[#000E25] hover:bg-white hover:text-prm-black border-[0.75px] border-[#74767E] transition-all ease-in-out duration-75 rounded-full text-[15px] leading-[21px] font-bold text-white py-[13.5px] px-[66.5px]"
              >
                Shop Ramadan Hampers
              </button>
            )}
          </div>
          <div className="relative z-10 w-full">
            <img
              src={hero}
              className="object-cover rounded-b-[40px] w-full md:w-auto h-[360px] md:h-auto md:object-contain"
              alt="Ramadan Fruit Basket"
            />
          </div>
        </div>
      </section>
    </Container>
  );
};

export default RamadanHero;

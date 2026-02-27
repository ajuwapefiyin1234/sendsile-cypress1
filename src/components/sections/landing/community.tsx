import { useNavigate } from 'react-router-dom';
import { CommImage, CommImage2 } from '../../../assets/images';
import { Container } from '../../global/Container';
import { ProductsArrowLeft } from '../../svgs/products-arrow-left';
import { ROUTES } from '../../../utils/route-constants';

export const Community = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-4 bg-[#FFFCF7] ">
      <Container>
        <div className="pt-16 pb-16 pl-4 pr-[17px] md:pb-[209px] lg:pr-0  lg:pt-[84px] lg:pl-[100px] relative">
          <h1 className="text-prm-black font-normal text-5xl leading-[48px] lg:text-[72px] lg:leading-[72px] w-full max-w-[993px]">
            Give back through community <span className="italic font-besley">donations</span>
          </h1>
          <p className="pt-8 pb-[108px] md:pb-0 w-full max-w-[503px] font-normal text-[20px] leading-7 lg:text-[24px] lg:leading-[34px] text-prm-black">
            Make positive change in your community back home. Easily create fundraising campaigns or
            contribute to existing causes focused on vital areas like education, clean water access
            and renewable energy solutions.
          </p>
          <button
            onClick={() => navigate(ROUTES.signUp)}
            className="hidden lg:flex mt-8 lg:pb-[0px] items-center gap-[20px] text-[20px] leading-7 font-medium group "
          >
            <span className="transition-all duration-200 ease-linear text-prm-red group-hover:text-prm-black">
              Create a cause
            </span>
            <div className="bg-prm-red rounded-full px-[11px] py-[14px] group-hover:bg-prm-black transition-all duration-200 ease-linear">
              <ProductsArrowLeft />
            </div>
          </button>

          <div className="relative md:absolute lg:bottom-[52px] md:right-[100px] laptop:right-[265px] w-full mobile:w-[327px] lg:w-[450px] laptop:w-[510px]">
            <img
              className="w-full object-cover object-center h-[300px] md:h-[260px] lg:h-auto lg:w-auto lg:absolute bottom-[52px] sm:bottom-0 left-4 rounded-[20px]"
              src={CommImage}
              alt="community image"
            />
            <img
              className="w-[180px] object-contain xs:w-[180px] mobile:w-[232px] h-[300px] lg:h-[358px] laptop:w-auto absolute bottom-24 md:bottom-[80px] lg:bottom-[105px] left-20 xs:left-[120px] sm:right-[165px] lg:left-[300px] laptop:left-[405px]"
              src={CommImage2}
              alt="community image"
            />
          </div>

          {/* <button
            onClick={() => navigate("/sign-up")}
            className="lg:hidden mt-8 flex items-center justify-end w-full gap-[20px] text-[20px] leading-7 font-medium group "
          >
            <span className="transition-all duration-200 ease-linear text-prm-red group-hover:text-prm-black">
              Create a cause
            </span>
            <div className="bg-prm-red rounded-full px-[11px] py-[14px] group-hover:bg-prm-black transition-all duration-200 ease-linear">
              <ProductsArrowLeft />
            </div>
          </button> */}
        </div>
      </Container>
    </section>
  );
};

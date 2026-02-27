import { useNavigate } from 'react-router-dom';

import { Container } from '../../global/Container';
import { ProductsArrowLeft } from '../../svgs/products-arrow-left';
import { donationLandingPageImage } from '../../../assets/images';

export const RamadanServices = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-4 bg-[#F8F3F0] pt-16 px-4 lg:pt-[71px] lg:px-[100px]">
      <Container>
        <div className="flex flex-col mx-auto gap-y-8 lg:gap-y-0 w-fit">
          <div className="flex flex-col-reverse gap-10 md:flex-row lg:gap-20 xl:gap-[114px] items-center">
            <div className="w-full lg:w-1/2 xl:w-auto bg-[#F2EBE7] rounded-[24px] flex items-center gap-10 lg:gap-12 flex-col">
              <img
                className="w-full h-full object-cover object-center"
                src={donationLandingPageImage}
                alt="service image"
              />
            </div>

            <div className="w-full lg:w-1/2 laptop:w-[600px]">
              <h1 className="text-5xl leading-[48px] lg:text-[72px] lg:leading-[72px] font-normal">
                Feed a Soul,
                <br />
                <span className="italic font-besley text-[#E4572E]">Earn a Blessing</span>
              </h1>
              <p className="w-full max-w-[503px] font-normal text-prm-black text-[20px] leading-7 lg:text-[24px] lg:leading-[34px] mt-4 py-1">
                Join thousands of generous donors providing iftar meals and essential food items to
                families in need during this holy month.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/donations')}
            className=" mb-9 self-end flex items-center gap-[20px] text-[20px] leading-7 font-medium group "
          >
            <span className="font-medium transition-all duration-200 ease-linear text-prm-red group-hover:text-prm-black">
              Donate Now
            </span>
            <div className="bg-prm-red rounded-full px-[11px] py-[14px] group-hover:bg-prm-black transition-all duration-200 ease-linear">
              <ProductsArrowLeft />
            </div>
          </button>
        </div>
      </Container>
    </section>
  );
};

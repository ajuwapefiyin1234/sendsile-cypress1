import { Container } from '../../global/Container';
import { Bulb } from '../../svgs/bulb';
import { Data } from '../../svgs/data';
import { Airtime } from '../../svgs/airtime';
// import { ProductsArrowLeft } from "../../svgs/products-arrow-left";
// import { useNavigate } from "react-router-dom";
import { Mark, ServiceImg } from '../../../assets/images';
// import { ROUTES } from "../../../utils/route-constants";

export const Services = () => {
  // const navigate = useNavigate();

  return (
    <section className="mt-4 bg-[#F8F3F0] pt-16 px-4 lg:pt-[71px] lg:px-[100px]">
      <Container>
        <div className="flex flex-col mx-auto gap-y-8 lg:gap-y-0 w-fit">
          <div className="flex flex-col-reverse gap-10 md:flex-row lg:gap-20 xl:gap-[114px] items-center">
            <div className="w-full lg:w-1/2 xl:w-auto bg-[#F2EBE7] rounded-[24px] py-[54px] lg:pt-[54px] lg:pb-[51px] px-6 lg:pr-[90px] lg:pl-[56px] flex items-center gap-10 lg:gap-12 flex-col">
              <img
                className="w-[267px] h-[272px] object-cover object-center"
                src={ServiceImg}
                alt="service image"
              />
              <div className="border-2 lg:border-[3px] w-full mobile:w-[320px] lg:w-[378px] border-[#FF8A64] rounded-[12px] bg-white">
                <div className="rounded-t-[12px] py-3 lg:py-[19px] px-[14px] flex items-center justify-between bg-[#FFF2ED] border-b border-[#D1D8E6]">
                  <div className="gap-[10px] flex items-center">
                    <img src={Mark} alt="mark" />
                    <p>Fast and easy</p>
                  </div>
                </div>
                <div className="flex justify-between items-center px-[14px] lg:px-7 py-4 lg:py-6 ">
                  <h1 className="text-[20px] leading-[28px] font-bold">₦20,000</h1>
                  <p className="text-sm leading-5 text-[#536878] font-normal">Up to 100 units</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 laptop:w-[600px]">
              <h1 className="text-5xl leading-[48px] lg:text-[72px] lg:leading-[72px] font-normal">
                Pay{'  '} <span className="italic font-besley">bills</span>
                {'  '}and{'  '} <span className="italic font-besley">utilities</span>
                {'  '}
                with ease{' '}
              </h1>
              <p className="w-full max-w-[503px] font-normal text-prm-black text-[20px] leading-7 lg:text-[24px] lg:leading-[34px] py-8">
                Distance is no barrier when it comes to supporting your loves ones. Ensure their
                lights stay on, phones remain connected, and daily essentials are covered.
              </p>
              <div className="flex flex-col items-start justify-start gap-6">
                <div className="flex items-center gap-[14px]">
                  <Bulb />
                  <p className="text-[20px] leading-7 font-medium text-prm-black">
                    Electricity bills
                  </p>
                </div>
                <div className="flex items-center gap-[14px]">
                  <Data />
                  <p className="text-[20px] leading-7 font-medium text-prm-black">Data purchase</p>
                </div>
                <div className="flex items-center gap-[14px]">
                  <Airtime />
                  <p className="text-[20px] leading-7 font-medium text-prm-black">Airtime top-up</p>
                </div>
              </div>
            </div>
          </div>
          {/* <button
            onClick={() => navigate(ROUTES.payBills)}
            className=" mb-9 self-end flex items-center gap-[20px] text-[20px] leading-7 font-medium group "
          >
            <span className="font-medium transition-all duration-200 ease-linear text-prm-red group-hover:text-prm-black">
              Pay a bill
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

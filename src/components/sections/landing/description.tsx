// import { useNavigate } from "react-router-dom";
import { Container } from '../../global/Container';
// import { ROUTES } from "../../../utils/route-constants";

export const Description = () => {
  // const navigate = useNavigate();
  return (
    <section className="bg-descriptionGradient pt-24 lg:pt-[115px] pb-12 lg:pb-[187px]">
      <Container>
        <div className="mx-4 lg:ml-[102px] lg:mr-[105px] border-t bodrer-[#E1DFD0]"></div>
        <div className="px-4 lg:pl-[102px] lg:pr-[99px] pt-20 lg:pt-[87px] flex-col flex sm:flex-row gap-11 lg:items-end">
          <h1 className="font-normal text-5xl leading-[52px] lg:text-[84px] text-prm-black lg:leading-[92px] w-full max-w-[594px]">
            <span>A better way to</span>{' '}
            <span className="italic font-normal font-besley">care</span>{' '}
            <span>for your loved ones</span>
          </h1>
          <div>
            <p className="pt-8 sm:pt-0 text-xl lg:text-[24px] w-full max-w-[600px] leading-7 lg:leading-[34px] text-prm-black font-normal">
              In a world where distance separates hearts, Sendsile allows you provide essential care
              for family and friends, anywhere you are. Purchase farm fresh goods, pay electricity
              bills, create and share community donation causes close to your heart.
            </p>
            {/* <button
              onClick={() => navigate(ROUTES.signUp)}
              className="mt-8 bg-[#000E25] hover:bg-white hover:text-prm-black border-[0.75px] border-[#74767E] transition-all ease-in-out duration-75 rounded-full text-[15px] leading-[21px] font-bold text-white py-[13.5px] px-[66.5px]"
            >
              Try for free
            </button> */}
          </div>
        </div>
      </Container>
    </section>
  );
};

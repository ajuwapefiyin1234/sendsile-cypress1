import { ramadanEasy } from '../../../utils/constants';
import { Container } from '../../global/Container';
import { PaymentCard } from '../../ui/home/payment-card';

export const RamadanEasy = () => {
  return (
    <Container>
      <section className="mt-20 bg-[#161618] rounded-[20px] lg:rounded-[40px] pt-14 pb-[70px] mx-4 px-4 lg:py-[84px] lg:px-[42px] lg:mx-[100px]">
        <h1 className="pb-12 lg:pb-20 text-[48px] leading-[48px] lg:text-[80px] text-white font-normal lg:leading-[80px] text-center">
          We’ve made it very <span className="italic font-besley">easy</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 sm:gap-x-4">
          {ramadanEasy.map((item, index) => {
            return <PaymentCard {...item} key={index} />;
          })}
        </div>
      </section>
    </Container>
  );
};

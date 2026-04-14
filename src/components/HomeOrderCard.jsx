import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { handleTransition } from '@/utils/handleTransition';

const HomeOrderCard = ({ heading, subtitle, orders, route }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start py-5 px-6 bg-white rounded-[8px] w-full   gap-6">
      <div className="flex flex-col items-start gap-1">
        <h3 className="font-medium text-[18px] leading-[25px] text-[#23272E]">
          {heading}
        </h3>
        <span className="text-[14px] text-[#8B909A] leading-[20px]">
          {subtitle && subtitle}
        </span>
      </div>

      <div className="flex justify-between items-center gap-[3px] w-full">
        <h2 className="font-bold text-[26px] leading-[36px] text-[#23272E]">
          {orders}
        </h2>

        <Button
          variant="default"
          type="button"
          className="py-3 px-4 bg-[#F0F0F0] border border-[#ECEEF4] rounded-[32px] font-medium text-[15px] leading-[21px] text-[#0C1116] hover:text-white w-full max-w-[128px]"
          onClick={(e) => {
            if (route) {
              handleTransition(e, route, navigate);
            }
          }}
        >
          View list
        </Button>
      </div>
    </div>
  );
};

HomeOrderCard.propTypes = {
  heading: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  orders: PropTypes.number.isRequired,
  orderTab: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
};

export default HomeOrderCard;

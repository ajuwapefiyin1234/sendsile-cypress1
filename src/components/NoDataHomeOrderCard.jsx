import PropTypes from "prop-types";
import { TbInfoCircle } from "react-icons/tb";

const NoDataHomeOrderCard = ({ title, subtitle, message }) => {
  return (
    <div className="flex flex-col items-start p-6 gap-6 bg-white rounded-[16px] w-full ">
      <div className="flex flex-col items-start gap-1">
        <h1 className="font-medium text-[18px] leading-[25px] text-[#23272E]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[14px] leading-[20px] text-[#8B909A]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="box-border flex items-center p-6 gap-2 border border-[#ECEEF4] rounded-[16px] w-full">
        <TbInfoCircle className="w-4 h-4  text-[#0D1415]" />

        <p className="text-[12px] leading-[17px] text-[#8B909A]">{message}</p>
      </div>
    </div>
  );
};

NoDataHomeOrderCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  message: PropTypes.string.isRequired,
};

export default NoDataHomeOrderCard;

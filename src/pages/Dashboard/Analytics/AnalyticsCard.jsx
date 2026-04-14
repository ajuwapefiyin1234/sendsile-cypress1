import PropTypes from 'prop-types';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';

const AnalyticsCard = ({ title, subtitle, period, green, percent }) => {
  return (
    <div
      className={`bg-white rounded-[16px] p-6 flex flex-col gap-14 w-full ${
        period ? 'lg:w-1/3' : 'lg:w-1/4'
      }`}
    >
      <h3 className="font-bold text-[18px] leading-[25px] text-[#2327E]">
        {title}
      </h3>

      <div className="flex flex-col items-start gap-[3px]">
        <p className="font-bold text-[32px] leading-[45px] text-[#23272E]">
          {subtitle}
        </p>

        {period && (
          <div className="flex items-center p-0 gap-2">
            <span
              className={`font-medium text-[14px] leading-[19.6px] flex gap-[1px] items-center ${
                green ? 'text-[#1EB564]' : 'text-[#E60026]'
              }`}
            >
              {green ? (
                <FaArrowUp className="w-4 h-4" />
              ) : (
                <FaArrowDown className="w-4 h-4" />
              )}{' '}
              {percent}%
            </span>
            <span className="font-medium text-[14px] leading-[20px] text-[#8B909A]">
              vs {period}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

AnalyticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  green: PropTypes.bool,
  percent: PropTypes.number.isRequired,
};

export default AnalyticsCard;

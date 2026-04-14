import PropTypes from "prop-types";
import { returnColor } from "@/lib/reusable";

const SummaryCard = ({
  icon,
  heading,
  heading2,
  subtitle2,
  heading3,
  subtitle3,
  status,
}) => {
  return (
    <div
      className={`flex flex-col items-start p-3 gap-2.5  h-[145px] bg-white rounded-[12px] w-full  
        ${ heading2 === 'Payment Method' ? 'lg:w-1/5' : 'lg:w-2/5'} 
       `}>
      <div className="flex flex-col items-start justify-center w-full gap-8 grow">
        <div className="flex items-start justify-between w-full ">
          <div className="flex items-center w-full gap-4">
            <img src={icon} alt="icon" className="w-9 h-9" />
          </div>
          {status && (
            <div className="flex items-start p-0 mix-blend-multiply">
              <div
                style={{
                  backgroundColor: returnColor(status).bg,
                }}
                className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]"
              >
                <div
                  style={{
                    backgroundColor: returnColor(status).dot,
                  }}
                  className="w-2 h-2 rounded-full"
                />
                <p
                  style={{ color: returnColor(status).text }}
                  className="font-medium text-[12px] leading-[17px] text-center text-nowrap capitalize"
                >
                  {status}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between w-full gap-8">
          <div className="flex flex-col items-start gap-2 ">
            <h4
              className={`${
                heading
                  ? 'text-[14px] leading-[16.8px]'
                  : 'text-[12px] leading-[14.4px]'
              }  text-[#8B8D97]`}
            >
              {heading || heading2}
            </h4>
            <p className="font-medium text-[13px] leading-[16px] items-center text-[#45464E] capitalize">
              {heading && (
                <span className="text-[#8B8D97]">Customer since </span>
              )}{' '}
              {subtitle2}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 ">
            <h4 className="text-[12px] leading-[14px] text-[#8B8D97] ">
              {heading3}
            </h4>
            <p
              className={`font-medium text-[13px] w-full leading-[16px] items-center text-[#45464E]  ${
                subtitle3?.includes('@')
                  ? 'truncate'
                  : 'line-clamp-2 capitalize'
              }`}
            >
              {subtitle3}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

SummaryCard.propTypes = {
  icon: PropTypes.string.isRequired,
  heading: PropTypes.string,
  subtitle: PropTypes.string,
  heading2: PropTypes.string,
  subtitle2: PropTypes.string,
  heading3: PropTypes.string,
  subtitle3: PropTypes.string,
  status: PropTypes.string,
};

export default SummaryCard;

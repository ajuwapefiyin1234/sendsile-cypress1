import PropTypes from "prop-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const InventoryCard = ({
  heading,
  icon,
  subheading,
  inStockfilterValue,
  setInstockFilterValue,
}) => {
  return (
    <div
      style={{
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
      }}
      className="flex flex-col items-start py-[11px] px-[15px] bg-white rounded-[12px] md:w-1/3 w-full "
    >
      <div className="flex flex-col items-start p-0 gap-4 md:gap-8 grow w-full">
        <div className="flex justify-between items-center w-full ">
          <img src={icon} alt="icon" className="w-9 h-9" />
        </div>

        <div className="flex items-start gap-8 my-0">
          <div className="flex flex-col items-start p-0 gap-2 grow">
            {heading === 'In Stock' ||
            heading === 'Low Stock' ||
            heading === 'Out of Stock' ? (
              <Select
                onValueChange={(newValue) => setInstockFilterValue(newValue)}
                value={inStockfilterValue}
              >
                <SelectTrigger
                  className={`box-border   flex items-center py-[5px] pl-0 pr-2 gap-0 h-5 border-0 focus:ring-0  rounded-[5px] ${
                    inStockfilterValue === 'In Stock'
                      ? 'text-[#1EB564]'
                      : inStockfilterValue === 'Out of Stock'
                      ? 'text-[#DD6262]'
                      : 'text-[#F79009]'
                  } `}
                >
                  <div className="flex items-center justify-start text-left  w-full  h-[17px] ">
                    <span className="text-[14px] ">
                      <SelectValue placeholder="In Stock" />
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="In Stock"
                    className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
                  >
                    In Stock
                  </SelectItem>
                  <SelectItem
                    value="Out of Stock"
                    className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
                  >
                    Out of stock
                  </SelectItem>
                  <SelectItem
                    value="Low Stock"
                    className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
                  >
                    Low stock
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-0.5">
                <h3
                  className={`text-[14px] leading-[20px] text-[#8B8D97] text-nowrap truncate `}
                >
                  {heading}
                </h3>
              </div>
            )}

            <h2 className="font-medium text-[20px] leading-[30px] text-[#45464E] text-nowrap truncate">
              {subheading}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

InventoryCard.propTypes = {
  heading: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  subheading: PropTypes.number.isRequired,
  inStockfilterValue: PropTypes.string.isRequired,
  setInstockFilterValue: PropTypes.func.isRequired,
};

export default InventoryCard;

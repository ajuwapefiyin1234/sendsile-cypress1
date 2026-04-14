import PropTypes from "prop-types";

const MobileRecieptTable = ({ data, config }) => {
  return (
    <div className="flex items-center p-0 overflow-x-auto w-full  md:hidden">
      <div className="flex flex-col items-start gap-2 px-2 grow ">
        {data?.map((item, index) => (
          <div key={index} className="flex items-start flex-col gap-6 w-full">
            <div className="flex flex-col items-start py-2 px-0 w-full">
              <div
                className={`box-border flex justify-between items-start py-4 px-0               
                  border-b-[0.2px] border-[#D4D4D4]
                  w-full`}
              >
                <div className="flex items-center p-0 gap-2">
                  {config?.image && (
                    <img
                      src={item[config?.image]}
                      className="w-[39px] h-[40px]"
                      alt=""
                    />
                  )}
                  <div className="flex flex-col items-start p-0">
                    <h4 className="text-[14px] leading-[20px] text-[#383A3C]">
                      {item[config?.title]}
                    </h4>
                    <p className="text-[15px] leading-[21px] text-[#8B909A]">
                      {item[config?.subtitle]}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[14px] leading-[25px] items-center text-right grow text-[#777C80]">
                    &#8358;{item[config?.price]}
                  </p>
                  <div className="flex items-start p-0 mix-blend-multiply">
                    <p className="font-medium text-[14px] leading-[20px] text-right">
                      &#8358; {item[config?.status]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="box-border flex justify-between items-start py-4 border-b-[0.2px] border-[#D4D4D4] w-full">
          <div className="flex flex-col items-start gap-2.5">
            <p className="text-[14px] leading-[25px] text-center text-[#777C80] grow">
              Subtotal
            </p>
            <p className="font-medium text-[14px] leading-[20px] text-right text-[#8B909A]">
              Delivery fee
            </p>

            <p className="font-medium text-[14px] leading-[20px] text-right text-[#8B909A]">
              Service fee
            </p>
            <p className="font-bold text-[16px] leading-[22px] text-[#0D1415] text-right">
              Total
            </p>
          </div>

          <div className="flex flex-col items-end gap-2.5">
            <p className="grow font-medium text-[14px] leading-[25px] items-center text-right text-[#777C80]">
              &#8358;26,000.00
            </p>

            <p className="font-medium text-[14px] leading-[20px] text-right text-[#8B909A]">
              &#8358;1,500
            </p>

            <p className="font-medium text-[14px] leading-[20px] text-right text-[#8B909A]">
              &#8358;200
            </p>
            <p className="font-bold text-[16px] leading-[22px] text-right text-[#0D1415]">
              &#8358;41,320
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

MobileRecieptTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  config: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onTableItemClicked: PropTypes.func,
  viewRow: PropTypes.func,
};

export default MobileRecieptTable;

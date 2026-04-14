import { returnColor } from "@/lib/reusable";
import PropTypes from "prop-types";

const MobileTable = ({ data, config, viewRow }) => {
  const tableRowClicked = (row) => {
    viewRow && viewRow(row[config.id]);
  };

  return (
    <div className="flex items-center p-0 overflow-x-auto w-full  md:hidden">
      <div className="flex flex-col items-start gap-2 px-2 grow ">
        {data?.map((item, index) => (
          <div
            onClick={() => tableRowClicked(item)}
            key={index}
            className="flex items-start flex-col gap-6 w-full"
          >
            <div className="flex flex-col items-start py-2 px-0 w-full">
              <div
                className={`box-border flex justify-between items-start py-4 px-0 ${
                  data?.length !== index + 1 &&
                  'border-b-[0.2px] border-[#D4D4D4]'
                }   w-full`}
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
                    <p
                      title={item[config?.subtitle] || ''}
                      className="text-[15px] leading-[21px] text-[#8B909A] max-w-[200px] truncate"
                    >
                      {item[config?.subtitle]}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[14px] leading-[25px] items-center text-right grow text-[#777C80]">
                    {item[config?.price]}
                  </p>
                  <div className="flex items-start p-0 mix-blend-multiply">
                    <div
                      style={{
                        backgroundColor: returnColor(item[config?.status]).bg,
                      }}
                      className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]"
                    >
                      <div
                        style={{
                          backgroundColor: returnColor(item[config?.status])
                            .text,
                        }}
                        className="w-2 h-2 rounded-full"
                      />
                      <p
                        style={{
                          color: returnColor(item[config?.status]).text,
                        }}
                        className="font-medium text-[14px] leading-[20px] text-right text-nowrap"
                      >
                        {item[config?.status]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

MobileTable.propTypes = {
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

export default MobileTable;

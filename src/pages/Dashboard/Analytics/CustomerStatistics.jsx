import images from '@/assets/images';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
import { useNavigate } from 'react-router-dom';

const CustomerStatistics = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start bg-white  rounded-[16px] w-full h-full">
      <header className="flex items-center py-3 px-6">
        <h3 className="font-medium text-[18px] leading-[25px] text-[#343C6A]">
          Customers
        </h3>
      </header>
      <div className="flex  items-center p-5 gap-2.5 bg-white rounded-[25px] w-full justify-between h-full">
        <div className="flex flex-col items-center gap-2.5 w-full  h-full justify-between">
          <div className="w-full flex items-center justify-center">
            <img src={images.customerStat} alt="" />
          </div>
          <div className="flex flex-col items-center justify-center gap-[15px] w-full">
            <div className="flex md:flex-row flex-col items-center justify-center gap-2 xl:gap-[46px] w-full ">
              <div className="flex flex-col items-center gap-3">
                <h5 className="font-bold text-[28px] leading-[34px] text-center text-[#202224]">
                  34,249
                </h5>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E4572E]" />
                  <p className="font-bold text-[16px] leading-[20px] text-[#282D32]">
                    New Customers
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <h5 className="font-bold text-[28px] leading-[34px] text-center text-[#202224]">
                  1420
                </h5>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EBD2CB]" />
                  <p className="font-bold text-[16px] leading-[20px] text-[#282D32]">
                    Returning User
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() =>
              navigate(SUPER_ADMIN_ROUTES.customerActivityLog + 'ID-011221')
            }
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            <p className="font-medium text-[17px] eading-[24px] text-[#E4572E]">
              View activity logs
            </p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6434_41287)">
                <path
                  d="M19 12H5"
                  stroke="#E4572E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 12L15 16"
                  stroke="#E4572E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 12L15 8"
                  stroke="#E4572E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_6434_41287">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="matrix(-1 0 0 1 24 0)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatistics;

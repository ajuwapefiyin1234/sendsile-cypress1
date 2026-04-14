import images from '@/assets/images';
import { ROUTE } from '@/routes';
import PropTypes from 'prop-types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link, useLocation } from 'react-router-dom';
import { TbMenu2 } from 'react-icons/tb';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import LogoutOutDialog from './LogoutOutDialog';
import {
  // useEffect,
  useState,
} from 'react';
import NotificationPopover from './NotificationPopover';
import { useStore } from '@/store/store';
import { handleTransition } from '@/utils/handleTransition';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';

const TopNav = ({ setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
const path = location.pathname;
  const isSuperAdmin = location.pathname.includes('super-admin');
  const { user } = useStore((state) => state.auth);
  const [logOutDialog, setLogOutDialog] = useState(false);


  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     // Perform actions before the component unloads
  //     event.preventDefault();
  //     event.returnValue = "";
  //   };

  //   const handleUnload = () => {
  //     // Perform cleanup actions
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("unload", handleUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("unload", handleUnload);
  //   };
  // }, []);

  const routeHeaders = {
    [ROUTE.eachOrder]: 'Order Details',
    [ROUTE.orderManagement]: 'Order List',
    [ROUTE.addProduct]: 'Add Product',
    [ROUTE.editEachProduct]: 'Edit Product',
    [ROUTE.eachProduct]: 'Product Details',
    [ROUTE.inventory]: 'Inventory List',
    [ROUTE.transactions]: 'Transactions',
    [ROUTE.analytics]: 'Analytics',
    [ROUTE.settings]: 'Settings',
    [ROUTE.dashboardHome]: 'Home',
    [SUPER_ADMIN_ROUTES.dashboard]: 'Home',
    [SUPER_ADMIN_ROUTES.addPartner]: 'Add Partner',
    [SUPER_ADMIN_ROUTES.eachOrder]: 'Order Details',
    [SUPER_ADMIN_ROUTES.orderManagement]: 'Order List',
    [SUPER_ADMIN_ROUTES.partnerDetail]: 'Partner Details',
    [SUPER_ADMIN_ROUTES.partnerManagement]: 'Partner List',
    [SUPER_ADMIN_ROUTES.customerActivityLog]: 'Activity Log',
    [SUPER_ADMIN_ROUTES.customerDetails]: 'Customer Details',
    [SUPER_ADMIN_ROUTES.customer]: 'Customer List',
    [SUPER_ADMIN_ROUTES.productActivityLog]: 'Activity Log',
    [SUPER_ADMIN_ROUTES.eachProduct]: 'Product Details',
    [SUPER_ADMIN_ROUTES.inventory]: 'Inventory List',
    [SUPER_ADMIN_ROUTES.transactions]: 'Transactions',
    [SUPER_ADMIN_ROUTES.analytics]: 'Analytics',
    [SUPER_ADMIN_ROUTES.settings]: 'Settings',
  };

  const getHeaderText = () => {
    for (const [route, text] of Object.entries(routeHeaders)) {
      if (path.startsWith(route)) {
        return text;
      }
    }
    return ''; // Default text for other routes
  };

  const shouldShowBackButton =
    path.startsWith(ROUTE.eachOrder) ||
    path.startsWith(ROUTE.eachProduct) ||
    path.startsWith(ROUTE.addProduct) ||
    path.startsWith(SUPER_ADMIN_ROUTES.eachOrder) ||
    path.startsWith(SUPER_ADMIN_ROUTES.eachProduct) ||
    path.startsWith(SUPER_ADMIN_ROUTES.addProduct) ||
    path.startsWith(SUPER_ADMIN_ROUTES.addPartner) ||
    path.startsWith(SUPER_ADMIN_ROUTES.partnerDetail) ||
    path.startsWith(SUPER_ADMIN_ROUTES.customerDetails) ||
    path.startsWith(SUPER_ADMIN_ROUTES.productActivityLog) ||
    path.startsWith(SUPER_ADMIN_ROUTES.customerActivityLog);
  return (
    <div className="w-full  bg-white border-b border-[#EAECF2]">
      <nav className="box-border max-w-[87.5rem] ml-auto mr-auto flex flex-col items-start py-0 px-4 md:px-8 w-full">
        <div
          style={{
            filter: 'drop-shadow(0px 2px 4px rgba(165, 163, 174, 0.3))',
          }}
          className="flex justify-between items-center pt-6 px-0 pb-4 rounded-[6px] w-full"
        >
          <div className=" flex-col hidden lg:flex items-start gap-2">
            <h1 className=" font-medium text-[20px] leading-[28px] items-center text-[#0D1415] grow">
              {getHeaderText()}
            </h1>
            {shouldShowBackButton && (
              <div
                onClick={(e) => handleTransition(e, -1, navigate)}
                className="gap-2 h-6 p-0 flex items-center justify-center cursor-pointer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6209_5186)">
                    <path
                      d="M5 12H19"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 12L9 16"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 12L9 8"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6209_5186">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <p className="font-medium text-[17px] text-[#E4572E] leading-[23.8px]">
                  Back
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-2 justify-center lg:hidden">
            <Link to={ROUTE.dashboardHome}>
              <img
                src={images.mobileLogo}
                alt="logo"
                className="w-[140px] h-[24px]"
              />
            </Link>
            {shouldShowBackButton && (
              <div
                onClick={(e) => handleTransition(e, -1, navigate)}
                className="gap-2 h-6 p-0 flex items-center justify-center cursor-pointer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6209_5186)">
                    <path
                      d="M5 12H19"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 12L9 16"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 12L9 8"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6209_5186">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <p className="font-medium text-[17px] text-[#E4572E] leading-[23.8px]">
                  Back
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center p-0 gap-4">
            <NotificationPopover />

            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.photo ? user?.photo : images.avatarImage}
                  className="w-[39px] h-[38px]  hidden md:block rounded-full"
                  alt=""
                />
              </PopoverTrigger>
              <PopoverContent
                style={{ boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)' }}
                className="flex flex-col items-center p-5 gap-2.5 bg-white rounded-[8px] max-w-[240px]"
              >
                <img
                  src={user?.photo ? user?.photo : images.avatarImage}
                  className="w-14 h-14 rounded-full"
                  alt=""
                />

                <div className="flex flex-col items-center justify-center gap-1">
                  <h2 className="font-medium text-[18px] truncate leading-[25px] text-[#23272E]">
                    Hi, {user?.name?.split(' ')[0] || user?.role || ''}!
                  </h2>
                  <span className="uppercase text-[12px] leading-[17px] text-[#8B909A]">
                    {user?.role || 'STAFF'}
                  </span>
                </div>

                <div className="flex flex-col items-start p-0 gap-2">
                  <Button
                    variant="ghost"
                    asChild
                    className="flex items-center p-4 gap-2 rounded-[6px] w-full"
                  >
                    {isSuperAdmin ? (
                      <Link
                        to={`${SUPER_ADMIN_ROUTES.settings}?tab=Security`}
                        className=""
                      >
                        <p className="text-[16px] leading-[22px] items-center text-[#536878] grow">
                          Manage account
                        </p>
                      </Link>
                    ) : (
                      <Link to={`${ROUTE.settings}?tab=Security`} className="">
                        <p className="text-[16px] leading-[22px] items-center text-[#536878] grow">
                          Manage account
                        </p>
                      </Link>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setLogOutDialog(true)}
                    className="flex items-center justify-start p-4 gap-2 rounded-[6px] w-full"
                  >
                    <div className="">
                      <p className="text-[16px] leading-[22px] items-center text-[#536878] grow">
                        Logout
                      </p>
                    </div>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className={`p-2 bg-transparent text-[#121217] border-none  block md:hidden`}
            >
              <TbMenu2 size={24} className="text-[#121217]" />
            </button>
          </div>
        </div>
      </nav>

      <LogoutOutDialog
        logOutDialog={logOutDialog}
        setLogOutDialog={setLogOutDialog}
      />
    </div>
  );
};
TopNav.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default TopNav;

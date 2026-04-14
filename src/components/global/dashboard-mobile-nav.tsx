import { Link, useNavigate } from 'react-router-dom';
import { NavLogo } from '../svgs/NavLogo';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoNotificationsOutline, IoNotificationsSharp } from 'react-icons/io5';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { dashboardNavMenus } from '../../utils/route-constants';
import { Menu } from '../ui/dashboard/menu';
import Overline from '../../assets/images/dashboard/overline.png';
import { Logout } from '../svgs/dashboard/nav-menu';
import { AiOutlineClose } from 'react-icons/ai';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Notification } from './profile';
import { toast } from 'react-toastify';
import { logoutUser } from '../../utils/helpers';

export const DashboardMobileNav = ({
  openSideBar,
  setSideBar,
}: {
  openSideBar: boolean;
  setSideBar: Dispatch<SetStateAction<boolean>>;
}) => {
  const [openNotification, setNotification] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getNotifications() {
      try {
        const res = await axiosPrivate.get('/user/notifications');
        if (res.status === 200) {
          setNotifications(res.data.data);
        }
      } catch (error: any) {
        if (error?.response?.status === 404) return;
        toast.error(error?.response?.data?.message || 'An error occurred', {
          toastId: 'notification-error',
        });
        setNotifications([]);
      }
    }

    getNotifications();
  }, [axiosPrivate]);

  return (
    <div>
      <header
        className={` bg-white px-4 backdrop-blur-lg fixed z-50 w-full top-0 flex flex-wrap justify-between items-center py-8 lg:hidden`}
      >
        <Link to={'/'} className="w-[100px] h-[24px]">
          <NavLogo />
        </Link>

        <div className="flex gap-4 items-center">
          <div className="relative">
            <button onClick={() => setNotification(!openNotification)}>
              {notifications?.length > 0 ? (
                <IoNotificationsSharp size={24} />
              ) : (
                <IoNotificationsOutline size={24} />
              )}

              {notifications?.length > 0 && (
                <div className=" w-fit bg-white p-[2px] !z-50 rounded-full absolute top-0 right-0">
                  <div className="size-2 bg-prm-red rounded-full"></div>
                </div>
              )}
            </button>
            <Notification
              hiddenClass="-right-10 sm:right-0"
              transition="-right-12 mobile:right-0 sm:right-10"
              notifications={notifications}
              openNotification={openNotification}
              setNotification={setNotification}
            />
          </div>
          <div>
            <button onClick={() => setSideBar(true)}>
              <RxHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </header>

      <nav
        className={`${
          openSideBar ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-200 flex justify-between flex-col left-0 fixed bg-white h-full z-[99]`}
      >
        <div>
          <div className="shadow-[0px_3px_4px_0px] shadow-[#2632381A] flex justify-between items-center px-5 py-[30px]">
            <div className="w-[94px] h-4">
              <NavLogo />
            </div>

            <button onClick={() => setSideBar(false)}>
              <AiOutlineClose size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-4 px-5 pt-8">
            {dashboardNavMenus.map((item, index) => {
              return <Menu {...item} key={index + item.text} action={() => setSideBar(false)} />;
            })}
          </div>
        </div>
        <div className="">
          <img className="mx-4" src={Overline} alt="overline" />
          <button
            onClick={() => logoutUser(navigate)}
            className="flex items-center gap-2 pt-5 pb-[24px] pl-8 text-[#E42E2E] font-normal text-base leading-[22.4px]"
          >
            <div className="">
              <Logout />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </nav>
      {openSideBar && (
        <div
          onClick={() => setSideBar(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        ></div>
      )}
    </div>
  );
};

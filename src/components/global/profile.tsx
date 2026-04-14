import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { NotificationChat } from '../../assets/images';
import { NavLogo } from '../svgs/NavLogo';
import { IoCloseOutline, IoNotificationsOutline, IoNotificationsSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { extractCharacter } from '../../utils/helpers';
import { userProfileState } from '../../services/store/userProfileStore';
import { NotificationType } from '../../types';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

export const Profile = () => {
  const [openNotification, setNotification] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { userData } = userProfileState();

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
    <div className="shadow-[0px_3px_4px_0px] shadow-[#2632381A] flex justify-between items-center px-5 py-4">
      <Link to={'/'} className="w-[94px] h-4">
        <NavLogo />
      </Link>

      <div className="flex items-center gap-[10px] relative">
        <button className="text-[#682EE4] font-medium text-sm leading-5 text-center bg-[#EBEFFC] py-[11px] px-[11px] rounded-full">
          {extractCharacter(userData?.name)}
        </button>
        <button onClick={() => setNotification(!openNotification)} className="relative">
          {notifications?.length > 0 ? (
            <IoNotificationsSharp size={22} />
          ) : (
            <IoNotificationsOutline size={22} />
          )}

          {notifications?.length > 0 && (
            <div className=" w-fit bg-white p-[2px] !z-50 rounded-full absolute top-0 right-0">
              <div className="size-2 bg-prm-red rounded-full"></div>
            </div>
          )}
        </button>
        <Notification
          openNotification={openNotification}
          setNotification={setNotification}
          notifications={notifications}
          hiddenClass="left-0"
          transition="left-10"
        />
      </div>
    </div>
  );
};

export const Notification = ({
  openNotification,
  setNotification,
  notifications,
  hiddenClass,
  transition,
}: {
  openNotification: boolean;
  setNotification: Dispatch<SetStateAction<boolean>>;
  notifications: NotificationType[];
  hiddenClass?: string;
  transition?: string;
}) => {
  return (
    <div
      className={`${
        openNotification
          ? ` ${transition} visible opacity-100`
          : `invisible opacity-0 ${hiddenClass}`
      } transition-all duration-300 ease-in-out p-4 absolute top-10 w-[90vw] mobile:w-[350px] ${
        notifications?.length > 0 ? 'h-[487px]' : 'h-fit'
      } rounded-lg  border border-[#E3E6ED] shadow-[0px_4px_16px_0px_#00000014] bg-white`}
    >
      <header className="pb-6 flex justify-between items-center">
        <h1 className="text-[#36454F] text-base leading-7 font-medium">Notifications</h1>
        <button onClick={() => setNotification(false)}>
          <IoCloseOutline className="text-[22px]" />
        </button>
      </header>

      {notifications?.length > 0 ? (
        <Fragment>
          <div className="h-[340px] scrollbar overflow-auto flex flex-col gap-6">
            {notifications.map((msg, index) => {
              const { title, description, created_at } = msg;
              return (
                <div key={index} className="flex items-start gap-4 pb-5 border-b border-[#E3E6ED]">
                  <img src={NotificationChat} alt="notification chat" />
                  <div className="flex flex-col gap-2">
                    <h1 className="text-prm-black text-sm font-medium leading-7">Order shipped</h1>
                    <p className="text-sm leading-6 text-[#536878]">
                      Your order <span className="text-[#36454F] font-medium">{title}</span>{' '}
                      {description}
                    </p>
                    <div className="flex items-center gap-2 text-xs mobile:text-[13px] text-[#536878] leading-6">
                      <p>{created_at && dayjs(created_at).format('DD MMMM, YYYY')}</p>
                      <div className="size-[6px] rounded-full bg-[#84939E]"></div>
                      <p>{created_at && dayjs(created_at).format('DD MMMM, YYYY')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button
              // onClick={handleMarkAsRead}
              className="mt-6 text-sm leading-5 text-prm-black py-2 px-4 rounded-full border-[0.75px] border-prm-black"
            >
              Mark all as read
            </button>
          </div>
        </Fragment>
      ) : (
        <div className="border-[0.5px] border-[#E3E6ED] rounded flex flex-col p-4 justify-center items-center">
          <img src={NotificationChat} alt="notification chat" />

          <p>You have no notifications</p>
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoIosNotificationsOutline } from "react-icons/io";
import { TbBellOff, TbLoader, TbAlertCircle } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { returnColor } from '@/lib/reusable';
import { fetchNotifications } from '@/utils/queries';

const NotificationPopover = () => {
  const [readNotifications, setReadNotifications] = useState([]);

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    retry: false,
    enabled: false,
  });

  const handleMarkAllAsRead = () => {
    setReadNotifications(notifications.map((notif, index) => index));
  };

  const notificationCount = notifications?.length;

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative">
          <IoIosNotificationsOutline className="w-6 h-6 text-[#536878]" />
          {notificationCount > 0 ? (
            <span className="absolute -top-1 -right-1 bg-red-600 text-[#F9FAFB] rounded-full text-xs w-[18px] h-[18px] flex items-center justify-center">
              {notificationCount}
            </span>
          ) : (
            <span className="absolute -top-1 -right-1 bg-red-600 text-[#F9FAFB] rounded-full text-xs w-[18px] h-[18px] flex items-center justify-center">
              0
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-1 max-w-[400px]">
        <div>
          <header
            style={{
              boxShadow:
                '0px 3px 4px rgba(0, 0, 0, 0.03), 0px 7px 4px rgba(0, 0, 0, 0.02)',
            }}
            className="box-border flex flex-col justify-center items-start gap-2 bg-white border-b border-[#ECEEF4] w-full"
          >
            <div className="flex justify-between w-full gap-14 p-4 bg-white">
              <div className="flex items-center p-0 gap-1.5 my-0 ">
                <h1 className="font-bold text-[15px] leading-[21px] text-[#141414]">
                  Notifications
                </h1>
                <div className="w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#0085FF] text-[11px] leading-[13.2px] text-center text-white">
                  {notificationCount}
                </div>
              </div>
              <span
                onClick={handleMarkAllAsRead}
                className="cursor-pointer font-medium text-[#0085FF] text-[12px] text-nowrap leading-[16.8px] text-right"
              >
                Mark all as read
              </span>
            </div>
          </header>

          {isLoading ? (
            <div className="flex justify-center items-center h-[200px] text-[#FFA900]">
              <TbLoader className="animate-spin w-10 h-10 " />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[200px] text-red-500">
              <TbAlertCircle className="w-10 h-10" />
              <p className="ml-2 text-sm">Failed to load notifications</p>
            </div>
          ) : notificationCount === 0 ? (
            <div className="flex flex-col gap-1 justify-center items-center h-[200px] text-gray-500">
              <TbBellOff className="w-10 h-10 text-[#FFA900]" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className={`box-border flex py-4 px-2 gap-1 ${
                  notifications.length === index + 1
                    ? ''
                    : 'border-b border-[#ECEEF4]'
                }  ${readNotifications.includes(index) ? 'bg-gray-100' : ''}`}
              >
                <div className="flex items-start p-0 mix-blend-multiply">
                  <div
                    style={{
                      backgroundColor: returnColor(notification.status).bg,
                    }}
                    className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]"
                  >
                    <div
                      style={{
                        backgroundColor: returnColor(notification.status).text,
                      }}
                      className="w-2 h-2 rounded-full"
                    />
                    <p
                      style={{ color: returnColor(notification.status).text }}
                      className="font-medium text-[12px] leading-[17px] text-center text-nowrap"
                    >
                      {notification.status}
                    </p>
                  </div>
                </div>
                <p className="ml-2 text-[12px] leading-[17px] text-[#141414]">
                  {notification.message}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;

import { ROUTE } from "@/routes";
import { TbClipboardList, TbLogout, TbSettings } from 'react-icons/tb';
import { TbReportMoney } from "react-icons/tb";
import { styled } from "styled-components";

import { TbBrandGoogleAnalytics } from 'react-icons/tb';
import { useState } from 'react';
import { TbShoppingCart } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { TbSmartHome } from 'react-icons/tb';
import { X } from 'lucide-react';
import images from '@/assets/images';
import PropTypes from 'prop-types';
import { sleep } from '@/lib/reusable';
import LogoutOutDialog from './LogoutOutDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Sidebar = ({ open, setOpen }) => {
  const [activeRoute, setActiveRoute] = useState(null);
  const [activeIndex, setActiveIndex] = useState();
  const [logOutDialog, setLogOutDialog] = useState(false);

  const navigate = useNavigate();
  const content = [
    {
      name: 'Home',
      route: ROUTE.dashboardHome,
      icon: TbSmartHome,
    },
    {
      name: 'Order Management',
      route: ROUTE.orderManagement,
      icon: TbClipboardList,
    },
    {
      name: 'Inventory',
      route: ROUTE.inventory,
      icon: TbShoppingCart,
    },
    {
      name: 'Transactions',
      route: ROUTE.transactions,
      icon: TbReportMoney,
    },
    {
      name: 'Analytics',
      route: ROUTE.analytics,
      icon: TbBrandGoogleAnalytics,
    },
    {
      name: 'Settings',
      route: ROUTE.settings,
      icon: TbSettings,
    },
  ];

  const openSubroute = async (e, route, subroutes, key) => {
    // setOpen(true);
    e.preventDefault();
    setOpen(false);
    setActiveIndex(key);
    // console.log(route, subroutes, key)
    setActiveRoute(route);
    const transitionContainer = document.querySelector('#transition-container');
    transitionContainer?.classList.add('page-transition');

    await sleep(150);
    navigate(route);
    await sleep(250);
    transitionContainer?.classList.remove('page-transition');
  };

  return (
    <>
      <aside
        className={`z-30 ${
          open ? 'w-[90%] left-[5%] rounded-md' : 'w-0 md:w-[82px] xl:w-[260px]'
        } max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh-5px)] h-full top-4 md:top-0 flex z-30 flex-col bg-[#FAFAFA] border-r border-[#EAECF2] fixed justify-between overflow-y-auto transition-all duration-150 ease-in`}
      >
        <div className="justify-start">
          <div className="mb-6 pb-6 mt-3 ">
            <div className="px-[18px] py-5 h-16 mb-8 flex justify-between items-center">
              <Link to={ROUTE.homePage}>
                <img
                  src={images.dashboardLogo}
                  alt="logo"
                  className="w-[37px] h-[26px]"
                />
              </Link>
              <div
                onClick={() => setOpen(false)}
                className=" md:hidden block !rounded-sm  cursor-pointer opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground border-none h-fit "
              >
                <X className="!h-6 w-6 text-black" />
                <span className="sr-only">Close</span>
              </div>
            </div>
            <SidebarItems
              className="flex flex-col gap-1 mb-3 px-2.5"
              open={open}
            >
              {content.map((item, key) => {
                return item.subroutes ? (
                  <div key={key}>
                    <div
                      onClick={() =>
                        openSubroute(item.route, item.subroutes, key)
                      }
                      className={`relative z-20 item `}
                    >
                      <item.icon size={20} />
                      {item.name}
                    </div>
                    {activeIndex === key && (
                      <ul className=" subroutes relative">
                        {item.subroutes.map((subroute, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              openSubroute(subroute.route, '', key)
                            }
                            // to={subroute?.route}
                            className={`item ${
                              activeRoute === subroute.route ? 'active' : ''
                            }`}
                          >
                            <div className="relative">
                              <span className="line" />
                              <span className="bubble" />
                              <p>{subroute.name}</p>
                            </div>
                          </div>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <TooltipProvider key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          key={key}
                          onClick={(e) => openSubroute(e, item.route, '', key)}
                          className={`item  ${
                            window.location.pathname.startsWith(item.route)
                              ? 'active'
                              : ''
                          }`}
                        >
                          <item.icon size={20} />
                          <span
                            className={`${open ? 'block' : 'xl:block hidden'} `}
                          >
                            {item.name}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </SidebarItems>
          </div>
        </div>

        <SidebarItems className="px-2.5" open={open}>
          <div className="line-with-bullets">
            <span className="line-content"></span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="item !mb-4  !text-[#E42E2E] !py-4 "
                  onClick={() => setLogOutDialog(true)}
                >
                  <TbLogout size={20} />
                  <span className={`${open ? 'block' : 'xl:block hidden'} `}>
                    Logout
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarItems>
      </aside>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="overlay  z-20 fixed top-0 h-screen w-full xl:hidden bg-[#00000080] transition duration-300 ease-in-out"
        ></div>
      )}

      <LogoutOutDialog
        logOutDialog={logOutDialog}
        setLogOutDialog={setLogOutDialog}
      />
    </>
  );
};
/* List */

/* Auto layout */

const SidebarItems = styled.div`
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    gap: 8px;
    color: #536878;
    /* width: ${({ open }) => (open ? '264px' : '8px')};  */
    height: 54px;
    font-size: 16px;
    line-height: 22.4px;
    background: transparent;
    border-radius: 6px;
    transition: background-color 0.3s ease, color 0.3s ease;

    /* Inside auto layout */
    flex: none;
    order: 4;
    align-self: stretch;
    flex-grow: 0;
    cursor: pointer;

    &:hover {
      background-color: #f4f5fa;
    }

    &.active {
      background-color: #ebebeb;
      color: #000000;
      border-radius: 8px;
    }

    @media (min-width: 1280px) {
      width: 232px;
    }
  }

  .subroutes {
    .item {
      font-size: 16px;
      line-height: 22.4px;
      padding-left: 3.5rem;
      position: relative; /* Added to ensure pseudo-elements are positioned correctly */
      transition: background-color 0.3s ease, color 0.3s ease;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 36px; /* Adjust to position the line */
        width: 0.77px; /* Width of the line */
        height: 84.5%; /* Height of the line */
        background-color: #000000; /* Color of the line */
      }

      &.active {
        background-color: #ebebeb;

        /* border-left: none; */
      }

      .line {
        position: absolute;
        width: 18px;
        height: 0.77px;
        background-color: #aeb4bd;
        top: 12px;
        left: -20px;
      }

      .bubble {
        width: 4px;
        height: 4px;
        border-radius: 100px;
        background-color: #aeb4bd;
        top: 10.5px;
        left: -6px;
        position: absolute;
      }
      &.active .bubble {
        background-color: #000000;
      }

      &.active .line {
        background-color: #000000;
      }
    }
  }
`;

Sidebar.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  noNav: PropTypes.bool,
};

export default Sidebar;

import { Menu } from '../ui/dashboard/menu';
import { Profile } from './profile';
import Overline from '../../assets/images/dashboard/overline.png';
import { dashboardNavMenus } from '../../utils/route-constants';
import { Logout } from '../../components/svgs/dashboard/nav-menu';
import { DashboardMobileNav } from './dashboard-mobile-nav';
import { useEffect, useState } from 'react';
import { extractCategoryID, logoutUser } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useSetCategoryIdStore } from '../../services/store/categoryIdStore';

export const SideBar = () => {
  const [openSideBar, setSideBar] = useState(false);
  const [id, setID] = useState('');
  const navigate = useNavigate();
  const { setId, categoryID } = useSetCategoryIdStore();

  useEffect(() => {
    async function loadCategoryID() {
      setID(`/dashboard/groceries?category=${encodeURIComponent(categoryID)}`);
      const res = await extractCategoryID();
      setId(res?.id);
    }
    loadCategoryID();
  }, []);

  return (
    <>
      <aside className={`hidden lg:block fixed top-0 left-0 w-[256px] h-screen bg-white z-50`}>
        <nav className="flex justify-between flex-col h-full">
          <div>
            <Profile />
            <div className="flex flex-col gap-4 px-4 pt-4">
              {dashboardNavMenus.map((item, index) => {
                const { iconActive, iconInActive, path, text } = item;
                return (
                  <Menu
                    iconActive={iconActive}
                    iconInActive={iconInActive}
                    path={text === 'Groceries' ? id : path}
                    text={text}
                    key={index + item.text}
                  />
                );
              })}
            </div>
          </div>
          <div className="">
            <img className="mx-4" src={Overline} alt="overline" />
            <button
              onClick={() => logoutUser(navigate)}
              className="flex items-center gap-2 pt-5 pb-[24px] pl-8 text-[#E42E2E] w-full font-normal text-base leading-[22.4px]"
            >
              <div className="">
                <Logout />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
      <DashboardMobileNav openSideBar={openSideBar} setSideBar={setSideBar} />
    </>
  );
};

import { Suspense } from 'react';
import PropTypes from 'prop-types';
// import { useNavigate } from "react-router-dom";

import PageLoader from '@/components/loaders/PageLoader';
import SecurityTab from './SecurityTab';
import NotificationTab from './NotificationTab';

import { useSearchParams } from 'react-router-dom';

import TeamMembersTab from './TeamMembersTab';

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Manage Team';

  const NavTab = ({ title }) => (
    <div
      className={`box-border cursor-pointer flex items-center py-2 px-3 md:px-5 gap-2.5 border-b-[2px] hover:bg-accent transition-colors duration-300 ease-in-out ${
        activeTab === title ? 'border-[#E4572E]' : 'border-transparent'
      } rounded-t-[6px]`}
      onClick={() => setSearchParams({ tab: title })}
    >
      <h2
        className={`font-medium text-[15px] leading-[21px] flex items-center text-nowrap transition-colors duration-300 ease-in-out ${
          activeTab === title ? 'text-[#E4572E]' : 'text-[#8B909A]'
        }`}
      >
        {title}
      </h2>
    </div>
  );

  NavTab.propTypes = {
    title: PropTypes.string,
  };

  return (
    <div className="flex flex-col items-start gap-4 w-full">
      <section className="box-border flex items-center py-2 md:px-6 md:gap-2 bg-white border border-[#ECEEF4] rounded-[8px] w-full">
        <NavTab title="Manage Team" />
        <NavTab title="Notifications" />
        <NavTab title="Security" />
      </section>

      {activeTab === 'Manage Team' && (
        <Suspense fallback={<PageLoader />}>
          <TeamMembersTab />
        </Suspense>
      )}

      {activeTab === 'Notifications' && (
        <Suspense fallback={<PageLoader />}>
          <NotificationTab />
        </Suspense>
      )}

      {activeTab === 'Security' && (
        <Suspense fallback={<PageLoader />}>
          <SecurityTab />
        </Suspense>
      )}
    </div>
  );
};

export default SettingsPage;

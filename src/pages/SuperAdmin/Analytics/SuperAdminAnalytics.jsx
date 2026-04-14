import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AnalyticsCard from '@/pages/Dashboard/Analytics/AnalyticsCard';
import CustomerStatistics from '@/pages/Dashboard/Analytics/CustomerStatistics';
import SellingVendorChart from '@/pages/Dashboard/Analytics/SellingVendorChart';
import TopSellingPieChart from '@/pages/Dashboard/Analytics/TopSellingPieChart';
import WeeklyActivityCard from '@/pages/Dashboard/Analytics/WeeklyActivityCard';
import WorldMap from '@/pages/Dashboard/Analytics/WorldMap';
import { useState } from 'react';

const SuperAdminAnalytics = () => {
  const [filterValue, setFilterValue] = useState('All time');

  return (
    <div className="flex flex-col items-start gap-8 w-full">
      <header className="flex justify-end items-center gap-8 w-full">
        <Select
          onValueChange={(newValue) => setFilterValue(newValue)}
          value={filterValue}
          className=""
        >
          <SelectTrigger className="box-border bg-white flex items-center py-[5px] px-2 gap-5 h-8 border border-[#EAECF2] text-[#878790] rounded-[8px] max-w-fit">
            <div className="flex  p-0 items-center gap-2">
              <p className="font-medium leading-[17px] text-[14px]">
                <SelectValue placeholder="All time" />
              </p>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
              value="All time"
            >
              All time
            </SelectItem>
            <SelectItem
              value="This Week"
              className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
            >
              This Week
            </SelectItem>
            <SelectItem
              value="This Month"
              className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
            >
              This Month
            </SelectItem>
          </SelectContent>
        </Select>
      </header>

      <section className="flex lg:flex-row flex-col items-center  gap-8 w-full">
        <AnalyticsCard
          title="Total Revenue"
          subtitle="₦687,743"
          period="last 7 days"
          percent={6}
          green={true}
        />
        <AnalyticsCard
          title="Active vendors"
          subtitle="263"
          period="last 7 days"
          percent={6}
          green={true}
        />
        <AnalyticsCard
          title="Number of users"
          subtitle="23"
          period="yesterday"
          percent={15}
        />
        <AnalyticsCard
          title="Total Orders"
          subtitle="23"
          period="last 7 days"
          percent={6}
          green={true}
        />
      </section>

      <section
        id="weekly activities"
        className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:gap-8 w-full"
      >
        <WeeklyActivityCard />
        <TopSellingPieChart />
      </section>

      <section className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8 w-full h-auto gap-6">
        {/* other charts */}
        <div className="w-full lg:col-span-1 h-auto">
          <CustomerStatistics />
        </div>
        <div className="w-full lg:col-span-1 h-auto">
          <SellingVendorChart />
        </div>
        <div className="w-full lg:col-span-1 h-auto">
          <WorldMap />
        </div>
      </section>
    </div>
  );
};

export default SuperAdminAnalytics;

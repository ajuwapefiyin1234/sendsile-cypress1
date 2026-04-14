import HomeOrderCard from "@/components/HomeOrderCard";
import HomeOrderSkeletonLoading from "@/components/HomeOrderSkeletonLoading";
import NoDataHomeOrderCard from "@/components/NoDataHomeOrderCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTE } from "@/routes";

import { handleTransition } from "@/utils/handleTransition";
import { fetchHomeStatistics } from "@/utils/queries";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DashboardHome = () => {
  const [filterValue, setFilterValue] = useState("All time");
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery({
    queryKey: ["homeStatistics"],
    queryFn: fetchHomeStatistics,
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Network error"
      );
    }
  }, [error]);

  const homeOrderData = [
    {
      heading: 'Pending Orders',
      subtitle: 'Orders awaiting processing', // subtitle already present
      orders: data?.pending || 0,
      orderTab: 'Pending',
      route: `${ROUTE.orderManagement}?tab=${'pending'}`,
      noDataMessage: 'No pending orders at the moment.',
    },
    {
      heading: 'Processing Orders',
      subtitle: 'Orders currently being processed', // subtitle already present
      orders: data?.processing || 0,
      orderTab: 'Processing',
      noDataMessage: 'No orders are currently being processed.',
      route: `${ROUTE.orderManagement}?tab=${'processing'}`,
    },
    {
      heading: 'Shipped Orders',
      subtitle: 'Orders that have been sent out for delivery', // subtitle already present
      orders: data?.shipped || 0,
      orderTab: 'Shipped',
      noDataMessage: 'No orders have been shipped yet.',
      route: `${ROUTE.orderManagement}?tab=${'shipped'}`,
    },
    {
      heading: 'Completed Orders',
      subtitle: 'Orders that have been completed', // added subtitle
      orders: data?.completed || 0,
      orderTab: 'Completed',
      noDataMessage: 'No orders have been completed yet.',
      route: `${ROUTE.orderManagement}?tab=${'completed'}`,
    },
    {
      heading: 'Cancelled Orders',
      subtitle: 'Orders that have been cancelled', // added subtitle
      orders: data?.cancelled || 0,
      orderTab: 'Cancelled',
      noDataMessage: 'No orders have been cancelled.',
      route: `${ROUTE.orderManagement}?tab=${'cancelled'}`,
    },
  ];

  const renderOrderCard = (item) => {
    if (isLoading) {
      return <HomeOrderSkeletonLoading />;
    }
    if (item.orders === 0) {
      return (
        <NoDataHomeOrderCard
          title={item.heading}
          subtitle={item.subtitle}
          message={item.noDataMessage}
        />
      );
    }
    return (
      <HomeOrderCard
        heading={item.heading}
        subtitle={item.subtitle}
        orders={item.orders}
        orderTab={item.orderTab}
        route={item.route}
      />
    );
  };

  return (
    <div className="flex flex-col items-start gap-8 w-full">
      <header className="flex justify-between items-center  gap-1 md:gap-8 w-full flex-wrap">
        <h1 className="font-medium md:text-[32px] md:leading-[45px] text-[24px] leading-[33.6px] text-[#00070C]">
          Welcome to Sendsile!
        </h1>

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

      <section className="flex items-start flex-col md:flex-row gap-5 w-full">
        <div className="flex flex-col gap-6 grow w-full md:w-1/2">
          {homeOrderData.slice(0, 3).map((item, index) => (
            <React.Fragment key={index}>{renderOrderCard(item)}</React.Fragment>
          ))}
        </div>

        <div className="flex flex-col items-start p-0 gap-6 grow w-full md:w-1/2">
          {homeOrderData.slice(3).map((item, index) => (
            <React.Fragment key={index}>{renderOrderCard(item)}</React.Fragment>
          ))}

          <div className="flex flex-col items-start py-5 px-6 gap-6 bg-white rounded-[16px] w-full">
            <h3 className="font-medium text-[18px] leading-[25px] text-[#23272E]">
              Quick Access
            </h3>
            <div
              onClick={(e) => handleTransition(e, ROUTE.inventory, navigate)}
              className="box-border cursor-pointer hover:bg-accent flex justify-between items-center p-6 md:gap-6 bg-[#F7F7F7] border border-[#ECEEF4] rounded-[8px] w-full"
            >
              <div className="flex flex-col items-start p-0 gap-1 grow">
                <h4 className="font-bold text-[16px] leading-[22.4px] text-[#23272E]">
                  Manage inventory
                </h4>

                <span className="text-[14px] leading-[19.6px] text-[#8B909A]">
                  View, edit and update lists of available products
                </span>
              </div>
              <FaChevronRight className="w-4 h-4 text-[#0D1415]" />
            </div>

            <div
              onClick={(e) => handleTransition(e, ROUTE.transactions, navigate)}
              className="box-border cursor-pointer hover:bg-accent flex justify-between items-center p-6 md:gap-6 bg-[#F7F7F7] border border-[#ECEEF4] rounded-[8px] w-full"
            >
              <div className="flex flex-col items-start p-0 gap-1 grow">
                <h4 className="font-bold text-[16px] leading-[22.4px] text-[#23272E]">
                  View transactions
                </h4>

                <span className="text-[14px] leading-[19.6px] text-[#8B909A]">
                  Monitor and manage financial transactions
                </span>
              </div>
              <FaChevronRight className="w-4 h-4 text-[#0D1415]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;

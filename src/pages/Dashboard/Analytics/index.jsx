import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import WeeklyActivityCard from "./WeeklyActivityCard";
import TopSellingPieChart from "./TopSellingPieChart";
import { ROUTE } from "@/routes";
import { useNavigate } from "react-router-dom";
import { returnColor } from "@/lib/reusable";

const orders = [
  {
    id: "#5675",
    name: "Sandra Oluwatife",
    product: "Tomatoes (1 basket)",
    status: "Pending",
    price: "₦4,000",
  },
  {
    id: "#5674",
    name: "Adeyinka Ogunleye",
    product: "Tomatoes (1 basket)",
    status: "Completed",
    price: "₦4,000",
  },
  {
    id: "#5675",
    name: "John Doe",
    product: "Tomatoes (1 basket)",
    status: "Pending",
    price: "₦4,000",
  },
];

const transactions = [
  {
    orderID: "5675",
    date: "12/06/2024",

    status: "Pending",
    price: "₦4,000",
  },
  {
    orderID: "5674",
    date: "12/06/2024",

    status: "Completed",
    price: "₦4,000",
  },
  {
    orderID: "5675",
    date: "12/06/2024",

    status: "Pending",
    price: "₦4,000",
  },
];
const AnalyticsPage = () => {
  const [filterValue, setFilterValue] = useState("All time");
  const navigate = useNavigate();

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

      <section className="flex md:flex-row flex-col items-center  gap-8 w-full">
        <AnalyticsCard
          title="Total Revenue"
          subtitle="₦687,743"
          period="last 7 days"
          percent={6}
          green={true}
        />
        <AnalyticsCard
          title="Total Orders"
          subtitle="263"
          period="last 7 days"
          percent={6}
          green={true}
        />
        <AnalyticsCard
          title="Pending Orders"
          subtitle="23"
          period="yesterday"
          percent={15}
        />
      </section>

      <section
        id="weekly activities"
        className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:gap-8 w-full"
      >
        <WeeklyActivityCard />
        <TopSellingPieChart />
      </section>

      <section className="flex flex-col lg:flex-row justify-between items-start gap-8 w-full h-auto">
        <div className="flex flex-col items-start p-0 gap-4 rounded-[16px] bg-white w-full lg:max-w-[60.80%]">
          <div className="flex justify-between items-center py-3 px-6 gap-1 w-full">
            <h2 className="font-bold text-[18px] leading-[25px] text-[#333B69]">
              Recent Orders
            </h2>
            <p
              onClick={() => navigate(ROUTE.orderManagement)}
              className="font-medium text-[16px] leading-[22px] text-[#E4572E] hover:underline cursor-pointer"
            >
              View all
            </p>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="rounded-[8px] bg-white w-full">
              <thead>
                <tr className="border-b border-[#ECEEF4] font-medium text-[14px] leading-[19.6px] text-[#8B909A] text-left">
                  <th className="gap-4 p-6">Order ID & Name</th>
                  <th className="gap-4 p-6">Product</th>
                  <th className="gap-4 p-6">Status</th>
                  <th className="gap-4 p-6">Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className={`${
                      index < orders.length - 1 && " border-b"
                    } border-[#ECEEF4] text-[15px] leading-[21px] text-[#0D1415]`}
                  >
                    <td className="gap-4 p-6">
                      <strong className="font-bold">{order.id}</strong>{" "}
                      <span>{order.name}</span>
                    </td>
                    <td className="gap-4 p-6">{order.product}</td>
                    <td className="gap-4 p-6">
                      <div className="flex items-start p-0 mix-blend-multiply">
                        <div
                          style={{
                            backgroundColor: returnColor(order.status).bg,
                          }}
                          className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]"
                        >
                          <div
                            style={{
                              backgroundColor: returnColor(order.status).text,
                            }}
                            className="w-2 h-2 rounded-full"
                          />
                          <p
                            style={{ color: returnColor(order.status).text }}
                            className="font-medium text-[12px] leading-[17px] text-center"
                          >
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="gap-4 p-6">{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start bg-white rounded-[16px] w-full lg:max-w-[39.20%]">
          <div className="flex justify-between py-3 px-6 gap-1 w-full">
            <h2 className="font-bold text-[18px] leading-[25px] text-[#333B69]">
              Last Transaction
            </h2>
            <p
              onClick={() => navigate(ROUTE.transactions)}
              className="font-medium text-[16px] leading-[22px] text-[#E4572E] cursor-pointer hover:underline"
            >
              View all
            </p>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="rounded-[8px] bg-white w-full">
              <thead>
                <tr className="border-b border-[#ECEEF4] font-medium text-[14px] leading-[19.6px] text-[#8B909A] text-left">
                  <th className="gap-4 p-6">Date</th>
                  <th className="gap-4 p-6">Order ID</th>
                  <th className="gap-4 p-6">Price</th>
                  <th className="gap-4 p-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`${
                      index < orders.length - 1 && " border-b"
                    } border-[#ECEEF4] text-[15px] leading-[21px] text-[#8B909A]`}
                  >
                    <td className="gap-4 p-6">{transaction.date}</td>
                    <td className="gap-4 p-6">{transaction.orderID}</td>

                    <td className="gap-4 p-6 text-[#0D1415]">
                      {transaction.price}
                    </td>
                    <td className="gap-4 p-6">
                      <div className="flex items-start p-0 mix-blend-multiply">
                        {/* <div
                            style={{
                              backgroundColor: returnColor(order.status).text,
                            }}
                            className="w-2 h-2 rounded-full"
                          /> */}
                        <p
                          style={{
                            color: returnColor(transaction.status).text,
                          }}
                          className="font-medium text-[12px] leading-[17px] text-center"
                        >
                          {transaction.status}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;

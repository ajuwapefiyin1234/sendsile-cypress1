import PieChart from "@/components/Charts/PieChart";

const TopSellingPieChart = () => {
  return (
    <div className="flex flex-col items-start bg-white rounded-[16px] w-full lg:max-w-[32.08%] ">
      <div className="py-3 p-6 flex items-center">
        <h2 className="font-medium text-[18px] leading-[25px] text-[#343C6A]">
          Top Selling Category
        </h2>
      </div>

      <div className="w-full h-[325px] flex items-center justify-center">
        <PieChart />
      </div>
    </div>
  );
};

export default TopSellingPieChart;

import BarChats from "@/components/Charts/BarChats";

const WeeklyActivityCard = () => {
  return (
    <div className="flex flex-col p-0 gap-0 bg-white rounded-[16px] lg:max-w-[67.69%] w-full">
      <div className="flex justify-between items-center py-3 px-6 gap-1 w-full">
        <h2 className="font-medium text-[18px] leading-[25px] text-[#343C6A] grow">
          Weekly Activities
        </h2>
      </div>
      <div
        className="w-full h-[324px] bg-white rounded-[24px] p-7 gap-5"
      >
        <BarChats />
      </div>
    </div>
  );
};

export default WeeklyActivityCard;

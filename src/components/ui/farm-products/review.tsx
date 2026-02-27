import { IoStarSharp } from 'react-icons/io5';

export const Review = ({
  count,
  message,
  name,
  date,
}: {
  count: number;
  message: string;
  name: string;
  date: string;
}) => {
  return (
    <div className="pb-8 border-b border-[#E3E6ED]">
      <div className="py-3 flex gap-2 items-center">
        {Array(5)
          .fill(1)
          .map((_, index) => (
            <IoStarSharp size={24} key={index} color={index + 1 <= count ? '#FFA900' : '#DBDBDB'} />
          ))}
      </div>
      <p className="pt-[10px] pb-4 text-[#0D1415] text-[17px] leading-6 font-normal">{message}</p>
      <div className="flex justify-between items-center">
        <h1 className="text-[#0D1415] text-base font-medium leading-[22px]">{name}</h1>
        <h1 className="text-[#36454F] text-base font-medium leading-[22px]">{date}</h1>
      </div>
    </div>
  );
};

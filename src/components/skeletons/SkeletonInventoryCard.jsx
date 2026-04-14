export const SkeletonInventoryCard = () => {
  return (
    <div
      style={{
        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
      }}
      className="flex flex-col items-start py-[11px] px-[15px] bg-white rounded-[12px] md:w-1/3 w-full animate-pulse"
    >
      <div className="flex flex-col items-start p-0 gap-4 md:gap-8 grow w-full">
        <div className="flex justify-between items-center w-full">
          <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
        </div>

        <div className="flex items-start gap-8 my-0">
          <div className="flex flex-col items-start p-0 gap-2 grow">
            <div className="w-full h-5 bg-gray-300 rounded-md"></div>
            <div className="w-1/2 h-6 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

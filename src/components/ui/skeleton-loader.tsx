export const SkeletonLoader = () => {
  return (
    <div className="animate-pulse bg-gray-50 w-full px- pt-4 sm:pt-7 cursor-pointer group pb-[10px] sm:pb-4 pl-4 sm:pl-3 pr-4 flex flex-col justify-between laptop:w-[290px] h-[398px] sm:h-[400px] rounded-[20px]">
      <div className="bg-gray-200/50 h-5 w-[70%] rounded-md"></div>
      <div className="mx-auto bg-gray-200/50 size-[160px] rounded-full  max-w-[180px] "></div>

      <div className="flex flex-col-reverse sm:flex-row gap-10 items-center">
        <div className="bg-gray-200/50 h-10 w-1/2 rounded-md"></div>
        <div className="bg-gray-200/50 h-5 w-1/2"></div>
      </div>
    </div>
  );
};

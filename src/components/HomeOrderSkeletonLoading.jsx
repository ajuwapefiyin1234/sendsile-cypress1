const HomeOrderSkeletonLoading = () => {
  return (
    <div className="flex flex-col items-start p-6 gap-6 bg-white rounded-[16px] animate-pulse w-full">
      <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
      <div className="w-1/4 h-8 bg-gray-200 rounded"></div>
    </div>
  );
};

export default HomeOrderSkeletonLoading;

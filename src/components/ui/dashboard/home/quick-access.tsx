export const QuickAccess = ({
  icon,
  title,
  text,
  action,
}: {
  icon: any;
  title: string;
  text: string;
  action: () => void;
}) => {
  return (
    <div
      onClick={action}
      className="cursor-pointer p-4 w-full laptop:w-[245px] bg-white rounded-md hover:border-prm-red transition-all duration-150 border-[#E4E4E4] border-[0.5px]"
    >
      <img src={icon} alt="icon" className="size-[60px]" />
      <h1 className="select-none pt-4 pb-[10px] text-prm-black text-[17px] md:text-base leading-6 font-medium">
        {title}
      </h1>
      <p className="select-none text-base md:text-[15px] leading-5 text-[#36454F] font-normal">
        {text}
      </p>
    </div>
  );
};

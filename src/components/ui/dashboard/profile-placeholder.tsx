import { twMerge } from 'tailwind-merge';

export const ProfilePlaceholder = ({ children }: { children: string }) => {
  return (
    <div
      className={twMerge(
        'bg-[#EBEFFC] rounded-full py-[10px] px-[11px] md:py-[14px] md:px-[15px] text-[22px] md:text-[32px] leading-[30px] md:leading-[44px] text-[#6029D5] font-medium uppercase'
      )}
    >
      {children}
    </div>
  );
};

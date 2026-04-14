import { ReactNode } from 'react';

export const FarmCarouselBtn = ({
  icon,
  classname,
  action,
}: {
  icon: ReactNode;
  classname?: string;
  action: () => void;
}) => {
  return (
    <button
      onClick={action}
      className={`bg-[#F0F0F0] py-[15px] px-[17px] rounded-full ${classname} absolute`}
    >
      {icon}
    </button>
  );
};

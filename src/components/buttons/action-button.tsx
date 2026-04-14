import { ReactNode } from 'react';

export const ActionButton = ({
  action,
  icon,
  text,
  cartItemsNo,
  style,
  textStyle,
}: {
  action: () => void;
  icon: ReactNode;
  text: string;
  cartItemsNo?: number;
  style?: string;
  textStyle?: string;
}) => {
  return (
    <button onClick={action} className="flex gap-1 items-center relative">
      <div className={style}>{icon}</div>
      <p
        className={`${textStyle ? textStyle : 'text-base'} leading-[22.4px] font-normal text-black`}
      >
        {text}
      </p>

      {cartItemsNo! > 0 && (
        <p className="py-[2px] px-[8px] rounded-full text-white bg-[#E4572E] absolute top-1 left-[2px] font-bold text-[10px] leading-[14px]">
          {cartItemsNo}
        </p>
      )}
    </button>
  );
};

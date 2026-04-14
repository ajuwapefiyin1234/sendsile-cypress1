import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export const FilterChip = ({
  iconLeft,
  iconRight,
  text,
  classname,
  action,
  handleRemove,
  onMouseEnter,
  onMouseLeave,
}: {
  text: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  classname: string;
  id?: string;
  action?: () => void;
  handleRemove?: () => any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        action && action();
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      type="button"
      className={twMerge(
        `transition-all ease-in-out select-none font-normal text-prm-black flex items-center min-w-fit rounded-3xl border-[0.75px] border-[#E6E3DD]`,
        classname
      )}
    >
      {iconLeft && <div className="mr-3 size-6 sm:size-4">{iconLeft}</div>}
      {text}
      {iconRight && (
        <div className="pl-[10px] cursor-pointer" onClick={handleRemove}>
          {iconRight}
        </div>
      )}
    </button>
  );
};

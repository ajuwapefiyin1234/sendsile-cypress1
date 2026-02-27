import { ArrowUp } from '../svgs/ArrowUp';
import { ArrowDown } from '../svgs/ArrowDown';

export const Accordion = ({
  title,
  content,
  isActive,
  onClick,
  classname,
  titleStyle,
}: {
  title: string;
  content: string;
  isActive: boolean;
  onClick: () => void;
  classname: string;
  titleStyle: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${classname} cursor-pointer bg-[#FAF5F1] rounded-[10px] ${
        isActive ? 'h-auto' : 'h-fit overflow-hidden'
      } transition-all duration-200 ease-in-out`}
    >
      <div className="flex justify-between items-center">
        <h1 className={`${titleStyle} cursor-pointer font-medium  text-prm-black`}>{title}</h1>
        <button>{isActive ? <ArrowUp /> : <ArrowDown />}</button>
      </div>
      <p
        className={`${
          isActive ? 'h-full pt-4' : 'h-0 overflow-hidden'
        } text-sm md:text-base leading-[22px] font-normal text-prm-black `}
      >
        {content}
      </p>
    </div>
  );
};

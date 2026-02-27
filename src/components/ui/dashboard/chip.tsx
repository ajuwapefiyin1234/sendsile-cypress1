import { twMerge } from 'tailwind-merge';
import { chipStatusColor } from '../../../utils/helpers';

export const Chip = ({ statusText, classname }: { statusText: string; classname?: string }) => {
  return (
    <div
      className={twMerge(
        'px-2 py-1 text-xs leading-[18px] font-medium border-[0.5px] border-[#E3E6ED] rounded-full flex justify-center items-center gap-[6px]',
        classname
      )}
    >
      <div className={`${chipStatusColor(statusText).bg} size-2 rounded-full`}></div>
      <p className={`${chipStatusColor(statusText).text}  text-center`}>{statusText}</p>
    </div>
  );
};

import { twMerge } from 'tailwind-merge';

export const ImagePlaceholder = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge('rounded-lg size-28 sm:size-[180px] mx-auto bg-gray-200 flex', className)}
    ></div>
  );
};

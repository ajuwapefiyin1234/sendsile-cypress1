import { ReactNode } from 'react';
import { FeedbackText } from './feedback-text';
import { twMerge } from 'tailwind-merge';

export const PageHeader = ({
  text,
  element,
  classname,
}: {
  text?: string;
  element?: ReactNode;
  classname?: string;
}) => {
  return (
    <div className="pt-[160px] lg:pt-[90px] pb-10 flex items-center justify-between w-full">
      {text && (
        <h1 className={twMerge('text-prm-black text-[32px] leading-9 font-medium', classname)}>
          {text}
        </h1>
      )}

      {element && element}
      <FeedbackText />
    </div>
  );
};

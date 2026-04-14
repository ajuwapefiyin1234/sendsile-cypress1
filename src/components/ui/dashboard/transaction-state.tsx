import { ReactNode } from 'react';

export const TransactionState = ({
  icon,
  statusText,
  classname,
  timerCount,
  showCancelButton,
  timerCountSec,
}: {
  icon: ReactNode;
  statusText: string;
  classname?: string;
  timerCountSec?: number;
  showCancelButton: boolean;
  timerCount?: number;
}) => {
  return (
    <div
      className={`flex h-[78px] justify-between items-center px-2 mobile:px-4 border border-[#F3F4F6] bg-white rounded-lg ${classname}`}
    >
      <div className="flex items-center gap-3">
        <img src={icon as any} alt="icon" />

        <div>
          <p className="text-sm mobile:text-[17px] font-normal leading-6 text-prm-black">
            {statusText}
          </p>
          {statusText.toLowerCase() === 'pending' && (
            <p className="text-[#E60026] font-normal text-sm leading-5">
              <span>{timerCount! < 10 ? '0' + timerCount : timerCount}</span>:
              <span>{timerCountSec! < 10 ? '0' + timerCountSec : timerCountSec}</span>s
            </p>
          )}
        </div>
      </div>

      {showCancelButton ? (
        <button
          onClick={() => ''}
          className=" h-fit py-[6px] px-3 text-sm md:text-[15px] font-medium rounded-full text-prm-black bg-[#F6F6F6]"
        >
          Cancel order
        </button>
      ) : null}
    </div>
  );
};

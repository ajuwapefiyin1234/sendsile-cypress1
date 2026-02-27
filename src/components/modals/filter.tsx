import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

export const FilterModal = ({
  openFilter,
  setOpen,
  handleReset,
  dropDownOne,
  dropDownTwo,
  dropDownThree,
}: {
  openFilter: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleReset: () => void;
  dropDownOne: React.JSX.Element;
  dropDownTwo: React.JSX.Element;
  dropDownThree?: React.JSX.Element;
}) => {
  useEffect(() => {
    if (openFilter) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'unset';
    }
  }, [openFilter]);

  return (
    <div
      className={`${
        openFilter ? 'visible translate-x-0' : 'translate-x-full invisible'
      }  fixed top-0 left-0 bg-white z-50 overflow-hidden duration-500 h-dvh w-full transition-all ease-in-out`}
    >
      <div className="px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="pb-1 text-prm-black text-2xl font-medium">All Filters</h1>
          <p className="text-[#536878] text-xl leading-6">Select filter to apply</p>
        </div>

        <button onClick={() => setOpen(false)}>
          <IoCloseOutline size={32} />
        </button>
      </div>

      <div className="px-4 flex flex-col gap-8">
        {dropDownOne}
        {dropDownTwo}
        {dropDownThree}
      </div>

      <div className="py-4 px-4 [box-shadow:_0px_2px_8px_4px_#7080901A] bg-white absolute bottom-0 flex w-full justify-between items-center">
        <button onClick={handleReset} className="text-[#D5D9E0] text-[20px] leading-7 font-medium">
          Reset
        </button>
        <button
          onClick={() => setOpen(false)}
          className="bg-black text-base leading-6 font-medium text-white py-[10px] px-[18px] rounded-full"
        >
          Show results
        </button>
      </div>
    </div>
  );
};

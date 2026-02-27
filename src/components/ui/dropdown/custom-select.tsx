import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';

interface IOption {
  label: string;
  value: string;
}

interface CustomSelectProp {
  handleSelect: Dispatch<SetStateAction<string>>;
  value: string;
  option: IOption[];
  placeholder: string;
  placeholderStyles?: string;
  classname?: string;
  arrowDown?: ReactNode;
  arrowUp?: ReactNode;
  dropdownClass?: string;
}

const CustomSelect: React.FC<CustomSelectProp> = ({
  dropdownClass,
  handleSelect,
  value,
  option,
  placeholder,
  placeholderStyles,
  classname,
  arrowDown = <IoMdArrowDropdown />,
  arrowUp = <IoMdArrowDropup />,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [dropdownPossition, setDropDownPostion] = useState('');

  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e: MouseEvent | TouchEvent) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node))
      setIsOpen((prev) => !prev);
  };

  const handleSelectedOption = (option: string) => {
    // setSelectedOption(option);
    handleSelect(option);
    setIsOpen(false);
  };

  const adjustDropdownPosition = () => {
    if (dropDownRef.current) {
      const rect = dropDownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = dropDownRef.current.scrollHeight;

      setDropDownPostion(spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }
  };

  useEffect(() => {
    if (isOpen) {
      adjustDropdownPosition();
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('resize', adjustDropdownPosition);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('resize', adjustDropdownPosition);
    };
  }, [isOpen]);

  return (
    <div ref={dropDownRef} className="relative w-full h-full">
      <button
        type="button"
        className={twMerge(
          `inline-flex justify-between items-center w-full h-full rounded-md border border-[#D1D3D9] px-4 py-[14px] bg-white text-sm leading-5 font-normal`,
          classname
        )}
        onClick={handleToggleDropdown}
      >
        {value ? (
          <p className={'text-[#36454F] whitespace-nowrap'}>{value}</p>
        ) : (
          <p className={`${placeholderStyles ? placeholderStyles : 'text-[#CCC8BF]'}`}>
            {placeholder}
          </p>
        )}

        {isOpen ? arrowUp : arrowDown}
      </button>

      <div
        className={twMerge(
          `${
            isOpen
              ? `${
                  // transition ||
                  dropdownPossition === 'top' ? 'bottom-full' : 'top-full'
                } opacity-100 visible `
              : `${dropdownPossition === 'top' ? 'bottom-0' : 'top-0'} opacity-0 invisible z-0`
          } z-50 flex flex-col gap-2  items-start transition-all duration-200 ease-in-out absolute left-0 mt-2 min-w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`,
          dropdownClass
        )}
      >
        {option.map((option, index) => {
          return (
            <button
              type="button"
              key={index}
              onClick={() => handleSelectedOption(option.value)}
              className="hover:bg-gray-100 w-full text-left px-4 py-2 text-prm-black"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomSelect;

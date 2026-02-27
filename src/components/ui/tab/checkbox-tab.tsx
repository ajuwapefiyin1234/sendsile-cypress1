import { ChangeEvent } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

interface ICheckbox {
  value?: string;
  classname?: string;
  id?: string;
  action?: (e: ChangeEvent<HTMLInputElement>) => void;
  isChecked: string;
}

export const CheckboxTab = ({ value, id, classname, action, isChecked }: ICheckbox) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        value={value}
        id={id}
        name=""
        className="hidden"
        checked={isChecked === id}
        onChange={action}
      />
      <label
        htmlFor={id}
        className={`border rounded flex items-center justify-center ${
          isChecked === id ? 'border-[#E4572E] bg-[#E4572E]' : 'border-[#EDEDED]'
        } ${classname ? classname : 'size-5'}`}
      >
        <IoMdCheckmark
          className={`text-base scale-75 ${
            isChecked === id ? 'text-white' : 'text-[#EDEDED]'
          } transition-all duration-150 cursor-pointer`}
        />
      </label>
    </div>
  );
};

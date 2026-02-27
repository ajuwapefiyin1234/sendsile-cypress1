import { ChangeEvent } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

interface ICheckbox {
  value?: string;
  classname?: string;
  id?: string;
  action?: (e: ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
}

export const Checkbox = ({ value, id, classname, action, isChecked }: ICheckbox) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        value={value}
        id={id}
        name=""
        className="hidden"
        checked={isChecked}
        onChange={action}
      />
      <label
        htmlFor={id}
        className={`border rounded w-4 h-4 flex items-start justify-center ${
          isChecked && 'border-[#E4572E]'
        } ${classname}`}
      >
        <IoMdCheckmark
          className={`text-base text-[#E4572E] ${
            isChecked ? 'scale-100' : 'scale-0'
          } transition-all duration-150 cursor-pointer`}
        />
      </label>
    </div>
  );
};

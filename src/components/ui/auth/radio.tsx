import { IoCheckmarkSharp } from 'react-icons/io5';

export const Radio = ({
  id,
  name,
  checked,
  onChange,
  required = true,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  required?: boolean;
}) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        name={name}
        className="hidden"
        checked={checked}
        onChange={onChange}
        required={required}
      />

      <label
        htmlFor={id}
        className={`w-4 h-4 ${
          checked ? 'bg-[#E4572E]' : 'border-[1.5px] border-[#D0D5DD]'
        } rounded-full flex items-center justify-center`}
      >
        <IoCheckmarkSharp
          className={`text-xs text-white ${
            checked ? 'scale-100' : 'scale-0'
          } transition-all duration-150 cursor-pointer`}
        />
      </label>
    </div>
  );
};

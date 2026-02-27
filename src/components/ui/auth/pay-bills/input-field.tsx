import { ChangeEvent } from 'react';

export const InputField = ({
  name,
  id,
  placeholder,
  onChange,
}: {
  type: string;
  name: string;
  id: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
}) => {
  return (
    <input
      className="w-full h-full focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] border border-[#D1D3D9] rounded-md py-[13px] px-4 bg-[#F7F7F7] outline-none text-base leading-[22px] text-prm-black font-normal"
      placeholder={placeholder}
      type="text"
      onChange={onChange}
      name={name}
      id={id}
      required
    />
  );
};

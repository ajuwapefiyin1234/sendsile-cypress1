import { UseFormRegister } from 'react-hook-form';

export const InputField = ({
  type,
  name,
  id,
  placeholder,
  showPassword,
  errorActive,
  register,
}: {
  type: string;
  name: string;
  id: string;
  placeholder?: string;
  showPassword?: boolean;
  errorActive?: boolean;
  register: UseFormRegister<any>;
}) => {
  return (
    <input
      {...register(name)!}
      className={`focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px]  w-full h-full ${
        errorActive ? 'border-prm-red ring-[#FFE6DC] ring-[4.5px]' : 'border-[#DEDEDE]'
      } border  rounded-md p-4 bg-white outline-none`}
      placeholder={placeholder}
      type={showPassword ? 'text' : type}
      name={name}
      id={id}
      required
    />
  );
};

import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export const Button = ({
  children,
  action,
  buttonStyle,
  disabled,
  type = 'button',
}: {
  children: string | ReactNode;
  action?: () => void;
  buttonStyle?: string;
  disabled?: boolean;
  type?: 'reset' | 'button' | undefined | 'submit';
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={action}
      className={twMerge(
        'mt-6 py-3 rounded-full bg-prm-black disabled:cursor-not-allowed disabled:opacity-80 text-white text-base leading-[22px] font-bold',
        buttonStyle
      )}
    >
      {children}
    </button>
  );
};

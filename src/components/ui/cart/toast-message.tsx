import { twMerge } from 'tailwind-merge';
import { useCartState } from '../../../services/store/cartStore';

export const ToastMessage = ({ message, classname }: { message: string; classname?: string }) => {
  const isToastOpen = useCartState((state) => state.isToastOpen);
  return (
    <div
      className={twMerge(
        `${
          isToastOpen ? 'visible opacity-100 scale-100' : 'scale-0 invisible opacity-0'
        } bg-[#089E5F] transition-all duration-200 px-5 fixed top-0 z-50 text-center text-white w-full
       py-[10px] font-normal text-base leading-5`,
        classname
      )}
    >
      {message}
    </div>
  );
};

export const updateToast = () => {
  useCartState.getState().updateToastOpen(true);
};

import { Fragment } from 'react/jsx-runtime';
import { FeedbackText } from '../feedback-text';
import { ButtonBack } from '../../buttons/button-back';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { InputField } from '../../auth/input-fields';
import { userProfileState } from '../../../../services/store/userProfileStore';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const pinSchema = z.object({
  oldPin: z.string().max(4),
  newPin: z.string().max(4),
  confirmPin: z.string().max(4),
});

type PinFormFields = z.infer<typeof pinSchema>;

export const UpdatePinScreen = ({
  setOpenOTPModal,
  setPinScreen,
  togglePinVisibilty,
  setTogglePinVisiblity,
}: {
  setOpenOTPModal: Dispatch<SetStateAction<string>>;
  setPinScreen: Dispatch<SetStateAction<boolean>>;
  togglePinVisibilty: {
    oldPin: boolean;
    newPin: boolean;
    confirmPin: boolean;
  };
  setTogglePinVisiblity: Dispatch<
    SetStateAction<{
      oldPin: boolean;
      newPin: boolean;
      confirmPin: boolean;
    }>
  >;
}) => {
  const [onSuccess, setSuccess] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PinFormFields>({
    resolver: zodResolver(pinSchema),
  });

  const axiosPrivate = useAxiosPrivate();
  const { userData } = userProfileState();

  const handleSixDigitOTP = async () => {
    setOpenOTPModal('sixDigitOtp');
    try {
      const res = await axiosPrivate.post('/resend/otp', {
        email: userData?.email,
      });
      if (res.status === 200) {
        toast.success(res?.data?.message);
      } else {
        throw new Error();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const onSubmit: SubmitHandler<PinFormFields> = async ({ confirmPin, newPin, oldPin }) => {
    try {
      const res = await axiosPrivate.post('/pin/change', {
        old_pin: oldPin,
        pin: newPin,
        confirm_pin: confirmPin,
      });

      if (res.statusText === 'OK') {
        reset();
        setSuccess(res.data.message);
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error: any) {
      setError('root', {
        message: error.response.data.message,
      });

      setTimeout(() => {
        setError('root', {
          message: '',
        });
      }, 3000);
    }
  };

  return (
    <div className="pt-[160px] lg:pt-[90px] px-4 sm:px-10 xl:px-0 pb-10 w-full xl:w-[824px] 2xl:w-[920px] mx-auto">
      <header className="flex justify-between">
        <div>
          <ButtonBack onClick={() => setPinScreen(false)} />
          <h1 className="pt-2 uppercase text-[15px] leading-[18px] text-prm-black">
            CHANGE TRANSACTION PIN
          </h1>
        </div>
        <FeedbackText />
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pt-7 pb-[129px] px-3 sm:px-0 flex flex-col items-center justify-center gap-6 mt-10 rounded-2xl mx-auto bg-white"
      >
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="new-pin" className="text-sm leading-5 font-normal text-[#36454F]">
            Old PIN
          </label>
          <Fragment>
            <div className="w-full relative">
              <InputField
                id="old-pin"
                name="oldPin"
                type="password"
                placeholder="*******"
                showPassword={togglePinVisibilty.oldPin}
                register={register}
              />
              <button
                type="button"
                onClick={() =>
                  setTogglePinVisiblity({
                    ...togglePinVisibilty,
                    oldPin: !togglePinVisibilty.oldPin,
                  })
                }
                className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
              >
                {togglePinVisibilty.oldPin ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.oldPin && (
              <span className=" text-prm-red text-sm text-left font-normal">
                {errors.oldPin.message}
              </span>
            )}
          </Fragment>
        </div>
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="new-pin" className="text-sm leading-5 font-normal text-[#36454F]">
            New PIN
          </label>
          <Fragment>
            <div className="w-full relative">
              <InputField
                id="new-pin"
                name="newPin"
                type="password"
                placeholder="*******"
                showPassword={togglePinVisibilty.newPin}
                register={register}
              />
              <button
                type="button"
                onClick={() =>
                  setTogglePinVisiblity({
                    ...togglePinVisibilty,
                    newPin: !togglePinVisibilty.newPin,
                  })
                }
                className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
              >
                {togglePinVisibilty.newPin ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.newPin && (
              <span className=" text-prm-red text-sm text-left font-normal">
                {errors.newPin.message}
              </span>
            )}
          </Fragment>
        </div>
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="new-password" className="text-sm leading-5 font-normal text-[#36454F]">
            Confirm PIN
          </label>
          <Fragment>
            <div className="w-full relative">
              <InputField
                id="confirm-pin"
                name="confirmPin"
                type="password"
                placeholder="*******"
                showPassword={togglePinVisibilty.confirmPin}
                register={register}
              />
              <button
                type="button"
                onClick={() =>
                  setTogglePinVisiblity({
                    ...togglePinVisibilty,
                    confirmPin: !togglePinVisibilty.confirmPin,
                  })
                }
                className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
              >
                {togglePinVisibilty.confirmPin ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPin && (
              <span className=" text-prm-red text-sm text-left font-normal">
                {errors.confirmPin.message}
              </span>
            )}

            <button
              onClick={handleSixDigitOTP}
              type="button"
              className="text-[#E4572E] font-normal text-sm leading-5 self-end"
            >
              Forgot pin?
            </button>
          </Fragment>
        </div>

        <button
          type="submit"
          className="mt-4 text-white bg-prm-black py-[10px] rounded-full w-full mobile:w-[307px]"
        >
          {isSubmitting ? <PulseLoader size={10} color="#ffffff" /> : 'Change PIN'}
        </button>

        {errors.root && (
          <span className="-mt-4 text-prm-red text-sm text-center font-normal">
            {errors.root.message}
          </span>
        )}
        {onSuccess && (
          <span className="-mt-4 text-green-600 text-sm text-center font-normal">{onSuccess}</span>
        )}
      </form>
    </div>
  );
};

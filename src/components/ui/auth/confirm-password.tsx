import { Fragment, useState } from 'react';
import { InputField } from './input-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { PulseLoader } from 'react-spinners';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/route-constants';

const schema = z
  .object({
    otp: z.string().min(4),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormField = z.infer<typeof schema>;

export const ConfirmPassword = () => {
  const [isHidden, setHidden] = useState(false);
  const [isHidden2, setHidden2] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<FormField>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const onSubmit: SubmitHandler<FormField> = async ({ password, confirmPassword, otp }) => {
    try {
      const res = await axiosPrivate.post('/password/reset/finalize', {
        email: localStorage.getItem('user_email'),
        password,
        password_confirmation: confirmPassword,
        otp,
      });

      if (res.status === 200) {
        toast.success(res?.data?.data?.message || 'Password was successfully reset', {
          toastId: 'confirmPasswordReset',
        });
        navigate(ROUTES.login);
        reset();
      } else {
        throw new Error();
      }
    } catch (error: any) {
      setError('root', {
        message: error?.response?.data?.message,
      });

      setTimeout(() => {
        setError('root', {
          message: '',
        });
      }, 3000);
    }
  };

  return (
    <>
      <h1 className=" pt-[137px] md:pt-[146px] pb-10 text-prm-black text-[28px] md:text-[26px] text-center leading-[34px] md:leading-[36px] font-medium">
        Set a new password
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-4 lg:px-0 flex flex-col gap-6 md:gap-3 w-full sm:w-[361px] mx-auto"
      >
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor="password"
            className=" font-normal text-[17px] md:text-[15px] leading-5 text-[#36454F]"
          >
            OTP
          </label>
          <Fragment>
            <div className="h-14 md:h-12 w-full relative">
              <InputField
                showPassword={isHidden}
                name="otp"
                type="text"
                id="otp"
                register={register}
              />
            </div>
            {errors.otp && (
              <span className="pb-3 text-prm-red text-xs font-normal">{errors.otp.message}</span>
            )}
          </Fragment>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor="password"
            className=" font-normal text-[17px] md:text-[15px] leading-5 text-[#36454F]"
          >
            New password
          </label>
          <Fragment>
            <div className="h-14 md:h-12 w-full relative">
              <InputField
                showPassword={isHidden}
                name="password"
                type="password"
                id="password"
                placeholder="*******"
                register={register}
              />
              <button
                onClick={() => setHidden(!isHidden)}
                className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
              >
                {isHidden ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <span className="pb-3 text-prm-red text-xs font-normal">
                {errors.password.message}
              </span>
            )}
          </Fragment>
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label
            htmlFor="password2"
            className=" font-normal text-[17px] md:text-[15px] leading-5 text-[#36454F]"
          >
            Confirm password
          </label>
          <Fragment>
            <div className="w-full h-14 md:h-12 relative">
              <InputField
                showPassword={isHidden2}
                name="confirmPassword"
                type="password"
                id="password2"
                placeholder="*******"
                register={register}
              />
              <button
                onClick={() => setHidden2(!isHidden2)}
                className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
              >
                {isHidden2 ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="pb-3 text-prm-red text-xs font-normal">
                {errors.confirmPassword.message}
              </span>
            )}
          </Fragment>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-10 md:mt-7 w-full py-4 disabled:opacity-80 disabled:cursor-not-allowed bg-prm-black text-white rounded-full text-base leading-[22.4px] font-bold"
        >
          {isSubmitting ? <PulseLoader size={10} color="#ffffff" /> : 'Continue'}
        </button>
        {errors.root && (
          <span className="mt-4 text-prm-red text-sm text-center font-normal">
            {errors.root.message}
          </span>
        )}
      </form>
    </>
  );
};

import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { InputField } from '../../auth/input-fields';
import { SubmitHandler, useForm } from 'react-hook-form';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonBack } from '../../buttons/button-back';
import { FeedbackText } from '../feedback-text';
import { z } from 'zod';

const passwordSchema = z
  .object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormFields = z.infer<typeof passwordSchema>;

export const UpdatePasswordScreen = ({
  setShowPasswordScreen,
  togglePasswordVisibility,
  setTogglePasswordVisiblity,
}: {
  setShowPasswordScreen: Dispatch<SetStateAction<boolean>>;
  togglePasswordVisibility: {
    oldPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
  };
  setTogglePasswordVisiblity: Dispatch<
    SetStateAction<{
      oldPassword: boolean;
      newPassword: boolean;
      confirmPassword: boolean;
    }>
  >;
}) => {
  const [onSuccess, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<PasswordFormFields>({
    resolver: zodResolver(passwordSchema),
  });

  const axiosPrivate = useAxiosPrivate();

  const onSubmit: SubmitHandler<PasswordFormFields> = async ({
    confirmPassword,
    newPassword,
    oldPassword,
  }) => {
    try {
      const res = await axiosPrivate.post('/password/change', {
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
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
          <ButtonBack onClick={() => setShowPasswordScreen(false)} />
          <h1 className="pt-2 uppercase text-[15px] leading-[18px] text-prm-black">
            Update password
          </h1>
        </div>
        <FeedbackText />
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="py-7 px-3 sm:px-0 flex flex-col items-center justify-center gap-6 mt-10 rounded-2xl mx-auto bg-white"
      >
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="oldPassword" className="text-sm leading-5 font-normal text-[#36454F]">
            Old password
          </label>
          <Fragment>
            <div className="w-full relative">
              <InputField
                id="oldPassword"
                name="oldPassword"
                type="password"
                placeholder="*******"
                showPassword={togglePasswordVisibility.oldPassword}
                register={register}
              />
              <button
                type="button"
                onClick={() =>
                  setTogglePasswordVisiblity({
                    ...togglePasswordVisibility,
                    oldPassword: !togglePasswordVisibility.oldPassword,
                  })
                }
                className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
              >
                {togglePasswordVisibility.oldPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.oldPassword && (
              <span className=" text-prm-red text-sm text-left font-normal">
                {errors.oldPassword.message}
              </span>
            )}
          </Fragment>
        </div>
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="new-password" className="text-sm leading-5 font-normal text-[#36454F]">
            New password
          </label>
          <Fragment>
            <div className="w-full relative">
              <InputField
                id="new-password"
                name="newPassword"
                type="password"
                placeholder="*******"
                showPassword={togglePasswordVisibility.newPassword}
                register={register}
              />
              <button
                type="button"
                onClick={() =>
                  setTogglePasswordVisiblity({
                    ...togglePasswordVisibility,
                    newPassword: !togglePasswordVisibility.newPassword,
                  })
                }
                className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
              >
                {togglePasswordVisibility.newPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.newPassword && (
              <span className=" text-prm-red text-sm text-left font-normal">
                {errors.newPassword.message}
              </span>
            )}
          </Fragment>
        </div>
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label
            htmlFor="confirm-password"
            className="text-sm leading-5 font-normal text-[#36454F]"
          >
            Confirm password
          </label>
          <Fragment>
            <div className="w-full relative">
              <InputField
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="*******"
                showPassword={togglePasswordVisibility.confirmPassword}
                register={register}
              />
              <button
                type="button"
                onClick={() =>
                  setTogglePasswordVisiblity({
                    ...togglePasswordVisibility,
                    confirmPassword: !togglePasswordVisibility.confirmPassword,
                  })
                }
                className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
              >
                {togglePasswordVisibility.confirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className=" text-prm-red text-sm text-left font-normal">
                {errors.confirmPassword.message}
              </span>
            )}
          </Fragment>
        </div>

        <button
          type="submit"
          className="mt-4 text-white bg-prm-black py-[10px] rounded-full w-full mobile:w-[307px]"
        >
          Update password
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

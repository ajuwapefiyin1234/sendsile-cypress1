import { Link } from 'react-router-dom';
import { InputField } from '../../components/ui/auth/input-fields';
import { Container } from '../../components/global/Container';
import { ButtonBack } from '../../components/ui/buttons/button-back';
import { Fragment, useState } from 'react';
import { ConfirmPassword } from '../../components/ui/auth/confirm-password';
import { ROUTES } from '../../utils/route-constants';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PulseLoader } from 'react-spinners';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';

const schema = z.object({
  email: z.string().email(),
});

type FormField = z.infer<typeof schema>;

const ForgotPassword = () => {
  const [showComfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<FormField>({
    resolver: zodResolver(schema),
  });

  const axiosPrivate = useAxiosPrivate();

  const onSubmit: SubmitHandler<FormField> = async ({ email }) => {
    try {
      const res = await axiosPrivate.post('/password/reset/initiate', {
        email,
      });

      if (res.status === 200) {
        setShowConfirmPassword(true);
        toast.success(res?.data?.data?.message, {
          toastId: 'forgotPasswordId',
        });
        localStorage.setItem('user_email', email);
        reset();
      }
    } catch (error: any) {
      setError('email', {
        message: error?.response?.data?.message,
      });

      setTimeout(() => {
        setError('email', {
          message: '',
        });
      }, 3000);
    }
  };

  return (
    <section className="bg-[#FCFAF6] min-h-screen w-full">
      <Container>
        <div className="top-[47px] left-4 absolute md:top-[146px] md:left-[100px]">
          <ButtonBack />
        </div>
        {showComfirmPassword ? (
          <ConfirmPassword />
        ) : (
          <>
            <div className="px-4 lg:px-0 w-full sm:w-[361px] mx-auto text-center">
              <h1 className="pt-[137px] md:pt-[146px] text-prm-black text-[28px] md:text-[26px] text-center leading-[34px] md:leading-[36px] font-medium">
                Forgot your password?
              </h1>
              <p className="pt-4 text-[17px] leading-6 md:text-[15px] md:leading-5 text-[#36454F] text-center">
                Experiencing difficulty logging in? provide your email address, and we will send you
                a link to reset your password.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-4 lg:px-0 mt-10 w-full sm:w-[361px] mx-auto"
            >
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className=" font-normal text-sm md:text-[15px] leading-5 text-[#36454F]"
                >
                  Email address
                </label>
                <Fragment>
                  <div className="h-[48px] w-full">
                    <InputField name="email" type="email" id="email" register={register} />
                  </div>
                  {errors.email && (
                    <span className=" text-prm-red text-xs font-normal">
                      {errors.email.message}
                    </span>
                  )}
                </Fragment>
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className=" w-full py-4 disabled:opacity-80 disabled:cursor-not-allowed bg-prm-black text-white rounded-full text-base leading-[22.4px] font-bold"
                >
                  {isSubmitting ? <PulseLoader size={10} color="#ffffff" /> : 'Reset password'}
                </button>

                <p className="text-center pt-4 font-normal text-[#536878] text-base md:text-sm leading-[22px] md:leading-5">
                  Remember password?{' '}
                  <Link className="text-[#E4572E]" to={ROUTES.login}>
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </Container>
    </section>
  );
};

export default ForgotPassword;

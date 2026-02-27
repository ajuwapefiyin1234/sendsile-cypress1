import { Link, useNavigate } from 'react-router-dom';
import { InputField } from '../../components/ui/auth/input-fields';
import { Dispatch, FormEvent, Fragment, SetStateAction, useEffect, useState } from 'react';
import { Google } from '../../components/svgs/auth/google';
import { Container } from '../../components/global/Container';
import { ROUTES } from '../../utils/route-constants';
import OTPInput from 'react-otp-input';
import '../../styles/packages/react-otp-input.css';
import { useGoogleLogin } from '@react-oauth/google';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PulseLoader } from 'react-spinners';
import { userProfileState } from '../../services/store/userProfileStore';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { useCartState, useCartStore } from '../../services/store/cartStore';

const schema = z.object({
  password: z.string(),
  email: z.string().email(),
});

type FormFields = z.infer<typeof schema>;

const Login = () => {
  const [isHidden, setHidden] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState<null | string>(null);

  const navigate = useNavigate();
  const { setUserData } = userProfileState();
  const updateCartOpen = useCartState((state) => state.updateIsCartOpen);
  const { setIsAuthenticated, mergeGuestCart, isAuthenticated, syncCartWithDatabase } =
    useCartStore();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const axiosInstance = useAxiosPrivate();
  const fromCart = sessionStorage.getItem('fromCart');
  const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');

  const onSubmit: SubmitHandler<FormFields> = async ({ email, password }) => {
    try {
      const res = await axiosInstance.post(
        '/login',
        { email, password },
        { headers: { device_uid: email } }
      );

      if (res.status !== 200) {
        setError('root', {
          message: res?.data?.message || 'An error occurred',
        });
        return;
      }
      const { token, email: userEmail, name, refresh_token, balance, phone, photo } = res.data.data;

      if (res.status === 200) {
        if (res.data.data['2fa_required']) {
          localStorage.setItem('temp_token', res?.data?.data?.temp_token);
          setShowOtpScreen(true);
          return;
        } else {
          handleSuccessfulLogin(
            token,
            refresh_token,
            {
              name,
              phone,
              email: userEmail,
              photo,
              balance,
            },
            'credentials'
          );
        }
      }
    } catch (err: any) {
      setError('root', {
        message: err?.response?.data?.message,
      });
    }
  };

  const handleSuccessfulLogin = async (
    token: string,
    refresh_token: string,
    userData: any,
    loginMethod: string
  ) => {
    localStorage.setItem('__user_access', token);
    refresh_token && localStorage.setItem('__user_refresh', refresh_token);
    localStorage.setItem('login_method', loginMethod);
    setIsAuthenticated(true);
    setUserData(userData);
    await mergeGuestCart();
    await syncCartWithDatabase();
    reset();

    if (fromCart === 'true') {
      navigate(ROUTES.checkout);
      updateCartOpen(false);
    } else if (redirectAfterLogin) {
      navigate(redirectAfterLogin);
      // sessionStorage.removeItem('redirectAfterLogin');
    } else {
      navigate(ROUTES.dashboard);
    }
  };

  const handleGoogleAuth = async (tokenResponse: any) => {
    try {
      if (tokenResponse?.access_token) {
        const res = await axiosInstance.post('/google/auth', {
          access_token: tokenResponse?.access_token,
        });
        const { name, phone, email: userEmail, photo, balance } = res.data.data;
        setUserData({
          name,
          phone,
          email: userEmail,
          photo,
          balance,
        });
        handleSuccessfulLogin(
          res?.data?.data?.token,
          '',
          {
            name,
            phone,
            email: userEmail,
            photo,
            balance,
          },
          'google'
        );
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleAuth(tokenResponse),
    onError: (error) => toast.error(error.error_description),
  });

  useEffect(() => {
    const handleAuthentication = async () => {
      if (isAuthenticated) {
        await mergeGuestCart();
        await syncCartWithDatabase();
        if (fromCart === 'true') {
          navigate(ROUTES.checkout);
          updateCartOpen(false);
        } else {
          navigate(ROUTES.dashboard);
        }
      }
    };

    handleAuthentication();
  }, [isAuthenticated, fromCart, mergeGuestCart, navigate, updateCartOpen, syncCartWithDatabase]);

  return (
    <section className="bg-[#FCFAF6] min-h-screen w-full">
      {showOtpScreen ? (
        <OtpScreen otp={otp} setOTP={setOtp} />
      ) : (
        <Container>
          <h1 className="pt-[137px] md:pt-[146px] pb-10 text-prm-black text-[28px] md:text-[26px] text-center leading-[34px] md:leading-[36px] font-medium">
            Login to your account
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-4 lg:px-0 flex flex-col gap-6 md:gap-3 w-full mobile:w-[361px] mx-auto"
          >
            <div className="flex flex-col w-full gap-2">
              <label
                htmlFor="email"
                className="font-normal text-sm md:text-[17px] leading-5 text-[#36454F]"
              >
                Email address
              </label>
              <Fragment>
                <div className="w-full h-12">
                  <InputField
                    name="email"
                    type="email"
                    id="email"
                    register={register}
                    errorActive={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <span className="pb-3 text-xs font-normal text-prm-red">
                    {errors.email.message}
                  </span>
                )}
              </Fragment>
            </div>
            <div className="flex flex-col w-full gap-2">
              <label
                htmlFor="password"
                className="font-normal text-sm md:text-[17px] leading-5 text-[#36454F]"
              >
                Password
              </label>
              <Fragment>
                <div className="relative w-full h-12">
                  <InputField
                    showPassword={isHidden}
                    name="password"
                    type="password"
                    id="password"
                    placeholder="*******"
                    register={register}
                  />
                  <button
                    type="button"
                    onClick={() => setHidden(!isHidden)}
                    className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
                  >
                    {isHidden ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <span className="pb-3 text-xs font-normal text-prm-red">
                    {errors.password.message}
                  </span>
                )}
              </Fragment>
            </div>

            <div className="self-end -mt-2 md:-mt-3">
              <Link
                to={ROUTES.forgotPassword}
                className="text-[#E4572E] font-normal text-sm leading-5"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex flex-col gap-8 mt-10 md:mt-7">
              <button
                type="submit"
                disabled={isSubmitting}
                className=" w-full py-4 disabled:opacity-80 disabled:cursor-not-allowed bg-prm-black text-white rounded-full text-base leading-[22.4px] font-bold"
              >
                {isSubmitting ? <PulseLoader size={10} color="#ffffff" /> : 'Continue'}
              </button>
              {errors.root && (
                <span className="-mt-4 font-medium text-center text-prm-red">
                  {errors.root.message}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="border-t-[0.5px] w-full md:w-[162px] border-[#D1D3D9]"></div>
                <p className="text-[#36454F] text-sm leading-5 font-normal">OR</p>
                <div className="border-t-[0.5px] w-full md:w-[162px] border-[#D1D3D9]"></div>
              </div>

              <button
                onClick={() => handleGoogleSignIn()}
                type="button"
                className="flex items-center justify-center gap-2 border border-[#D1D3D9] w-full py-[14px] bg-white text-base text-[#536878] rounded-full md:text-sm leading-[20px] font-normal"
              >
                <Google />
                <span>Continue with google</span>
              </button>
            </div>
          </form>
        </Container>
      )}
    </section>
  );
};

export default Login;

const OtpScreen = ({
  otp,
  setOTP,
}: {
  otp: string | null;
  setOTP: Dispatch<SetStateAction<string | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const { setUserData } = userProfileState();

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleOnCompleteOtpInput = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axiosPrivate.post('/verify/2fa-totp', {
        '2fa_code': otp,
        temp_token: localStorage.getItem('temp_token'),
      });

      const { token, email, name, refresh_token, balance, phone, photo } = res.data.data;

      if (res.status === 200) {
        localStorage.setItem('__user_access', token);
        localStorage.setItem('__user_refresh', refresh_token);
        localStorage.setItem('login_method', 'credentials');
        useCartStore.getState().setIsAuthenticated(true);
        await useCartStore.getState().mergeGuestCart();
        navigate(ROUTES.dashboard);
        setUserData({
          name,
          phone,
          email,
          photo,
          balance,
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="pt-[146px] md:pt-[146px] pb-10 text-prm-black text-[28px] md:text-[26px] text-center leading-[34px] md:leading-[36px] font-medium">
        OTP
      </h1>
      <form
        onSubmit={handleOnCompleteOtpInput}
        className="px-4 lg:px-0 w-full mobile:w-[361px] mx-auto"
      >
        <p className="pb-4 text-base leading-6 text-center font-normal text-[#101828]">
          Enter the 6-digit code on your Authenticator App
        </p>
        <OTPInput
          value={otp!}
          onChange={setOTP}
          numInputs={6}
          shouldAutoFocus={true}
          inputType="tel"
          renderInput={(props) => <input {...props} />}
          inputStyle="otp-input-2"
          containerStyle={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
          }}
        />

        <button
          type="submit"
          className="mt-16 w-full py-4 bg-prm-black text-white rounded-full text-base leading-[22.4px] font-bold"
        >
          {loading ? <PulseLoader size={10} color="#ffffff" /> : 'Submit'}
        </button>
      </form>
    </div>
  );
};

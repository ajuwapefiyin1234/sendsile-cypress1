import { Container } from '../../components/global/Container';
import { InputField } from '../../components/ui/auth/input-fields';
import { Fragment, useState } from 'react';
import { Google } from '../../components/svgs/auth/google';
import { Link, useNavigate } from 'react-router-dom';
import { faqData } from '../../utils/constants';
import { Accordion } from '../../components/ui/Accordion';

import PhoneInput from 'react-phone-input-2';
import '../../styles/packages/phoneInput.css';
import { ROUTES } from '../../utils/route-constants';
import { RegisterImage } from '../../assets/images';

import { axiosInstance } from '../../services/axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PulseLoader } from 'react-spinners';
import { PhoneNumberModal } from '../../components/modals';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const schema = z
  .object({
    fullname: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    email: z.string().email(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormFields = z.infer<typeof schema>;

const SignUp = () => {
  const [isHidden, setHidden] = useState(true);
  const [isConfirmHidden, setConfirmHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [showNumberModal, setNumberModal] = useState(false);
  const [googleToken, setGoogleToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const locationData = JSON.parse(localStorage.getItem('location') || '{}');
  const location = locationData?.state?.location || null; // Provide a fallback value

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const handleActiveTab = (index: number) => {
    setActiveTab((prev) => (prev === index ? null : index));
  };

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async ({
    confirmPassword,
    email,
    fullname,
    password,
  }) => {
    try {
      const res = await axiosInstance.post('/register', {
        name: fullname,
        email,
        password,
        phone_number: phoneNumber,
        password_confirmation: confirmPassword,
        country: location || 'Nigeria',
        channel: 'web',
        device_uid: email,
        mac_address: email,
        role_type: 'user',
      });

      if (res.statusText === 'OK') {
        const email = res?.data?.data?.email;
        localStorage.setItem('user_email', email);
        navigate(ROUTES.emailVerification);
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      if (phoneNumber?.length && googleToken) {
        const res = await axiosInstance.post('/google/auth', {
          access_token: googleToken,
          phone_number: phoneNumber,
        });

        localStorage.setItem('__user_access', res?.data?.data?.token);
        localStorage.setItem('login_method', 'credentials');
        navigate(ROUTES.dashboard);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (tokenResponse: any) => {
    setNumberModal(true);
    if (tokenResponse?.access_token) {
      setGoogleToken(tokenResponse?.access_token);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleAuth(tokenResponse),
    onError: (error) => toast.error(error.error_description),
  });

  return (
    <div className="bg-[#FCFAF6]">
      <Container>
        <section className="pt-[151px] px-4 lg:px-[100px]">
          <div className="flex flex-col md:flex-row items-start gap-5 lg:gap-10 xl:gap-[131px]">
            <img
              className="rounded-[20px] w-full md:w-1/2 xl:w-[628px] md:h-[525px] object-cover object-center"
              src={RegisterImage}
              alt="register image"
            />
            <div className="w-full md:w-1/2 xl:w-[361px]">
              <h1 className="text-prm-black text-center font-medium text-[28px] md:text-[26px] leading-[36px]">
                Let’s sign you up first
              </h1>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="pt-10 w-full flex flex-col space-y-3"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="fullname"
                    className="text-[17px] md:text-sm leading-5 text-[#36454F] font-normal"
                  >
                    Full name
                  </label>
                  <div className="h-14 md:h-12 w-full">
                    <InputField
                      id="fullname"
                      name="fullname"
                      type="text"
                      register={register}
                      errorActive={!!errors.fullname}
                    />
                  </div>
                  {errors.fullname && (
                    <span className="pb-3 text-prm-red text-xs font-normal">
                      {errors?.fullname.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-[17px] md:text-sm leading-5 text-[#36454F] font-normal"
                  >
                    Email address
                  </label>

                  <Fragment>
                    <div className="h-14 md:h-12 w-full">
                      <InputField
                        id="email"
                        name="email"
                        type="email"
                        register={register}
                        errorActive={!!errors.email}
                      />
                    </div>
                    {errors.email && (
                      <span className="pb-3 text-prm-red text-xs font-normal">
                        {errors?.email.message}
                      </span>
                    )}
                  </Fragment>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="phonenumber"
                    className="text-[17px] md:text-sm leading-5 text-[#36454F] font-normal"
                  >
                    Phone number
                  </label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    masks={{
                      ng: '... ... ....',
                      gb: '.. .... ....',
                      us: '... ... ....',
                      ca: '... ... ....',
                    }}
                    placeholder=""
                    containerClass="sign-up-phone-input"
                    buttonClass="phone-input-drop"
                    onlyCountries={['ng', 'gb', 'us', 'ca']}
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      borderRight: 'none',
                    }}
                    country={'ng'}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <label
                      htmlFor="phone"
                      className="text-[17px] md:text-sm leading-5 text-[#36454F] font-normal"
                    >
                      Password
                    </label>

                    <Fragment>
                      <div className="h-14 md:h-12 w-full relative">
                        <InputField
                          id="password"
                          name="password"
                          type="password"
                          placeholder="*******"
                          showPassword={!isHidden}
                          errorActive={!!errors.password}
                          register={register}
                        />
                        <button
                          type="button"
                          onClick={() => setHidden(!isHidden)}
                          className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
                        >
                          {isHidden ? 'Show' : 'Hide'}
                        </button>
                      </div>
                      {errors.password && (
                        <span className="pb-3 text-prm-red text-xs font-normal">
                          {errors?.password.message}
                        </span>
                      )}
                    </Fragment>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-[17px] md:text-sm leading-5 text-[#36454F] font-normal"
                    >
                      Confirm password
                    </label>

                    <Fragment>
                      <div className="h-14 md:h-12 w-full relative">
                        <InputField
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="*******"
                          showPassword={!isConfirmHidden}
                          register={register}
                          errorActive={!!errors?.confirmPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setConfirmHidden(!isConfirmHidden)}
                          className="font-normal text-xs absolute top-1/2 -translate-y-1/2 right-4 border-b border-[#36454F] text-[#36454F]"
                        >
                          {isConfirmHidden ? 'Show' : 'Hide'}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="pb-3 text-prm-red text-xs font-normal">
                          {errors?.confirmPassword.message}
                        </span>
                      )}
                    </Fragment>
                  </div>
                </div>
                <div className="mt-7 flex flex-col gap-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-4 md:py-3 bg-prm-black disabled:opacity-90 disabled:cursor-not-allowed rounded-full text-white font-bold text-base leading-[22.5px]"
                  >
                    {isSubmitting ? <PulseLoader size={10} color="#ffffff" /> : 'Continue'}
                  </button>

                  {errors.root && (
                    <span className="-mt-4 text-prm-red text-sm text-center font-normal">
                      {errors.root.message}
                    </span>
                  )}

                  <div className="flex gap-2 items-center">
                    <div className="border-t-[0.5px] w-full xl:w-[162px] border-[#D1D3D9]"></div>
                    <p className="text-[#36454F] text-sm leading-5 font-normal">OR</p>
                    <div className="border-t-[0.5px] w-full xl:w-[162px] border-[#D1D3D9]"></div>
                  </div>
                  <button
                    onClick={() => handleGoogleSignIn()}
                    type="button"
                    className="flex items-center justify-center gap-2 border border-[#D1D3D9] w-full py-4 md:py-[14px] bg-white text-[#536878] rounded-full text-base md:text-sm leading-[20px] font-normal"
                  >
                    <Google />
                    <span>Continue with google</span>
                  </button>
                </div>

                {/* Terms and conditions */}
                <p className="pt-4 md:pt-5 text-[#36454F] text-center mx-auto text-base lg:text-xs leading-4 font-normal">
                  By continuing, I agree to the{' '}
                  <Link to={'/'} className="text-[#E4572E] font-medium">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to={'/'} className="text-[#E4572E] font-medium">
                    Privacy Policy
                  </Link>{' '}
                </p>
              </form>
            </div>
          </div>
        </section>
        <section className="pt-12 lg:pt-0 pb-32 md:pb-[111px] px-4 lg:px-[100px]">
          <div className="border-b border-[#E6E3DD] pb-10">
            <h1 className="pb-3 text-[34px] leading-10 font-medium text-prm-black">
              Frequently asked questions
            </h1>
            <p className="text-lg leading-[25px] font-normal text-[#36454F]">
              Explore answers without the need to pose the questions.
            </p>
          </div>

          <div className="pt-6 md:pt-[43px] flex flex-col gap-4">
            {faqData.map((item, index) => {
              return (
                <Accordion
                  key={index}
                  classname="px-6 py-5 bg-[#FFFCFB]"
                  titleStyle="text-[15px] md:text-[17px] leading-[21px] md:leading-[23.8px]"
                  title={item.title}
                  content={item.content}
                  onClick={() => handleActiveTab(index)}
                  isActive={activeTab === index}
                />
              );
            })}
          </div>
        </section>

        <PhoneNumberModal
          setModal={setNumberModal}
          showNumberModal={showNumberModal}
          handleSubmit={signInWithGoogle}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          loading={loading}
        />
      </Container>
    </div>
  );
};

export default SignUp;

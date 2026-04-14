import {
  forgotpasswordSchema,
  newPasswordSchema,
} from '@/lib/validations/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ROUTE } from '@/routes';
import images from '@/assets/images';
import DrawerDialog from '@/components/DrawerDialog';
import { Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [forgetPasswordStep, setForgetPasswordStep] = useState('email');
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(
      forgetPasswordStep === 'email' ? forgotpasswordSchema : newPasswordSchema
    ),
    mode: 'onChange', // Trigger validation on change
    reValidateMode: 'onChange', // Revalidate on change
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [isPasswordOpen, toggleEyePass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationModal, setEmailVerificationModal] = useState(false);

  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    if (forgetPasswordStep === 'email' && values) {
      setTimeout(() => {
        setForgetPasswordStep('setPassword');
        setIsLoading(false);
        setEmailVerificationModal(true);
      }, 2000);
    } else if (
      forgetPasswordStep === 'setPassword' &&
      values?.newPassword === values?.confirmPassword
    ) {
      setTimeout(() => {
        sessionStorage.setItem('user', 'userGottenBack');
        setIsLoading(false);
        navigate(ROUTE.dashboardHome);
      }, 4000);
    }
  }

  return (
    <div className="flex min-h-screen items-center w-full bg-[#FFFCF7] ">
      <DrawerDialog
        open={emailVerificationModal}
        setOpen={setEmailVerificationModal}
        title="Email verification"
      >
        <div className="flex gap-8 flex-col">
          <p className="text-[15px] leading-[21px] text-[#36454F] grow">
            We&apos;ve sent an email with a verification link to
            tan*****@gmail.com. Please check your email and follow the
            instructions.
          </p>

          <p className="cursor-pointer font-bold text-[15px] leading-[21px] text-[#E4572E] hover:underline">
            Resend link
          </p>
        </div>
      </DrawerDialog>

      <div className="flex flex-col lg:flex-row items-start justify-center w-full px-4 lg:px-24 gap-16 lg:gap-1">
        <div
          onClick={() => navigate(ROUTE.login)}
          className="flex cursor-pointer items-center justify-center gap-2 p-0 "
        >
          <MdOutlineKeyboardBackspace className="text-[17px] leading-[24px] text-[#E4572E] " />
          <p className="font-medium text-[17px] leading-[24px] text-[#E4572E] ">
            Go back
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-14 w-full lg:w-fit lg:grow"
          >
            <div className="flex flex-col items-center p-0 gap-10  w-full max-w-[361px]">
              <h1 className="font-medium text-[26px] leading-[36px] flex items-center text-[#00070C]">
                Forgot your password?
              </h1>
              {forgetPasswordStep === 'email' && (
                <p className="text-[15px] leading-[21px] items-center text-[#36454F]">
                  Experiencing difficulty logging in? Provide your email
                  address, and we will send you a link to reset your password.
                </p>
              )}

              <div className="flex flex-col items-start p-0 gap-5 w-full">
                {forgetPasswordStep === 'email' && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full gap-2">
                        <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                          Email address
                        </FormLabel>
                        <FormControl className="w-full ">
                          <Input
                            className=" border border-[#DEDEDE] w-full bg-white rounded-[6px]"
                            placeholder="example@gmail.com"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {forgetPasswordStep === 'setPassword' && (
                  <>
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="w-full gap-2">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            New Password
                          </FormLabel>
                          <FormControl className="w-full">
                            <div className="relative w-full">
                              <Input
                                type={isPasswordOpen ? 'text' : 'password'}
                                className=" border border-[#DEDEDE] w-full bg-white rounded-[6px]  pr-10" // Add padding to the right to make space for the icon
                                placeholder="&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;"
                                {...field}
                              />
                              <div
                                onClick={() => toggleEyePass((e) => !e)}
                                className="cursor-pointer text-xl text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {isPasswordOpen ? (
                                  <p className="text-[12px] leading-[17px] text-[#36454F] hover:underline">
                                    Hide
                                  </p>
                                ) : (
                                  <p className="text-[12px] leading-[17px] text-[#22B378] hover:underline">
                                    Show
                                  </p>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="w-full gap-2">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            Confirm password
                          </FormLabel>
                          <FormControl className="w-full">
                            <div className="relative w-full">
                              <Input
                                type={isPasswordOpen ? 'text' : 'password'}
                                className=" border border-[#DEDEDE] w-full bg-white rounded-[6px]  pr-10" // Add padding to the right to make space for the icon
                                placeholder="&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;"
                                {...field}
                              />
                              <div
                                onClick={() => toggleEyePass((e) => !e)}
                                className="cursor-pointer text-xl text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {isPasswordOpen ? (
                                  <p className="text-[12px] leading-[17px] text-[#36454F] hover:underline">
                                    Hide
                                  </p>
                                ) : (
                                  <p className="text-[12px] leading-[17px] text-[#22B378] hover:underline">
                                    Show
                                  </p>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center p-0 gap-4 w-full max-w-[361px]">
              <Button
                type="submit"
                disabled={isLoading}
                className="py-3 px-4 h-[46px] rounded-[32px] bg-[#00070C] font-bold text-[16px] leading-[22px] items-center text-white w-full max-w-[453px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : forgetPasswordStep === 'email' ? (
                  'Reset password'
                ) : (
                  'Continue'
                )}
              </Button>
              {forgetPasswordStep === 'email' && (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-[16px] leading-[22px]  items-center text-black">
                    Remember password?{' '}
                    <Link to={ROUTE.login}>
                      <span className="font-bold text-[16px]  text-[#E4572E] hover:underline">
                        Login
                      </span>
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      <div className="fixed bottom-0 left-0 lg:block hidden">
        <img src={images.SendsileLogo} className="w-[123px] h-[117px]" />
      </div>
    </div>
  );
};

export default ForgotPassword;

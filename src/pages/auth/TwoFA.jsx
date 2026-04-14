import { useForm } from 'react-hook-form';

import { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { twoFASchema } from '@/lib/validations/loginSchema';
import { toast } from 'sonner';
import { useStore } from '@/store/store';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import images from '@/assets/images';
import { Loader2 } from 'lucide-react';

const TwoFA = () => {
  const { verify2faCode } = useStore((state) => state.authActions);
  const { user } = useStore((state) => state.auth);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(twoFASchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      code: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  async function onSubmit(values) {
    if (!user?.temp_token) {
      toast.error('An error occurred, try logging in again');
      navigate(ROUTE.login);
      return;
    }
    setIsLoading(true);

    const formData = {
      temp_token: user?.temp_token,
      '2fa_code': values.code,
    };
    const result = await verify2faCode(formData);
    // console.log(result);
    if (result) {
      window.location.href = ROUTE.dashboardHome;
    }

    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center w-full bg-[#FFFCF7]">
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
            <div className="flex flex-col items-center p-0 gap-10 w-full max-w-[453px]">
              <h1 className="font-medium text-[26px] leading-[36px] flex items-center text-[#00070C]">
                Two-Factor Authentication
              </h1>
              <div className="flex flex-col items-start p-0 gap-5 w-full">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="w-full gap-2">
                      <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                        Verification Code
                      </FormLabel>
                      <FormControl className="w-full">
                        <Input
                          type="text"
                          className="border border-[#DEDEDE] w-full bg-white rounded-[6px]"
                          placeholder="Enter your code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center p-0 gap-4 w-full">
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
                ) : (
                  'Verify Code'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="fixed bottom-0 left-0 lg:block hidden">
        <img
          src={images.SendsileLogo}
          className="w-[123px] h-[117px]"
          alt="vendor logo"
        />
      </div>
    </div>
  );
};

export default TwoFA;

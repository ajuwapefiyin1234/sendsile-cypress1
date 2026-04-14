import { useForm } from 'react-hook-form';
// import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useStore } from '@/store/store';
import { Loader2 } from 'lucide-react';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsAdmin } = useStore((state) => state.authActions);

  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');

  const form = useForm({
    // resolver: zodResolver(emailPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isPasswordOpen, toggleEyePass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //   function showToastAndRedirect(redirectUrl, delay = 1500) {
  //     setTimeout(() => {
  //       window.location.href = redirectUrl;
  //     }, delay);
  //   }
  async function onSubmit(values) {
    setIsLoading(true);

    try {
      const user = isSuperAdmin
        ? await loginAsAdmin(values)
        : await login(values);

      if (!user) {
        throw new Error('Login failed: No user data returned');
      }

      if (user['2fa_required']) {
        navigate(ROUTE.twofaPage);
        return;
      }

      const lastVisitedRoute = localStorage.getItem('lastVisitedRoute');
      let targetRoute;

      if (user.role === 'super-admin') {
        targetRoute =
          lastVisitedRoute && lastVisitedRoute.includes('super-admin')
            ? lastVisitedRoute
            : SUPER_ADMIN_ROUTES.dashboard;
      } else {
        targetRoute =
          lastVisitedRoute && !lastVisitedRoute.includes('super-admin')
            ? lastVisitedRoute
            : ROUTE.dashboardHome;
      }

      localStorage.removeItem('lastVisitedRoute');
      navigate(targetRoute);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center w-full bg-[#FFFCF7] ">
      <div className="flex flex-col lg:flex-row items-start justify-center w-full px-4 lg:px-24 gap-16 lg:gap-1">
        <div
          onClick={() => navigate(ROUTE.dashboardHome)}
          className="w-[145px] h-[26px] absolute top-[22px] left-[16px] lg:left-[100px]"
        >
          <img src={images.longLogo} className="object-contain" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center gap-14 w-full lg:w-fit lg:grow"
          >
            <div className="flex flex-col items-center p-0 gap-10  w-full max-w-[453px]">
              <h1 className="font-medium text-[26px] leading-[36px] flex items-center text-[#00070C]">
                {isSuperAdmin ? 'Login as an admin' : 'Login as a partner'}
              </h1>
              <div className="flex flex-col items-start p-0 gap-5 w-full">
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full gap-2">
                      <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                        Password
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
                <Link
                  to={ROUTE.forgotPassword}
                  className="items-end hover:underline flex self-end cursor-pointer"
                >
                  <p className="text-[14px] leading-[20px] text-[#00070C] items-center">
                    Forgot password?
                  </p>
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center p-0 gap-4 w-full ">
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
                  'Continue'
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

export default Login;

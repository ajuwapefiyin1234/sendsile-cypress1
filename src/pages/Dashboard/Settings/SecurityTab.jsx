import images from '@/assets/images';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '@/lib/validations/loginSchema';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/FileUploader';
import PropTypes from 'prop-types';
import { convertFileToUrl, resizeImage } from '@/lib/reusable';
import { useStore } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import { changePassword, updateAvatar } from '@/utils/queries';
import TwoFaForm from './TwoFaForm';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const NoFile = () => (
  <div className="box-border flex flex-col items-center justify-center p-4 gap-2 border border-[#DEDEDE] rounded-[6px]">
    <img src={images.gallary} className="w-[70px] h-[70px]" />
    <p className="font-medium text-[14px] leading-[20px] text-center text-[#E4572E]">
      Upload or drag one item here
    </p>
  </div>
);

const FilePreview = ({ files }) => (
  <div className="box-border flex flex-col items-center justify-center p-4 gap-2 border border-[#DEDEDE] rounded-[6px] h-[130px]">
    <img
      src={convertFileToUrl(files)}
      alt="upload image"
      className="overflow-hidden object-cover "
    />
    <p className="font-medium text-[14px] leading-[20px] text-center text-[#E4572E]">
      Upload or drag one item here
    </p>
  </div>
);

FilePreview.propTypes = {
  files: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

const SecurityTab = () => {
  const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');
  const { updateUserDetails } = useStore((state) => state.authActions);
  const { user } = useStore((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange', // Trigger validation on change
    reValidateMode: 'onChange', // Revalidate on change
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      profileAvatar: [],
    },
  });
  const [isPasswordOpen, toggleEyePass] = useState(false);
  const [isNewPasswordOpen, toggleNewEyePass] = useState(false);
  const [isConfirmPasswordOpen, toggleConfirmEyePass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: (data) => changePassword(data, isSuperAdmin),
  });

  const updateAvatarMutation = useMutation({
    mutationFn: updateAvatar,
  });

  async function onSubmit(values) {
    setIsLoading(true);
    const resizedImage = await resizeImage(values.profileAvatar[0]);

    const submissionPromise = new Promise((resolve, reject) => {
      const promises = [];

      if (
        values.currentPassword &&
        values.newPassword &&
        values.confirmPassword
      ) {
        const passwordForm = {
          old_password: values.currentPassword,
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
        };
        promises.push(
          changePasswordMutation.mutateAsync(passwordForm).then(() => ({
            type: 'password',
            message: 'Password changed successfully',
          }))
        );
      }

      if (values.profileAvatar) {
        const avatarForm = {
          name: user?.name || '',
          picture: resizedImage,
        };
        promises.push(
          updateAvatarMutation.mutateAsync(avatarForm).then((data) => {
            updateUserDetails(data?.user);
            return { type: 'avatar', message: 'Avatar updated successfully' };
          })
        );
      }

      if (promises.length < 1) {
        reject(
          new Error('At least one section (Password or Avatar) must be filled')
        );
        return;
      }

      Promise.all(promises)
        .then((results) => {
          resolve(results);
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    toast.promise(submissionPromise, {
      loading: 'Saving changes...',
      success: (results) => {
        const messages = results.map((result) => result.message);
        return messages.join('. ');
      },
      error: (error) =>
        `Error: ${
          error?.response?.data?.message ||
          error.message ||
          'Something went wrong'
        }`,
    });
  }

  return (
    <section className="flex flex-col items-start bg-white rounded-[8px] p-6  w-full">
      <Form {...form}>
        <form
          className="flex flex-col gap-8 items-start"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="gap-4 grid grid-cols-4 w-full">
            <h2 className="font-medium col-span-4 md:col-span-1 text-[16px] text-[#45464E]">
              Change Password
            </h2>
            <div className="flex flex-col col-span-4 md:col-span-2  items-start p-0 gap-5 grow w-full ">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full">
                    <FormLabel className="text-[14px] leading-[20px] text-[#36454F] font-normal">
                      Current password
                    </FormLabel>
                    <FormControl>
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full">
                    <FormLabel className="text-[14px] leading-[20px] text-[#36454F] font-normal">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isNewPasswordOpen ? 'text' : 'password'}
                          className=" border border-[#DEDEDE] w-full bg-white rounded-[6px] pr-10" // Add padding to the right to make space for the icon
                          placeholder="&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;"
                          {...field}
                        />
                        <div
                          onClick={() => toggleNewEyePass((e) => !e)}
                          className="cursor-pointer text-xl text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {isNewPasswordOpen ? (
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
                  <FormItem className="flex flex-col gap-2 w-full">
                    <FormLabel className="text-[14px] leading-[20px] text-[#36454F] font-normal">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type={isConfirmPasswordOpen ? 'text' : 'password'}
                          className=" border border-[#DEDEDE] w-full bg-white rounded-[6px]  pr-10" // Add padding to the right to make space for the icon
                          placeholder="&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;&#42;"
                          {...field}
                        />
                        <div
                          onClick={() => toggleConfirmEyePass((e) => !e)}
                          className="cursor-pointer text-xl text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {isNewPasswordOpen ? (
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
            </div>
          </div>

          {/* upload avatar */}
          <div className="gap-4 grid grid-cols-4 w-full">
            <h2 className="font-medium col-span-4 md:col-span-1 text-[16px] text-[#45464E]">
              Profile Avatar
            </h2>
            <div className="flex flex-col col-span-4 md:col-span-2  items-start p-0 gap-5 grow w-full ">
              <FormField
                control={form.control}
                name="profileAvatar"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full">
                    <FormLabel className="text-[14px] leading-[20px] text-[#36454F] font-normal">
                      Upload Profile Avatar
                    </FormLabel>
                    <FormControl className="w-full ">
                      <FileUploader
                        files={field.value}
                        onChange={field.onChange}
                        FileComponent={FilePreview}
                        NoFileComponent={NoFile}
                        isSingle={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <TwoFaForm />

          <div className="gap-4 grid grid-cols-4 w-full">
            <div></div>
            <div className="w-full col-span-2 justify-end flex items-center">
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending || isLoading}
                className="py-3 px-4 border border-b border-[#ECEEF4] rounded-[32px] font-medium text-[15px] leading-[21px] text-white"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default SecurityTab;

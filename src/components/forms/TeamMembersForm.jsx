import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { addTeamMemberSchema } from '@/lib/validations/addTeamMemberSchema';
import { useState } from 'react';
import { Button } from '../ui/button';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTeamMember, editTeamMember } from '@/utils/queries';
import { useLocation } from 'react-router-dom';

const TeamMembersForm = ({
  setOpenTeamMemberModal,
  isEditing,
  selectedMember,
}) => {
    const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(addTeamMemberSchema),
    mode: 'onChange', // Trigger validation on change
    reValidateMode: 'onChange', // Revalidate on change
    defaultValues: {
      fullName: isEditing ? selectedMember?.name || '' : '',
      email: isEditing ? selectedMember?.email || '' : '',
      roles: isEditing ? selectedMember?.role || '' : '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      return isEditing ? editTeamMember(data,isSuperAdmin) : addTeamMember(data,isSuperAdmin);
    },
  });

  async function onSubmit(values) {
    const formValues = {
      full_name: values.fullName,
      email: values.email,
      role: values.roles,
    };

    setIsLoading(true);

    const submissionPromise = new Promise((resolve, reject) => {
      mutation.mutate(formValues, {
        onSuccess: (data) => {
          queryClient.invalidateQueries(['teamMembers']);
          setOpenTeamMemberModal(false);
          resolve(data);
        },
        onError: (error) => {
          reject(error);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    });

    toast.promise(submissionPromise, {
      loading: 'Submitting...',
      success: (data) =>
        `${data.full_name || 'Member'} ${
          isEditing ? 'updated' : 'added'
        } successfully`,
      error: (error) =>
        `Error: ${
          error?.response?.data?.message ||
          error.message ||
          'Something went wrong'
        }`,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full max-w-[504px] border-t-[0.5px] pt-6 mt-2 border-[#ECEEF4] max-h-[calc(100dvh-50px)]  overflow-y-auto"
      >
        <div className="flex items-start flex-col p-0 gap-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Full Name
                </FormLabel>
                <FormControl className="w-full ">
                  <Input
                    className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2]rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                    placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Email
                </FormLabel>
                <FormControl className="w-full ">
                  <Input
                    type="email"
                    className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2]rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                    placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Roles
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-[14px] leading-[20px] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                      <SelectValue
                        placeholder="Select member's roles"
                        className="placeholder:text-[#B2C2D2]"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-w-[450px] group">
                    <SelectItem
                      className="py-2 border-b border-[#ECEEF4]  "
                      value="admin"
                    >
                      <div className="group-data-[state=open]:flex  hidden box-border  flex-col items-start ">
                        <h4 className="font-medium text-[14px] leading-[20px] text-[#536878]">
                          Admin
                        </h4>

                        <span className="text-[12px] leading-[17px] text-[#8B909A]">
                          Full access to all settings and data.
                        </span>
                      </div>

                      <p className="group-data-[state=open]:hidden  block">
                        Admin
                      </p>
                    </SelectItem>

                    <SelectItem
                      className="py-2 border-b border-[#ECEEF4]  "
                      value="manager"
                    >
                      <div className="group-data-[state=open]:flex  hidden box-border  flex-col items-start ">
                        <h4 className="font-medium text-[14px] leading-[20px] text-[#536878]">
                          Manager
                        </h4>

                        <span className="text-[12px] leading-[17px] text-[#8B909A]">
                          Manage inventory and team members, view and process
                          orders, access reports.
                        </span>
                      </div>

                      <p className="group-data-[state=open]:hidden  block">
                        Manager
                      </p>
                    </SelectItem>
                    <SelectItem className="py-2" value="staff">
                      <div className="group-data-[state=open]:flex  hidden box-border  flex-col items-start ">
                        <h4 className="font-medium text-[14px] leading-[20px] text-[#536878]">
                          Staff
                        </h4>

                        <span className="text-[12px] leading-[17px] text-[#8B909A]">
                          Manage inventory, view and process orders.
                        </span>
                      </div>

                      <p className="group-data-[state=open]:hidden  block">
                        Staff
                      </p>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="p-2 w-full rounded-[32px] bg-[#00070C] font-bold text-[16px] leading-[22.4px] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </>
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Member'
          )}
        </Button>
      </form>
    </Form>
  );
};

TeamMembersForm.propTypes = {
  isEditing: PropTypes.bool,
  setOpenTeamMemberModal: PropTypes.func.isRequired,
  selectedMember: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
};


export default TeamMembersForm;

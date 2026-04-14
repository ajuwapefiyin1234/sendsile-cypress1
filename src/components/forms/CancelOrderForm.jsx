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
import { cancelOrderConfirmationSchema } from '@/lib/validations/cancelOrderSchema';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REASONS } from '@/lib/reusable';
import { Input } from '../ui/input';
import { ROUTE } from '@/routes';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import { DialogClose } from '../ui/dialog';

const CancelOrderForm = ({ setOpenModal }) => {
  const form = useForm({
    resolver: zodResolver(cancelOrderConfirmationSchema),
    mode: 'onChange', // Trigger validation on change
    reValidateMode: 'onChange', // Revalidate on change
    defaultValues: {
      reason: '',
      comments: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  async function onSubmit(values) {
    // Create a new promise for the submission process
    const submissionPromise = new Promise((resolve) => {
      setIsLoading(true);

      // Simulate an asynchronous operation with a timeout
      setTimeout(() => {
        setIsLoading(false);
        setOpenModal(false);
        resolve({ name: values?.reason || 'reason' });
      }, 4000);
    });

    // Use toast.promise to handle the promise and show toast messages
    toast.promise(submissionPromise, {
      loading: 'Loading...',
      success: () => {
        navigate(ROUTE.orderManagement);
        return 'Order cancelled';
      },
      error: 'Error occurred during submission',
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full max-w-[504px] border-t-[0.5px] pt-6 mt-2 border-[#ECEEF4] max-h-[calc(100dvh-50px)]  overflow-y-auto"
      >
        <div className="flex  flex-col items-start gap-4">
          <p className="text-[15px] leading-[21px] text-[#3645F] grow">
            Are you sure you want to cancel this order? Please select a reason
            for cancellation
          </p>

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Reason for Cancelling Order
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-[14px]  leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                      <SelectValue
                        className="text-[14px] leading-[19px] text-[#8B909A] placeholder:text-[#8B909A]"
                        placeholder="Select reason"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REASONS.map((reason, index) => (
                      <SelectItem
                        key={reason}
                        className={`text-[14px] py-2 leading-[19px] text-[#8B909A] ${
                          REASONS.length === index + 1
                            ? ''
                            : 'border-b border-[#ECEEF4]'
                        } `}
                        value={reason}
                      >
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                  Comment (Optional)
                </FormLabel>
                <FormControl className="w-full ">
                  <Input
                    className="text-[14px] leading-[20px]  placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                    placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* two buttons */}
        <div className="flex items-start gap-1 w-full">
          <DialogClose asChild>
            <Button
              type="button"
              varaint="secondary"
              disabled={isLoading}
              className="p-4 w-full h-[54px] rounded-[32px] bg-[#FCFBFA] font-bold text-[17px] leading-[23.8px] text-[#00070C] hover:text-white border border-[#5F5F5F] grow"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            disabled={isLoading}
            className="p-4 w-full h-[54px] rounded-[32px] bg-[#00070C] font-bold text-[16px] leading-[22.4px] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Confirm cancellation'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

CancelOrderForm.propTypes = {
  setOpenModal: PropTypes.func.isRequired,
};

export default CancelOrderForm;

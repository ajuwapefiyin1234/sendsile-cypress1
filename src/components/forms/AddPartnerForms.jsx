import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { TbDeviceFloppy } from 'react-icons/tb';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductFilePreview, ProductNoFile } from '../FilePreviews';
import { useState } from 'react';
import FileUploader from '../FileUploader';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { editPartnerSchema } from '@/lib/validations/partnerSchema';
import BusinessDetails from '../superadmin/Partners/BusinessDetails';
import AddressInformation from '../superadmin/Partners/AddressInformation';
import { useMutation } from '@tanstack/react-query';
import { addPartner } from '@/utils/queries';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';

const AddPartnerForms = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(editPartnerSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      partnerImage: [],
      businessName: '',
      partnerEmail: '',
      contactPersonName: '',
      contactPersonPhoneNumber: '',
      country: '',
      businessAddress: '',
      role: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const mutation = useMutation({
    mutationFn: (data) => {
      return addPartner(data);
    },
    onSuccess: () => {
      toast.success(`Partner added successfully`);
      setIsLoading(false); // Ensure isLoading is set to false on success
      setOpenModal(false);
      navigate(SUPER_ADMIN_ROUTES.partnerManagement);
    },
    onError: (error) => {
      toast.error(
        `Error: ${
          error?.response?.data?.message || error.message || 'Network error'
        }`
      );
      setIsLoading(false); // Ensure isLoading is set to false on error
    },
    onMutate: () => {
      setIsLoading(true); // Set isLoading to true when mutation starts
    },
  });

  async function saveChanges() {
    mutation.mutate(formData);
  }

  async function onSubmit(values) {
    if (!values?.partnerImage) {
      toast.info('Please select a partner image');
      return;
    }
    const formValues = {
      business_name: values.businessName,
      email: values.partnerEmail,
      phone_number: values.contactPersonPhoneNumber,
      country: values.country,
      role: values.role,
      business_address: values.businessAddress,
      contact_name: values.contactPersonName,
    };

    // console.log(formValues);
    setFormData(formValues);
    setOpenModal(true);
  }

  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="gap-6 sm:max-w-[426px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-[22px] leading-[31px] text-[#45464E]">
              Save Changes
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-start gap-4 border-t-[0.5px] pt-6 mt-2 border-[#ECEEF4] ">
            <p className="txt-[15px] leading-[21px] text-[#36454F] grow">
              Are you sure you want to save the changes made to this partner?
            </p>
          </div>
          <div className="flex items-start gap-1 w-full">
            <Button
              type="button"
              varaint="secondary"
              disabled={isLoading}
              onClick={() => setOpenModal(false)}
              className="p-4 w-full h-[54px] rounded-[32px] bg-[#FCFBFA] font-bold text-[17px] leading-[23.8px] !text-[#00070C] hover:text-white border border-[#5F5F5F] grow"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isLoading}
              onClick={saveChanges}
              className="p-4 w-full h-[54px] rounded-[32px] bg-[#00070C] font-bold text-[16px] leading-[22.4px] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full"
        >
          <header className="flex items-center  rounded-[24px]">
            <div className="flex justify-end items-center w-full grow">
              <div className="flex items-start gap-5">
                <div className="flex items-start p-0 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="py-3 px-4 gap-2 border border-[#ECEEF4] bg-white rounded-[32px] font-medium text-[15px] text-[#8B909A] leading-[21px]"
                    onClick={() =>
                      navigate(SUPER_ADMIN_ROUTES.partnerManagement)
                    }
                  >
                    Cancel
                    <X className="w-5 h-5 text-[#8B909A]" />
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="py-3 px-4 gap-2 border border-[#ECEEF4] bg-[#00070C] rounded-[32px] font-medium text-[15px] text-white leading-[21px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      <>
                        <p className="text-[15px] leading-[21px]">
                          Save Changes
                        </p>
                        <TbDeviceFloppy className="w-5 h-5 text-white" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <section className="flex flex-col md:flex-row gap-4 grow py-6 ">
            <div className="flex flex-col items-center p-6 gap-8 rounded-[8px] bg-white md:w-[248px] w-full  h-auto">
              <div className="flex flex-col p-0 gap-5 items-center">
                <FormField
                  control={form.control}
                  name="partnerImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                      <FormControl className="w-full ">
                        <FileUploader
                          files={field.value}
                          onChange={field.onChange}
                          FileComponent={ProductFilePreview}
                          NoFileComponent={ProductNoFile}
                          isSingle={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row  p-6 gap-8 bg-white w-full rounded-[8px] grow">
              <BusinessDetails control={form.control} />
              <div className="border md:block hidden border-[#ECEEF4] h-auto" />
              <AddressInformation control={form.control} />
            </div>
          </section>
        </form>
      </Form>
    </>
  );
};

AddPartnerForms.propTypes = {
  id: PropTypes.string,
  isAdding: PropTypes.bool.isRequired,
  partner: PropTypes.object,
};
export default AddPartnerForms;

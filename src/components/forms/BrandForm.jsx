import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { brandSchema } from '@/lib/validations/editProductSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addBrand,
  addCategory,
  deleteBrand,
  deleteCategory,
  editBrand,
  editCategory,
} from '@/utils/queries';
import FileUploader from '../FileUploader';
import { ProductFilePreview, ProductNoFile } from '../FilePreviews';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { TbTrash } from 'react-icons/tb';

const BrandForm = ({
  setOpenBrandModal,
  name,
  selectedItem,
  isCreating,
  onChange,
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm({
    resolver: zodResolver(brandSchema),
    mode: 'onChange', // Trigger validation on change
    reValidateMode: 'onChange', // Revalidate on change
    defaultValues: {
      name: selectedItem?.name || '',
      description: selectedItem?.description || '',
      image: selectedItem?.image ? [selectedItem?.image] : [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (name === 'category' && isCreating) {
        return addCategory(data);
      } else if (name === 'category') {
        return editCategory(selectedItem?.id, data);
      } else if (name === 'brand' && isCreating) {
        return addBrand(data);
      } else if (name === 'brand') {
        return editBrand(selectedItem?.id, data);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (name === 'category') {
        return deleteCategory(selectedItem?.id);
      } else {
        return deleteBrand(selectedItem?.id);
      }
    },
  });

  async function onSubmit() {
    if (!selectedItem && !isCreating) return;
    const values = form.watch();
    setIsLoading(true);

    const formValues = {
      name: values.name,
      description: values.name,
      image: values.image,
    };
    if (name === 'brand') delete formValues.image;

    // Wrap the mutation in a new promise if needed for toast handling
    const submissionPromise = new Promise((resolve, reject) => {
      mutation.mutate(formValues, {
        onSuccess: (data) => {
          queryClient.invalidateQueries([name]);
          if (isCreating) onChange(data.id);
          resolve(data);
          setOpenBrandModal(false);
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
      loading: `Saving ${name}...`,
      success: (data) =>
        `${name} ${data.name} ${
          isCreating ? 'created' : 'updated'
        } successfully`,
      error: (error) =>
        `Error: ${
          error?.response?.data?.message ||
          error.message ||
          'Something went wrong'
        }`,
    });
  }

  async function onDelete() {
    if (!selectedItem) return;
    setIsDeleting(true);

    const deletePromise = new Promise((resolve, reject) => {
      deleteMutation.mutate(null, {
        onSuccess: () => {
          queryClient.invalidateQueries([name]);
          resolve();
          setOpenBrandModal(false);
        },
        onError: (error) => {
          reject(error);
        },
        onSettled: () => {
          setIsDeleting(false);
        },
      });
    });

    toast.promise(deletePromise, {
      loading: `Deleting ${name}...`,
      success: `${name} deleted successfully`,
      error: (error) =>
        `Error: ${
          error?.response?.data?.message ||
          error.message ||
          'Something went wrong'
        }`,
    });
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full max-w-[504px] border-t-[0.5px] pt-6 mt-2 border-[#ECEEF4] max-h-[calc(100dvh-50px)] overflow-y-auto"
        >
          <div className="flex items-start flex-col p-0 gap-5">
            {name === 'category' && (
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center p-0 gap-2 w-full ">
                    <FormControl className="w-full ">
                      <FileUploader
                        files={field.value || []}
                        onChange={field.onChange}
                        FileComponent={() => (
                          <ProductFilePreview
                            files={field.value || []}
                            name={name}
                          />
                        )}
                        NoFileComponent={() => <ProductNoFile name={name} />}
                        isSingle={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start p-0 gap-2 w-full">
                  <FormLabel className="text-[14px] capitalize leading-[20px] text-[#36454F]">
                    {name} Name
                  </FormLabel>
                  <FormControl className="w-full">
                    <Input
                      className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4 w-full"
                      placeholder={`Enter ${name} name`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex-col items-start p-0 gap-2 w-full hidden">
                  <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                    Description
                  </FormLabel>
                  <FormControl className="w-full">
                    <Textarea
                      className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4 w-full min-h-[100px]"
                      placeholder="Enter brand description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              id="combo"
              disabled={isLoading}
              onClick={onSubmit}
              className="p-2 flex-grow rounded-[32px] bg-[#00070C] font-bold text-[16px] leading-[22.4px] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : isCreating ? (
                `Create ${name}`
              ) : (
                'Save Changes'
              )}
            </Button>

            {!isCreating && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="p-2 rounded-[32px]"
                  >
                    <TbTrash className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you absolutely sure? This action cannot be undone.
                      This will permanently delete the {name}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
BrandForm.propTypes = {
  setOpenBrandModal: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selectedItem: PropTypes.object,
  isCreating: PropTypes.bool,
  onChange: PropTypes.func,
};
export default BrandForm;

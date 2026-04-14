import { Button } from '@/components/ui/button';
import { TbPlus, TbTrashFilled } from 'react-icons/tb';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbDeviceFloppy } from 'react-icons/tb';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { editProductSchema } from '@/lib/validations/editProductSchema';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import FileUploader from '../FileUploader';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NoProductImage, ProductImagePreview } from '../FilePreviews';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProduct, editProduct } from '@/utils/queries';
import { Input } from '../ui/input';
import { CustomCombobox } from '../CustomCombobox';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { discountOptions } from '@/lib/reusable';
import { Switch } from '../ui/switch';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
import { ROUTE } from '@/routes';

const ProductForms = ({
  isAdding,
  product,
  id,
  partners,
  isLoadingPartners,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');
  const queryClient = useQueryClient();

  const generateRandomSKU = useCallback(() => {
    return Math.floor(10000 + Math.random() * 9000).toString(); // Generates a number between 10000 and 99999
  }, []);

  const form = useForm({
    resolver: zodResolver(editProductSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      productName: isAdding ? '' : product?.name || 'N/A',
      category: isAdding ? '' : product?.category?.category_id || 'N/A',
      brand: isAdding
        ? ''
        : product?.brand?.brand_id || '83b5e133-20ee-4303-819b-42f3b91e2800',
      description: isAdding ? '' : product?.description || 'N/A',
      product_list: isAdding ? '' : product?.product_list || 'N/A',
      partner: isAdding ? '' : product?.vendor?.partner_id || '',
      productImage0: isAdding
        ? []
        : product?.images?.[0]
          ? [product.images[0]]
          : [],
      productImage1: isAdding
        ? []
        : product?.images?.[1]
          ? [product.images[1]]
          : [],
      productImage2: isAdding
        ? []
        : product?.images?.[2]
          ? [product.images[2]]
          : [],
      productImage3: isAdding
        ? []
        : product?.images?.[3]
          ? [product.images[3]]
          : [],
      productImage4: isAdding
        ? []
        : product?.images?.[4]
          ? [product.images[4]]
          : [],
      variants: isAdding
        ? [
          {
            variation: '',
            price: '0',
            sku: generateRandomSKU(),
            quantityInStock: '0',
            productAvailability: 'low stock',
            discount: false,
            discountType: '',
            discountValue: '0',
          },
        ]
        : product?.variants?.map((variant) => {
          return {
            variation: variant?.variation || 'N/A',
            price: variant?.price || '0',
            sku: variant?.sku || 'N/A',
            quantityInStock: variant?.stock || '0',
            productAvailability: variant?.availability || 'N/A',
            discount: variant?.discount_type ? true : false,
            discountType: variant?.discount_type || 'N/A',
            discountValue: variant?.discount || 'N/A',
            variant_id: variant?.variant_id || 'N/A',
          };
        }),
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  });
  const [animatingFields, setAnimatingFields] = useState([]);

  // Modify the append function to include a random SKU
  const appendVariant = useCallback(() => {
    const newField = {
      variation: '',
      price: '',
      sku: generateRandomSKU(),
      quantityInStock: '',
      productAvailability: '',
    };
    append(newField);
    setAnimatingFields((prev) => [...prev, fields.length]);
    setTimeout(() => {
      setAnimatingFields((prev) =>
        prev.filter((index) => index !== fields.length)
      );
    }, 300);
  }, [append, fields.length, generateRandomSKU]);

  const removeVariant = useCallback(
    (index) => {
      setAnimatingFields((prev) => [...prev, index]);
      setTimeout(() => {
        remove(index);
        setAnimatingFields((prev) => prev.filter((i) => i !== index));
      }, 300);
    },
    [remove]
  );

  const mutation = useMutation({
    mutationFn: (data) => {
      return isAdding
        ? addProduct(data, isSuperAdmin)
        : editProduct(id, data, isSuperAdmin);
    },
  });

  async function saveChanges() {
    setIsLoading(true);
    const submissionPromise = new Promise((resolve, reject) => {
      mutation.mutate(formData, {
        onSuccess: (data) => {
          queryClient.invalidateQueries(['inventories']);
          setOpenModal(false);
          isAdding && form.reset();
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
      loading: 'Saving...',
      success: (data) => {
        // After successful toast, navigate to product detail
        const productId = isAdding ? data.product_id : id;
        if (!isAdding) {
          setTimeout(() => {
            isSuperAdmin
              ? navigate(`${SUPER_ADMIN_ROUTES.eachProduct}${productId}`)
              : navigate(`/dashboard/inventory/${productId}`);
          }, 1000); // Optional delay to allow users to see the success message
        } else {
          setTimeout(() => {
            isSuperAdmin
              ? navigate(`${SUPER_ADMIN_ROUTES.inventory}`)
              : navigate(`/dashboard/inventory`);
          }, 1000); // Optional delay to allow users to see the success message
        }

        return `Product ${isAdding ? 'added' : 'updated'} successfully`;
      },
      error: (error) =>
        `Error: ${error?.response?.data?.message ||
        error.message ||
        'Something went wrong'
        }`,
    });
  }

  async function onSubmit(values) {
    if (!values?.productImage0) {
      toast.info('Please select a main product image');
      return;
    }

    // Ensure only valid images are added
    const images = [
      ...(values.productImage0 || []),
      ...(values.productImage1 || []),
      ...(values.productImage2 || []),
      ...(values.productImage3 || []),
      ...(values.productImage4 || []),
    ];

    const formValues = {
      categories_id: values.category,
      brand_id: values.brand || 'cddf67d6-08bc-45ea-a45f-b7beeaeef829',
      name: values.productName || '',
      product_list: values.product_list || '',
      description: values.description || '',
      images, // use the prepared images array
      vendor_id: values?.partner,
      variants: values?.variants?.map((variant) => ({
        name: variant.variation,
        variant_id: variant?.variant_id,
        quantity: variant.quantityInStock || 0, // Default to 0 if undefined
        price: variant.price || 0, // Default to 0 if undefined
        sku: variant.sku || '',
        availability: variant.productAvailability || 'available',
        discount_type: variant?.discount ? variant.discountType : '',
        discount: variant?.discount ? variant.discountValue : 0,
      })),
    };

    // Remove vendor_id if not a super admin
    if (!isSuperAdmin) delete formValues.vendor_id;
    // console.log(formValues);
    // Set form data and open modal
    setFormData(formValues);
    setOpenModal(true);
  }

  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="gap-6 sm:max-w-[426px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-[22px] leading-[31px] text-[#45464E]">
              {isAdding ? 'Add Product' : ' Save Changes'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-start gap-4 border-t-[0.5px] pt-6 mt-2 border-[#ECEEF4] ">
            <p className="txt-[15px] leading-[21px] text-[#36454F] grow">
              {isAdding
                ? 'Are you sure you want to upload this product?'
                : 'Are you sure you want to save the changes made to this product?'}
            </p>
          </div>
          <div className="flex items-start w-full gap-1">
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait...
                </>
              ) : isAdding ? (
                'Add Product'
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
          className="flex flex-col w-full gap-4"
        >
          <header className="flex items-center  rounded-[24px]">
            <div className="flex items-center justify-end w-full grow">
              <div className="flex items-start gap-5">
                <div className="flex items-start gap-3 p-0">
                  <Button
                    type="button"
                    variant="outline"
                    className="py-3 px-4 gap-2 h-[45px] border border-[#ECEEF4] bg-white rounded-[32px] font-medium text-[15px] text-[#8B909A] leading-[21px]"
                    onClick={() =>
                      navigate(
                        isSuperAdmin
                          ? SUPER_ADMIN_ROUTES.eachProduct + id
                          : ROUTE.eachProduct + id
                      )
                    }
                  >
                    Cancel
                    <X className="w-5 h-5 text-[#8B909A]" />
                  </Button>

                  <Button
                    type="submit"
                    id="product"
                    disabled={isLoading}
                    className="py-3 px-4 gap-2 h-[45px] border border-[#ECEEF4] bg-[#00070C] rounded-[32px] font-medium text-[15px] text-white leading-[21px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Please wait...
                      </>
                    ) : isAdding ? (
                      <>
                        <p className="text-[15px] leading-[21px]">
                          Add Product
                        </p>
                        <TbPlus className="w-5 h-5 text-white" />
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

          <section className="flex flex-col items-start justify-center p-6 gap-8 bg-white rounded-[8px] w-full">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-wrap justify-center gap-6">
                {[0, 1, 2, 3, 4].map((index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`productImage${index}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start gap-2 p-0 w-fit">
                        <FormControl className="w-fit ">
                          <FileUploader
                            files={field?.value || []}
                            onChange={field.onChange}
                            FileComponent={ProductImagePreview}
                            NoFileComponent={() => (
                              <NoProductImage main={index === 0} />
                            )}
                            isSingle={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <p className="text-[13px] leading-[18px] text-[#536878]">
                Image needs to be between 500x500 and 2000x2000 pixels. White
                backgrounds are recommended. No watermarks. Maximum image size
                2Mb
              </p>
            </div>
          </section>

          <main className="flex flex-col items-start p-6 gap-8 bg-white rounded-[8px]">
            <section className="flex flex-col items-start gap-6 w-full border-b border-[#ECEEF4] pb-8">
              <h2 className="font-medium text-[16px] leading-[22px] text-[#00070C]">
                General Information
              </h2>
              <div className="flex flex-col items-start w-full gap-5 ">
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                        <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                          Product Name
                        </FormLabel>
                        <FormControl className="w-full ">
                          <Input
                            className="text-[14px] leading-[20px]  placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                            placeholder="Cucumber"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                        <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                          Category
                        </FormLabel>
                        <FormControl className="w-full ">
                          <CustomCombobox
                            onChange={field.onChange}
                            value={field.value}
                            name="category"
                            isSuperAdmin={isSuperAdmin}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                        <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                          Brand
                        </FormLabel>
                        <FormControl className="w-full ">
                          <CustomCombobox
                            onChange={field.onChange}
                            value={field.value}
                            name="brand"
                            isSuperAdmin={isSuperAdmin}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                    <FormField
                      control={form.control}
                      name="product_list"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start w-full gap-2 p-0 ">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            Product List
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Product List"
                              className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
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
                        <FormItem className="flex flex-col items-start w-full gap-2 p-0 ">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Product description"
                              className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  {isSuperAdmin && (
                    <FormField
                      control={form.control}
                      name="partner"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            Partner
                          </FormLabel>

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                                <SelectValue placeholder="Select partner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingPartners ? (
                                <SelectItem
                                  className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4] last:border-none"
                                  value="Tatancom"
                                >
                                  Tatancom
                                </SelectItem>
                              ) : (
                                partners?.map((partner) => (
                                  <SelectItem
                                    key={partner?.partner_id}
                                    className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4] last:border-none"
                                    value={partner?.partner_id}
                                  >
                                    {partner?.company_name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </section>

            <section className="flex flex-col items-start w-full gap-6 pb-8">
              <h2 className="font-medium text-[16px] leading-[22px] text-[#00070C]">
                Product Variant
              </h2>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`gap-5 grid grid-cols-1 lg:grid-cols-3 w-full transition-all duration-300 ${animatingFields.includes(index)
                      ? 'opacity-0 max-h-0 overflow-hidden'
                      : 'opacity-100 max-h-[1000px]'
                    } border-b border-[#ECEEF4] py-3 last:border-none`}
                >
                  <div className="grid w-full grid-cols-1 col-span-3 gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.variation`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            Variation
                          </FormLabel>
                          <FormControl className="w-full ">
                            <Input
                              className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                              placeholder="6 pieces"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            Price
                          </FormLabel>
                          <FormControl className="w-full ">
                            <div className="flex  items-center gap-0 w-full border border-[#DEDEDE] rounded-[6px] has-[:focus-visible]:border-[#E4572E] has-[:focus-visible]:ring-4  has-[:focus-visible]:ring-[#FFE6DC]">
                              <div className="flex  items-center justify-center py-[9.6px] bg-white  rounded-l-[6px] font-medium text-[14px] text-[#708090] leading-[19px]">
                                <div className="border-r border-[#DEDEDE]  px-4">
                                  &#8358;
                                </div>
                              </div>
                              <Input
                                className="text-[14px] appearance-none leading-[20px] placeholder:text-[#B2C2D2] rounded-r-[6px] rounded-l-none border-0  border-[#DEDEDE] bg-white p-4  w-full focus-visible:ring-0 focus-visible:border-0"
                                placeholder="0"
                                {...field}
                              />
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid w-full grid-cols-1 col-span-3 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.sku`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start w-full col-span-1 gap-2 p-0">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            SKU
                          </FormLabel>
                          <FormControl className="w-full ">
                            <Input
                              className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                              placeholder="4701"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.quantityInStock`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            Quantity in Stock
                          </FormLabel>
                          <FormControl className="w-full ">
                            <Input
                              className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                              placeholder="set quantity in stock"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.productAvailability`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                          <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                            Product Availability
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full">
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
                                value="In Stock"
                              >
                                In Stock
                              </SelectItem>
                              <SelectItem
                                className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
                                value="Low Stock"
                              >
                                Low Stock
                              </SelectItem>
                              <SelectItem
                                className="text-[14px] leading-[19px] text-[#8B909A]"
                                value="Out of Stock"
                              >
                                Out of Stock
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col w-full col-span-3 gap-6 ">
                    <div className="flex items-start justify-between w-full ">
                      <h4 className="font-medium text-[16px] leading-[22.4px] text-[#8B8D97]">
                        Discount
                      </h4>

                      <FormField
                        control={form.control}
                        name={`variants.${index}.discount`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-5 justify-items-center">
                            <FormLabel className="text-[14px] leading-[19px] text-[#2B2F32]">
                              Add Discount
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="w-10 h-[14px]"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch(`variants.${index}.discount`) && (
                      <div className="grid w-full grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.discountType`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                              <FormLabel className="text-[14px] leading-[20px] text-[#36454F]">
                                Discount Type
                              </FormLabel>

                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4 w-full">
                                    <SelectValue placeholder="Select discount type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {discountOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      className="text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
                                      value={option.value}
                                    >
                                      {option.label}
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
                          name={`variants.${index}.discountValue`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start w-full gap-2 p-0">
                              <FormLabel className="text-[14px] leading-[20px] text-[#36454F] text-nowrap truncate">
                                Discount Value (%)
                              </FormLabel>
                              <FormControl className="w-full ">
                                <Input
                                  className="text-[14px] leading-[20px] placeholder:text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4  w-full"
                                  placeholder=""
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 ">
                    {index < fields.length - 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeVariant(index)}
                        className="cursor-pointer  flex hover:bg-transparent   p-0 gap-1 items-center text-[15px] leading-[21px] font-medium text-[#E4572E] w-fit"
                      >
                        <TbTrashFilled className="w-4 h-4" />
                        <p>Delete </p>
                      </Button>
                    )}
                    {fields.length === index + 1 && (
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={appendVariant}
                        className="cursor-pointer  flex  p-0 gap-1 items-center hover:bg-transparent  text-[15px] leading-[21px] font-medium text-[#E4572E] w-fit"
                      >
                        <TbPlus className="w-4 h-4" />
                        <p>Add variant</p>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </main>
        </form>
      </Form>
    </>
  );
};

ProductForms.propTypes = {
  id: PropTypes.string,
  isAdding: PropTypes.bool.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    vendor: PropTypes.shape({
      partner_id: PropTypes.string,
      contact_person: PropTypes.string,
      company_name: PropTypes.string,
      vendor_email: PropTypes.string,
      vendor_phone: PropTypes.string,
      status: PropTypes.string,
      last_active: PropTypes.string,
    }),
    description: PropTypes.string,
    product_list: PropTypes.string,
    price: PropTypes.string,
    stock: PropTypes.number,
    sku: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
    product_id: PropTypes.string,
    category_name: PropTypes.string,
    variants: PropTypes.array,
    brand: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      brand_id: PropTypes.string,
    }),
    category: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      category_id: PropTypes.string,
    }),
    availability: PropTypes.string,
    variations: PropTypes.array,
  }),
  partners: PropTypes.arrayOf(
    PropTypes.shape({
      partner_id: PropTypes.string,
      contact_person: PropTypes.string,
      company_name: PropTypes.string,
      vendor_email: PropTypes.string,
      vendor_phone: PropTypes.string,
      status: PropTypes.string,
      last_active: PropTypes.string,
    })
  ),
  isLoadingPartners: PropTypes.bool,
};

export default ProductForms;

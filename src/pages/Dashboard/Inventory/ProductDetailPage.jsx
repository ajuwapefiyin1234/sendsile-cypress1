import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProduct, fetchProduct } from '@/utils/queries';
import { toast } from 'sonner';
import PageLoader from '@/components/loaders/PageLoader';
import { Button } from '@/components/ui/button';

import { ROUTE } from '@/routes';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import FileUploader from '@/components/FileUploader';
import { ProductImagePreview, NoProductImage } from '@/components/FilePreviews';
import { Label } from '@/components/ui/label';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ReadOnlyInput = ({ labelName, value, priceInput, descriptionInput }) => (
  <div className="flex flex-col items-start w-full gap-2 p-0">
    <Label className="text-[14px] leading-[20px] text-[#36454F]">
      {labelName}
    </Label>
    <div className="w-full">
      {priceInput ? (
        <div className="flex items-center gap-0 w-full border border-[#DEDEDE] rounded-[6px]">
          <div className="flex items-center justify-center py-[9.6px] bg-white rounded-l-[6px] font-medium text-[14px] text-[#708090] leading-[19px]">
            <div className="border-r border-[#DEDEDE] px-4">&#8358;</div>
          </div>
          <Input
            className="text-[14px] leading-[20px] text-[#B2C2D2] rounded-r-[6px] rounded-l-none border-0 border-[#DEDEDE] bg-white p-4 w-full"
            value={value}
            readOnly
          />
        </div>
      ) : descriptionInput ? (
        <Textarea
          className="text-[14px] leading-[20px] text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4 w-full"
          value={value}
          readOnly
        />
      ) : (
        <Input
          className="text-[14px] leading-[20px] text-[#B2C2D2] rounded-[6px] border border-[#DEDEDE] bg-white p-4 w-full"
          value={value}
          readOnly
        />
      )}
    </div>
  </div>
);
ReadOnlyInput.propTypes = {
  labelName: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Assuming value is always provided
  priceInput: PropTypes.bool,
  descriptionInput: PropTypes.bool,
};

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const location = useLocation();
  const isSuperAdmin = location.pathname.includes('super-admin');
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: product,
    error: productError,
    isLoading: isLoadingProduct,
  } = useQuery({
    queryKey: ['product', id, isSuperAdmin],
    queryFn: () => fetchProduct(id, isSuperAdmin),
  });

  React.useEffect(() => {
    if (productError) {
      toast.error(
        productError?.response?.data?.message ||
          productError?.message ||
          'Network error'
      );
    }
  }, [productError]);

  const mutation = useMutation({
    mutationFn: (data) => {
      return deleteProduct(data, isSuperAdmin);
    },
  });

  async function onDelete() {
    setIsDeleting(true);
    const submissionPromise = new Promise((resolve, reject) => {
      mutation.mutate(id, {
        onSuccess: (data) => {
          resolve(data);
        },
        onError: (error) => {
          reject(error);
        },
        onSettled: () => {
          setIsDeleting(false);
        },
      });
    });

    toast.promise(submissionPromise, {
      loading: 'Deleting...',
      success: () => {
        setTimeout(() => {
          isSuperAdmin
            ? navigate(`${SUPER_ADMIN_ROUTES.inventory}`)
            : navigate(`/dashboard/inventory`);
          queryClient.invalidateQueries([
            'product',
            id,
            isSuperAdmin,
            'inventories',
          ]);
        }, 1000);
        return `Product deleted successfully`;
      },
      error: (error) =>
        `Error: ${
          error?.response?.data?.message ||
          error.message ||
          'Something went wrong'
        }`,
    });
  }
  if (isLoadingProduct) return <PageLoader />;

  return (
    <div className="flex flex-col w-full">
      <header className="flex items-center rounded-[24px]">
        <div className="flex items-center justify-end w-full grow">
          <div className="flex items-start gap-5">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className=" py-3 h-[45px] px-4 gap-2 border border-[#ECEEF4] bg-white rounded-[32px] font-medium text-[15px] text-[#8B909A] leading-[21px]"
                >
                  Delete
                  <TbTrash className="w-5 h-5 " />
                </Button>
              </DialogTrigger>
              <DialogContent className="gap-6 sm:max-w-[426px]">
                <DialogHeader>
                  <DialogTitle className="font-bold text-[22px] leading-[31px] text-[#45464E]">
                    Delete Product?
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-start gap-4 border-t-[0.5px] pt-6 mt-2 border-[#ECEEF4] ">
                  <p className="txt-[15px] leading-[21px] text-[#36454F] grow">
                    Are you sure you want to delete this product?
                  </p>
                </div>
                <div className="flex items-start w-full gap-1">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      varaint="secondary"
                      disabled={isLoadingProduct || isDeleting}
                      className="p-4 w-full h-[54px] rounded-[32px] bg-[#FCFBFA] font-bold text-[17px] leading-[23.8px] text-[#00070C] hover:text-white border border-[#5F5F5F] grow"
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    type="button"
                    disabled={isLoadingProduct || isDeleting}
                    onClick={onDelete}
                    className="p-4 w-full h-[54px] rounded-[32px] bg-[#00070C] font-bold text-[16px] leading-[22.4px] text-white"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              className="py-3 px-4 h-[45px] gap-2 border border-[#ECEEF4] bg-[#00070C] rounded-[32px] font-medium text-[15px] text-white leading-[21px]"
              onClick={() => {
                isSuperAdmin
                  ? navigate(SUPER_ADMIN_ROUTES.editEachProduct + id)
                  : navigate(ROUTE.editEachProduct + id);
              }}
            >
              <p className="text-[15px] leading-[21px]">Edit</p>
              <TbEdit className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </header>

      <section className="flex flex-col items-start justify-center p-6 gap-8 bg-white rounded-[8px] w-full mt-6">
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-wrap justify-center gap-6">
            {product?.images?.map((imageurl, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-2 p-0 w-fit"
              >
                <div className="w-fit ">
                  <FileUploader
                    files={[imageurl]}
                    disabled={true}
                    onChange={() => {}}
                    FileComponent={ProductImagePreview}
                    NoFileComponent={() => (
                      <NoProductImage main={index === 0} />
                    )}
                    isSingle={true}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start w-full ">
            {isSuperAdmin && (
              <div
                onClick={() =>
                  navigate(SUPER_ADMIN_ROUTES.productActivityLog + 'ID-011221')
                }
                className="flex items-center justify-center gap-2 cursor-pointer"
              >
                <p className="font-medium text-[17px] eading-[24px] text-[#E4572E]">
                  View activity logs
                </p>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6434_41287)">
                    <path
                      d="M19 12H5"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 12L15 16"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 12L15 8"
                      stroke="#E4572E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6434_41287">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="matrix(-1 0 0 1 24 0)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="flex flex-col items-start p-6 gap-8 bg-white rounded-[8px] mt-6">
        <section className="flex flex-col items-start gap-6 w-full border-b border-[#ECEEF4] pb-8">
          <h2 className="font-medium text-[16px] leading-[22px] text-[#00070C]">
            General Information
          </h2>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyInput
              labelName="Product Name"
              value={product?.name || 'N/A'}
            />
            <ReadOnlyInput
              labelName="Category"
              value={product?.category?.category_name || 'N/A'}
            />
            <ReadOnlyInput
              labelName="Brand"
              value={product?.brand?.brand_name || 'N/A'}
            />
            <ReadOnlyInput
              labelName="Description"
              value={product?.description || 'N/A'}
              descriptionInput
            />
            <ReadOnlyInput
              labelName="Product List"
              value={product?.product_list || 'N/A'}
              descriptionInput
            />
            {isSuperAdmin && (
              <ReadOnlyInput
                labelName="Partner"
                value={
                  product?.partner || product?.vendor?.company_name || 'N/A'
                }
              />
            )}
          </div>
        </section>

        <section className="flex flex-col items-start w-full gap-6 ">
          <h2 className="font-medium text-[16px] leading-[22px] text-[#00070C]">
            Product Variant
          </h2>
          {Array.isArray(product?.variants) &&
            product?.variants?.map((variant) => (
              <div
                key={variant.variant_id}
                className="flex flex-col w-full gap-6 border-b border-[#ECEEF4]  pb-8"
              >
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <ReadOnlyInput
                    labelName="Variation"
                    value={variant?.variation || ''}
                  />
                  <ReadOnlyInput
                    labelName="Price"
                    value={variant?.price || 0}
                    priceInput
                  />
                  <ReadOnlyInput
                    labelName="SKU"
                    value={variant?.sku || 'N/A'}
                  />
                  <ReadOnlyInput
                    labelName="Quantity in Stock"
                    value={variant?.stock || 'N/A'}
                  />
                  <ReadOnlyInput
                    labelName="Product Availability"
                    value={variant?.availability || 'N/A'}
                  />
                </div>

                <div className="flex flex-col w-full gap-6">
                  <div className="flex items-start justify-between w-full">
                    <h4 className="font-medium text-[16px] leading-[22.4px] text-[#8B8D97]">
                      Discount
                    </h4>
                    <p className="text-[14px] leading-[19.6px] text-right text-[#B2C2DC]">
                      {variant?.discount_type
                        ? 'Discount Applied'
                        : 'No Discount'}
                    </p>
                  </div>
                  {variant?.discount_type && (
                    <div className="grid w-full grid-cols-2 gap-5">
                      <ReadOnlyInput
                        labelName="Discount Type"
                        value={variant?.discount_type || 'N/A'}
                      />
                      <ReadOnlyInput
                        labelName="Discount Value (%)"
                        value={variant?.discount || 'N/A'}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
};

export default ProductDetailPage;

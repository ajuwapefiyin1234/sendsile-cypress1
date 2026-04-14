import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import images from '@/assets/images';
import InventoryCard from '@/components/InventoryCard';
import { maskId, returnColor } from '@/lib/reusable';

import { Checkbox } from '@/components/ui/checkbox';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OrderDataTable from '@/components/Tables/OrderDataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { viewPartnerDetails } from '@/utils/adminqueries';
import { toast } from 'sonner';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';

const inventoryConfig = {
  image: 'productImage',
  title: 'productName',
  subtitle: 'quantity',
  price: 'price',
  status: 'availability',
  id: 'orderID',
};

const NoDetailsPage = ({ navigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <img src={images.noOrderEmptyState} className="w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        No Details Found
      </h1>
      <p className="text-gray-500 mb-6">
        Sorry, there seems to be no available information or details for this
        page.
      </p>
      <Button
        className=" text-white px-4 py-2 rounded-lg"
        onClick={() => navigate(SUPER_ADMIN_ROUTES.partnerManagement)}
      >
        Go Back
      </Button>
    </div>
  );
};
NoDetailsPage.propTypes = {
  navigate: PropTypes.func.isRequired,
};

const PartnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inStockfilterValue, setInstockFilterValue] = useState('In Stock');

  const [availabilityParams, setAvailabilityParams] = useState('Availability');
  const [filterValue, setFilterValue] = useState('This Week');

  const {
    data: partner_data,
    error,
    isLoading: partner_loading,
    isFetching,
    isPlaceholderData,
    failureCount,
  } = useQuery({
    queryKey: ['partner', id],
    queryFn: () => viewPartnerDetails(id),
    placeholderData: keepPreviousData,
    enabled: !!id,
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
  }, [error]);

  async function saveChanges() {
    setIsLoading(true);
    queryClient.invalidateQueries(['partners', 'partner']);
    setIsLoading(false);
  }

  const partner = useMemo(
    () => ({
      PartnerInformation: [
        {
          title: 'Company Name',
          subtitle: partner_data?.company_name || 'N/A',
          backgroundColor: '#FFFFEE',
          rectangleColor: '#FFE9BC',
        },
        {
          title: 'Email',
          subtitle: partner_data?.vendor_email || 'N/A',
          backgroundColor: '#FFF8FF',
          rectangleColor: '#E7D1F8',
        },
        {
          title: 'Partner ID',
          subtitle: maskId(partner_data?.partner_id) || 'N/A',
          backgroundColor: '#F2FFFF',
          rectangleColor: '#B1F1CC',
        },
        {
          title: 'Register Since',
          subtitle: partner_data?.register_since || 'N/A',
          backgroundColor: '#FEFBF5',
          rectangleColor: '#F8D4C8',
        },
      ],
      CategoriesDetails: [
        {
          icon: images.dash,
          heading: 'Categories',
          subheading: 0,
        },
        {
          icon: images.bag,
          heading: 'Total Products',
          subheading: 0,
        },
        {
          icon: images.cart,
          heading: 'In Stock',
          subheading: 0,
        },
      ],
      data:
        Array.isArray(partner_data?.data?.products) && partner?.data?.length > 0
          ? partner?.data.map((inventory) => {
              const {
                category,
                images: inventoryImage,
                name,
                product_id,
                variants,
              } = inventory;

              return {
                orderID: product_id || 'N/A',
                productImage:
                  inventoryImage?.length > 0
                    ? inventoryImage[0]
                    : images.kingsvegetableoil,
                productName: name || 'Unknown Product',
                sku: variants[0]?.sku || 'N/A',
                category: category?.category_name || 'Unknown Category',
                quantity: variants[0]?.stock || 'N/A',
                price: variants[0]?.price || 'N/A',
                availability: variants[0]?.availability || 'Out of stock',
              };
            })
          : [],
    }),
    [
      partner_data?.data?.products,
      partner_data?.company_name,
      partner_data?.vendor_email,
      partner_data?.partner_id,
      partner_data?.register_since,
    ]
  );

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="w-4 h-4  p-0 border-[#D0D5DD]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="w-4 h-4 border-[#D0D5DD] "
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'productName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Product
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const productImage = row?.original?.productImage;
        return (
          <div className="flex items-center gap-4 relative ">
            <div className="w-10 h-10 border-[0.36px] border-[#EAECF0] rounded-[5.71px] bg-[#EDEFF4] absolute">
              <img
                src={productImage || images.kingsvegetableoil}
                alt="ico"
                className="object-contain  w-full h-full"
              />
            </div>

            <p className="text-[#8B909A] text-[15px] leading-[21px]  pl-12">
              {row.getValue('productName')}
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: 'sku',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            SKU
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('sku')}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Category
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('category')}
        </div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Quantity
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('quantity')}
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Price
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('price')}
        </div>
      ),
    },

    {
      accessorKey: 'availability',
      header: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className=" border-none ">
              <Button
                variant="ghost"
                className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
              >
                {availabilityParams || 'Availability'}
                <div className="flex flex-col gap-[1px] items-center justify-center">
                  <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
                  <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[168px] bg-white gap-2.5 p-3">
              <DropdownMenuItem
                onClick={() => setAvailabilityParams('in-stock')}
                className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
              >
                In-stock
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAvailabilityParams('low in stock')}
                className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
              >
                Low in Stock
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAvailabilityParams('out of stock')}
                className="p-2 text-[14px] leading-[19px] text-[#8B909A] "
              >
                Out of stock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      cell: ({ row }) => {
        const statusType = row.getValue('availability');

        return (
          <div className="flex items-start p-0 mix-blend-multiply">
            <div className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]">
              {/* <div
                  style={{
                    backgroundColor: returnColor(statusType).text,
                  }}
                  className="w-2 h-2 rounded-full"
                /> */}
              <p
                style={{ color: returnColor(statusType).text }}
                className="font-medium text-[12px] leading-[17px] text-center"
              >
                {statusType}
              </p>
            </div>
          </div>
        );
      },
    },
  ];

  const rightSideMenu = () => {
    return (
      <div className="flex items-center mx-auto gap-3.5 md:gap-5 justify-end flex-wrap grow">
        <Select
          onValueChange={(newValue) => setFilterValue(newValue)}
          value={filterValue}
        >
          <SelectTrigger className="box-border bg-white flex items-center py-[5px] px-2 gap-5 h-8 border border-[#EAECF2] text-[#878790] rounded-[8px] max-w-fit">
            <div className="flex  p-0 items-center gap-2">
              <p className="font-medium leading-[17px] text-[14px]">
                <SelectValue placeholder="This week" />
              </p>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
              value="All time"
            >
              All time
            </SelectItem>
            <SelectItem
              value="This Week"
              className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
            >
              This Week
            </SelectItem>
            <SelectItem
              value="This Month"
              className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
            >
              This Month
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };
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
              Are you sure you want deactivate partner?
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
                'Deactivate'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        {partner_loading ? (
          <div className="w-full h-80 flex md:flex-col gap-1 justify-center items-center relative">
            {/* <SubtleLoadingIndicator isLoading={isFetching} /> */}
            <SpinnerLoader />
            {failureCount > 1 && (
              <div className="text-sm text-gray-600 bg-gray-100 rounded-md p-3">
                <p>Processing... Please wait.</p>
              </div>
            )}
          </div>
        ) : error || !partner_data ? (
          <NoDetailsPage navigate={navigate} />
        ) : (
          <div className="flex flex-col w-full">
            <header className="flex items-center  rounded-[24px]">
              <div className="flex justify-end items-center w-full grow">
                <div className="flex items-start gap-5">
                  <div className="flex items-start p-0 gap-3">
                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setOpenModal(true)}
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
                            Deactivate Partner
                          </p>
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
                  <div className="box-border border-dashed border border-[#A6A8B1] rounded-[12px] w-[200px] h-[194px] p-0.5">
                    <div className="bg-[#FFF8EF] w-full h-full flex items-center justify-center rounded-[12px]">
                      <img
                        src={images.gallary}
                        alt="product"
                        className="object-contain w-[70px] h-[70px] "
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4  grow">
                <div className="grid grid-cols-2 gap-y-5 gap-x-4 w-full p-6 bg-white  rounded-[8px]">
                  {partner.PartnerInformation.map((partner, index) => (
                    <div
                      key={index}
                      style={{
                        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
                        background: partner.backgroundColor,
                      }}
                      className={`box-border flex items-center p-3 gap-[9px] w-full  h-[64px] rounded-[8px]`}
                    >
                      <div
                        style={{ background: partner.rectangleColor }}
                        className={`w-10 h-10  rounded-[4px]`}
                      />

                      <div className="flex flex-col items-start gap-2">
                        <h4 className="font-medium text-[16px] leading-[22.4px] text-[#2E2E2E]">
                          {partner.title}
                        </h4>

                        <p className="text-[13px] leading-[18.2px] text-[#71747D]">
                          {partner.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <section className="flex flex-col w-full py-5 md:py-7 px-4 md:px-6 gap-4 bg-white rounded-[8px]">
                  <div className="flex flex-col w-full md:flex-row items-start gap-4 md:gap-[19px]">
                    {partner.CategoriesDetails.map((item, index) => (
                      <InventoryCard
                        key={index}
                        icon={item.icon}
                        heading={item.heading}
                        subheading={item.subheading}
                        inStockfilterValue={inStockfilterValue}
                        setInstockFilterValue={setInstockFilterValue}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </section>

            <OrderDataTable
              orderName="Inventory List"
              data={partner.data}
              columns={columns}
              rightSideMenu={rightSideMenu}
              config={inventoryConfig}
              isFetchingTableItems={partner_loading}
              failureCount={failureCount}
              //   total={total}
              //   currentPage={currentPage}
              //   perPage={perPage}
              //   totalPages={totalPages}
              //   setCurrentPage={setCurrentPage}
              setPerPage={partner?.data?.length || 10}
              isFetching={isFetching}
              isPlaceholderData={isPlaceholderData}
              // filterSection={filterSection}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PartnerDetails;

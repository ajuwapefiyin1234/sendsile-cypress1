import images from '@/assets/images';
import InventoryCard from '@/components/InventoryCard';

import { useEffect, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import OrderDataTable from '@/components/Tables/OrderDataTable';
// import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  TbTriangleInvertedFilled,
  TbTriangleFilled,
  TbFilter,
  TbPlus,
} from 'react-icons/tb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { addCommasToNumber, returnColor } from '@/lib/reusable';
import { useNavigate } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleTransition } from '@/utils/handleTransition';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
import { useStore } from '@/store/store';
import { toast } from 'sonner';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { SkeletonInventoryCard } from '@/components/skeletons/SkeletonInventoryCard';
import { FilterBadge } from '@/components/FilterBadge';
import { AVAILABILITY, CATEGORIES } from '@/lib/constants';
import { fetchInventories, fetchStockStats } from '@/utils/queries';
import ExportButton from '@/components/ExportButton';

const inventoryConfig = {
  image: 'productImage',
  title: 'productName',
  subtitle: 'quantity',
  price: 'price',
  status: 'availability',
  id: 'orderID',
};
const SuperAdminInventoryPage = () => {
  const { setMeta, meta } = useStore((state) => state.inventory);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState('');
  const [total, setTotal] = useState(meta?.total || 0);
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
  const [perPage, setPerPage] = useState(meta?.per_page || 10);
  const [totalPages, setTotalPages] = useState(meta?.total_pages || 1);

  const [filters, setFilters] = useState({
    category: null,
    availability: null,
    priceRange: null,
  });

  const removeFilter = (type) => {
    setFilters((prev) => ({ ...prev, [type]: null }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: null,
      availability: null,
      priceRange: null,
    });
  };
  const [
    ,
    // availabilityParams
    setAvailabilityParams,
  ] = useState('all');
  const [filterValue, setFilterValue] = useState('This Week');
  const [inStockfilterValue, setInstockFilterValue] = useState('In Stock');

  useEffect(() => {
    if (meta) {
      setTotal(meta?.total);
      setCurrentPage(meta?.current_page);
      setPerPage(meta?.per_page || 10);
      setTotalPages(meta?.total_pages);
    }
  }, [meta]);

  const {
    data: inventories,
    error,
    isLoading,
    isFetching,
    isPlaceholderData,
    failureCount,
  } = useQuery({
    queryKey: ['inventories', currentPage, perPage, searchParams, filters],
    queryFn: () =>
      fetchInventories(currentPage, perPage, searchParams, filters, true),
    placeholderData: keepPreviousData,
  });

  const {
    data: stockData,
    error: stockError,
    isLoading: stockLoading,
  } = useQuery({
    queryKey: ['stockStats', inStockfilterValue],
    queryFn: () => fetchStockStats(inStockfilterValue, true),
  });

  useEffect(() => {
    setMeta(inventories?.meta);
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
    if (stockError) {
      toast.error(
        stockError?.response?.data?.message ||
          stockError?.message ||
          'Network error'
      );
    }
  }, [error, stockError, inventories?.meta, setMeta]);

  const inventoryData = useMemo(
    () => ({
      details: [
        {
          icon: images.dash,
          heading: 'Categories',
          subheading: stockData?.categories_count || 0,
        },
        {
          icon: images.bag,
          heading: 'Total Products',
          subheading: stockData?.products_count || 0,
        },
        {
          icon: images.cart,
          heading: inStockfilterValue,
          subheading: stockData?.products_availability_count || 0,
        },
      ],
      data:
        Array.isArray(inventories?.data) && inventories?.data?.length > 0
          ? inventories?.data.map((inventory) => {
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
      inventories,
      inStockfilterValue,
      stockData?.categories_count,
      stockData?.products_availability_count,
      stockData?.products_count,
    ]
  );

  const viewRow = (row) => {
    // console.log(row);
    //if clicked, take you to that row
    handleTransition(null, SUPER_ADMIN_ROUTES.eachProduct + row, navigate);
  };

  const onTableItemClicked = (row) => {
    const id = row?.original?.orderID;
    handleTransition(null, SUPER_ADMIN_ROUTES.eachProduct + id, navigate);
  };
  const columns = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="w-4 h-4  p-0 border-[#D0D5DD]"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onClick={(event) => {
    //         // event.preventDefault()
    //         // event.stopImmediatePropagation();
    //         event.stopPropagation();
    //       }}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="w-4 h-4 border-[#D0D5DD] "
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      name: 'Product',
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
            <div className="w-10 h-10 border-[0.36px] border-[#EAECF0] flex items-center justify-center rounded-[5.71px] bg-[#EDEFF4] absolute">
              <img
                src={productImage}
                alt=""
                className="w-full h-full object-fill rounded-[5px]"
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
      name: 'SKU',
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
      name: 'Category',
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
      name: 'Quantity',
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
      name: 'Price',
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
      cell: ({ row }) => {
        const price = row.getValue('price');
        return (
          <div className="text-[#8B909A] text-[15px] leading-[21px]">
            &#8358; {addCommasToNumber(price)}
          </div>
        );
      },
    },

    {
      name: 'Availability',
      accessorKey: 'availability',
      header: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className=" border-none ">
              <Button
                variant="ghost"
                className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
              >
                Availability
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

  const filterSection = () => {
    return (
      <section className="flex flex-wrap items-center gap-2 mt-4">
        {filters.category && (
          <FilterBadge
            type="Category"
            value={filters?.category?.name || ''}
            onRemove={() => removeFilter('category')}
          />
        )}
        {filters.availability && (
          <FilterBadge
            type="Availability"
            value={filters?.availability || ''}
            onRemove={() => removeFilter('availability')}
          />
        )}
        {filters.priceRange && (
          <FilterBadge
            type="Price Range"
            value={`₦${filters?.priceRange?.from || ''} - ₦${
              filters?.priceRange?.to || ''
            }`}
            onRemove={() => removeFilter('priceRange')}
          />
        )}
        {(filters.category || filters.availability || filters.priceRange) && (
          <Button
            variant="ghost"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        )}
      </section>
    );
  };

  const rightSideMenu = () => {
    return (
      <div className="flex items-center mx-auto gap-3.5 md:gap-5 justify-end flex-wrap grow">
        <div className="relative w-full md:w-fit flex gap-6">
          <div className="absolute top-0 inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <IoIosSearch size={16} className="text-[#8B909A]" />
          </div>
          <Input
            placeholder={'Search'}
            value={searchParams}
            onChange={(event) => {
              setCurrentPage(1);
              setSearchParams(event?.target?.value);
            }}
            className="rounded-[7px] w-full md:w-[197px] py-2 pr-2  bg-white  h-9 pl-8 text-[14px] placeholder:text-[#8B909A]  border border-[#ECEEF4]"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'outline'}
              className="text-[14px] leading-[20px] text-[#8B909A] box-border items-center p-2 gap-2 h-9 bg-white border border-[#ECEEF4] rounded-[7px] "
            >
              <TbFilter className="w-4 h-4" />
              <p>Filter</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[168px] bg-white gap-2.5 p-3">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                <span>Category</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {CATEGORIES?.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          category: {
                            name: category.name,
                            id: category.id,
                          },
                        }))
                      }
                      className="p-2 text-[14px] leading-[19px] text-[#8B909A]"
                    >
                      <span>{category.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                <span>Availability</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {AVAILABILITY.map((availability) => (
                    <DropdownMenuItem
                      key={availability.id}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          availability: availability.name,
                        }))
                      }
                      className="p-2 text-[14px] leading-[19px] text-[#8B909A]"
                    >
                      <span>{availability.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="p-2 text-[14px] leading-[19px] text-[#8B909A]">
                <span>Price range</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <div className="p-3 flex items-start flex-col gap-2 w-[275px]">
                    <h4 className="text-[#8B909A] text-[14px] leading-[20px]">
                      Price
                    </h4>
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex flex-col items-start gap-1 grow">
                        <Label className="font-medium text-[12px] leading-[17px] text-[#8B909A]">
                          From
                        </Label>
                        <Input
                          className="py-[7px] px-3 text-[#8B909A] text-[14px] leading-[20px] gap-2.5 bg-white border border-[#ECEEF4] rounded-[8px]"
                          defaultValue="0.00"
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: {
                                ...prev.priceRange,
                                from: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="flex flex-col items-start gap-1 grow">
                        <Label className="font-medium text-[12px] leading-[17px] text-[#8B909A]">
                          To
                        </Label>
                        <Input
                          className="py-[7px] px-3 text-[#8B909A] text-[14px] leading-[20px] gap-2.5 bg-white border border-[#ECEEF4] rounded-[8px]"
                          defaultValue="0.00"
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: {
                                ...prev.priceRange,
                                to: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <ExportButton
          data={inventoryData.data}
          headers={columns.map((column) => ({
            name: column.name,
            accessor: column.accessorKey,
          }))}
          filename="inventory_export"
        />

        <Button
          type="button"
          onClick={(e) =>
            handleTransition(e, SUPER_ADMIN_ROUTES.addProduct, navigate)
          }
          className="h-[45px] py-3 px-4 bg-[#00070C] border gap-2 border-[#ECEEF4] rounded-[32px] text-white leading-[21px] font-medium text-[15px]"
        >
          <TbPlus className="w-5 h-5" />
          <span>Add Product</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <section className="flex flex-col py-5 md:py-7 px-4 md:px-6 gap-4 bg-white rounded-[8px]">
        <header className="flex items-start p-0 gap-4">
          <h2 className="font-medium text-[16px] leading-[22px] text-[#0D1415] grow">
            Overall Inventory
          </h2>

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
        </header>

        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-[19px]">
          {stockLoading ? (
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-[19px] w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonInventoryCard key={index} />
              ))}
            </div>
          ) : (
            inventoryData.details.map((item, index) => (
              <InventoryCard
                key={index}
                icon={item.icon}
                heading={item.heading}
                subheading={item.subheading}
                inStockfilterValue={inStockfilterValue}
                setInstockFilterValue={setInstockFilterValue}
              />
            ))
          )}
        </div>
      </section>

      <OrderDataTable
        orderName="Products"
        data={inventoryData.data}
        columns={columns}
        rightSideMenu={rightSideMenu}
        config={inventoryConfig}
        viewRow={viewRow}
        onTableItemClicked={onTableItemClicked}
        isFetchingTableItems={isLoading}
        failureCount={failureCount}
        total={total}
        currentPage={currentPage}
        perPage={perPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        setPerPage={setPerPage}
        isFetching={isFetching}
        isPlaceholderData={isPlaceholderData}
        filterSection={filterSection}
      />
    </div>
  );
};
export default SuperAdminInventoryPage;

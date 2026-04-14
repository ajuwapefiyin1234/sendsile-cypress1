import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import OrderDataTable from '@/components/Tables/OrderDataTable';
import { Button } from '@/components/ui/button';
import {
  TbTriangleInvertedFilled,
  TbTriangleFilled,
  TbFilter,
} from 'react-icons/tb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoIosSearch } from 'react-icons/io';
import { Input } from '@/components/ui/input';
import { format, subDays } from 'date-fns';
import { TbCalendarMonth } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { addCommasToNumber, maskId, returnColor } from '@/lib/reusable';
import { RxDotsHorizontal } from 'react-icons/rx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE } from '@/routes';
import { handleTransition } from '@/utils/handleTransition';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getOrders } from '@/utils/queries';
import { toast } from 'sonner';
import { useStore } from '@/store/store';
import ExportButton from '@/components/ExportButton';

const ordersConfig = {
  image: null, // No image for orders data
  title: 'customerName',
  subtitle: 'product',
  price: 'price',
  status: 'status',
  id: 'orderID',
};

const OrderManagementPage = () => {
  const { setMeta, meta } = useStore((state) => state.order);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchBarParams, setBarSearchParams] = useState('');
  const [total, setTotal] = useState(meta?.total || 0);
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
  const [perPage, setPerPage] = useState(meta?.per_page || 10);
  const [totalPages, setTotalPages] = useState(meta?.total_pages || 1);
  // const [filteredData, setFilteredData] = useState([]);
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  // const [isMobile, setIsMobile] = useState(1);
  const activeTab = searchParams.get('tab') || 'Pending';
  useEffect(() => {
    if (meta) {
      setTotal(meta?.total);
      setCurrentPage(meta?.current_page);
      setPerPage(meta?.per_page || 10);
      setTotalPages(meta?.total_pages);
    }
  }, [meta]);

  const {
    data: orders,
    error,
    isLoading,
    failureCount,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      'orders',
      activeTab,
      currentPage,
      perPage,
      searchBarParams,
      date?.from,
      date?.to,
      date,
    ],
    queryFn: () =>
      getOrders(
        activeTab.toLowerCase(),
        currentPage,
        perPage,
        searchBarParams,
        date?.from ? format(new Date(date.from), 'yyyy-MM-dd') : '', //end date
        date?.to ? format(new Date(date.to), 'yyyy-MM-dd') : '' //start date
      ),
    placeholderData: keepPreviousData,
  });

  //   console.log('orders: ', orders);
  useEffect(() => {
    setMeta(orders?.meta);
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
  }, [error, orders?.meta, setMeta]);

  const handleDateChange = (value) => {
    let newToDate = new Date(); // Always end at today
    let newFromDate;

    switch (value) {
      case '0': // Today
        newFromDate = newToDate;
        break;
      case '1': // Yesterday
        newFromDate = subDays(newToDate, 1);
        newToDate = subDays(newToDate, 1); // Yesterday's date for both from and to
        break;
      case '7': // Last 7 days
        newFromDate = subDays(newToDate, 7); // From 7 days ago to today
        break;
      case '30': // Last 30 days
        newFromDate = subDays(newToDate, 30); // From 30 days ago to today
        break;
      default:
        newFromDate = newToDate;
    }

    setDate((prev) => ({
      ...prev,
      to: newToDate,
      from: newFromDate,
    }));
  };

  const viewRow = (row) => {
    // console.log(row);
    //if clicked, take you to that row
    navigate(ROUTE.eachOrder + row);
  };

  const onTableItemClicked = (row) => {
    const id = row?.original?.orderID;
    handleTransition(null, ROUTE.eachOrder + id, navigate);
    // navigate(ROUTE.eachOrder + id);
  };
  const columns = [
    {
      name: 'Order ID',
      accessorKey: 'orderID',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Order ID
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const orderId = row?.getValue('orderID') || '0';
        return <div className="">{maskId(orderId)}</div>;
      },
    },
    {
      name: 'Customer name',
      accessorKey: 'customerName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Customer Name
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue('customerName')}</div>,
    },
    {
      name: 'Product',
      accessorKey: 'product',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Product
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm capitalize text-[#383838]">
          {row.getValue('product')}
        </div>
      ),
    },
    {
      name: 'Date',
      accessorKey: 'date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue('date')}</div>,
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
        return <div className="">&#8358;{addCommasToNumber(price)}</div>;
      },
    },

    {
      name: 'Status',
      accessorKey: 'status',
      header: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className=" border-none ">
              <Button
                variant="ghost"
                className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
                // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Status
                <div className="flex flex-col gap-[1px] items-center justify-center">
                  <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
                  <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[168px] bg-white gap-2.5 p-3">
              <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                All
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                In progress
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A]">
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      cell: ({ row }) => {
        const statusType = row.getValue('status');

        return (
          <div className="flex items-start p-0 mix-blend-multiply">
            <div
              style={{
                backgroundColor: returnColor(statusType).bg,
              }}
              className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]"
            >
              <div
                style={{
                  backgroundColor: returnColor(statusType).text,
                }}
                className="w-2 h-2 rounded-full"
              />
              <p
                style={{ color: returnColor(statusType).text }}
                className="font-medium text-[12px] leading-[17px] text-center capitalize"
              >
                {statusType}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      name: '',
      id: 'actions',
      enableHiding: false,
      cell: () => {
        // const id = row?.original?.orderID;
        return (
          <RxDotsHorizontal size={20} className="w-5 h-5 text-[#8B909A]" />
        );
      },
    },
  ];

  const NavTab = ({ title }) => (
    <div
      className={`${
        title === 'Cancelled' && 'hidden md:block'
      } box-border cursor-pointer flex items-center py-2 px-1 md:px-5 gap-2.5 border-b-[2px] transition-colors duration-300 ease-in-out hover:bg-accent ${
        activeTab === title ? 'border-[#E4572E]' : 'border-transparent'
      } rounded-t-[6px]`}
      onClick={() => setSearchParams({ tab: title })}
    >
      <h2
        className={`font-medium text-[15px] leading-[21px] flex items-center transition-colors duration-300 ease-in-out ${
          activeTab === title ? 'text-[#E4572E]' : 'text-[#8B909A]'
        }`}
      >
        {title}
      </h2>
    </div>
  );

  NavTab.propTypes = {
    title: PropTypes.string,
  };

  const rightSideMenu = () => {
    return (
      <div className="flex items-start mx-auto gap-3.5 md:gap-5 justify-end flex-wrap grow w-fit">
        <div className="relative w-full md:w-fit flex gap-6">
          <div className="absolute top-0 inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <IoIosSearch size={16} className="text-[#8B909A]" />
          </div>
          <Input
            placeholder={'Search by product'}
            value={searchBarParams}
            onChange={(event) => {
              setCurrentPage(1);
              setBarSearchParams(event?.target?.value);
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
              <p>Status</p>{' '}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[168px] bg-white gap-2.5 p-3">
            <DropdownMenuItem
              onClick={() => setSearchParams({ tab: 'Shipped' })}
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
            >
              Shipped
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSearchParams({ tab: 'Pending' })}
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSearchParams({ tab: 'Completed' })}
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
            >
              Completed
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setSearchParams({ tab: 'Cancelled' })}
              className="p-2 text-[14px] leading-[19px] text-[#8B909A]"
            >
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Select onValueChange={handleDateChange}>
          <SelectTrigger
            removeIcon
            className="px-0 py-0 h-fit border-none w-fit"
          >
            <div
              className={cn(
                'flex text-[14px] leading-[20px] text-[#8B909A]  box-border items-center p-2 gap-2 h-9 bg-white border border-[#ECEEF4] rounded-[7px] text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <TbCalendarMonth className=" h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <SelectValue placeholder="Date" />
              )}
            </div>
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem
              className="text-[14px] py-2 leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
              value="0"
            >
              Today
            </SelectItem>
            <SelectItem
              className="text-[14px] py-2 leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
              value="1"
            >
              Yesterday
            </SelectItem>
            <SelectItem
              className="text-[14px] py-2 leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
              value="7"
            >
              Last Week
            </SelectItem>
            <SelectItem
              className="text-[14px] py-2 leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
              value="30"
            >
              Last Month
            </SelectItem>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative flex py-2 w-full cursor-default select-none items-center rounded-sm  pl-8 pr-2 text-sm outline-none focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <p className="text-[14px] leading-[19px] text-[#8B909A]">
                    Custom Range
                  </p>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="rounded-md border">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date > new Date()}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </SelectContent>
        </Select>

        <ExportButton
          data={orderData.data}
          headers={columns.map((column) => ({
            name: column.name,
            accessor: column.accessorKey,
          }))}
          filename="order_management_export"
        />
      </div>
    );
  };

  const orderData = useMemo(
    () => ({
      data:
        Array.isArray(orders?.data) && orders?.data?.length > 0
          ? orders?.data?.map((littleOrder) => {
              const {
                order_id,
                order_details,
                total_items,
                status,
                sub_total,
                service_fee,
                delivery_fee,
                discount,
                total,
                payment_method,
                order_date,
                payment_reference,
                customer_name,
              } = littleOrder;

              // Format the order date using date-fns
              const formattedDate = format(new Date(order_date), 'd/MM/yyyy');

              // Join all product names with a comma
              const productNames =
                order_details?.products
                  ?.map((product) => product.product_name)
                  .join(', ') || 'N/A';

              return {
                orderID: order_id,
                customerName: customer_name || 'N/A',
                product: productNames,
                date: formattedDate,
                price: total,
                status: status,
                service_fee,
                total_items,
                sub_total,
                delivery_fee,
                discount,
                payment_method,
                payment_reference,
              };
            })
          : [],
    }),
    [orders]
  );

  return (
    <div className="w-full gap-4 flex  flex-col">
      <section className="box-border flex items-center py-2 md:px-6 md:gap-2 bg-white border border-[#ECEEF4] rounded-[8px] w-full justify-between md:justify-start">
        <NavTab title="Pending" />
        <NavTab title="Processing" />
        <NavTab title="Shipped" />
        <NavTab title="Completed" />
        <NavTab title="Cancelled" />
      </section>

      <OrderDataTable
        orderName="Customer Orders"
        data={orderData.data}
        columns={columns}
        rightSideMenu={rightSideMenu}
        config={ordersConfig}
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
      />
    </div>
  );
};

export default OrderManagementPage;

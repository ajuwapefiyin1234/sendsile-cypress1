import images from '@/assets/images';
import InventoryCard from '@/components/InventoryCard';
import OrderDataTable from '@/components/Tables/OrderDataTable';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import {
  TbCalendarMonth,
  TbFilter,
  TbTriangleFilled,
  TbTriangleInvertedFilled,
} from 'react-icons/tb';
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
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { returnColor } from '@/lib/reusable';
import { useNavigate } from 'react-router-dom';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
const inventoryData = {
  details: [
    {
      icon: images.walletIcon,
      heading: 'Wallet Balance',
      subheading: '₦28,356.00',
    },
    {
      icon: images.bag,
      heading: 'Total Purchase',
      subheading: 10,
    },
    {
      icon: images.cart,
      heading: 'Pending',
      subheading: 0,
    },
  ],
  data: [],
};

const inventoryConfig = {
  image: 'productImage',
  title: 'productName',
  subtitle: 'quantity',
  price: 'price',
  status: 'availability',
  id: 'orderID',
};

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  const [filterValue, setFilterValue] = useState('This Week');
  const handleDateChange = (value) => {
    let newDate;
    switch (value) {
      case '0':
        newDate = new Date();
        break;
      case '1':
        newDate = subDays(new Date(), 1);
        break;
      case '7':
        newDate = subWeeks(new Date(), 1);
        break;
      case '30':
        newDate = subMonths(new Date(), 1);
        break;
      default:
        newDate = new Date();
    }
    setDate(newDate);
  };
  const customerData = [
    {
      icon: images.securityBadge,
      title: 'Customer ID',
      subtitle: 'ID-011221',
    },
    {
      icon: images.emailbadge,
      title: 'E-mail',
      subtitle: 'chinedueze79@gmail.com',
    },
    {
      icon: images.locationbadge,
      title: 'Address',
      subtitle: 'No. 15 Adekunle Street, Yaba, Lagos State',
    },
    {
      icon: images.phoneBadge,
      title: 'Phone Number',
      subtitle: '+23490414878',
    },
    {
      icon: images.clockbadge,
      title: 'Customer Since',
      subtitle: '48 Days Ago',
    },
    {
      icon: images.inboxbadge,
      title: 'Last Order',
      subtitle: '12 January 2024',
    },
  ];

  const columns = [
    {
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
      cell: ({ row }) => <div className="">{row.getValue('orderID')}</div>,
    },
    {
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
      cell: ({ row }) => <div className="">{row.getValue('price')}</div>,
    },

    {
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
              //   style={{
              //     backgroundColor: returnColor(statusType).bg,
              //   }}
              className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]"
            >
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
        <Select onValueChange={handleDateChange}>
          <SelectTrigger
            removeIcon
            className="px-0 py-0 h-fit border-none w-fit"
          >
            <div
              // variant={"outline"}
              className={cn(
                'text-[14px] leading-[20px] text-[#8B909A] flex  box-border items-center p-2 gap-2 h-9 bg-white border border-[#ECEEF4] rounded-[7px] text-left font-normal',
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
                    numberOfMonths={1}
                    disabled={(date) => date > new Date()}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </SelectContent>
        </Select>

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
                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                    <span>Fruits</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                    <span>Foodstuff</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                    <span>Oil & Spices</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                    <span>Soup & ingredients</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                    <span>Drinks & beverages</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] ">
                    <span>Meat, poutry & seafood</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                <span>Availability</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                    <span>In-stock</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                    <span>Low in Stock</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] ">
                    <span>Out of stock</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="p-2 text-[14px] leading-[19px] text-[#8B909A] ">
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
                        />
                      </div>

                      <div className="flex flex-col items-start gap-1 grow">
                        <Label className="font-medium text-[12px] leading-[17px] text-[#8B909A]">
                          To
                        </Label>
                        <Input
                          className="py-[7px] px-3 text-[#8B909A] text-[14px] leading-[20px] gap-2.5 bg-white border border-[#ECEEF4] rounded-[8px]"
                          defaultValue="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  return (
    <div className="flex flex-col items-start py-6  gap-4 w-full">
      <div className="w-full flex justify-end items-center">
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
      <div className="flex items-start  gap-4 w-full">
        <aside className="flex flex-col items-start gap-6 w-1/3">
          <div
            style={{ boxShadow: '0px 4px 30px rgba(46, 45, 116, 0.05)' }}
            className="flex flex-col items-center gap-6 bg-white rounded-[12px] w-full pb-6 px-2 pt-2"
          >
            <div className="bg-[#FFF8EF] rounded-[4px] w-full h-[148px]" />

            <div className="flex flex-col items-center gap-3 w-full -mt-24 z-10">
              <div className="flex items-start bg-[#E0E2E7] p-0 gap-2 w-[148px] h-[148px] rounded-full">
                {/* avatar */}
              </div>
              <div className="flex flex-col items-center justify-center p-0 gap-2">
                <h2 className="font-medium text-[16px] leading-[22px] text-center text-[#353535]">
                  Chinedu Eze
                </h2>
                <div className="flex items-center justify-center py-0.5 px-2 gap-1.5 bg-[#ECFDF3] rounded-[16px]">
                  <div className="w-2 h-2 bg-[#12B76A] rounded-full" />
                  <p className="font-medium text-[12px] leading-[17px] text-center text-[#027A48]">
                    Active
                  </p>
                </div>
              </div>
            </div>

            {/* horizontal line */}
            <div className="w-full px-4">
              <div className="w-full  bg-[#E0E2E7] h-[1px]" />
            </div>

            <div className="flex flex-col items-start gap-[18px] w-full px-4">
              {customerData?.map((detail, index) => (
                <div className="flex items-start gap-2" key={index}>
                  <img src={detail.icon} className="w-10 h-10" />
                  <div className="flex flex-col items-start justify-center gap-1 grow">
                    <h6 className="text-[12px] leading-[17px] text[#667085]">
                      {detail.title}
                    </h6>
                    <p className="font-medium text-[14px] leading-[20px] text-[#353535]">
                      {detail.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              onClick={() =>
                navigate(SUPER_ADMIN_ROUTES.customerActivityLog + 'ID-011221')
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
          </div>
        </aside>
        <div className="w-2/3 flex flex-col gap-4">
          <section className="flex flex-col py-5 md:py-7 px-4 md:px-6 gap-4 bg-white rounded-[8px]">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-[19px]">
              {inventoryData.details.map((item, index) => (
                <InventoryCard
                  key={index}
                  icon={item.icon}
                  heading={item.heading}
                  subheading={item.subheading}
                />
              ))}
            </div>
          </section>

          <OrderDataTable
            orderName="Transaction History"
            data={inventoryData.data}
            columns={columns}
            rightSideMenu={rightSideMenu}
            config={inventoryConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;

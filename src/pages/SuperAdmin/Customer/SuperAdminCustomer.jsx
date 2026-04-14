import OrderDataTable from '@/components/Tables/OrderDataTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
import { handleTransition } from '@/utils/handleTransition';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosSearch } from 'react-icons/io';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
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


import ExportButton from '@/components/ExportButton';

const customerData = {
  data: [
    {
      orderID: 'ID-011221',
      customerName: 'Adeyinka Ogunleye',
      email: 'chinedueze79@gmail.com',
      phoneNumber: '07045532101',
      dateRegistered: '12/06/2024',
      lastActive: '12/06/2024',
      status: 'Active',
    },
    {
      orderID: 'ID-011222',
      customerName: 'Ngozi Okafor',
      email: 'ngozi.okafor@example.com',
      phoneNumber: '08012345678',
      dateRegistered: '15/06/2024',
      lastActive: '15/06/2024',
      status: 'Inactive',
    },
    {
      orderID: 'ID-011223',
      customerName: 'Chukwuemeka Nwankwo',
      email: 'chukwuemeka.nwankwo@example.com',
      phoneNumber: '08123456789',
      dateRegistered: '18/06/2024',
      lastActive: '18/06/2024',
      status: 'InActive',
    },
    {
      orderID: 'ID-011224',
      customerName: 'Ifeoma Ude',
      email: 'ifeoma.ude@example.com',
      phoneNumber: '09012345678',
      dateRegistered: '20/06/2024',
      lastActive: '20/06/2024',
      status: 'Active',
    },
    {
      orderID: 'ID-011225',
      customerName: 'Emeka Nnamdi',
      email: 'emeka.nnamdi@example.com',
      phoneNumber: '07098765432',
      dateRegistered: '22/06/2024',
      lastActive: '22/06/2024',
      status: 'Inactive',
    },
    {
      orderID: 'ID-011226',
      customerName: 'Chinonso Eze',
      email: 'chinonso.eze@example.com',
      phoneNumber: '08087654321',
      dateRegistered: '25/06/2024',
      lastActive: '25/06/2024',
      status: 'Active',
    },
    {
      orderID: 'ID-011227',
      customerName: 'Aisha Bello',
      email: 'aisha.bello@example.com',
      phoneNumber: '08134567890',
      dateRegistered: '28/06/2024',
      lastActive: '28/06/2024',
      status: 'Inactive',
    },
    {
      orderID: 'ID-011228',
      customerName: 'Mohammed Yusuf',
      email: 'mohammed.yusuf@example.com',
      phoneNumber: '09023456789',
      dateRegistered: '01/07/2024',
      lastActive: '01/07/2024',
      status: 'Inactive',
    },
    {
      orderID: 'ID-011229',
      customerName: 'Zainab Ahmed',
      email: 'zainab.ahmed@example.com',
      phoneNumber: '07023456789',
      dateRegistered: '03/07/2024',
      lastActive: '03/07/2024',
      status: 'Active',
    },
    {
      orderID: 'ID-011230',
      customerName: 'Jide Martins',
      email: 'jide.martins@example.com',
      phoneNumber: '08034567890',
      dateRegistered: '05/07/2024',
      lastActive: '05/07/2024',
      status: 'Active',
    },
  ],
};

const customerConfig = {
  image: null, // No image for orders data
  title: 'customerName',
  subtitle: 'email',
  price: 'dateRegistered',
  status: 'lastActive',
  id: 'orderID',
};

const SuperAdminCustomer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchBarParams, setBarSearchParams] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  const [isMobile, setIsMobile] = useState(1);
  const activeTab = searchParams.get('tab') || 'Active';

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
  const navigate = useNavigate();

  const viewRow = (row) => {
    // console.log(row);
    //if clicked, take you to that row

    handleTransition(null, SUPER_ADMIN_ROUTES.customerDetails + row, navigate);
  };

  const onTableItemClicked = (row) => {
    const id = row?.original?.orderID;
    handleTransition(null, SUPER_ADMIN_ROUTES.customerDetails + id, navigate);
    // navigate(ROUTE.eachOrder + id);
  };
  const columns = [
    {
      id: 'select',
      name: '',
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
      name: 'Order ID',
      accessorKey: 'orderID',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Customer ID
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
      name: 'Email',
      accessorKey: 'email',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Email
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm capitalize text-[#383838]">
          {row.getValue('email')}
        </div>
      ),
    },
    {
      name: 'Phone number',
      accessorKey: 'phoneNumber',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Phone Number
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue('phoneNumber')}</div>,
    },
    {
      name: 'Date registered',
      accessorKey: 'dateRegistered',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date Registered
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="">{row.getValue('dateRegistered')}</div>
      ),
    },

    {
      name: 'Last active',
      accessorKey: 'lastActive',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Last Active
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue('lastActive')}</div>,
    },
  ];

  useEffect(() => {
    // Filter data based on the active tab
    if (activeTab === 'All') {
      setFilteredData(customerData.data);
    } else {
      setFilteredData(
        customerData.data.filter((order) =>
          order?.status?.toLowerCase().includes(activeTab?.toLowerCase())
        )
      );
    }
  }, [activeTab]);

  useEffect(() => {
    const updateSide = () => {
      if (window.innerWidth < 768) {
        setIsMobile(1);
      } else {
        setIsMobile(2);
      }
    };

    window.addEventListener('resize', updateSide);
    updateSide(); // Initial call

    return () => {
      window.removeEventListener('resize', updateSide);
    };
  }, []);

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
            placeholder={'Search'}
            value={searchBarParams}
            onChange={(event) => {
              setBarSearchParams(event?.target?.value);
              //   handlePageChange(
              //     event?.target?.value || "",
              //     currentPage,
              //     perPage
              //   );
            }}
            className="rounded-[7px] w-full md:w-[197px] py-2 pr-2  bg-white  h-9 pl-8 text-[14px] placeholder:text-[#8B909A]  border border-[#ECEEF4]"
          />
        </div>

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
                    numberOfMonths={isMobile}
                    disabled={(date) => date > new Date()}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </SelectContent>
        </Select>

        <ExportButton
          data={customerData.data}
          headers={columns.map((column) => ({
            name: column.name,
            accessor: column.accessorKey,
          }))}
          filename="customer_export"
        />
      </div>
    );
  };

  return (
    <div className="w-full gap-4 flex  flex-col">
      <section className="box-border flex items-center py-2 md:px-6 md:gap-2 bg-white border border-[#ECEEF4] rounded-[8px] w-full justify-between md:justify-start">
        <NavTab title="Active" />
        <NavTab title="Inactive" />
      </section>

      <OrderDataTable
        orderName="Customer Orders"
        data={filteredData}
        columns={columns}
        rightSideMenu={rightSideMenu}
        searchParams={searchBarParams}
        config={customerConfig}
        viewRow={viewRow}
        onTableItemClicked={onTableItemClicked}
      />
    </div>
  );
};

export default SuperAdminCustomer;

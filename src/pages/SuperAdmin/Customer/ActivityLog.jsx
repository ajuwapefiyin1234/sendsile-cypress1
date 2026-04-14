import OrderDataTable from '@/components/Tables/OrderDataTable';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { returnColor } from '@/lib/reusable';
import { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
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

const data = [
  {
    time: '12/06/2024, 12:45 PM',
    activityDescription: 'Order #1234 Placed',
    ipAddress: '192.168.1.10',
    status: 'Successful',
  },
  {
    time: '12/06/2024, 1:15 PM',
    activityDescription: 'Order #1235 Shipped',
    ipAddress: '192.168.1.11',
    status: 'Successful',
  },
  {
    time: '12/06/2024, 2:30 PM',
    activityDescription: 'Order #1236 Delivered',
    ipAddress: '192.168.1.12',
    status: 'Successful',
  },
  {
    time: '12/06/2024, 3:00 PM',
    activityDescription: 'Order #1237 Canceled',
    ipAddress: '192.168.1.13',
    status: 'Failed',
  },
  {
    time: '12/06/2024, 4:15 PM',
    activityDescription: 'Profile Updated',
    ipAddress: '192.168.1.14',
    status: 'Successful',
  },
  {
    time: '12/06/2024, 5:00 PM',
    activityDescription: 'Password Changed',
    ipAddress: '192.168.1.15',
    status: 'Successful',
  },
  {
    time: '12/06/2024, 6:30 PM',
    activityDescription: 'Order #1238 Placed',
    ipAddress: '192.168.1.16',
    status: 'Successful',
  },
  {
    time: '12/07/2024, 8:00 AM',
    activityDescription: 'Order #1239 Shipped',
    ipAddress: '192.168.1.17',
    status: 'Successful',
  },
  {
    time: '12/07/2024, 9:45 AM',
    activityDescription: 'Order #1240 Delivered',
    ipAddress: '192.168.1.18',
    status: 'Successful',
  },
  {
    time: '12/07/2024, 11:00 AM',
    activityDescription: 'Order #1241 Returned',
    ipAddress: '192.168.1.19',
    status: 'Failed',
  },
];

const ActivityLog = () => {
  const [searchParams, setSearchParams] = useState('');
  const [status, setStatus] = useState('All');
  const [filteredData, setFilteredData] = useState([]);
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
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
  const columns = [
    {
      name: 'Time',
      accessorKey: 'time',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Time
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('time')}
        </div>
      ),
    },

    {
      name: 'Activity description',
      accessorKey: 'activityDescription',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Activity Description
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('activityDescription')}
        </div>
      ),
    },

    {
      name: 'IP Address',
      accessorKey: 'ipAddress',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            IP Address
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('ipAddress')}
        </div>
      ),
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
              >
                Status
                <div className="flex flex-col gap-[1px] items-center justify-center">
                  <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
                  <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[168px] bg-white gap-2.5 p-3">
              <DropdownMenuItem
                onClick={() => setStatus('All')}
                className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatus('Successful')}
                className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
              >
                Successful
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatus('Failed')}
                className="p-2 text-[14px] leading-[19px] text-[#8B909A] "
              >
                Failed
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
        <div className="relative w-full md:w-fit flex gap-6">
          <div className="absolute top-0 inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <IoIosSearch size={16} className="text-[#8B909A]" />
          </div>
          <Input
            placeholder={'Search'}
            value={searchParams}
            onChange={(event) => {
              setSearchParams(event?.target?.value);
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
                    numberOfMonths={1}
                    disabled={(date) => date > new Date()}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </SelectContent>
        </Select>

        <ExportButton
          data={data}
          headers={columns.map((column) => ({
            name: column.name,
            accessor: column.accessorKey,
          }))}
          filename="activity_logs_export"
        />
      </div>
    );
  };

  useEffect(() => {
    if (status === 'All') {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((inventory) =>
          inventory?.status.toLowerCase().includes(status?.toLowerCase())
        )
      );
    }
  }, [status]);
  return (
    <div className="flex flex-col gap-4 w-full">
      <OrderDataTable
        orderName="Customers Log"
        data={filteredData}
        columns={columns}
        searchParams={searchParams}
        rightSideMenu={rightSideMenu}
        // config={inventoryConfig}
      />
    </div>
  );
};

export default ActivityLog;

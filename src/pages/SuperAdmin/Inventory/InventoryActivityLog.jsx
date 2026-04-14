import OrderDataTable from '@/components/Tables/OrderDataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
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
    updated_by: 'Partner (Tantacom)',
    activity: 'Updated product',
  },
  {
    time: '12/06/2024, 1:15 PM',
    activityDescription: 'Order #1234 Confirmed',
    updated_by: 'Admin (CIDI)',
    activity: 'Confirmed order',
  },
  {
    time: '12/06/2024, 1:30 PM',
    activityDescription: 'Order #1235 Placed',
    updated_by: 'Customer (Adamu Usman)',
    activity: 'Created order',
  },
  {
    time: '12/06/2024, 2:00 PM',
    activityDescription: 'Order #1234 Shipped',
    updated_by: 'Logistics (Eagle Express)',
    activity: 'Shipped order',
  },
  {
    time: '12/06/2024, 3:45 PM',
    activityDescription: 'Order #1236 Placed',
    updated_by: 'Customer (Chinwe Okeke)',
    activity: 'Created order',
  },
  {
    time: '12/06/2024, 4:10 PM',
    activityDescription: 'Order #1235 Confirmed',
    updated_by: 'Admin (Jane Smith)',
    activity: 'Confirmed order',
  },
  {
    time: '12/06/2024, 4:30 PM',
    activityDescription: 'Order #1235 Shipped',
    updated_by: 'Logistics (FastTrack)',
    activity: 'Shipped order',
  },
  {
    time: '12/06/2024, 5:00 PM',
    activityDescription: 'Order #1237 Placed',
    updated_by: 'Customer (Fatima Ibrahim)',
    activity: 'Created order',
  },
  {
    time: '12/06/2024, 5:30 PM',
    activityDescription: 'Order #1234 Delivered',
    updated_by: 'Logistics (Eagle Express)',
    activity: 'Delivered order',
  },
  {
    time: '12/06/2024, 6:00 PM',
    activityDescription: 'Order #1236 Confirmed',
    updated_by: 'Admin (Michael Johnson)',
    activity: 'Confirmed order',
  },
];

const InventoryActivityLog = () => {
  const [searchParams, setSearchParams] = useState('');

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
      name: 'Activity',
      accessorKey: 'activity',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Activity
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
      name: 'Updated By',
      accessorKey: 'updated_by',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Updated By
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('updated_by')}
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

  return (
    <div className="flex flex-col gap-4 w-full">
      <OrderDataTable
        orderName="Inventory Log"
        data={data}
        columns={columns}
        searchParams={searchParams}
        rightSideMenu={rightSideMenu}
        // config={inventoryConfig}
      />
    </div>
  );
};
export default InventoryActivityLog;

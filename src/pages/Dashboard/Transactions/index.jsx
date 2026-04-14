import { TbInfoCircle } from "react-icons/tb";
import PropTypes from "prop-types";
import OrderDataTable from "@/components/Tables/OrderDataTable";
import { IoIosSearch } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { format, subDays } from 'date-fns';
import { TbCalendarMonth } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { TbFilter } from 'react-icons/tb';
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
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TbTriangleInvertedFilled, TbTriangleFilled } from 'react-icons/tb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { addCommasToNumber, maskId, returnColor } from '@/lib/reusable';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@/routes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import images from '@/assets/images';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/utils/queries';
import { toast } from 'sonner';
import { useStore } from '@/store/store';
import ExportButton from '@/components/ExportButton';

const TransactionCard = ({ heading, subtitle }) => {
  return (
    <div
      style={{
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
      }}
      className="flex flex-col items-start p-3 gap-2.5 bg-white rounded-[12px] w-full md:w-1/3"
    >
      <div className="flex flex-col gap-8">
        <h3 className="text-[14px] leading-[20px] text-[#8B8D97]">{heading}</h3>
        <p className="font-medium text-[20px] items-center text-[#45464E]">
          &#8358;{addCommasToNumber(subtitle)}
        </p>
      </div>
    </div>
  );
};

TransactionCard.propTypes = {
  heading: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

const TableCell = ({ heading, content, icon, idCell, moneyCell }) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4 py-6  md:h-[69px] w-full border-b-[0.5px] border-[#ECEEF4]">
      <div
        className="box-border flex items-center  w-full justify-start

      "
      >
        <p className={` "text-[15px] text-[#8B909A] leading-[21px] text-left `}>
          {heading}
        </p>
      </div>
      {/* second part */}
      <div
        className={`box-border gap-1 flex items-center w-full md:justify-end`}
      >
        {icon && (
          <img src={icon} alt="ico" className="w-[19.98px] h-[12.35px]" />
        )}
        <p
          className={`text-[14px] capitalize leading-[19.6px] text-[#36453F] md:text-right `}
        >
          {idCell
            ? maskId(content)
            : moneyCell
            ? `₦${addCommasToNumber(content)}`
            : content}
        </p>
      </div>
    </div>
  );
};

TableCell.propTypes = {
  heading: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  icon: PropTypes.string,
  idCell: PropTypes.bool,
  moneyCell: PropTypes.bool,
};

const TransactionsPage = () => {
  const navigate = useNavigate();
  const { setMeta, meta } = useStore((state) => state.transaction);
  const [searchParams, setSearchParams] = useState('');
  const [total, setTotal] = useState(meta?.total || 0);
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
  const [perPage, setPerPage] = useState(meta?.per_page || 10);
  const [totalPages, setTotalPages] = useState(meta?.total_pages || 1);
  const [status, setStatus] = useState('All');
  const [selectedItem, setSelectedItem] = useState({
    date: '',
    orderID: '',
    customerName: '',
    amount: '',
    paymentMethod: '',
  });
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  useEffect(() => {
    if (meta) {
      setTotal(meta?.total);
      setCurrentPage(meta?.current_page);
      setPerPage(meta?.per_page || 10);
      setTotalPages(meta?.total_pages);
    }
  }, [meta]);

  const {
    data: transactions,
    error,
    isLoading,
    failureCount,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      'transactions',
      currentPage,
      perPage,
      searchParams,
      date,
      date?.to,
      date?.from,
      status,
    ],
    queryFn: () =>
      fetchTransactions(
        currentPage,
        perPage,
        searchParams,
        date?.from ? format(new Date(date.from), 'yyyy-MM-dd') : '', //end date
        date?.to ? format(new Date(date.to), 'yyyy-MM-dd') : '', //start date
        status
      ),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setMeta(transactions?.meta);
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
  }, [error, setMeta, transactions?.meta]);

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
    setSelectedItem(row);
    setOpenTransactionModal(true);
  };

  const onTableItemClick = (row) => {
    setSelectedItem(row.original);
    setOpenTransactionModal(true);
  };

  const columns = [
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
      cell: ({ row }) => {
        return (
          <p className="text-[#8B909A] text-[15px] leading-[21px]">
            {row.getValue('date')}
          </p>
        );
      },
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
            Order ID
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const orderID = row.getValue('orderID');

        return (
          <p className="text-[#8B909A] text-[15px] leading-[21px]">
            {maskId(orderID)}
          </p>
        );
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
      cell: ({ row }) => {
        return (
          <p className="text-[#8B909A] text-[15px] leading-[21px]">
            {row.getValue('customerName')}
          </p>
        );
      },
    },

    {
      name: 'Amount',
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Amount
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue('amount') || '0';
        return (
          <p className="text-[#8B909A] text-[15px] leading-[21px]">
            &#8358;{addCommasToNumber(amount)}
          </p>
        );
      },
    },
    {
      name: 'Payment method',
      accessorKey: 'paymentMethod',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Payment Method
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px] capitalize">
          {row.getValue('paymentMethod')}
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
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                All
              </DropdownMenuItem>

              <DropdownMenuItem className="p-2 text-[14px] leading-[19px] text-[#8B909A] ">
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
            <div className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]">
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
      <div className="flex items-start mx-auto gap-3.5 md:gap-5 justify-end flex-wrap grow">
        <div className="relative w-full md:w-fit flex gap-6">
          <div className="absolute top-0 inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <IoIosSearch size={16} className="text-[#8B909A]" />
          </div>
          <Input
            placeholder={'search product'}
            value={searchParams}
            onChange={(event) => {
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
              <p>Status</p>
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
              onClick={() => setStatus('Pending')}
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
            >
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatus('Processing')}
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
            >
              Processing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatus('Completed')}
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
            >
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatus('Shipped')}
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
            >
              Shipped
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setStatus('Canceled')}
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
          data={transactionData.data}
          headers={columns.map((column) => ({
            name: column.name,
            accessor: column.accessorKey,
          }))}
          filename="transactions_export"
        />
      </div>
    );
  };

  const transactionData = useMemo(
    () => ({
      total: transactions?.data?.total || '0',
      data:
        Array.isArray(transactions?.data?.transactions) &&
        transactions?.data?.transactions?.length > 0
          ? transactions?.data?.transactions?.map((transaction) => {
              const {
                type,
                narration,
                amount,
                net_value,
                payment_method,
                payment_status,
                status,
                date,
                customer_name,
                details,
              } = transaction;

              return {
                date: date || 'N/A',
                orderID: details?.order_id || 'N/A',
                customerName: customer_name || 'N/A',
                amount: amount || 'N/A',
                paymentMethod: payment_method || 'N/A', // can be card
                status: status || 'N/A',
                type,
                narration,
                net_value,
                payment_status,
              };
            })
          : [],
    }),
    [transactions?.data?.total, transactions?.data?.transactions]
  );

  const transactionConfig = {
    image: null,
    title: 'customerName',
    subtitle: 'date',
    price: 'amount',
    status: 'status',
    id: 'orderID',
  };

  return (
    <div className="flex w-full gap-4 flex-col">
      <Dialog
        open={openTransactionModal}
        onOpenChange={setOpenTransactionModal}
      >
        <DialogContent className="flex flex-col p-6  gap-6 w-full sm:max-w-[426px] max-h-[calc(100dvh-50px)]  overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-[22px] leading-[31px] text-[#45464E]">
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-start p-0 h-full border-t-[0.5px] pt-6 mt-2">
            <div className="flex flex-col  grow">
              <TableCell
                heading={'Transaction Date & Time'}
                content={selectedItem?.date}
              />
              <TableCell
                heading={'Transaction ID'}
                content={selectedItem?.orderID}
                idCell={true}
              />
              <TableCell
                heading={'Customer Name'}
                content={selectedItem?.customerName}
              />
              <TableCell
                heading={'Amount Paid'}
                content={selectedItem?.amount}
                moneyCell={true}
              />
              <TableCell
                heading={'Payment Method'}
                icon={images.masterCard}
                content={selectedItem?.paymentMethod}
              />
            </div>
          </div>
          <Button
            onClick={() => navigate(ROUTE.eachOrder + selectedItem?.orderID)}
            className="p-2 w-full rounded-[32px] bg-[#00070C] font-bold text-[16px] leading-[22.4px] text-white"
          >
            View Order
          </Button>
        </DialogContent>
      </Dialog>
      <section className="flex flex-col py-7 px-5 md:px-6 gap-4 bg-white rounded-[8px] w-full">
        <div className="flex flex-col md:flex-row items-start gap-[19px] w-full">
          <TransactionCard
            heading={'Total Transactions'}
            subtitle={transactionData?.total || 0}
          />
        </div>
        <div className="flex items-center gap-2">
          <TbInfoCircle className="w-4 h-4" />
          <p className="text-[12px] leading-[17px] text-[#8B909A]">
            --------------------------------------------
          </p>
        </div>
      </section>

      <OrderDataTable
        orderName="Transaction History"
        data={transactionData.data}
        columns={columns}
        searchParams={searchParams}
        rightSideMenu={rightSideMenu}
        config={transactionConfig}
        viewRow={viewRow}
        onTableItemClicked={onTableItemClick}
        isFetchingTableItems={isLoading}
        failureCount={failureCount}
        isFetching={isFetching}
        total={total}
        currentPage={currentPage}
        perPage={perPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        setPerPage={setPerPage}
        isPlaceholderData={isPlaceholderData}
      />
    </div>
  );
};

export default TransactionsPage;

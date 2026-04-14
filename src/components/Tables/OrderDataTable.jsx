import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui/button';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import images from '@/assets/images';
import SpinnerLoader from '../loaders/SpinnerLoader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import MobileTable from './MobileTable';
// import SubtleLoadingIndicator from '../loaders/SubtleLoadingIndicator';

const OrderDataTable = ({
  orderName,
  data,
  columns,
  isFetchingTableItems,
  onTableItemClicked,
  currentPage = 1,
  perPage = 10,
  totalPages = 1,
  config,
  rightSideMenu,
  viewRow,
  failureCount = 0,
  total = 0,
  setCurrentPage,
  setPerPage,
  isFetching,
  isPlaceholderData,
  filterSection,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: perPage,
  });

  const tableRowClicked = (row) => {
    onTableItemClicked && onTableItemClicked(row);
  };
  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: perPage,
    });
  }, [perPage]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const generateEmptyImageState = (state) => {
    if (!state || typeof state !== 'string') {
      return images.noOrderEmptyState;
    }
    const parsedState = state?.toLocaleLowerCase();
    switch (parsedState) {
      case 'orders':
        return images.noOrderEmptyState;
      case 'transaction history':
        return images.noTransaction;
      default:
        return images.noOrderEmptyState;
    }
  };

  const renderEmptyState = () => (
    <div className="flex justify-center items-center gap-1 min-h-[calc(100dvh-250px)]">
      <div className="flex flex-col items-center gap-6">
        <img
          src={generateEmptyImageState(orderName)}
          alt="no order"
          className="w-[140px] h-[140px]"
        />
        <p className="text-[20px] leading-[28px] text-center text-[#8B909A]">
          No {orderName} to Display!
        </p>
      </div>
    </div>
  );

  const renderLoader = () => (
    <div className="w-full h-80 flex md:flex-col gap-1 justify-center items-center relative">
      {/* <SubtleLoadingIndicator isLoading={isFetching} /> */}
      <SpinnerLoader />
      {failureCount > 1 && (
        <div className="text-sm text-gray-600 bg-gray-100 rounded-md p-3">
          <p>Processing... Please wait.</p>
        </div>
      )}
    </div>
  );

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Adjust this number as needed

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Always show first page
    pageNumbers.push(
      <Button
        variant="ghost"
        key={1}
        className={`w-10 h-8 py-2 ${
          1 === currentPage
            ? 'bg-[#F6F6F6] text-[#0E1422]'
            : 'bg-transparent text-[#5C5F6A]'
        }`}
        onClick={() => setCurrentPage(1)}
      >
        <div className="text-center text-[12px] leading-[16.8px] font-medium">
          1
        </div>
      </Button>
    );

    // Add ellipsis if there's a gap after the first page
    if (startPage > 2) {
      pageNumbers.push(
        <Button
          variant="ghost"
          key="ellipsis-start"
          className="justify-center items-center"
          disabled
        >
          <div className="text-center text-[#5C5F6A] text-[13px] leading-[27px]">
            ...
          </div>
        </Button>
      );
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        // Skip first and last page here
        pageNumbers.push(
          <Button
            variant="ghost"
            key={i}
            className={`w-10 h-8 py-2 ${
              i === currentPage
                ? 'bg-[#F6F6F6] text-[#0E1422]'
                : 'bg-transparent text-[#5C5F6A]'
            }`}
            onClick={() => setCurrentPage(i)}
          >
            <div className="text-center text-[12px] leading-[16.8px] font-medium">
              {i}
            </div>
          </Button>
        );
      }
    }

    // Add ellipsis if there's a gap before the last page
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <Button
          variant="ghost"
          key="ellipsis-end"
          className="justify-center items-center"
          disabled
        >
          <div className="text-center text-[#5C5F6A] text-[13px] leading-[27px]">
            ...
          </div>
        </Button>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(
        <Button
          variant="ghost"
          key={totalPages}
          className={`w-10 h-8 py-2 ${
            totalPages === currentPage
              ? 'bg-[#F6F6F6] text-[#0E1422]'
              : 'bg-transparent text-[#5C5F6A]'
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          <div className="text-center text-[12px] leading-[16.8px] font-medium">
            {totalPages}
          </div>
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <section className="flex flex-col py-3 rounded-[8px] bg-white w-full">
      <div className="flex flex-col  py-[15px] px-2.5 md:px-6 rounded-[24px] w-full">
        <div className="flex flex-col md:flex-row gap-5 justify-between items-center p-0 grow w-full">
          <div className="flex grow self-start">
            <h2 className="font-medium text-[16px] leading-[22px] text-[#45464E] text-nowrap">
              {orderName}
            </h2>
          </div>
          {rightSideMenu && <>{rightSideMenu()}</>}
        </div>
        {filterSection && <>{filterSection()}</>}
      </div>
      {isFetching || isFetchingTableItems ? (
        renderLoader()
      ) : !data || data?.length < 1 ? (
        renderEmptyState()
      ) : (
        <div className="w-full relative">
          <Table className="min-w-max overflow-x-auto w-full hidden md:inline-table">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="p-6">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => tableRowClicked(row)}
                    className={`${
                      onTableItemClicked && 'cursor-pointer'
                    } hover:bg-accent/50`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-6">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <MobileTable data={data} config={config} viewRow={viewRow} />
          <div className="flex justify-between py-3 px-2 md:px-6 border-t items-center">
            <div className="flex items-center gap-2 w-full">
              <p className="font-medium text-[15px] leading-[21px] flex items-center text-[#8B909A]">
                Showing
              </p>
              <Select
                onValueChange={(newValue) => setPerPage(parseInt(newValue))}
                value={perPage.toString()}
                className=""
              >
                <SelectTrigger className="w-[60px] h-[36px] md:h-[41px]">
                  <SelectValue placeholder="All members" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 30].map((value) => (
                    <SelectItem
                      key={value}
                      className="text-[13px] text-[#383838] hover:bg-[#F3F3F3]"
                      value={value.toString()}
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="font-medium text-[15px] leading-[21px] text-[#8B909A]">
                of {total}
              </p>
            </div>
            <div className="justify-start items-center md:gap-3 flex">
              <Button
                variant={'ghost'}
                className=""
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <TbChevronLeft className="w-5 h-5 text-[#8B909A]" />
              </Button>
              <div className="flex items-center justify-center">
                {generatePageNumbers()}
              </div>
              <Button
                variant={'ghost'}
                className=""
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={isPlaceholderData || currentPage === totalPages}
              >
                <TbChevronRight className="w-5 h-5 text-[#8B909A]" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

OrderDataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  orderName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onTableItemClicked: PropTypes.func,
  currentPage: PropTypes.number,
  perPage: PropTypes.number,
  totalPages: PropTypes.number,
  isFetchingTableItems: PropTypes.bool,
  isFetching: PropTypes.bool,
  rightSideMenu: PropTypes.elementType,
  filterSection: PropTypes.element,
  setCurrentPage: PropTypes.func,
  setPerPage: PropTypes.func,
  config: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  viewRow: PropTypes.func,
  failureCount: PropTypes.number,
  total: PropTypes.number,
  isPlaceholderData: PropTypes.bool,
};

export default OrderDataTable;

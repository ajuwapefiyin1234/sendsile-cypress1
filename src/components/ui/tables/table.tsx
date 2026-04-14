import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Chip } from '../dashboard/chip';
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../../utils/route-constants';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { Pagination } from '../dashboard/pagination';
import { ITable } from '../../../types';

const columnHelper = createColumnHelper<ITable>();

export const Table = ({
  pagination,
  setPagination,
  data,
  showPagination = true,
}: {
  pagination?: {
    pageIndex: number;
    totalPage: number;
    pageSize: number;
  };
  setPagination?: Dispatch<
    SetStateAction<{ pageIndex: number; totalPage: number; pageSize: number }>
  >;
  data: ITable[] | [];
  showPagination?: boolean;
}) => {
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor('date', {
      header: () => 'Date',
      cell: (info) => info.getValue(),
      meta: {
        minWidth: '200px',
      },
    }),

    columnHelper.accessor('amount', {
      header: () => 'Amount',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('type', {
      header: () => 'Type',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('narration', {
      header: () => 'Item',
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor("item", {
    //   header: () => "Item",
    //   cell: (info) => info.getValue(),
    // }),

    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: (info) => (
        <div className="cursor-pointer flex items-center gap-10">
          <Chip statusText={info.getValue()} />
          <IoIosArrowForward />
        </div>
      ),
    }),
  ];

  const handlePageClick = (pageNumber: number) => {
    setPagination && setPagination({ ...pagination!, pageIndex: pageNumber });
  };

  const table = useReactTable({
    data,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <Fragment>
      <div className="w-full overflow-x-auto">
        <table className="mt-5 w-full border-[0.75px] border-[#EBEAF2] h-full rounded-lg">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="first:min-w-[200px]  md:first:min-w-[168px] secondLastColumn bg-[#FAFAFA] py-[14px] text-[13px] leading-[18px] uppercase text-[#536878] text-left px-5"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table?.getRowModel()?.rows?.map((row) => (
              <tr
                key={row.id}
                className="border-[0.75px] border-[#EBEAF2]"
                onClick={() =>
                  navigate(`${ROUTES.singleTransactionName}/${row.original.transaction_id}`)
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="bg-white py-[18px] px-5 text-base leading-6 text-[#36454F] first:min-w-[200px]  md:first:min-w-[168px] secondLastColumn"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination
          handlePageChange={handlePageClick}
          currentPage={pagination?.pageIndex || 0}
          pageSize={pagination?.pageSize || 1}
          totalPage={pagination?.totalPage || 1}
        />
      )}
    </Fragment>
  );
};

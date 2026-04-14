import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderDataTable from '@/components/Tables/OrderDataTable';
import { Checkbox } from '@/components/ui/checkbox';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { returnColor } from '@/lib/reusable';
import { handleTransition } from '@/utils/handleTransition';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
import { IoIosSearch } from 'react-icons/io';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSuperAdminPartners } from '@/utils/adminqueries';
import { toast } from 'sonner';
import { FilterBadge } from '@/components/FilterBadge';
import ExportButton from '@/components/ExportButton';

const partnerConfig = {
  image: null,
  title: 'company_name',
  subtitle: 'contact_person',
  price: 'vendor_email',
  status: 'status',
  id: 'partner_id',
};

const PartnerManagement = () => {
  const navigate = useNavigate();
  const { setMeta, meta } = useStore((state) => state.partner);
  const [searchParams, setSearchParams] = useState('');
  const [total, setTotal] = useState(meta?.total || 0);
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
  const [perPage, setPerPage] = useState(meta?.per_page || 10);
  const [totalPages, setTotalPages] = useState(meta?.total_pages || 1);

  const [filters, setFilters] = useState({
    availability: null,
  });

  const removeFilter = (type) => {
    setFilters((prev) => ({ ...prev, [type]: null }));
  };
  const clearAllFilters = () => {
    setFilters({
      status: null,
    });
  };
  useEffect(() => {
    if (meta) {
      setTotal(meta?.total);
      setCurrentPage(meta?.current_page);
      setPerPage(meta?.per_page || 10);
      setTotalPages(meta?.total_pages);
    }
  }, [meta]);

  const {
    data: partners,
    error,
    isLoading,
    isFetching,
    isPlaceholderData,
    failureCount,
  } = useQuery({
    queryKey: ['partners', currentPage, perPage, searchParams, filters],
    queryFn: () =>
      getSuperAdminPartners(currentPage, perPage, searchParams, filters),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setMeta(partners?.meta);
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
  }, [error, partners?.meta, setMeta]);

  const partnerData = useMemo(
    () => ({
      data:
        Array.isArray(partners?.data) && partners?.data?.length > 0
          ? partners?.data.map((partner) => {
              const {
                partner_id,
                contact_person,
                company_name,
                vendor_email,
                vendor_phone,
                status,
                last_active,
              } = partner;

              return {
                partner_id: partner_id || 'N/A',
                contact_person: contact_person || 'N/A',
                company_name: company_name || 'N/A',
                vendor_email: vendor_email || 'N/A',
                vendor_phone: vendor_phone || 'N/A',
                status: status || 'inactive',
                last_active: last_active || 'N/A',
              };
            })
          : [],
    }),
    [partners]
  );

  const viewRow = (row) => {
    handleTransition(null, SUPER_ADMIN_ROUTES.partnerDetail + row, navigate);
  };
  const onTableItemClicked = (row) => {
    const id = row?.original?.partner_id;

    handleTransition(null, SUPER_ADMIN_ROUTES.partnerDetail + id, navigate);
  };
  const columns = [
    {
      name: '',
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
      name: 'Company name',
      accessorKey: 'company_name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Company Name
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-[#8B909A] text-[15px] leading-[21px]">
            {row.getValue('company_name')}
          </div>
        );
      },
    },
    {
      name: 'Contact person',
      accessorKey: 'contact_person',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Contact Person
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-[#8B909A] text-[15px] leading-[21px]">
            {row.getValue('contact_person')}
          </div>
        );
      },
    },
    {
      name: 'Email',
      accessorKey: 'vendor_email',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Email
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('vendor_email')}
        </div>
      ),
    },
    {
      name: 'Phone number',
      accessorKey: 'vendor_phone',
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
      cell: ({ row }) => (
        <div className="text-[#8B909A] text-[15px] leading-[21px]">
          {row.getValue('vendor_phone')}
        </div>
      ),
    },

    {
      name: 'Status',
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 font-medium text-[14px] leading-[19px] text-[#0D1415] gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <div className="flex flex-col gap-[1px] items-center justify-center">
              <TbTriangleFilled className="w-2 h-1.5 text-[#FFA900]" />
              <TbTriangleInvertedFilled className="w-2 h-1.5 text-[#A5A6F6]" />
            </div>
          </Button>
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
    {
      name: 'Last active',
      accessorKey: 'last_active',
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
      cell: ({ row }) => {
        return (
          <div className="text-[#8B909A] text-[15px] leading-[21px]">
            {row.getValue('last_active')}
          </div>
        );
      },
    },
  ];
  const filterSection = () => {
    return (
      <section className="flex flex-wrap items-center gap-2 mt-4">
        {filters.status && (
          <FilterBadge
            type="Status"
            value={filters?.status?.name || ''}
            onRemove={() => removeFilter('status')}
          />
        )}

        {filters.status && (
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
            <DropdownMenuItem
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: {
                    name: 'active',
                    id: 'active',
                  },
                }))
              }
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
            >
              Active
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: {
                    name: 'inactive',
                    id: 'inactive',
                  },
                }))
              }
              className="p-2 text-[14px] leading-[19px] text-[#8B909A] "
            >
              Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ExportButton
          data={partnerData.data}
          headers={columns.map((column) => ({
            name: column.name,
            accessor: column.accessorKey,
          }))}
          filename="partners_export"
        />

        <Button
          type="button"
          onClick={(e) =>
            handleTransition(e, SUPER_ADMIN_ROUTES.addPartner, navigate)
          }
          className="h-[45px] py-3 px-4 bg-[#00070C] border gap-2 border-[#ECEEF4] rounded-[32px] text-white leading-[21px] font-medium text-[15px]"
        >
          <TbPlus className="w-5 h-5" />
          <span>Add Partner</span>
        </Button>
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-4 w-full">
      <OrderDataTable
        orderName="Partners"
        data={partnerData.data}
        columns={columns}
        searchParams={searchParams}
        rightSideMenu={rightSideMenu}
        config={partnerConfig}
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

export default PartnerManagement;

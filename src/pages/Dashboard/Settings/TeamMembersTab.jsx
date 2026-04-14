import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchTeamMembers } from '@/utils/queries';
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import OrderDataTable from '@/components/Tables/OrderDataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TbPlus, TbLock } from 'react-icons/tb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { returnColor } from '@/lib/reusable';
import { RxDotsHorizontal } from 'react-icons/rx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TeamMembersForm from '@/components/forms/TeamMembersForm';
import { useStore } from '@/store/store';
import { useLocation } from 'react-router-dom';

const teamMembersConfig = {
  image: null, // No image for orders data
  title: 'name',
  subtitle: 'email',
  price: 'role',
  status: 'status',
  id: 'memberId',
};

const TeamMembersTab = () => {
  const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');
  const { setMeta, meta } = useStore((state) => state.member);
  //   const [searchBarParams, setSearchBarParams] = useState('');
  const [total, setTotal] = useState(meta?.total || 0);
  const [currentPage, setCurrentPage] = useState(meta?.current_page || 1);
  const [perPage, setPerPage] = useState(meta?.per_page || 10);
  const [totalPages, setTotalPages] = useState(meta?.total_pages || 1);
  const [openTeamMemberModal, setOpenTeamMemberModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const {
    data: teamMembers,
    error,
    isLoading,
    failureCount,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['teamMembers', currentPage, perPage, isSuperAdmin],
    queryFn: () => fetchTeamMembers(currentPage, perPage, isSuperAdmin),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    setMeta(teamMembers?.meta);
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
  }, [error, teamMembers?.meta, setMeta]);

  useEffect(() => {
    if (meta) {
      setTotal(meta?.total);
      setCurrentPage(meta?.current_page);
      setPerPage(meta?.per_page || 10);
      setTotalPages(meta?.total_pages);
    }
  }, [meta]);

  const teamMemberData = useMemo(
    () => ({
      data:
        Array.isArray(teamMembers?.data) && teamMembers?.data?.length > 0
          ? teamMembers?.data?.map((member) => {
              const { email, name, role, status } = member;

              return {
                email,
                name,
                role,
                status,
              };
            })
          : [],
    }),
    [teamMembers]
  );
  const columns = [
    {
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
      accessorKey: 'name',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Name
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm capitalize text-[#8B909A]">
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Email
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-[#8B909A]">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Role
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm capitalize text-[#8B909A]">
          {row.getValue('role')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => {
        return (
          <div className="font-medium text-[14px] leading-[19px] text-[#0D1415]">
            Status
          </div>
        );
      },
      cell: ({ row }) => {
        const statusType = row.getValue('status');

        return (
          <div className="flex items-start p-0 mix-blend-multiply">
            {/* <div
                  style={{
                    backgroundColor: returnColor(statusType).bg,
                  }}
                  className="flex justify-center items-center py-0.5 px-2 gap-1.5 rounded-[16px]"
                > */}
            {/* <div
                    style={{
                      backgroundColor: returnColor(statusType).text,
                    }}
                    className="w-2 h-2 rounded-full"
                  /> */}
            <p
              style={{ color: returnColor(statusType).text }}
              className="font-medium text-[12px] leading-[17px] text-center capitalize"
            >
              {statusType}
            </p>
            {/* </div> */}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const memberInformation = row?.original;

        return memberInformation?.role === 'owner' ? (
          <Button variant="ghost" className="h-5 p-0">
            <span className="sr-only">Menu locked</span>
            <TbLock size={20} className="w-5 h-5 text-[#8B909A]" />
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="border-none ">
              <Button variant="ghost" className="h-5 p-0">
                <span className="sr-only">Open menu</span>
                <RxDotsHorizontal
                  size={20}
                  className="w-5 h-5 text-[#8B909A]"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[168px] bg-white gap-2.5 p-3">
              <DropdownMenuItem
                className="py-2 cursor-pointer text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]"
                onClick={() => {
                  setIsEditing(true);
                  setSelectedMember(memberInformation);
                  setOpenTeamMemberModal(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 cursor-pointer text-[14px] leading-[19px] text-[#8B909A] border-b border-[#ECEEF4]">
                Remove
              </DropdownMenuItem>

              <DropdownMenuItem className="py-2 cursor-pointer text-[14px] leading-[19px] text-[#8B909A] ">
                Resend Invite
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const rightSideMenu = () => {
    return (
      <div className="flex items-start mx-auto gap-3.5 md:gap-5 justify-end flex-wrap grow w-full">
        <Button
          onClick={() => {
            setIsEditing(false);
            setOpenTeamMemberModal(true);
          }}
          className="py-3 px-4 gap-2 bg-[#00070C] border border-[#ECEEF4] rounded-[32px]"
        >
          <TbPlus className="text-white w-5 h-5" />
          <p className="text-[15px] font-medium leading-[21px]">
            Add Team Member
          </p>
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col">
      <Dialog open={openTeamMemberModal} onOpenChange={setOpenTeamMemberModal}>
        <DialogContent className="sm:max-w-[426px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-[22px] leading-[31px] text-[#45464E]">
              {isEditing ? 'Edit Team Member' : 'Add Team members'}
            </DialogTitle>
          </DialogHeader>
          <TeamMembersForm
            isEditing={isEditing}
            setOpenTeamMemberModal={setOpenTeamMemberModal}
            selectedMember={selectedMember}
          />
        </DialogContent>
      </Dialog>
      <OrderDataTable
        orderName="Team Members"
        data={teamMemberData.data}
        columns={columns}
        placeholder={'Search'}
        rightSideMenu={rightSideMenu}
        config={teamMembersConfig}
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

export default TeamMembersTab;

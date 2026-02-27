import { IoSearchOutline } from 'react-icons/io5';
import { DashboardWidth } from '../../../components/global/dashboard-width';
import { PageHeader } from '../../../components/ui/dashboard/page-header';
import CustomSelect from '../../../components/ui/dropdown/custom-select';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { EmptyTable } from '../../../assets/images';
import { Table } from '../../../components/ui/tables/table';
import { FilterChip } from '../../../components/ui/farm-products/filter-chip';
import { useEffect, useRef, useState } from 'react';
import { Filter } from '../../../components/svgs/farm-product/filter';
import { FilterModal } from '../../../components/modals/filter';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { MoonLoader } from 'react-spinners';
import { statusOptions } from '../../../utils/constants';
import DatePicker from 'react-datepicker';
import { formatDate } from '../../../utils/helpers';
import { twMerge } from 'tailwind-merge';

const transOptions = [
  { label: 'Groceries', value: 'Groceries' },
  { label: 'Airtime', value: 'Airtime' },
  { label: 'Data plan', value: 'Data plan' },
];

const Transactions = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFilter, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [tableData, setData] = useState<any[]>([]);
  const [isExportOpen, setExportOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPage: 0,
  });
  const exportRef = useRef<HTMLDivElement>(null);

  const axiosPrivate = useAxiosPrivate();

  const handleReset = () => {
    setDate(null);
    setType('');
    setStatus('');
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutisde = (e: MouseEvent | TouchEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutisde);
    document.addEventListener('touchstart', handleClickOutisde);

    return () => {
      document.removeEventListener('mousedown', handleClickOutisde);
      document.removeEventListener('touchstart', handleClickOutisde);
    };
  }, [isExportOpen]);

  useEffect(() => {
    const getAllTransactions = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`/transactions`, {
          params: {
            page: pagination.pageIndex,
            status,
            type,
            date: formatDate(date!),
            ...(searchQuery && { id: searchQuery }),
          },
        });

        setData(res.data.data);

        setPagination({
          totalPage: res?.data?.meta?.total_pages,
          pageIndex: res?.data?.meta?.current_page,
          pageSize: res?.data?.meta?.per_page,
        });
      } catch (error: any) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    getAllTransactions();
  }, [pagination.pageIndex, date, type, status, searchQuery]);

  return (
    <DashboardWidth classname="overflow-hidden">
      <div className="px-4 sm:px-10 md:px-5 xl:px-0 pb-10 w-full xl:w-[824px] 2xl:w-[920px] mx-auto">
        <PageHeader text="Transactions" />
        <div className="flex flex-wrap items-center gap-6 md:flex-nowrap">
          <div className="relative w-[383px]">
            <IoSearchOutline className="absolute -translate-y-1/2 top-1/2 left-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for..."
              className="bg-white h-[46px] pl-10 outline-none focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] w-full  border border-[#E3E6ED] rounded-full"
            />
          </div>
          <div className="hidden px-5 py-3 lg:px-3 xl:px-5 rounded-2xl md:w-fit md:flex gap-5 lg:gap-3 xl:gap-5 justify-center 2xl:justify-evenly  items-center w-[417px] bg-white">
            <div className="min-w-[82px]">
              <DatePicker
                selected={date}
                dateFormat="yyyy-MM-dd"
                onChange={(date) => setDate(date)}
                customInput={<CustomDatePickerButton date={date} />}
              />
            </div>

            <div>
              <CustomSelect
                handleSelect={setType}
                value={type}
                option={transOptions}
                placeholder="Transaction type"
                dropdownClass="min-w-[200px]"
                classname="rounded-full min-w-fit 2xl:w-[200px] flex-1 px-4 py-[6px] border-[#D5D5D5] border-[0.75px]"
                placeholderStyles="text-[15px] font-normal text-prm-black leading-5 whitespace-nowrap"
                arrowDown={<IoIosArrowDown className="text-[#36454F] flex-shrink-0" />}
                arrowUp={<IoIosArrowUp className="text-[#36454F] flex-shrink-0" />}
              />
            </div>

            <div className="w-fit 2xl:w-[120px]">
              <CustomSelect
                value={status}
                handleSelect={setStatus}
                option={statusOptions}
                placeholder="Status"
                dropdownClass="min-w-[200px] -left-full xl:left-0"
                classname=" rounded-full  px-4 py-[6px] border-[#D5D5D5] border-[0.75px]"
                placeholderStyles="text-[15px] font-normal text-prm-black leading-5"
                arrowDown={<IoIosArrowDown className="text-[#36454F] flex-shrink-0" />}
                arrowUp={<IoIosArrowUp className="text-[#36454F] flex-shrink-0" />}
              />
            </div>
          </div>
          {/* mobile filter*/}
          <div className="flex justify-between w-full px-5 py-3 bg-white md:hidden rounded-2xl">
            <FilterChip
              classname="bg-white select-none py-[6px] px-4 text-[17px] leading-6"
              iconLeft={<Filter stroke="#00070C" />}
              text="Filters"
              action={() => setOpen(true)}
            />
            <button
              onClick={handleReset}
              className="disabled:opacity-50 disabled:cursor-not-allowed text-[#536878] text-[17px] leading-6"
            >
              Reset
            </button>
          </div>
          {/* mobile filter */}
        </div>
        <div className="py-4 md:py-6 px-5 mt-6 min-h-[313px] bg-white rounded-2xl">
          <div className="flex justify-between">
            <h1 className="text-prm-black text-[17px] md:text-[15px] leading-6 font-medium">
              Groceries
            </h1>
            <div ref={exportRef} className="relative">
              <button
                type="button"
                onClick={() => setExportOpen(!isExportOpen)}
                className="text-[#E4572E] text-[17px] md:text-[15px] leading-6 font-medium"
              >
                Export data
              </button>

              <ul
                className={`${
                  isExportOpen ? 'visible opacity-100 top-full mt-2' : 'invisible opacity-0 top-0'
                } absolute left-0 bg-white shadow-md transition-all duration-300`}
              >
                {['pdf', 'csv', 'excel'].map((type, index) => (
                  <li
                    key={index + type}
                    onClick={() => ''}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {type.toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center gap-4 mt-6">
              <MoonLoader size={25} />
              <p>Please wait</p>
            </div>
          ) : tableData?.length > 0 ? (
            <Table pagination={pagination} setPagination={setPagination} data={tableData} />
          ) : (
            <img src={EmptyTable} alt="empty table" className="block mx-auto mt-5" />
          )}
        </div>
      </div>
      {/* filter modal */}
      <FilterModal
        openFilter={openFilter}
        setOpen={setOpen}
        handleReset={handleReset}
        dropDownOne={
          <div>
            <h1 className="pb-2 text-prm-black text-[17px] leading-6">Date</h1>
            {/* <CustomSelect
              handleSelect={() => ""}
              placeholder="Success"
              placeholderStyles="text-[#536878] text-base font-light leading-6"
              option={options}
              arrowUp={<IoIosArrowUp />}
              arrowDown={<IoIosArrowDown />}
              classname="bg-[#F7F7F7] border-[#D1D3D9]"
            /> */}
            <div className="!min-w-full">
              <DatePicker
                selected={date}
                dateFormat="yyyy-MM-dd"
                onChange={(date: Date | null) => setDate(date)}
                customInput={
                  <CustomDatePickerButton
                    date={date}
                    placeholderClasses="text-[#536878]"
                    classname="!min-w-screen py-[14px] bg-[#F7F7F7] text-[#36454F] border-[#D1D3D9] rounded-md text-sm font-light leading-6"
                  />
                }
              />
            </div>
          </div>
        }
        dropDownTwo={
          <div>
            <h1 className="pb-2 text-prm-black text-[17px] leading-6">Type</h1>
            <div>
              <CustomSelect
                handleSelect={setType}
                value={type}
                placeholder="Transaction type"
                placeholderStyles="text-[#536878] text-base font-light leading-6"
                option={transOptions}
                arrowUp={<IoIosArrowUp />}
                arrowDown={<IoIosArrowDown />}
                classname="bg-[#F7F7F7] border-[#D1D3D9]"
              />
            </div>
          </div>
        }
        dropDownThree={
          <div>
            <h1 className="pb-2 text-prm-black text-[17px] leading-6">Status</h1>
            <div>
              <CustomSelect
                handleSelect={setStatus}
                value={status}
                placeholder="Status"
                placeholderStyles="text-[#536878] text-base font-light leading-6"
                option={statusOptions}
                arrowUp={<IoIosArrowUp />}
                arrowDown={<IoIosArrowDown />}
                classname="bg-[#F7F7F7] border-[#D1D3D9]"
              />
            </div>
          </div>
        }
      />
      {/* filter modal */}
    </DashboardWidth>
  );
};

export default Transactions;

const CustomDatePickerButton = ({ value, onClick, date, classname, placeholderClasses }: any) => (
  <div
    className={twMerge(
      'min-w-[82px] text-sm whitespace-nowrap px-4 py-[6px] border-[0.75px]  rounded-full border-[#D5D5D5]',
      classname
    )}
    onClick={onClick}
  >
    {date ? value : <p className={placeholderClasses}> Date</p>}
  </div>
);

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { generatePageNumbers } from '../pagination';

export const Pagination = ({
  currentPage,
  pageSize,
  totalPage,
  handlePageChange,
}: {
  currentPage: number;
  pageSize: number;
  totalPage: number;
  handlePageChange: (event: any) => void;
}) => {
  const pageCount = Math.ceil(totalPage / pageSize);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <p className="text-[15px] leading-5 text-[#8B909A] font-medium">Showing</p>
        <p className="text-[#23272E] rounded-md outline-none py-[10px] px-2">{totalPage}</p>

        <p className="text-[15px] leading-5 text-[#8B909A] font-medium">of {pageCount}</p>
      </div>
      <div className="w-fit flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
          className="py-[6px] px-[10px] cursor-not-allowed"
        >
          <MdKeyboardArrowLeft color="#8B909A" size={20} />
        </button>
        <div className="flex items-center gap-1">
          {generatePageNumbers(currentPage, totalPage, handlePageChange, pageSize)}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPage}
          className="py-[6px] px-[10px] disabled:cursor-not-allowed"
        >
          <MdKeyboardArrowRight color="#8B909A" size={20} />
        </button>
      </div>
    </div>
  );
};

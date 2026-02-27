export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  handlePageChange: any,
  perPage: number
) => {
  const pageNumbers = [];
  const maxPageNumbers = 4;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

  if (endPage - startPage < maxPageNumbers - 1) {
    startPage = Math.max(1, endPage - maxPageNumbers + 1);
  }

  if (startPage > 1) {
    pageNumbers.push(
      <div
        key={1}
        className={`py-2 px-[18px] justify-center items-center cursor-pointer ${
          1 === currentPage ? 'bg-[#F6F6F6] rounded' : ''
        }`}
        onClick={() => handlePageChange(1, perPage)}
      >
        <div className="text-center text-[0.8125rem] leading-[18px]">{1}</div>
      </div>
    );

    if (startPage > 2) {
      pageNumbers.push(
        <div key="ellipsis-start" className="py-2 px-[18px] justify-center  items-center">
          <div className="text-center text-black text-[0.9375rem] leading-[27px]">...</div>
        </div>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <div
        key={i}
        className={`py-2 px-[18px] justify-center items-center cursor-pointer ${
          i === currentPage ? 'bg-[#F6F6F6] rounded' : ''
        }`}
        onClick={() => handlePageChange(i)}
        // onClick={() => handlePageChange(i, perPage)}
      >
        <div className="text-center  text-sm">{i}</div>
      </div>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <div key="ellipsis-end" className="py-2 px-[18px] justify-center bg-yelloq items-center">
          <div className="text-center text-black text-sm">...</div>
        </div>
      );
    }

    pageNumbers.push(
      <div
        key={totalPages}
        className={`py-2 px-[18px] justify-center items-center cursor-pointer ${
          totalPages === currentPage ? 'bg-[#F6F6F6] rounded' : ''
        }`}
        onClick={() => handlePageChange(totalPages)}
        // onClick={() => handlePageChange(searchParams, totalPages, perPage)}
      >
        <div className="text-center text-black text-[0.9375rem] leading-[27px]">{totalPages}</div>
      </div>
    );
  }

  return pageNumbers;
};

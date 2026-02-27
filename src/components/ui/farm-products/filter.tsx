import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Brand, Price } from '../../../assets/images';
import { productPrice } from '../../../utils/constants';
import { Checkbox } from '../auth/checkbox';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { IProductBrands } from '../../../types/products';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

interface IFilter {
  open: boolean;
  list: IProductBrands[];
  setList: Dispatch<SetStateAction<IProductBrands[]>>;
  priceFilter: string;
  setPriceFilter: Dispatch<SetStateAction<string>>;
}

export const FilterSection = ({ open, list, setList, priceFilter, setPriceFilter }: IFilter) => {
  const [filterPosition, setFilterPostion] = useState<'top-14' | 'bottom-14'>('bottom-14');
  const [productBrand, setBrands] = useState<IProductBrands[]>();
  const [loading, setLoading] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const axiosInstance = useAxiosPrivate();

  const adjustDropdownPosition = () => {
    if (filterRef.current && open) {
      const rect = filterRef.current.getBoundingClientRect();
      const spaceBelow = rect.bottom;
      const spaceAbove = window.innerHeight - rect.top;
      const filterHeight = filterRef.current.scrollHeight;

      setFilterPostion(
        spaceBelow >= filterHeight && spaceBelow > spaceAbove ? 'bottom-14' : 'top-14'
      );
    }
  };

  const handleFilterChecked = (brand: IProductBrands) => {
    setList((prev) => {
      return prev.some((prev) => prev.id === brand.id)
        ? prev.filter((prev) => prev.id !== brand.id)
        : [...list, brand];
    });
  };

  useEffect(() => {
    if (open) {
      adjustDropdownPosition();
      window.addEventListener('resize', adjustDropdownPosition);
      window.addEventListener('scroll', adjustDropdownPosition);
    }

    return () => {
      window.removeEventListener('scroll', adjustDropdownPosition);
      window.removeEventListener('resize', adjustDropdownPosition);
    };
  }, [open]);

  useEffect(() => {
    async function getBrands() {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/brands');
        if (res.status === 200) {
          setBrands(res.data.data);
        } else {
          throw new Error();
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Something went wrong', {
          toastId: 'filterBrand_ID',
        });
      } finally {
        setLoading(false);
      }
    }

    getBrands();
  }, []);

  return (
    <div ref={filterRef}>
      <div
        className={`z-20 scrollbar ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible overflow-hidden no-scrollbar'
        } h-fit max-h-[506px] overflow-y-auto transition-all ease-in-out duration-300 py-5 px-4 absolute ${filterPosition} left-0 bg-white w-fit sm:w-[292px] rounded-xl shadow-[0px_1px_48px_8px] shadow-[rgba(38,50,56,0.1)]`}
      >
        <div className="">
          <div className="flex gap-2 items-center ">
            <img src={Brand} alt="product brands logo" />
            <h1 className="text-[#0D1415] font-bold text-[15px] leading-5">Brand</h1>
          </div>
          <div className="pt-3 pb-5 border-b border-[#E3E6ED] flex flex-col gap-[18px]">
            {loading ? (
              <Skeleton count={10} />
            ) : (
              productBrand?.map((data, index) => {
                const { name, id } = data;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      action={() => handleFilterChecked({ id, name })}
                      id={id}
                      value={id}
                      isChecked={list.some((brand) => brand.id === id)}
                      classname="border-[#D0D5DD]"
                    />
                    <label
                      htmlFor={id}
                      className="font-normal select-none cursor-pointer text-[15px] leading-5 text-[#0D1415]"
                    >
                      {name}
                    </label>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-2 items-center ">
            <img src={Price} alt="price logo" />
            <h1 className="text-[#0D1415] font-bold text-[15px] leading-5">Price</h1>
          </div>
          <div className="pt-3 flex flex-col gap-[18px]">
            {productPrice.map((data, index) => {
              const { name, value } = data;
              return (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    action={() => setPriceFilter(value === priceFilter ? '' : value)}
                    isChecked={priceFilter === value}
                    id={value}
                    value={value}
                  />
                  <label
                    htmlFor={value}
                    className="font-normal select-none cursor-pointer text-[15px] leading-5 text-[#0D1415]"
                  >
                    {name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

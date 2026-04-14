import useEmblaCarousel from 'embla-carousel-react';
import { FarmProduct } from '../ui/home/farm-products';
import { SetURLSearchParams, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import { axiosPrivate } from '../../services/axios';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { IProductBrandCategory } from '../../types/products';
import { productColors } from '../../utils/constants';

export const DashboardProducts = ({
  setSearchParams,
  currentPageName,
}: {
  setSearchParams: SetURLSearchParams;
  currentPageName: string;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IProductBrandCategory[]>();

  const navigate = useNavigate();

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const updateButtonVisibility = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const updateQueryParamRouting = (queryParam: string) => {
    setSearchParams(queryParam);
    navigate(`/dashboard/groceries?category=${queryParam}`);
  };

  useEffect(() => {
    if (!emblaApi) return;
    updateButtonVisibility();

    emblaApi.on('select', updateButtonVisibility).on('reInit', updateButtonVisibility);

    return () => {
      emblaApi.off('select', updateButtonVisibility).off('reInit', updateButtonVisibility);
    };
  }, [emblaApi, updateButtonVisibility]);

  useEffect(() => {
    async function getCategories() {
      setLoading(true);
      try {
        const res = await axiosPrivate.get('/categories');
        if (res.status === 200) {
          setCategories(res.data.data);
        } else {
          throw new Error();
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  return (
    <div ref={emblaRef} className="w-full overflow-hidden">
      <div className="flex items-start z-20 justify-start gap-6">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="w-[180px] sm:w-[210px] h-[188px] sm:h-[209px] rounded-2xl"
              />
            ))
          : categories?.map((product, index) => {
              return (
                <FarmProduct
                  action={() => updateQueryParamRouting(product?.id)}
                  key={index}
                  bg={productColors[index % productColors?.length]}
                  image={product?.image || ''}
                  text={product?.name}
                  imageStyle="hover:scale-110 transition-all duration-300 max-w-[170px] sm:max-w-[120px] object-contain"
                  classname={`w-[180px] h-[188px] sm:w-[135px] ${
                    product?.id === currentPageName ? 'border-prm-red border' : ''
                  } hover:border-prm-red hover:border sm:h-[146px] rounded-[16px]`}
                />
              );
            })}
      </div>
      <div className="pt-4 md2:pt-0 pb-6 pr-0 md:pr-5 w-full mx-auto flex justify-end gap-2 items-center">
        <button
          onClick={handlePrev}
          disabled={!canScrollPrev}
          className={`bg-white border disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed border-[#EAECF0] p-2 rounded-full `}
        >
          <FaLongArrowAltLeft className="size-4" />
        </button>

        <button
          onClick={handleNext}
          disabled={!canScrollNext}
          className={`bg-white border disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed border-[#EAECF0] p-2 rounded-full `}
        >
          <FaLongArrowAltRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

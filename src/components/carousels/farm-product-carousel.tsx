import useEmblaCarousel from 'embla-carousel-react';
import { FarmProduct } from '../ui/home/farm-products';
import { FarmCarouselBtn } from '../buttons/farm-carousel-btn';
import { Arrow } from '../svgs/farm-product/arrow';
import { useCallback, useEffect, useState } from 'react';
import { SetURLSearchParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/route-constants';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { IProductBrandCategory } from '../../types/products';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { productColors } from '../../utils/constants';

export const FarmProductCarousel = ({
  setSearchParams,
  currentPageName,
}: {
  setSearchParams: SetURLSearchParams;
  currentPageName: string;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IProductBrandCategory[]>();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  // embla config **************
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

  useEffect(() => {
    if (!emblaApi) return;
    updateButtonVisibility();
    emblaApi.on('select', updateButtonVisibility).on('reInit', updateButtonVisibility);
    return () => {
      emblaApi.off('select', updateButtonVisibility).off('reInit', updateButtonVisibility);
    };
  }, [emblaApi, updateButtonVisibility]);

  // Auto-scroll feature **************
  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000); // 3 seconds auto-scroll interval

    return () => clearInterval(autoScroll); // Clean up on unmount
  }, [emblaApi]);
  // Auto-scroll feature **************

  const updateQueryParamRouting = (queryParam: string) => {
    setSearchParams(queryParam);
    navigate(`${ROUTES.groceriesPage}?category=${encodeURIComponent(queryParam)}`, {
      preventScrollReset: true,
    });
  };

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
        toast.error(error?.response?.data?.message || 'Something went wrong', {
          toastId: 'farmCarouselID',
        });
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, [axiosPrivate]);

  return (
    <div className="w-full overflow-hidden relative" ref={emblaRef}>
      <div className="pl-4 sm:pl-8 mr-8 pt-14 sm:pt-[118px] pb-6 sm:pb-14 flex items-start gap-[10px] sm:gap-4">
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
                  imageStyle="hover:scale-110 transition-all duration-300 max-w-[170px] object-contain"
                  classname={`w-[180px] h-[188px] sm:w-[210px] sm:h-[209px] ${
                    product.id == currentPageName && 'border-prm-red border'
                  } hover:border-prm-red hover:border rounded-[16px]`}
                />
              );
            })}
      </div>

      {/* control prev and next buttons */}
      <div>
        {canScrollPrev && (
          <FarmCarouselBtn
            classname="top-1/2 -translate-1/2 left-3"
            icon={<Arrow />}
            action={handlePrev}
          />
        )}

        {canScrollNext && (
          <FarmCarouselBtn
            classname="top-1/2 -translate-1/2 right-3 rotate-180"
            icon={<Arrow />}
            action={handleNext}
          />
        )}
      </div>
      {/* control prev and next buttons */}
    </div>
  );
};

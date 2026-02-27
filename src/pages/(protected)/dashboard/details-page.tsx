import { DashboardWidth } from '../../../components/global/dashboard-width';
import { ButtonBack } from '../../../components/ui/buttons/button-back';
import { PageHeader } from '../../../components/ui/dashboard/page-header';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FilterChip } from '../../../components/ui/farm-products/filter-chip';
import { useCartState, useCartStore } from '../../../services/store/cartStore';

import { IoStarSharp } from 'react-icons/io5';
import { Fragment, useEffect, useState } from 'react';
import { Cart } from '../../../components/svgs/cart';
import { Review } from '../../../components/ui/farm-products/review';
import { ReviewModal } from '../../../components/modals/review-modal';
import { ProductCard } from '../../../components/ui/farm-products/product-card';
import { IProduct, IProductReview } from '../../../types/products';
import { ROUTES } from '../../../utils/route-constants';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { priceFormatter } from '../../../utils/helpers';
import { ToastMessage } from '../../../components/ui/cart/toast-message';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../../types';
import dayjs from 'dayjs';

const DashboardDetailsPage = () => {
  const [isReviewOpen, setReviewOpen] = useState(false);
  const [isloadingSingleProduct, setLoadingSingleProduct] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmited] = useState(false);
  const [isloadingRelatedData, setLoadingRelatedData] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [productReviews, setProductReviews] = useState<IProductReview>();
  const [singleProduct, setSingleProduct] = useState<IProduct | null>();
  const [variantInfo, setVariantInfo] = useState<any>(null);

  const updateToastOpen = useCartState((state) => state.updateToastOpen);
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const [currentImage, setCurrentImage] = useState(0);

  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const variantId = searchParams.get('v');
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { addToCart } = useCartStore();

  const handleViewProductImage = (direction: 'next' | 'prev') => {
    setCurrentImage((prev) => {
      const imagesLength = singleProduct?.images?.length ?? 0;
      const lastIndex = Math.max(0, imagesLength - 1);
      switch (direction) {
        case 'next':
          return prev === lastIndex ? lastIndex : prev + 1;
        case 'prev':
          return prev === 0 ? 0 : prev - 1;
      }
    });
  };

  useEffect(() => {
    const getProductDetail = async () => {
      setLoadingSingleProduct(true);
      try {
        const res = await axiosPrivate.get(`/products/product/${id}`);
        const data: IProduct = res?.data?.data;
        if (res.status === 200) {
          setSingleProduct(data);
          if (variantId) {
            const variant = data.variants.find((v) => v.variant_id === variantId);
            setVariantInfo(variant || null);
          }
        } else {
          throw new Error();
        }
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        toast.error(axiosError.response?.data?.message || 'Something went wrong');
      } finally {
        setLoadingSingleProduct(false);
      }
    };

    const getRelatedProducts = async () => {
      setLoadingRelatedData(true);
      try {
        const res = await axiosPrivate.get(`/products/related-products/${id}`);
        const data: IProduct[] = res?.data?.data;
        if (res.status === 200) {
          setRelatedProducts(data);
          setLoadingRelatedData(false);
        } else {
          throw new Error();
        }
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        toast.error(axiosError.response?.data?.message || 'Something went wrong');
      } finally {
        setLoadingRelatedData(false);
      }
    };

    getProductDetail();
    getRelatedProducts();
  }, [id]);

  useEffect(() => {
    const getProductReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const res = await axiosPrivate.get(`/products/reviews?product_id=${id}`);
        const data = res?.data?.data;
        setProductReviews(data);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        toast.error(axiosError?.response?.data?.message || 'Something went wrong', {
          toastId: 'feedbacksError',
        });
      } finally {
        setIsLoadingReviews(false);
      }
    };

    getProductReviews();
  }, [isReviewSubmitted, id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateToastOpen(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isToastOpen]);

  return (
    <DashboardWidth>
      <ToastMessage
        classname={`${
          isToastOpen ? 'top-0' : '-translate-y-1/2'
        }  w-full lg:w-[calc(100vw-256px)] transition-all duration-300`}
        message="Item added to your bag! Click the bag to checkout."
      />
      <Fragment>
        <div className="px-4 md:px-10 xl:px-0 pb-10 w-full xl:w-[824px] 2xl:w-[920px] mx-auto">
          <PageHeader element={<ButtonBack />} />
          <section className="flex flex-col md:flex-row gap-[62px] md:items-start">
            <div className="flex flex-col gap-4">
              {isloadingSingleProduct ? (
                <Skeleton className="w-full md:w-[380px] h-[414px] " />
              ) : (
                <div className="flex items-center justify-center bg-white w-full md:w-[380px] h-[414px] rounded-2xl relative">
                  <div className="absolute top-5 right-7 flex items-center justify-end gap-4">
                    <button
                      className="bg-[#F7F7F7] p-1 rounded"
                      onClick={() => handleViewProductImage('prev')}
                    >
                      <IoIosArrowBack size={20} color="#36454F" />
                    </button>
                    <button
                      className="bg-[#F7F7F7] p-1 rounded"
                      onClick={() => handleViewProductImage('next')}
                    >
                      <IoIosArrowForward size={20} color="#36454F" />
                    </button>
                  </div>
                  {singleProduct?.images[currentImage] && (
                    <img
                      src={singleProduct?.images[currentImage]}
                      alt="product image"
                      className="max-w-[300px] object-contain max-h-[293px] w-auto h-auto"
                    />
                  )}
                </div>
              )}

              <div className="flex gap-4 items-start">
                {isloadingSingleProduct ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="size-20" />
                    </div>
                  ))
                ) : (
                  <Fragment>
                    {singleProduct?.images?.map((image, idx) => {
                      return (
                        <div
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className="cursor-pointer flex items-center justify-center bg-white h-[77px] w-[79px] rounded"
                        >
                          <img
                            src={image}
                            alt="product image"
                            className="max-w-[70px] object-contain max-h-[56px] w-auto h-auto"
                          />
                        </div>
                      );
                    })}
                  </Fragment>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-8">
              <div className="border-b border-b-[#E3E6ED] pb-6">
                {isloadingSingleProduct ? (
                  <Skeleton height={20} />
                ) : (
                  <h1 className="text-black leading-9 text-[26px] font-medium">
                    {singleProduct?.name +
                      (variantInfo?.variation ? ` (${variantInfo?.variation})` : '')}
                  </h1>
                )}
              </div>
              <div className="border-b border-b-[#E3E6ED]">
                {isloadingSingleProduct ? (
                  <Skeleton />
                ) : (
                  <p className="font-bold text-[20px] leading-7">
                    {variantInfo?.price ? priceFormatter(parseFloat(variantInfo?.price), 2) : null}
                  </p>
                )}
                <FilterChip
                  action={() => addToCart(singleProduct as IProduct, variantId as string)}
                  classname="my-10 bg-prm-black text-white border-[#757575] border-[0.75px] justify-center sm: py-[14px] px-[14px] w-full text-[15px] leading-5 rounded-[32px]"
                  text="Add to bag"
                  iconRight={
                    <div className="w-4 h-[18px]">
                      <Cart stroke="#ffffff" />
                    </div>
                  }
                />
              </div>
              {isloadingSingleProduct ? (
                <Skeleton count={5} />
              ) : (
                <p className="text-[#282828] text-[17px] font-normal leading-6">
                  {singleProduct?.description}
                </p>
              )}
              <button
                onClick={() => setReviewOpen(true)}
                className="border-y border-y-[#E3E6ED] py-6 flex gap-[6px] justify-center items-center text-[17px] font-normal leading-6 text-[#E4572E]"
              >
                <span>Rate this item</span>
                <IoStarSharp />
              </button>
            </div>
          </section>
          <section className="mt-6 pb-10">
            <h1 className="text-black font-medium text-2xl">Customers&apos; feedback</h1>
            <div className="mt-8 flex gap-14 flex-col md:flex-row">
              <div className="bg-white shadow-[#7080901A] shadow-lg border border-[#E3E6ED] flex flex-col items-center justify-center w-full md:w-[240px] h-[206px] rounded-lg py-10 px-6">
                <h1 className="text-[34px] leading-[48px] font-normal">
                  {isLoadingReviews ? (
                    <Skeleton width={50} />
                  ) : (
                    <>
                      <span>{productReviews?.average_rating || 0}</span> / <span>5</span>
                    </>
                  )}
                </h1>
                <div className="py-3 flex gap-2 items-center">
                  {isLoadingReviews ? (
                    <Skeleton width={140} />
                  ) : (
                    Array.from({ length: 5 }).map((_, index) => (
                      <IoStarSharp
                        size={32}
                        key={index}
                        color={
                          index + 1 <= (productReviews?.average_rating || 0) ? '#FFA900' : '#DBDBDB'
                        }
                      />
                    ))
                  )}
                </div>
                <p className="text-[#0D1415] text-base leading-[22px] font-normal">
                  {isLoadingReviews ? (
                    <Skeleton width={180} />
                  ) : (
                    productReviews?.reviews?.length + ' Verified Reviews'
                  )}
                </p>
              </div>
              <div className="w-full flex flex-col gap-10">
                {isLoadingReviews ? (
                  <Skeleton count={2} />
                ) : (productReviews?.reviews?.length as any) > 0 ? (
                  productReviews?.reviews.map((reviews, idx) => {
                    return (
                      <Review
                        key={idx}
                        count={reviews.rating}
                        name={reviews.user}
                        date={dayjs(reviews.date).format('DD-MM-YYYY')}
                        message={reviews.comment}
                      />
                    );
                  })
                ) : (
                  <h1 className="text-center text-2xl font-medium">No reviews yet</h1>
                )}
              </div>
            </div>
          </section>
          <section className="pb-24">
            <h1 className="text-black font-medium text-2xl">Related products</h1>
            <div className="mt-10 grid grid-cols-1 xs2:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 items-start gap-4 lg:gap-x-6 lg:gap-y-10">
              {isloadingRelatedData
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-[280px] w-full" />
                    </div>
                  ))
                : relatedProducts.map((product) => {
                    const { name, variants, product_id, images } = product;
                    return variants.map((v) => {
                      const { variation, price, variant_id } = v;

                      return (
                        <ProductCard
                          key={variant_id}
                          name={name + (variation ? ` (${variation})` : '')}
                          imgStyle="sm:max-w-[105px] sm:max-h-[150px]"
                          cardStyles="bg-white h-[287px] sm:h-[287px] laptop:w-auto rounded-[10px] pt-3 sm:pt-3"
                          productImage={images[0] || ''}
                          productPrice={parseInt(price)}
                          onClick={() =>
                            navigate(
                              `${ROUTES.dashboardDetailPageName}/${product_id}?v=${variant_id}`
                            )
                          }
                          action={() => addToCart(product, variant_id)}
                        />
                      );
                    });
                  })}
            </div>
          </section>
        </div>
      </Fragment>
      <ReviewModal
        setIsReviewSubmitted={setIsReviewSubmited}
        isReviewOpen={isReviewOpen}
        setReviewOpen={setReviewOpen}
        id={id}
      />
    </DashboardWidth>
  );
};

export default DashboardDetailsPage;

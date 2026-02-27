import { RxDoubleArrowRight } from 'react-icons/rx';
import { Container } from '../../components/global/Container';
import { FilterChip } from '../../components/ui/farm-products/filter-chip';
import { Cart } from '../../components/svgs/cart';
// import { IoStarSharp } from "react-icons/io5";
// import { Review } from "../../components/ui/farm-products/review";

import { ProductCard } from '../../components/ui/farm-products/product-card';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCartState, useCartStore } from '../../services/store/cartStore';
import { IProduct } from '../../types/products';
// import { ReviewModal } from "../../components/modals/review-modal";
import { Fragment, useEffect, useState } from 'react';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { toast } from 'react-toastify';
import { priceFormatter } from '../../utils/helpers';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
// import dayjs from "dayjs";
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../types';

const Details = () => {
  // const [isReviewOpen, setReviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  // const [isReviewSubmitted, setIsReviewSubmited] = useState(false);
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  // const [productReviews, setProductReviews] = useState<IProductReview>();
  const [productDetail, setProductDetail] = useState<IProduct | null>(null);
  const [variantInfo, setVariantInfo] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const [searchParams] = useSearchParams();
  const variantId = searchParams.get('v');
  const navigate = useNavigate();
  const { id } = useParams();

  const updateToastOpen = useCartState((state) => state.updateToastOpen);
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const { addToCart } = useCartStore();

  const axiosPrivate = useAxiosPrivate();

  const handleViewProductImage = (direction: 'next' | 'prev') => {
    setCurrentImage((prev) => {
      const imagesLength = productDetail?.images?.length ?? 0;
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
    const timeout = setTimeout(() => {
      updateToastOpen(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isToastOpen, updateToastOpen]);

  useEffect(() => {
    const getProductDetail = async () => {
      setLoadingProductDetail(true);
      try {
        const res = await axiosPrivate.get(`/products/product/${id}`);
        const data: IProduct = res?.data?.data;

        if (res.status === 200) {
          setProductDetail(data);
          if (variantId) {
            const variant = data.variants.find((v) => v.variant_id === variantId);
            setVariantInfo(variant || null);
          }
        } else {
          throw new Error();
        }
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;

        toast.error(axiosError?.response?.data?.message || 'Something went wrong', {
          toastId: 'detailserror',
        });
      } finally {
        setLoadingProductDetail(false);
      }
    };

    const getRelatedProducts = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`/products/related-products/${id}`);
        const data: IProduct[] = res?.data?.data;
        if (res.status === 200) {
          setRelatedProducts(data);
          setLoading(false);
        }
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        toast.error(axiosError?.response?.data?.message || 'Something went wrong', {
          toastId: 'relatedError',
        });
      } finally {
        setLoading(false);
      }
    };

    getProductDetail();
    getRelatedProducts();
  }, [id, variantId, axiosPrivate]);

  // useEffect(() => {
  //   const getProductReviews = async () => {
  //     setIsLoadingReviews(true);
  //     try {
  //       const res = await axiosPrivate.get(
  //         `/products/reviews?product_id=${id}`
  //       );
  //       const data = res?.data?.data;
  //       setProductReviews(data);
  //     } catch (error) {
  //       const axiosError = error as AxiosError<ErrorResponse>;
  //       toast.error(
  //         axiosError?.response?.data?.message || "Something went wrong",
  //         {
  //           toastId: "feedbacksError",
  //         }
  //       );
  //     } finally {
  //       setIsLoadingReviews(false);
  //     }
  //   };

  //   getProductReviews();
  // }, [isReviewSubmitted, id]);

  return (
    <div className="bg-[#FCFAF6]">
      <Container>
        <div className="px-4 md:px-10 lg:px-[100px] pt-56 sm:pt-56">
          <section>
            <div className="flex gap-[5px] items-center">
              <button
                onClick={() => navigate(-1)}
                className="cursor-pointer text-[#E4572E] text-[17px] leading-6 font-normal"
              >
                Groceries
              </button>
              <RxDoubleArrowRight color="#536878" size={14} />
              {loadingProductDetail ? (
                <Skeleton width={60} />
              ) : (
                <span className=" text-[#536878] text-[17px] leading-6 font-normal">
                  {productDetail?.name}
                </span>
              )}
            </div>
            <div className="mt-6 md:mt-[14px] flex flex-col md2:flex-row gap-12 lg:gap-[60px] md2:items-start">
              <div className="flex flex-col gap-4">
                {loadingProductDetail ? (
                  <Skeleton className="w-full md2:w-[520px] h-[414px]" />
                ) : (
                  <Fragment>
                    <div className="flex items-center justify-center bg-white w-full md2:w-[520px] h-[414px] rounded-2xl relative">
                      <div className="absolute flex items-center justify-end gap-4 top-5 right-6">
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
                      {productDetail?.images[currentImage] && (
                        <img
                          src={productDetail?.images[currentImage]}
                          alt="product image"
                          className="max-h-[293px] max-w-[211px] object-contain w-auto h-auto"
                        />
                      )}
                    </div>
                    <div className="flex items-start gap-4">
                      {productDetail?.images?.map((image, idx) => {
                        return (
                          <div
                            onClick={() => setCurrentImage(idx)}
                            key={idx}
                            className="cursor-pointer flex items-center justify-center bg-white h-[77px] w-[79px] rounded"
                          >
                            <img
                              src={image}
                              alt="product image"
                              className="max-h-[56px] max-w-[56px] object-contain w-auto h-auto"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Fragment>
                )}
              </div>

              <div className="w-full md2:w-[556px] px-4 flex flex-col gap-8">
                <div className="border-b border-b-[#E3E6ED] pb-6">
                  {loadingProductDetail ? (
                    <Skeleton />
                  ) : (
                    <h1 className="text-black leading-9 text-[26px] font-medium">
                      {
                        productDetail?.name
                        // + ` (${variantInfo?.variation || ""})`
                      }
                    </h1>
                  )}
                </div>
                <div className="border-b border-b-[#E3E6ED]">
                  <h1 className="font-bold text-[20px] leading-7">
                    {loadingProductDetail ? (
                      <Skeleton />
                    ) : (
                      <Fragment>
                        {variantInfo ? priceFormatter(parseFloat(variantInfo?.price), 2) : null}
                      </Fragment>
                    )}
                  </h1>

                  <FilterChip
                    action={() => addToCart(productDetail as IProduct, variantId as string)}
                    classname="my-10 bg-prm-black text-white border-[#757575] border-[0.75px] justify-center sm: py-[14px] px-[14px] w-full text-[15px] leading-5 rounded-[32px]"
                    text="Add to bag"
                    iconRight={
                      <div className="w-4 h-[18px]">
                        <Cart stroke="#ffffff" />
                      </div>
                    }
                  />
                </div>
                <div className="flex flex-col items-start gap-y-2">
                  <p className="text-[#282828] text-[17px] font-normal  whitespace-pre-line leading-6">
                    {loadingProductDetail ? <Skeleton count={4} /> : productDetail?.description}
                  </p>
                  {productDetail?.product_list && (
                    <p className="text-[#282828] text-[17px]  font-normal leading-6">
                      {loadingProductDetail ? (
                        <Skeleton count={4} />
                      ) : (
                        `${productDetail?.name} includes:`
                      )}
                    </p>
                  )}
                  <p className="text-[#282828] text-[17px] whitespace-pre-line font-normal leading-6">
                    {loadingProductDetail ? (
                      <Skeleton count={4} />
                    ) : (
                      productDetail?.product_list?.split(/[\r\n,]+/)?.map((item, index) => (
                        <span key={index} className="block">
                          • {item}
                        </span>
                      ))
                    )}
                  </p>
                </div>
                {/* <button
                  onClick={() => setReviewOpen(true)}
                  className="border-y border-y-[#E3E6ED] py-6 flex gap-[6px] justify-center items-center text-[17px] font-normal leading-6 text-[#E4572E]"
                >
                  <span>Rate this item</span>
                  <IoStarSharp />
                </button> */}
              </div>
            </div>
          </section>
          {/* <section className="pb-10 mt-12 md:mt-5">
            <h1 className="text-2xl font-medium text-black">
              Customers' feedback
            </h1>
            <div className="flex flex-col mt-8 md:flex-row gap-14">
              <div className="bg-white shadow-[#7080901A] shadow-lg border border-[#E3E6ED] flex flex-col items-center justify-center w-full md:w-[240px] h-[206px] rounded-lg py-10 px-6">
                <h1 className="text-[34px] leading-[48px] font-normal">
                  {isLoadingReviews ? (
                    <Skeleton width={50} />
                  ) : (
                    <>
                      <span>{productReviews?.average_rating || 0}</span> /{" "}
                      <span>5</span>
                    </>
                  )}
                </h1>
                <div className="flex items-center gap-2 py-3">
                  {isLoadingReviews ? (
                    <Skeleton width={180} />
                  ) : (
                    Array.from({ length: 5 }).map((_, index) => (
                      <IoStarSharp
                        size={32}
                        key={index}
                        color={
                          index + 1 <= (productReviews?.average_rating || 0)
                            ? "#FFA900"
                            : "#DBDBDB"
                        }
                      />
                    ))
                  )}
                </div>
                <p className="text-[#0D1415] text-base leading-6 font-normal">
                  {isLoadingReviews ? (
                    <Skeleton width={150} />
                  ) : (
                    productReviews?.reviews?.length + " Verified Reviews"
                  )}
                </p>
              </div>
              <div className="w-full lg:w-[825px] flex flex-col gap-10">
                {isLoadingReviews ? (
                  <Skeleton />
                ) : (productReviews?.reviews?.length as any) > 0 ? (
                  productReviews?.reviews.map((reviews, idx) => {
                    return (
                      <Review
                        key={idx}
                        count={reviews.rating}
                        name={reviews.user}
                        date={dayjs(reviews.date).format("DD-MM-YYYY")}
                        message={reviews.comment}
                      />
                    );
                  })
                ) : (
                  <h1 className="text-2xl font-medium text-center text-prm-black">
                    No reviews yet
                  </h1>
                )}
              </div>
            </div>
          </section> */}
          <section className="pb-24 mt-12 md:mt-5">
            <h1 className="text-2xl font-medium text-black">Related products</h1>
            <div className="grid items-start grid-cols-1 gap-4 mt-10 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-[300px] sm:h-[300px] laptop:w-[290px]" />
                    </div>
                  ))
                : relatedProducts.map((product) => {
                    const { name, variants, images, product_list, product_id } = product;
                    return variants.map((v) => {
                      const { price, variant_id } = v;
                      return (
                        <ProductCard
                          key={variant_id}
                          product_list={product_list}
                          name={name}
                          cardStyles="bg-white h-[300px] sm:h-[400px] laptop:w-[290px]"
                          productImage={images[0] || ''}
                          productPrice={parseFloat(price)}
                          onClick={() => navigate(`/quick-view/${product_id}`)}
                          action={() => addToCart(product, variant_id)}
                        />
                      );
                    });
                  })}
            </div>
          </section>
        </div>
      </Container>

      {/* <ReviewModal
        isReviewOpen={isReviewOpen}
        setReviewOpen={setReviewOpen}
        setIsReviewSubmitted={setIsReviewSubmited}
        id={id}
      /> */}
    </div>
  );
};

export default Details;

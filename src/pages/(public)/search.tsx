import { Container } from '../../components/global/Container';
import { Close } from '../../components/svgs/farm-product/close';
import { FilterChip } from '../../components/ui/farm-products/filter-chip';
import { ProductCard } from '../../components/ui/farm-products/product-card';
import { FarmProductCarousel } from '../../components/carousels/farm-product-carousel';
import { Cart } from '../../components/ui/cart/cart';

import { useEffect, useState } from 'react';
import { useCartState, useCartStore } from '../../services/store/cartStore';
import { IProduct } from '../../types/products';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import { useSetCategoryIdStore } from '../../services/store/categoryIdStore';

const SearchPage = ({
  title,
  text,
  spanText,
}: {
  title: string;
  text: string;
  spanText: string;
}) => {
  const { id: searchInput } = useParams();

  const updateToastOpen = useCartState((state) => state.updateToastOpen);
  const isToastOpen = useCartState((state) => state.isToastOpen);

  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { categoryID } = useSetCategoryIdStore();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  const handleCancelSearch = () => {
    navigate(`/groceries?category=${decodeURIComponent(categoryID)}`);
  };

  useEffect(() => {
    const getSearchResults = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`/products/search?q=${searchInput}`);
        const data: IProduct[] = res?.data?.data;

        if (res.status === 200) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    getSearchResults();
  }, [searchInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateToastOpen(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isToastOpen]);

  return (
    <Container>
      <div className="relative">
        <section className="lg:mt-44 mt-56 mx-4 lg:mx-[100px] bg-[#F8F3F0] rounded-[20px] sm:rounded-[40px] pt-[93px]">
          <div className="w-full px-[18px] md:w-[754px] text-center mx-auto">
            <h1 className="pb-6 sm:pb-4 font-besley text-[36px] sm:text-[64px] text-prm-black leading-[43px] sm:leading-[77px] italic font-medium sm:font-normal">
              {title} <span className="not-italic font-medium sm:font-normal">{spanText}</span>
            </h1>
            <p className="px-[10px] sm:px-0 text-lg sm:text-[20px] leading-6 sm:leading-7 text-[#36454F] font-normal">
              {text}
            </p>
          </div>
          <FarmProductCarousel
            setSearchParams={setSearchParams}
            currentPageName={decodeURIComponent(searchParams.get('category')!)!}
          />
        </section>
        <section className="pt-10 sm:pt-[70px] pb-14 lg:pb-[196px] mx-4 lg:mx-[100px]">
          <div className="flex items-center gap-6">
            <h1 className="text-prm-black text-[26px] font-medium leading-9 pr-6 lg:border-r lg:border-r-[#EAECF0]">
              Search results
            </h1>
            <FilterChip
              classname="bg-[#F7F7F7] capitalize select-none py-[6px] px-3 text-[15px] leading-5 flex items-center"
              iconRight={
                <div className="size-[14px]">
                  <Close />
                </div>
              }
              text={searchInput as string}
              action={handleCancelSearch}
            />
          </div>

          <div className="grid items-start grid-cols-1 gap-4 mt-10 xs:grid-cols-2 lg:grid-cols-3 laptop:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {loading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-[300px] sm:h-[300px] laptop:w-[290px]" />
                </div>
              ))
            ) : products?.length >= 1 ? (
              products.map((product, index: number) => {
                const { images, name, variants, product_id } = product;
                return variants.map((v) => {
                  const { variant_id, price, variation } = v;
                  return (
                    <ProductCard
                      onClick={() => navigate(`/quick-view/${product_id}?v=${variant_id}`)}
                      key={index + name + variant_id}
                      name={name + ` (${variation})`}
                      productImage={images[0]}
                      productPrice={parseFloat(price)}
                      action={() => addToCart(product, variant_id)}
                    />
                  );
                });
              })
            ) : (
              <h1 className="text-3xl font-medium">No product found</h1>
            )}
          </div>
        </section>
        <Cart />
      </div>
    </Container>
  );
};

export default SearchPage;

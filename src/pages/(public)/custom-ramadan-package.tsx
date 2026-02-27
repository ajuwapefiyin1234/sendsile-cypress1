import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ProductCard } from '../../components/ui/farm-products/product-card';
import { FilterChip } from '../../components/ui/farm-products/filter-chip';
import { useCartState, useCartStore } from '../../services/store/cartStore';
import { FilterSection } from '../../components/ui/farm-products/filter';
import { Filter } from '../../components/svgs/farm-product/filter';
import { Close } from '../../components/svgs/farm-product/close';
import { IProduct, IProductBrands } from '../../types/products';
import { useClickOutside } from '../../hooks/useClickOutside';
import { FilterModal } from '../../components/modals/filter';
import { Container } from '../../components/global/Container';
import { popularOptions } from '../../utils/constants';
import { ROUTES } from '../../utils/route-constants';
import { formatText } from '../../utils/helpers';
import CustomSelect from '../../components/ui/dropdown/custom-select';
import RamadanHero from '../../components/global/ramadan-hero';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { fruits } from '../../assets/images';

const CustomRamadanPackage = () => {
  const navigate = useNavigate();

  const [brandFilterList, setBrandFilterList] = useState<IProductBrands[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setOpen] = useState(false);
  const [popularity, setPopularity] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilterHover, setFilterHover] = useState(false);
  const [loadingCategoryName, setLoadingCategoryName] = useState(true);

  const filterRef = useClickOutside(() => setOpenFilter(false), openFilter);
  const updateToastOpen = useCartState((state) => state.updateToastOpen);
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const isCartOpen = useCartState((state) => state.isCartOpen);
  const axiosPrivate = useAxiosPrivate();
  const { addToCart } = useCartStore();

  const handleDeleteFilter = (id: string) => {
    const deleteFilter = brandFilterList?.filter((item) => item.id !== id);
    setBrandFilterList(deleteFilter);
  };

  const handleReset = () => {
    setBrandFilterList([]);
  };

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'unset';
    }

    return () => {
      document.body.style.overflowY = 'unset';
    };
  }, [isCartOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateToastOpen(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isToastOpen, updateToastOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setLoadingCategoryName(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          category: '29d5a0a0-943b-4cc6-aee5-ff34f6f2adea',
          ...(popularity && { popularity }),
          ...(priceFilter && { sortby: 'price', sort_order: priceFilter }),
        };

        const [productResponse, brandFilterResponse] = await Promise.all([
          axiosPrivate.get('/products/filter', {
            params,
          }),
          brandFilterList?.length > 0
            ? axiosPrivate.post('/products/filter', {
                brands: brandFilterList.map((item) => item.id),
              })
            : Promise.resolve(null),
        ]);

        let products = [];

        if (productResponse.status === 200) {
          products = productResponse?.data?.data;
        }

        if (brandFilterResponse?.status === 200) {
          const brandFilteredProducts = brandFilterResponse?.data?.data;
          if (products?.length > 0) {
            products = products.filter((product: any) =>
              brandFilteredProducts.some(
                (brandProduct: any) => brandProduct.product_id === product.product_id
              )
            );
          } else {
            products = brandFilteredProducts;
          }
        }

        if (products?.length > 0) {
          setProducts(products);
        } else {
          setProducts([]);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Something went wrong', {
          toastId: 'products',
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [popularity, priceFilter, brandFilterList, axiosPrivate]);

  return (
    <Container>
      <RamadanHero />
      <section className="pt-10 sm:pt-[70px] pb-14 lg:pb-[196px] mx-4 lg:mx-[100px]">
        <div className="hidden relative h-[46px] sm:h-12 md2:flex justify-between items-center">
          <div className="flex">
            <div ref={filterRef} className="relative pr-6 lg:border-r lg:border-r-[#EAECF0] w-fit">
              <FilterChip
                onMouseEnter={() => setFilterHover(true)}
                onMouseLeave={() => setFilterHover(false)}
                classname="bg-white hover:bg-[#E4572E] hover:text-white select-none py-3 px-4 mobile:px-[52px] sm:px-6 text-[17px] sm:text-sm leading-5"
                iconLeft={<Filter stroke={isFilterHover ? '#FFFFFF' : '#00070C'} />}
                text="Filters"
                action={() => setOpenFilter(!openFilter)}
              />
              <FilterSection
                open={openFilter}
                list={brandFilterList}
                setList={setBrandFilterList}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
              />
            </div>
            <div className="pl-6 flex items-center gap-4  md2:w-[550px] xl:w-[800px] overflow-scroll no-scrollbar">
              {brandFilterList?.map((item, index) => {
                return (
                  <FilterChip
                    key={index}
                    classname="py-[5px] px-3 bg-[#F7F7F7] "
                    text={item.name}
                    id={item.id}
                    iconRight={
                      <div className="size-[14px]">
                        {' '}
                        <Close />{' '}
                      </div>
                    }
                    handleRemove={() => handleDeleteFilter(item.id)}
                  />
                );
              })}
            </div>
          </div>
          <div className="w-fit mobile:w-[180px] sm:w-[130px]">
            <CustomSelect
              value={formatText(popularity) as string}
              handleSelect={setPopularity}
              classname="rounded-full border-[#E6E3DD] border-[0.75px] py-3 px-4 mobile:px-[46px] sm:px-6"
              option={popularOptions}
              placeholder="Popular"
              placeholderStyles="text-base leading-6 font-normal text-prm-black"
            />
          </div>
        </div>
        <div className="flex justify-between w-full px-5 py-3 my-12 bg-white md2:hidden rounded-2xl">
          <FilterChip
            classname="bg-white select-none py-3 px-5 xs2:px-[52px] text-[17px] leading-6"
            iconLeft={<Filter stroke="#00070C" />}
            text="Filters"
            action={() => setOpen(true)}
          />
          <button
            disabled={false}
            className="disabled:opacity-50 disabled:cursor-not-allowed text-[#536878] text-[17px] leading-6"
          >
            Reset
          </button>
        </div>
        <div className="grid items-start grid-cols-1 gap-4 mt-10 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          <div className=" h-[300px] laptop:w-[290px] sm:h-[400px] rounded-[20px] relative">
            {loadingCategoryName ? (
              <Skeleton className="w-full laptop:w-[290px] h-[300px] sm:h-[400px] rounded-[20px]" />
            ) : (
              <img
                className="w-full object-cover object-center h-full rounded-[20px]"
                src={fruits}
                alt="farm product image"
              />
            )}
            <p className="w-full absolute right-0 whitespace-pre-wrap top-5 sm:top-[34px] left-3 sm:left-5 text-[24px] sm:text-[38px] leading-7 sm:leading-[46px] italic font-besley font-normal text-white">
              {loadingCategoryName ? 'Loading' : 'Create your own basket'}
            </p>
          </div>
          {loading
            ? Array.from({ length: 7 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full laptop:w-[290px] h-[300px] sm:h-[400px] rounded-[20px]"
                />
              ))
            : products.map((product) => {
                const { name, images, product_id, product_list, variants } = product;

                return variants.map((variant) => {
                  const { price, variant_id } = variant;

                  return (
                    <ProductCard
                      key={variant_id}
                      name={name}
                      product_list={product_list}
                      productImage={images[0]}
                      productPrice={parseInt(price)}
                      onClick={() => navigate(`${ROUTES.detailName}/${product_id}?v=${variant_id}`)}
                      action={() => addToCart(product, variant_id)}
                    />
                  );
                });
              })}
        </div>
      </section>
      <FilterModal
        handleReset={handleReset}
        dropDownOne={<FilterDropDown name="Brand" placeholder="All brands" />}
        dropDownTwo={<FilterDropDown name="Price" placeholder="Lowest to Highest" />}
        setOpen={setOpen}
        openFilter={filterOpen}
      />
    </Container>
  );
};

export default CustomRamadanPackage;

function FilterDropDown({ name, placeholder }: { placeholder: string; name: string }) {
  return (
    <div>
      <h1 className="pb-2 text-prm-black text-[17px] leading-6">{name}</h1>
      <CustomSelect
        value=""
        handleSelect={() => ''}
        placeholder={placeholder}
        placeholderStyles="text-[#536878] text-base font-light leading-6"
        option={popularOptions}
        arrowUp={<IoIosArrowUp />}
        arrowDown={<IoIosArrowDown />}
        classname="bg-[#F7F7F7] border-[#D1D3D9]"
      />
    </div>
  );
}

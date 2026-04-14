import { useNavigate, useSearchParams } from 'react-router-dom';
import { ActionButton } from '../../../components/buttons/action-button';
import { DashboardWidth } from '../../../components/global/dashboard-width';
import { Cart } from '../../../components/svgs/cart';
import { Search } from '../../../components/svgs/search';
import { useCartState, useCartStore } from '../../../services/store/cartStore';
import { FormEvent, useEffect, useState } from 'react';
import { ToastMessage } from '../../../components/ui/cart/toast-message';
import { DashboardProducts } from '../../../components/carousels/dashboard-products';
import { FilterChip } from '../../../components/ui/farm-products/filter-chip';
import { Filter } from '../../../components/svgs/farm-product/filter';
import CustomSelect from '../../../components/ui/dropdown/custom-select';
import { FilterSection } from '../../../components/ui/farm-products/filter';
import { Close } from '../../../components/svgs/farm-product/close';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { ProductCard } from '../../../components/ui/farm-products/product-card';
import { IProduct, IProductBrandCategory, IProductBrands } from '../../../types/products';
import { FilterModal } from '../../../components/modals/filter';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { ROUTES } from '../../../utils/route-constants';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { formatText } from '../../../utils/helpers';
import { ImagePlaceholder } from '../../../components/ui/image-placeholder';
import { popularOptions } from '../../../utils/constants';

const options = [
  { value: 'name', label: 'name' },
  { value: 'filter', label: 'filter' },
];

const Groceries = () => {
  const updateCartOpen = useCartState((state) => state.updateIsCartOpen);
  const updateToastOpen = useCartState((state) => state.updateToastOpen);
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const isCartOpen = useCartState((state) => state.isCartOpen);
  const { cart, getTotalQuantity } = useCartStore();

  const [isSearchInputOpen, setSearchInputOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchSuggestion, setSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredProducts, setFilteredProduct] = useState<IProduct[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [isFilterHover, setFilterHover] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setOpen] = useState(false);
  const [brandFilterList, setBrandFilterList] = useState<IProductBrands[]>([]);
  const [popularity, setPopularity] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [categories, setCategories] = useState<IProductBrandCategory[]>();

  const searchRef = useClickOutside(() => setSearchInputOpen(false), isSearchInputOpen);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const filterRef = useClickOutside(() => setOpenFilter(false), openFilter);

  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCartStore();

  const handleSearchOpen = () => {
    setSearchInputOpen(!isSearchInputOpen);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput?.length === 0) {
      return;
    }
    navigate(`/search/${searchInput}`);
    setSuggestions(false);
    setSearchInput('');
  };

  const handleDetailPage = (id: string, variation: string) => {
    navigate(`/dashboard/product/${id}?v=${variation}`);
    setSuggestions(false);
    setSearchInput('');
  };

  const handleDeleteFilter = (id: string) => {
    const deleteFilter = brandFilterList.filter((item) => item.id !== id);
    setBrandFilterList(deleteFilter);
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions(false);
      setFilteredProduct([]);
      return;
    }

    const getSearchResults = async () => {
      setSearchLoading(true);
      setSuggestions(true);
      try {
        const res = await axiosPrivate.get(`/products/search?q=${searchInput}`);
        const data: IProduct[] = res?.data?.data;

        if (res.status === 200) {
          setFilteredProduct(data);
        } else {
          setSuggestions(false);
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Something went wrong', {
          toastId: 'searchInp',
          position: 'top-right',
        });
        setSuggestions(false);
      } finally {
        setSearchLoading(false);
      }
    };

    getSearchResults();
  }, [searchInput]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          category: searchParams.get('category'),
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
  }, [searchParams, popularity, priceFilter, brandFilterList]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateToastOpen(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isToastOpen]);

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
  }, []);

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

  return (
    <DashboardWidth classname="overflow-hidden">
      <ToastMessage
        classname={`${
          isToastOpen ? 'top-0' : '-translate-y-1/2'
        }  w-full lg:w-[calc(100vw-256px)] transition-all duration-300`}
        message="Item added to your bag! Click the bag to checkout."
      />

      <div className="px-4 sm2:px-5 md:px-5 xl:px-0 pb-10 w-full xl:w-[824px] 2xl:w-[920px] mx-auto">
        <header className="mt-[150px] lg:mt-[90px] flex flex-wrap md:flex-nowrap gap-y-3 justify-between  items-center">
          <div className="space-y-6">
            <h1 className="text-2xl md:text-[32px] leading-9 font-medium text-prm-black">
              Groceries
            </h1>
            <p>
              {categories?.find((category) => category.id === searchParams.get('category'))?.name}
            </p>
          </div>
          <div className="hidden gap-8 md:flex">
            <div className="relative">
              <form
                ref={searchRef}
                onSubmit={(e) => handleSearch(e)}
                className={`${
                  isSearchInputOpen
                    ? ' md:w-[377px] opacity-100 duration-300'
                    : 'opacity-0 w-0 overflow-hidden duration-500'
                }  rounded-full h-[46px] relative transition-all ease-in-out`}
              >
                <div className="absolute -translate-y-1/2 top-1/2 left-4">
                  <Search />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for..."
                  className="pl-10 pr-4 border border-[#5F5F5F] focus:border-[#E4572E] outline-none bg-white w-full h-full rounded-full placeholder:text-[#7E8B95] placeholder:text-base placeholder:leading-6"
                />
              </form>
              <div
                className={`${
                  searchSuggestion ? 'opacity-100 visible' : 'opacity-0 invisible'
                } z-50 py-5 px-4 flex flex-col gap-5 duration-300 transition-all ease-in-out bg-white w-full min-h-full max-h-[260px] overflow-scroll top-14 left-0 absolute shadow-md rounded-xl scrollbar shadow-[#2632381A] border border-[#F9FAFB]`}
              >
                {searchLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="w-full h-4 rounded-md" />
                    ))
                  : filteredProducts.map((product) => {
                      return product.variants.map((v) => {
                        return (
                          <div
                            onClick={() => handleDetailPage(product.product_id, v.variant_id)}
                            className="flex items-center gap-3 cursor-pointer"
                            key={v.variant_id}
                          >
                            <div className="bg-[#F7F7F7] size-[61px] rounded-sm flex items-center justify-center">
                              {product?.images[0] ? (
                                <img src={product?.images[0]} alt="" />
                              ) : (
                                <ImagePlaceholder className="rounded-md size-10" />
                              )}
                            </div>
                            <h1 className="text-lg leading-6 font-normal text-[#0D1415]">
                              {product.name + ` (${v.variation})`}
                            </h1>
                          </div>
                        );
                      });
                    })}
              </div>
            </div>
            {isSearchInputOpen ? (
              ''
            ) : (
              <ActionButton action={handleSearchOpen} icon={<Search />} text="Search" />
            )}

            <ActionButton
              action={() => updateCartOpen(true)}
              icon={<Cart />}
              style="w-4 h-[18px]"
              text="Bag"
              cartItemsNo={getTotalQuantity(cart)}
            />
          </div>

          {/* mobile action cart */}
          <div className="relative md:hidden">
            <ActionButton
              action={() => updateCartOpen(true)}
              icon={<Cart />}
              style="size-[30px]"
              text="Bag"
              textStyle="text-lg"
            />
            {getTotalQuantity(cart) > 0 && (
              <p className="py-[2px] px-[8px] rounded-full text-white bg-[#E4572E] absolute -top-1 left-3 font-bold text-[10px] leading-[14px]">
                {getTotalQuantity(cart)}
              </p>
            )}
          </div>
          {/* mobile action cart */}

          {/* mobile search bar */}
          <div className="relative w-full md:hidden">
            <form
              onSubmit={(e) => handleSearch(e)}
              className={`xl:w-[377px] rounded-full h-[46px] relative`}
            >
              <div className="absolute -translate-y-1/2 top-1/2 left-4">
                <Search />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for..."
                className="pl-10 pr-4 border border-[#5F5F5F] focus:border-[#E4572E] outline-none bg-white w-full h-full rounded-full placeholder:text-[#7E8B95] placeholder:text-base placeholder:leading-6"
              />
            </form>
            <div
              className={`${
                searchSuggestion ? 'opacity-100 visible' : 'opacity-0 invisible'
              } z-50 py-5 px-4 flex flex-col gap-5 duration-300 transition-all ease-in-out bg-white w-full min-h-full max-h-[260px] overflow-scroll top-14 left-0 absolute shadow-md rounded-xl scrollbar shadow-[#2632381A] border border-[#F9FAFB]`}
            >
              {searchLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="w-full h-4 rounded-md" />
                  ))
                : filteredProducts.map((product, index) => {
                    return product.variants.map((v) => {
                      return (
                        <div
                          onClick={() => handleDetailPage(product.product_id, v.variant_id)}
                          className="flex items-center gap-3 cursor-pointer"
                          key={index}
                        >
                          <div className="bg-[#F7F7F7] size-[61px] rounded-sm flex items-center justify-center">
                            {product?.images[0] ? (
                              <img src={product?.images[0]} alt="" />
                            ) : (
                              <ImagePlaceholder className="rounded-md size-10" />
                            )}
                          </div>
                          <h1 className="text-lg leading-6 font-normal text-[#0D1415]">
                            {product.name + ` (${v.variation})`}
                          </h1>
                        </div>
                      );
                    });
                  })}
            </div>
          </div>
          {/* mobile search bar */}
        </header>

        <section className="bg-white rounded-[20px] px-5 mt-10 pt-10 pb-4">
          <DashboardProducts
            setSearchParams={setSearchParams}
            currentPageName={decodeURIComponent(searchParams.get('category')!)!}
          />
        </section>

        {/*tablet filter section*/}
        <section className="hidden my-6 relative h-[46px]  md:flex justify-between items-center">
          <div className="flex items-center">
            <div
              ref={filterRef}
              className="relative pr-6 w-fit after:content-[''] after:bg-[#EAECF0] after:h-[32px] after:w-[1px] after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2 "
            >
              <FilterChip
                onMouseEnter={() => setFilterHover(true)}
                onMouseLeave={() => setFilterHover(false)}
                classname="bg-white hover:bg-[#E4572E] hover:text-white select-none py-3 px-6 text-base leading-5"
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
            <div className="hidden pl-8 sm:flex items-center gap-4 sm:w-[300px] md:w-[450px] lg:w-[450px] overflow-scroll no-scrollbar">
              {brandFilterList?.map((item, index) => {
                return (
                  <FilterChip
                    key={index}
                    classname="py-[5px] px-3 bg-white "
                    text={item.name}
                    id={item.id}
                    iconRight={
                      <div className="size-[14px]">
                        <Close />
                      </div>
                    }
                    handleRemove={() => handleDeleteFilter(item.id)}
                  />
                );
              })}
            </div>
          </div>
          <div className="w-fit mobile:w-[180px] sm:w-[130px] md:w-fit">
            <CustomSelect
              value={formatText(popularity) as string}
              handleSelect={setPopularity}
              arrowUp={<MdOutlineKeyboardArrowUp size={20} />}
              arrowDown={<MdOutlineKeyboardArrowDown size={20} />}
              classname="rounded-full border-[#E6E3DD] border-[0.75px] py-3 px-4 mobile:px-[46px] sm:px-6 min-w-[130px]"
              option={popularOptions}
              placeholder="Popular"
              placeholderStyles="text-base leading-6 font-normal text-prm-black"
            />
          </div>

          {/* <FilterSection
            setOpen={setOpenFilter}
            open={openFilter}
            list={selectedList}
            setList={setList}
          /> */}
        </section>
        {/*tablet filter section*/}

        {/*mobile filter control section*/}
        <div className="flex justify-between w-full px-5 py-3 my-12 bg-white md:hidden rounded-2xl">
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
        {/*mobile filter control section*/}

        <section className="grid items-start grid-cols-1 gap-4 mt-10 xs:grid-cols-2 md2:grid-cols-3 lg:gap-x-6 lg:gap-y-6">
          {loading
            ? Array.from({ length: 7 }).map((_, index) => (
                <Skeleton
                  className="h-[287px] sm:h-[287px] laptop:w-full rounded-[20px]"
                  key={index}
                />
              ))
            : products.map((product) => {
                const { name, variants, images, product_id } = product;
                return variants.map((v) => {
                  return (
                    <ProductCard
                      key={v.variant_id}
                      name={name + (v.variation ? ` (${v.variation})` : '')}
                      cardStyles="bg-white h-[287px] sm:h-[287px] laptop:w-auto"
                      textStyle="text-lg"
                      imgStyle="sm:max-w-[100px] sm:max-h-[150px]"
                      productImage={images[0]}
                      productPrice={parseFloat(v.price)}
                      onClick={() =>
                        navigate(
                          `${ROUTES.dashboardDetailPageName}/${product_id}?v=${v.variant_id}`
                        )
                      }
                      action={() => addToCart(product, v.variant_id)}
                    />
                  );
                });
              })}
        </section>
      </div>
      {/* mobile filter section */}
      <FilterModal
        handleReset={handleReset}
        dropDownOne={<FilterDropDown name="Brand" placeholder="All brands" />}
        dropDownTwo={<FilterDropDown name="Price" placeholder="Lowest to Highest" />}
        setOpen={setOpen}
        openFilter={filterOpen}
      />
      {/* mobile filter section */}
    </DashboardWidth>
  );
};

export default Groceries;

function FilterDropDown({ name, placeholder }: { placeholder: string; name: string }) {
  return (
    <div>
      <h1 className="pb-2 text-prm-black text-[17px] leading-6">{name}</h1>
      <CustomSelect
        value=""
        handleSelect={() => ''}
        placeholder={placeholder}
        placeholderStyles="text-[#536878] text-base font-light leading-6"
        option={options}
        arrowUp={<IoIosArrowUp />}
        arrowDown={<IoIosArrowDown />}
        classname="bg-[#F7F7F7] border-[#D1D3D9]"
      />
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { Container } from './Container';
import { NavLogo } from '../svgs/NavLogo';
import { ActionButton } from '../buttons/action-button';
import { Search } from '../svgs/search';
import { Cart } from '../svgs/cart';
import { useCartState, useCartStore } from '../../services/store/cartStore';
import { ToastMessage } from '../ui/cart/toast-message';
import { FormEvent, useEffect, useState } from 'react';
import { MobileNav } from './mobile-nav';
import { ROUTES } from '../../utils/route-constants';
import { IProduct } from '../../types/products';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { isLoggedIn } from '../../utils/helpers';
import { useClickOutside } from '../../hooks/useClickOutside';
import { ImagePlaceholder } from '../ui/image-placeholder';
import Skeleton from 'react-loading-skeleton';
// import TimedBanner from "./timed-banner";

export const HomeNavbar = () => {
  const updateCartOpen = useCartState((state) => state.updateIsCartOpen);
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const { getTotalQuantity, cart, guestCart, isAuthenticated } = useCartStore();

  const [isSearchInputOpen, setSearchInputOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchSuggestion, setSuggestions] = useState(false);
  const [filteredProducts, setFilteredProduct] = useState<IProduct[]>([]);

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const SearchRef = useClickOutside(() => {
    setSuggestions(false);
    setSearchInputOpen(false);
  }, isSearchInputOpen);

  // const handleSearchOpen = () => {
  //   setSearchInputOpen(!isSearchInputOpen);
  // };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput?.length === 0) {
      return;
    }
    navigate(`${ROUTES.searchName}/${searchInput}`);
    setSuggestions(false);
    setSearchInput('');
  };

  const handleDetailPage = (id: string, variation: string) => {
    navigate(`${ROUTES.detailName}/${id}?v=${variation}`);
    setSuggestions(false);
    setSearchInput('');
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
        setSuggestions(false);
        if (err.response.status === 422) {
          return;
        }
        toast.error(err?.response?.data?.message || 'Something went wrong', {
          toastId: 'searchInp',
          position: 'top-right',
        });
      } finally {
        setSearchLoading(false);
      }
    };

    getSearchResults();
  }, [searchInput, axiosPrivate]);

  return (
    <div className={`fixed  z-50 w-full ${isToastOpen ? 'top-10' : 'top-0'}`}>
      <ToastMessage
        classname={`z-[99] transition-all duration-300 ${
          isToastOpen ? 'top-0' : '-translate-y-1/2'
        }`}
        message="Item added to your bag! Click the bag to checkout."
      />
      {/* <TimedBanner /> */}
      <header
        className={`${
          isToastOpen ? 'top-10' : 'top-0'
        } transition-all duration-300 hidden lg:block w-full bg-navGradientBg`}
      >
        <Container>
          <nav className="flex items-center z-[99] justify-between px-4 lg:px-[100px] py-[18.5px]">
            <Link to={'/'} className="w-[117px] h-[29px]">
              <NavLogo />
            </Link>

            <div className="flex gap-8">
              <div className="relative">
                <form
                  ref={SearchRef}
                  onSubmit={(e) => handleSearch(e)}
                  className={`${
                    isSearchInputOpen
                      ? 'w-[400px] xl:w-[514px] visible opacity-100 duration-300'
                      : 'opacity-0 w-0 invisible overflow-hidden duration-500'
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
                    className="pl-10 pr-4 border border-[#5F5F5F] focus:border-[#E4572E] outline-none bg-[#F9FAFB] w-full h-full rounded-full placeholder:text-[#7E8B95] placeholder:text-base placeholder:leading-6"
                  />
                </form>
                <div
                  className={`${
                    searchSuggestion ? 'opacity-100 visible' : 'opacity-0 invisible'
                  } py-5 px-4 flex flex-col gap-5 duration-300 transition-all ease-in-out bg-white w-[514px] min-h-full max-h-[260px] overflow-scroll top-14 left-0 absolute shadow-md rounded-xl scrollbar shadow-[#2632381A] border border-[#F9FAFB]`}
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
                                {product?.name + ` (${v.variation})`}
                              </h1>
                            </div>
                          );
                        });
                      })}
                </div>
              </div>
              {/* {isSearchInputOpen ? (
                ""
              ) : (
                <ActionButton
                  action={handleSearchOpen}
                  icon={<Search />}
                  text="Search"
                />
              )} */}

              <ActionButton
                action={() => updateCartOpen(true)}
                icon={<Cart />}
                style="w-4 h-[18px]"
                text="Bag"
                cartItemsNo={getTotalQuantity(isAuthenticated ? cart : guestCart)}
              />
              {isLoggedIn() ? (
                <Link
                  to={ROUTES.dashboard}
                  className="z-10  font-medium bg-white rounded-[32px] border border-[#5F5F5F] shadow-[0px_4px_10px_0px] shadow-[#36454F1A] py-[10px] px-[44px]"
                >
                  <p className="text-[15px] font-bold leading-[21px] text-[#00070C]">Dashboard</p>
                </Link>
              ) : (
                <Link
                  to={ROUTES.login}
                  className="z-10  font-medium bg-white rounded-[32px] border border-[#5F5F5F] shadow-[0px_4px_10px_0px] shadow-[#36454F1A] py-[10px] px-[44px]"
                >
                  <p className="text-[15px] font-bold leading-[21px] text-[#00070C]">Login</p>
                </Link>
              )}
            </div>
          </nav>
        </Container>
      </header>
      <MobileNav />
    </div>
  );
};

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavLogo } from '../svgs/NavLogo';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useCartState, useCartStore } from '../../services/store/cartStore';
import { FormEvent, useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { navRoutes, ROUTES } from '../../utils/route-constants';
import { Cart } from '../svgs/cart';
import { Search } from '../svgs/search';
import { isLoggedIn } from '../../utils/helpers';
import { IProduct } from '../../types/products';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { ImagePlaceholder } from '../ui/image-placeholder';
import { useSetCategoryIdStore } from '../../services/store/categoryIdStore';

export const MobileNav = () => {
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const updateCartOpen = useCartState((state) => state.updateIsCartOpen);
  const { cart, getTotalQuantity, isAuthenticated, guestCart } = useCartStore();
  const cartItemsNo = getTotalQuantity(isAuthenticated ? cart : guestCart);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [isOpen, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchSuggestion, setSuggestions] = useState(false);
  const [filteredProducts, setFilteredProduct] = useState<IProduct[]>([]);
  const { categoryID } = useSetCategoryIdStore();

  const handleNavOpen = () => {
    setOpen(!isOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(!isOpen);
  };

  const checkPath = (path: string) => {
    if (path.includes(ROUTES.groceriesPage)) {
      return ROUTES.groceriesPage;
    } else {
      return path;
    }
  };

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
    <div className="">
      <header
        className={`${
          isToastOpen ? ' top-28' : 'top-0'
        } transition-all duration-300 ease-in-out px-4 backdrop-blur-lg fixed z-50 w-full top-0 flex flex-wrap justify-between items-center py-6 lg:hidden`}
      >
        <Link to={'/'} className="w-[100px] h-[24px]">
          <NavLogo />
        </Link>
        <div className="flex items-center gap-4">
          {location.pathname !== '/' &&
            location.pathname !== '/home' &&
            location.pathname !== ROUTES.signUp &&
            location.pathname !== ROUTES.login &&
            location.pathname !== ROUTES.forgotPassword &&
            location.pathname !== ROUTES.payBills &&
            location.pathname !== ROUTES.emailVerification && (
              <div className="relative sm:w-[350px] md:w-[450px]">
                <form
                  onSubmit={handleSearch}
                  className={`hidden sm:block w-full rounded-full h-[46px]`}
                >
                  <div className="absolute -translate-y-1/2 top-1/2 left-4">
                    <Search />
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search"
                    className=" pl-10 pr-4 border border-[#5F5F5F] focus:border-[#E4572E] outline-none bg-[#F9FAFB] w-full h-full rounded-full placeholder:text-prm-black placeholder:text-base placeholder:leading-6"
                  />
                </form>
                <div
                  className={`${
                    searchSuggestion ? 'opacity-100 visible' : 'opacity-0 invisible'
                  } hidden sm:flex py-5 px-4 flex-col gap-5 duration-300 transition-all ease-in-out bg-white  min-h-full max-h-[260px] overflow-scroll top-14 left-0 right-0 absolute shadow-md rounded-xl scrollbar shadow-[#2632381A] border border-[#F9FAFB]`}
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
                              className="flex items-center gap-3"
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
            )}

          {location.pathname !== '/home' &&
            location.pathname !== ROUTES.signUp &&
            location.pathname !== ROUTES.login &&
            location.pathname !== ROUTES.forgotPassword &&
            location.pathname !== ROUTES.payBills &&
            location.pathname !== ROUTES.emailVerification && (
              <div onClick={() => updateCartOpen(true)} className="relative">
                <div className="size-5">
                  <Cart />
                </div>
                {cartItemsNo > 0 && (
                  <p className="py-[3px] px-[8px] rounded-full text-white bg-[#E4572E] absolute -top-[3px] -right-2 font-bold text-[10px] leading-[14px]">
                    {cartItemsNo}
                  </p>
                )}
              </div>
            )}

          {location.pathname !== '/home' && (
            <button className="size-7" onClick={handleNavOpen}>
              <RxHamburgerMenu size={28} />
            </button>
          )}
        </div>

        {location.pathname !== '/' &&
          location.pathname !== '/home' &&
          location.pathname !== ROUTES.signUp &&
          location.pathname !== ROUTES.login &&
          location.pathname !== ROUTES.forgotPassword &&
          location.pathname !== ROUTES.payBills &&
          location.pathname !== ROUTES.emailVerification && (
            <div className="relative w-full">
              <form
                onSubmit={handleSearch}
                className={`sm:hidden mt-8 w-full rounded-full h-[46px] relative`}
              >
                <div className="absolute -translate-y-1/2 top-1/2 left-4">
                  <Search />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search"
                  className=" pl-10 pr-4 border border-[#5F5F5F] focus:border-[#E4572E] outline-none bg-[#F9FAFB] w-full h-full rounded-full placeholder:text-prm-black placeholder:text-base placeholder:leading-6"
                />
              </form>
              <div
                className={`${
                  searchSuggestion ? 'opacity-100 visible' : 'opacity-0 invisible'
                } sm:hidden py-5 px-4 flex-col space-y-5 duration-300 transition-all ease-in-out bg-white  min-h-full max-h-[260px] overflow-scroll top-24 left-0 right-0 absolute shadow-md rounded-xl scrollbar shadow-[#2632381A] border border-[#F9FAFB]`}
              >
                {searchLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="w-full h-4 rounded-md" />
                    ))
                  : filteredProducts.map((product) => {
                      return product?.variants.map((v) => {
                        return (
                          <div
                            onClick={() => handleDetailPage(product.product_id, v.variant_id)}
                            className="flex items-center gap-3"
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
          )}
      </header>

      {/* mobile nav content */}
      <div
        className={`${
          isOpen ? '-translate-x-full' : '-translate-x-0 overflow-hidden'
        } px-6 pb-8 bg-[#FCFAF6] z-[99] h-dvh w-[85%] sm:w-1/2 lg:hidden left-full top-0 fixed transition-all duration-300 ease-in-out flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between pt-6">
            <Link to={'/'} className="w-[100px] h-[24px]">
              <NavLogo />
            </Link>

            <button onClick={handleNavOpen}>
              <GrClose size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-8 pt-16">
            {navRoutes.map((route, index) => {
              if (route.text === 'Contact')
                return (
                  <a
                    key={index}
                    href="mailto:support@sendsile.com"
                    className="text-[20px] leading-[36px] text-[#36454F] font-medium "
                  >
                    <span>{route.text}</span>
                  </a>
                );
              else
                return (
                  <Link
                    key={index}
                    to={
                      route.text === 'Groceries'
                        ? `/groceries?category=${encodeURIComponent(categoryID)}`
                        : route.path
                    }
                    onClick={handleNavOpen}
                    className={`text-[20px] leading-[36px] text-[#36454F] ${
                      checkPath(route.path) === location.pathname ? 'font-bold' : 'font-medium '
                    } `}
                  >
                    <span
                      className={`size-2 rounded-full ${
                        checkPath(route.path) === location.pathname
                          ? 'bg-prm-red'
                          : 'bg-transparent'
                      }`}
                    ></span>

                    <span>{route.text}</span>
                  </Link>
                );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {isLoggedIn() ? (
            <button
              onClick={() => handleNavigate(ROUTES.dashboard)}
              className="border border-[#5F5F5F] bg-[#FCFBFA] hover:bg-[#000E25] hover:text-white transition-all duration-100  rounded-full py-4 h-14 w-full text-base leading-6 text-prm-black font-bold"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => handleNavigate(ROUTES.login)}
              className="border border-[#5F5F5F] bg-[#FCFBFA] hover:bg-[#000E25] hover:text-white transition-all duration-100  rounded-full py-4 h-14 w-full text-base leading-6 text-prm-black font-bold"
            >
              Login
            </button>
          )}
          <button
            onClick={() => handleNavigate('/sign-up')}
            className="border border-[#5F5F5F] bg-[#000E25] hover:bg-[#FCFBFA] hover:text-prm-black transition-all duration-100 rounded-full py-4 h-14 w-full text-base leading-6 text-white font-bold"
          >
            Get started
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 lg:hidden bg-mobileNavOverlay backdrop-blur-sm"
        ></div>
      )}
    </div>
  );
};

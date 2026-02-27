import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import { RamadanServices } from '../../components/sections/landing/ramadan-services';
import { RamadanEasy } from '../../components/sections/landing/ramadan-easy';
import { ProductCard } from '../../components/ui/farm-products/product-card';
import { useCartState, useCartStore } from '../../services/store/cartStore';
import RamadanHero from '../../components/global/ramadan-hero';
import { Container } from '../../components/global/Container';
import { Faq } from '../../components/sections/landing/faq';
import RamadanModal from '../../components/modals/ramadan';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ROUTES } from '../../utils/route-constants';
import { IProduct } from '../../types/products';

const RamadanLandingPage = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  // const endDate = new Date('2025-03-29');
  const [loading, setLoading] = useState(true);
  const updateToastOpen = useCartState((state) => state.updateToastOpen);
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const isCartOpen = useCartState((state) => state.isCartOpen);
  const { addToCart } = useCartStore();
  // const currentDate = new Date();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else if (!isCartOpen) {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (!isCartOpen) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isModalOpen, isCartOpen]);

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
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!isModalOpen) {
      document.body.style.overflow = 'auto';
    }

    return () => {
      if (!isModalOpen) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isCartOpen, isModalOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateToastOpen(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isToastOpen, updateToastOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const params: any = {
          category: '5f71cfef-fcba-4a89-a35b-f955aa6e58fb',
        };

        const [productResponse] = await Promise.all([
          axiosPrivate.get('/products/filter', {
            params,
          }),
        ]);

        let products = [];

        if (productResponse.status === 200) {
          products = productResponse?.data?.data;
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
  }, [axiosPrivate]);

  useEffect(() => {
    const isNotOpened = localStorage.getItem('ramadanModal') !== 'true';
    if (isNotOpened) {
      setIsModalOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    localStorage.setItem('ramadanModal', 'true');
  };

  return (
    <>
      <div className="">
        <RamadanHero />
        <Container>
          <section
            id="packages-section"
            ref={sectionRef}
            className=" mx-4 pt-14 pb-24 px-4 lg:px-0 lg:mx-[100px]"
          >
            <span className=" text-[#00070C] font-besley italic font-[400] text-[20px] leading-[28px] md:text-[26px] md:leading-[37px]">
              Ramadan Offerings
            </span>
            <div className="grid items-start grid-cols-1 gap-4 mt-10 xs:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-full h-[300px] sm:h-[400px] rounded-[20px]"
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
                          onClick={() =>
                            navigate(`${ROUTES.detailName}/${product_id}?v=${variant_id}`)
                          }
                          action={() => addToCart(product, variant_id)}
                        />
                      );
                    });
                  })}
            </div>
          </section>
        </Container>
        <RamadanServices />
        <RamadanEasy />
        <Faq />
      </div>
      {isModalOpen && <RamadanModal modalRef={modalRef} close={handleClose} />}
    </>
  );
};

export default RamadanLandingPage;

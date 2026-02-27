import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
// import { TbPlus } from "react-icons/tb";

import { ProductCard } from '../../components/ui/farm-products/product-card';
import { useCartState, useCartStore } from '../../services/store/cartStore';
import { Container } from '../../components/global/Container';
import { ROUTES } from '../../utils/route-constants';
import RamadanHero from '../../components/global/ramadan-hero';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { IProduct } from '../../types/products';

const RamadanPackages = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const updateToastOpen = useCartState((state) => state.updateToastOpen);
  const isToastOpen = useCartState((state) => state.isToastOpen);
  const isCartOpen = useCartState((state) => state.isCartOpen);
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<IProduct[]>([]);
  const axiosPrivate = useAxiosPrivate();

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

  return (
    <>
      <RamadanHero />
      <Container>
        <section
          id="packages-section"
          ref={sectionRef}
          className="pt-6 pb-14 lg:pb-[196px] mx-4 lg:mx-[100px]"
        >
          <div className="grid items-start grid-cols-1 gap-4 mt-10 xs:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-[300px] sm:h-[400px] rounded-[20px]" />
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
    </>
  );
};

export default RamadanPackages;

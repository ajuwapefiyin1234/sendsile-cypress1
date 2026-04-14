// import { useNavigate } from "react-router-dom";
import { productColors } from '../../../utils/constants';
import { Container } from '../../global/Container';
// import { ProductsArrowLeft } from "../../svgs/products-arrow-left";
import { FarmProduct } from '../../ui/home/farm-products';
// import { useSetCategoryIdStore } from "../../../services/store/categoryIdStore";
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { IProductBrandCategory } from '../../../types/products';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/route-constants';

export const FarmProducts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IProductBrandCategory[]>();

  // const { categoryID } = useSetCategoryIdStore();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getCategories() {
      setLoading(true);
      try {
        const res = await axiosPrivate.get('/categories');
        if (res.status === 200) {
          const filteredCategories = res.data.data.filter(
            (category: any) => category.name !== 'Ramadan'
          );
          setCategories(filteredCategories);
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

  const handleCategoryClick = (categoryId: string) => {
    navigate(`${ROUTES.groceriesPage}?category=${encodeURIComponent(categoryId)}`, {
      state: { scrollToProducts: true },
    });
  };

  return (
    <section className="bg-[#FAF8F0] px-4 pt-16 lg:px-[99.5px]">
      <Container>
        <h1 className="pb-10 lg:pb-16 w-full max-w-[942px] mx-auto font-normal text-5xl leading-[48px] lg:text-[72px] lg:leading-[72px] text-center  text-prm-black">
          Nourish and nurture: <span className="italic font-besley"> farm fresh</span> products
          delivered with love
        </h1>
        <div className="flex flex-col items-center w-full mx-auto lg:w-fit">
          <div className="bg-white w-full rounded-[20px] px-4 py-6 lg:py-[39px] lg:px-16 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 items-center gap-6 lg:gap-10">
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="laptop:w-[152px] h-[174px] rounded-[16px]" />
                ))
              : categories?.map((product, index) => {
                  return (
                    <FarmProduct
                      action={() => handleCategoryClick(product?.id)}
                      key={index}
                      bg={productColors[index % productColors?.length]}
                      image={product?.image || ''}
                      text={product?.name}
                      imageStyle="w-full max-w-[120px] sm:max-w-[160px] lg:max-w-[140px] mx-auto"
                      classname="laptop:w-[152px] h-[174px] rounded-[16px]  transition-transform duration-200"
                    />
                  );
                })}
          </div>
          {/* <button
            onClick={() =>
              navigate(`/groceries?category=${encodeURIComponent(categoryID)}`)
            }
            className="mt-6 mb-5 self-end flex items-center gap-[20px] text-[20px] leading-7 font-medium group "
          >
            <span className="text-xl font-medium transition-all duration-200 ease-linear text-prm-red group-hover:text-prm-black">
              Shop all
            </span>
            <div className="bg-prm-red rounded-full px-[11px] py-[14px] group-hover:bg-prm-black transition-all duration-200 ease-linear">
              <ProductsArrowLeft />
            </div>
          </button> */}
        </div>
      </Container>
    </section>
  );
};

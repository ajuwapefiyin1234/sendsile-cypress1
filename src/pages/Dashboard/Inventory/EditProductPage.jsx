import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ProductForms from "@/components/forms/ProductForms";
import { fetchCategories, fetchBrands, fetchProduct } from "@/utils/queries";

import { useEffect } from "react";
import { useStore } from "@/store/store";
import PageLoader from "@/components/loaders/PageLoader";
import { useParams } from "react-router-dom";
import { getSuperAdminPartners } from '@/utils/adminqueries';

const EditProductPage = () => {
  const { id } = useParams();
  const isSuperAdmin = location.pathname.includes('super-admin');

  const { setCategories, setBrands, setLoadingCategories, setLoadingBrands } =
    useStore((state) => state.inventory);

  const {
    data: categories,
    error: categoriesError,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const {
    data: brands,
    error: brandsError,
    isLoading: isLoadingBrands,
  } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });

  const {
    data: product,
    error: productError,
    isLoading: isLoadingProduct,
  } = useQuery({
    queryKey: ['product', id, isSuperAdmin],
    queryFn: () => fetchProduct(id, isSuperAdmin),
  });

  const {
    data: partners,
    error: partnersError,
    isLoading: isLoadingPartners,
  } = useQuery({
    queryKey: ['partners'],
    queryFn: () => getSuperAdminPartners(),
    enabled: !!isSuperAdmin,
  });

  // handle loading states
  useEffect(() => {
    setLoadingCategories(isLoadingCategories);
    setLoadingBrands(isLoadingBrands);
  }, [
    isLoadingCategories,
    isLoadingBrands,
    setLoadingCategories,
    setLoadingBrands,
  ]);

  // handle success state
  useEffect(() => {
    setCategories(categories), setBrands(brands);
  }, [brands, categories, setCategories, setBrands]);

  // Handle error states
  useEffect(() => {
    if (categoriesError || brandsError) {
      toast.error(
        categoriesError?.response?.data?.message ||
          brandsError?.response?.data?.message ||
          categoriesError?.message ||
          brandsError?.message ||
          'Network error'
      );
    }

    if (productError) {
      toast.error(
        productError?.response?.data?.message ||
          productError?.message ||
          'Network error'
      );
    }

    if (partnersError) {
      toast.error(
        partnersError?.response?.data?.message ||
          partnersError?.message ||
          'Network error'
      );
    }
  }, [categoriesError, brandsError, productError, partnersError]);
  return (
    <>
      {isLoadingProduct ? (
        <PageLoader />
      ) : (
        <ProductForms
          product={product}
          isAdding={false}
          id={id}
          partners={partners?.data}
          isLoadingPartners={isLoadingPartners}
        />
      )}
    </>
  );
};

export default EditProductPage;

import ProductForms from '@/components/forms/ProductForms';
import { getSuperAdminPartners } from '@/utils/adminqueries';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

const AddProductPage = () => {
    const isSuperAdmin = location.pathname.includes('super-admin');
    const {
      data: partners,
      error: partnersError,
      isLoading: isLoadingPartners,
    } = useQuery({
      queryKey: ['partners'],
      queryFn: () => getSuperAdminPartners(),
      enabled: !!isSuperAdmin,
    });

    // Handle error states
    useEffect(() => {
      if (partnersError) {
        toast.error(
          partnersError?.response?.data?.message ||
            partnersError?.message ||
            'Network error'
        );
      }
    }, [partnersError]);
    return (
      <ProductForms
        isAdding={true}
        partners={partners?.data}
        isLoadingPartners={isLoadingPartners}
      />
    );
};

export default AddProductPage;

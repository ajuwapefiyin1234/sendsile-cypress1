import { API_ROUTES } from '@/routes/apiRoutes';
import api from './api';

export const fetchAdminHomeStatistics = async () => {
  const data = await api.get(API_ROUTES.SUPER_ADMIN_HOME_STATISTICS);
  return data?.data?.data;
};

export const getSuperAdminOrders = async (
  status = 'processing',
  currentPage = 1,
  perPage = 10,
  searchBarParams = '',
  startDate = null,
  endDate = null
) => {
  const dateParams =
    startDate && endDate ? `&start_date=${startDate}&end_date=${endDate}` : '';
  const data = await api.get(
    `${API_ROUTES.SUPER_ADMIN_ORDERS}?status=${status}&&page=${currentPage}&&per_page=${perPage}&&keyword=${searchBarParams}${dateParams}`
  );
  return data?.data;
};


export const getSuperAdminPartners = async (
  currentPage = 1,
  perPage = 10,
  searchParams = '',
  availabilityParams
) => {

  const data = await api.get(
    API_ROUTES.SUPER_ADMIN_GET_PARTNERS(
      currentPage,
      perPage,
      searchParams,
      availabilityParams
    )
  );
  return data?.data;
};

export const viewPartnerDetails = async (
  partnerID = '7b1cb7b4-b35b-4845-bc24-ec0d7651ee4e'
) => {
  if (!partnerID) {
    throw new Error('partner ID is required');
  }

  const data = await api.get(API_ROUTES.SUPER_ADMIN_PARTNER_DETAILS(partnerID));
  return data?.data?.data;
};

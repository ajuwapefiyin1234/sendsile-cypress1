export const API_ROUTES = {
  HOME_STATISTICS: '/partner/landing/statistics',
  SUPER_ADMIN_HOME_STATISTICS: '/backoffice-admin/landing/statistics',
  SUPER_ADMIN_GET_PARTNERS: (
    currentPage,
    perPage,
    searchParams,
    availabilityParams
  ) => {
    let baseUrl = `/backoffice-admin/partners/index?page=${currentPage}&per_page=${perPage}`;
    // Append searchParams (keyword) only if searchParams is not empty or null
    if (searchParams) {
      baseUrl += `&keyword=${searchParams}`;
    }

    // If filterParams is not empty, append it to the base URL
    if (availabilityParams) {
      //   return `/backoffice-admin/partners/index?${availabilityParams}&page=${currentPage}&per_page=${perPage}${
      //     searchParams ? `&keyword=${searchParams}` : ''
      //   }`;
      return `/backoffice-admin/partners/index`;
    }

    // Return base URL if no filters are applied
    return baseUrl;
  },
  ORDERS: '/partner/orders',
  SUPER_ADMIN_ORDERS: '/backoffice-admin/orders',
  ORDER_DETAILS: (orderID) => `/partner/orders/${orderID}`,
  SUPER_ADMIN_ORDER_DETAILS: (orderID) => `/backoffice-admin/orders/${orderID}`,
  SUPER_ADMIN_PARTNER_DETAILS: (partnerID) =>
    `/backoffice-admin/partners/${partnerID}`,
  UPDATE_ORDER_STATUS: '/partner/orders',
  SUPER_ADMIN_UPDATE_ORDER_STATUS: '/backoffice-admin/orders',
  ADD_PRODUCT: '/partner/inventory/add',
  SUPER_ADMIN_ADD_PRODUCT: '/backoffice-admin/inventory/add',
  SUPER_ADMIN_ADD_PARTNER: '/backoffice-admin/partners',
  CATEGORIES: '/categories',
  BRANDS: `/brands`,
  SEARCHBRANDS: (searchParam) => `/brands/search?q=${searchParam}`,
  ADD_BRAND: '/backoffice/brands',
  EDIT_BRAND: (brandID) => `/backoffice/brands/${brandID}`,
  DELETE_BRAND: (brandID) => `/backoffice/brands/${brandID}`,
  SEARCHCATEGORIES: (searchParam) => `/categories/search?q=${searchParam}`,
  ADD_CATEGORY: '/backoffice/categories',
  DELETE_CATEGORY: (categoryID) => `/backoffice/categories/${categoryID}`,
  EDIT_CATEGORY: (categoryID) => `/backoffice/categories/${categoryID}`,
  INVENTORIES: (currentPage, perPage, searchParams, filter) => {
    let filterParams = '';

    // Check if filters are provided and construct the filterParams accordingly
    if (filter?.category) {
      filterParams += `category=${filter.category.id}`;
    }
    if (filter?.availability) {
      filterParams += `${filterParams ? '&' : ''}availability=${
        filter.availability
      }`;
    }
    if (filter?.priceRange?.from && filter?.priceRange?.to) {
      filterParams += `${filterParams ? '&' : ''}price_min=${
        filter.priceRange.from
      }&price_max=${filter.priceRange.to}`;
    }

    // Construct the base URL without keyword initially
    let baseUrl = `/partner/inventory/index?page=${currentPage}&per_page=${perPage}`;

    // Append searchParams (keyword) only if searchParams is not empty or null
    if (searchParams) {
      baseUrl += `&keyword=${searchParams}`;
    }

    // If filterParams is not empty, append it to the base URL
    if (filterParams) {
      return `/partner/inventory/filter?${filterParams}&page=${currentPage}&per_page=${perPage}${
        searchParams ? `&keyword=${searchParams}` : ''
      }`;
    }

    // Return base URL if no filters are applied
    return baseUrl;
  },
  SUPER_ADMIN_INVENTORIES: (currentPage, perPage, searchParams, filter) => {
    let filterParams = '';

    // Check if filters are provided and construct the filterParams accordingly
    if (filter?.category) {
      filterParams += `category=${filter.category.id}`;
    }
    if (filter?.availability) {
      filterParams += `${filterParams ? '&' : ''}availability=${
        filter.availability
      }`;
    }
    if (filter?.priceRange?.from && filter?.priceRange?.to) {
      filterParams += `${filterParams ? '&' : ''}price_min=${
        filter.priceRange.from
      }&price_max=${filter.priceRange.to}`;
    }

    // Construct the base URL without keyword initially
    let baseUrl = `/backoffice-admin/inventory/index?page=${currentPage}&per_page=${perPage}`;

    // Append searchParams (keyword) only if searchParams is not empty or null
    if (searchParams) {
      baseUrl += `&keyword=${searchParams}`;
    }

    // If filterParams is not empty, append it to the base URL
    if (filterParams) {
      return `/backoffice-admin/inventory/filter?${filterParams}&page=${currentPage}&per_page=${perPage}${
        searchParams ? `&keyword=${searchParams}` : ''
      }`;
    }

    // Return base URL if no filters are applied
    return baseUrl;
  },
  PRODUCT: (productID) => `/partner/inventory/view/${productID}`,
  SUPER_ADMIN_PRODUCT: (productID) =>
    `/backoffice-admin/inventory/view/${productID}`,
  SUPER_ADMIN_DELETE_PRODUCT: (productID) =>
    `/backoffice/products/${productID}`,
  DELETE_PRODUCT: (productID) => `/backoffice/products/${productID}`,
  EDIT_PRODUCT: (productID) => `/partner/inventory/edit/${productID}`,
  SUPER_ADMIN_EDIT_PRODUCT: (productID) =>
    `/backoffice-admin/inventory/edit/${productID}`,
  STOCK_STATS: (availability) =>
    `/partner/inventory/overview?availability=${availability}`,
  SUPER_ADMIN_STOCK_STATS: (availability) =>
    `/backoffice-admin/inventory/overview?availability=${availability}`,
  TRANSACTIONS: (
    currentPage,
    perPage,
    searchParams,
    startDate,
    endDate,
    status
  ) => {
    const dateParams =
      startDate && endDate
        ? `&start_date=${startDate}&end_date=${endDate}`
        : '';
    const statusParams = status && status !== 'All' ? `&status=${status}` : '';
    return `/partner/transactions?page=${currentPage}&&per_page=${perPage}&&q=${searchParams}${dateParams}${statusParams}`;
  },
  SUPER_ADMIN_TRANSACTIONS: (
    currentPage,
    perPage,
    searchParams,
    startDate,
    endDate,
    status
  ) => {
    const dateParams =
      startDate && endDate
        ? `&start_date=${startDate}&end_date=${endDate}`
        : '';
    const statusParams = status && status !== 'All' ? `&status=${status}` : '';
    return `/backoffice-admin/transactions?page=${currentPage}&&per_page=${perPage}&&q=${searchParams}${dateParams}${statusParams}`;
  },
  CHANGE_PASSWORD: '/password/change',
  UPDATE_AVATAR: '/user/profile',
  ENABLE_2FA: '/user/enable/two-factor-auth/initiate',
  FINALIZE_2FA: '/user/enable/two-factor-auth/finalize',
  DISABLE_2FA: '/user/disable/two-factor-auth',
  LOGOUT: '/partner/logout',
  SUPER_ADMIN_LOGOUT: '/backoffice-admin/logout',
  LOGOUT_ALL_SESSIONS: '/partner/logout/all-sessions',
  SUPER_ADMIN_LOGOUT_ALL_SESSIONS: '/backoffice-admin/logout/all-sessions',
  TEAM_MEMBERS: '/partner/team/members',
  SUPER_ADMIN_TEAM_MEMBERS: '/backoffice-admin/team/members',
  TEAM_MEMBER: '/partner/team/member',
  ADD_TEAM_MEMBER: '/partner/team/member-add',
  SUPER_ADMIN_ADD_TEAM_MEMBER: '/backoffice-admin/team/member-add',
  EDIT_TEAM_MEMBER: '/partner/team/member-update',
  SUPER_ADMIN_EDIT_TEAM_MEMBER: '/backoffice-admin/team/member-update',
  PREFERENCES: '/partner/notification/settings',
  SUPER_ADMIN_PREFERENCES: '/backoffice-admin/notification/settings',
  GET_NOTIFICATIONS: '/partner/notifications',
};

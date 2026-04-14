import { API_ROUTES } from '@/routes/apiRoutes';
import api from './api';
import { toast } from 'sonner';

export const fetchHomeStatistics = async () => {
  const data = await api.get(API_ROUTES.HOME_STATISTICS);
  return data?.data?.data;
};

export const getOrders = async (
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
    `${API_ROUTES.ORDERS}?status=${status}&&page=${currentPage}&&per_page=${perPage}&&keyword=${searchBarParams}${dateParams}`
  );
  return data?.data;
};

export const viewOrderDetails = async (orderID, isSuperAdmin = false) => {
  if (!orderID) {
    throw new Error('Order ID is required');
  }
  if (isSuperAdmin) {
    const data = await api.get(API_ROUTES.SUPER_ADMIN_ORDER_DETAILS(orderID));
    return data?.data?.data;
  } else {
    const data = await api.get(API_ROUTES.ORDER_DETAILS(orderID));
    return data?.data?.data;
  }
};

export const updateOrderStatus = async (fields) => {
  if (fields.isSuperAdmin) {
    const data = await api.put(
      API_ROUTES.SUPER_ADMIN_UPDATE_ORDER_STATUS,
      fields
    );
    return data?.data?.data;
  } else {
    const data = await api.put(API_ROUTES.UPDATE_ORDER_STATUS, fields);
    return data?.data?.data;
  }
};

export const addProduct = async (fields, isSuperAdmin = false) => {
  const formData = new FormData();

  // Add all non-file fields to formData
  for (const key in fields) {
    if (key !== 'images' && key !== 'variants') {
      formData.append(key, fields[key]);
    }
  }

  //   // Resize images and add them to the formData
  //   if (Array.isArray(fields.images)) {
  //     for (let index = 0; index < fields.images.length; index++) {
  //       const file = fields.images[index];

  //       try {
  //         // Resize the image if it exceeds the specified size (e.g., 128 KB)
  //         const resizedImage = await resizeImage(file, 128); // Adjust the size limit as needed
  //         formData.append(`images[${index}]`, resizedImage, file.name); // Append the resized image
  //       } catch (error) {
  //         console.error(`Failed to resize image ${file.name}:`, error);
  //         // Optionally handle this error (e.g., skip the file or notify the user)
  //       }
  //     }
  //   }

  // Add images as an array of files
  if (Array.isArray(fields.images)) {
    fields.images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
  }

  // Add variants as a nested structure
  if (Array.isArray(fields.variants)) {
    fields.variants.forEach((variant, index) => {
      for (const key in variant) {
        if (!isSuperAdmin && key === 'vendor_id') {
          continue;
        } else {
          formData.append(`variants[${index}][${key}]`, variant[key]);
        }
      }
    });
  }

  if (isSuperAdmin) {
    const response = await api.post(
      API_ROUTES.SUPER_ADMIN_ADD_PRODUCT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  } else {
    const response = await api.post(API_ROUTES.ADD_PRODUCT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
};

export const addPartner = async (fields) => {
  const response = await api.post(API_ROUTES.SUPER_ADMIN_ADD_PARTNER, fields);
  return response.data.data;
};

export const fetchCategories = async (searchParam) => {
  if (
    typeof searchParam === 'object' ||
    searchParam === null ||
    searchParam === ''
  ) {
    const data = await api.get(API_ROUTES.CATEGORIES);
    return data?.data?.data;
  }
  const data = await api.get(API_ROUTES.SEARCHCATEGORIES(searchParam));
  return data?.data?.data;
};

export const fetchBrands = async (searchParam) => {
  if (
    typeof searchParam === 'object' ||
    searchParam === null ||
    searchParam === ''
  ) {
    const data = await api.get(API_ROUTES.BRANDS);
    return data?.data?.data;
  }

  const data = await api.get(API_ROUTES.SEARCHBRANDS(searchParam));
  return data?.data?.data;
};

export const fetchBrandById = async (brandID) => {
  if (!brandID) return;
  const data = await api.get(`/brands/${brandID}`);

  return data?.data?.data;
};
export const fetchCategoryById = async (categoryID) => {
  if (!categoryID) return;
  const data = await api.get(`/categories/${categoryID}`);

  return data?.data?.data;
};

export const addBrand = async (fields) => {
  const data = await api.post(API_ROUTES.ADD_BRAND, fields);
  return data?.data?.data;
};

export const editBrand = async (brandID, fields) => {
  if (!brandID) return;
  const data = await api.put(API_ROUTES.EDIT_BRAND(brandID), fields);
  return data?.data?.data;
};

export const deleteBrand = async (brandID) => {
  if (!brandID) return;
  const data = await api.delete(API_ROUTES.DELETE_BRAND(brandID));
  return data?.data?.data;
};

export const addCategory = async (fields) => {
  const formData = new FormData();

  // Append non-array fields to formData
  for (const key in fields) {
    if (key !== 'image' && !Array.isArray(fields[key])) {
      formData.append(key, fields[key]);
    }
  }

  // Append the first image file if it's an array
  if (fields.image && Array.isArray(fields.image) && fields.image.length > 0) {
    const file = fields.image[0]; // Assuming you're sending one image

    if (file instanceof File) {
      formData.append('image', file);
    } else {
      toast.error('Not a valid file');
    }
  }

  // Send formData instead of fields
  const data = await api.post(API_ROUTES.ADD_CATEGORY, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data?.data?.data;
};

export const deleteCategory = async (categoryID) => {
  if (!categoryID) return;
  const data = await api.delete(API_ROUTES.DELETE_CATEGORY(categoryID));
  return data?.data?.data;
};

export const editCategory = async (categoryID, fields) => {
  if (!categoryID) return;
  const formData = new FormData();

  // Add all non-file fields to formData
  for (const key in fields) {
    if (key !== 'image' && !Array.isArray(fields[key])) {
      formData.append(key, fields[key]);
    }
  }
  // Add the image file directly if it exists
  if (fields.image && Array.isArray(fields.image) && fields.image.length > 0) {
    const file = fields.image[0];
    if (file instanceof File) {
      formData.append('image', file);
    } else if (file.path) {
      // In case file is not an instance of File, log or handle the error accordingly
      toast.error('Not a valid file');
    }
  }

  const response = await api.post(
    API_ROUTES.EDIT_CATEGORY(categoryID),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.data;
};

export const fetchInventories = async (
  currentPage = 1,
  perPage = 10,
  searchParams = '',
  filters,
  isSuperAdmin = false
) => {
  if (isSuperAdmin) {
    const data = await api.get(
      API_ROUTES.SUPER_ADMIN_INVENTORIES(
        currentPage,
        perPage,
        searchParams,
        filters
      )
    );
    return data?.data;
  } else {
    const data = await api.get(
      API_ROUTES.INVENTORIES(currentPage, perPage, searchParams, filters)
    );
    return data?.data;
  }
};

export const fetchProduct = async (productID, isSuperAdmin = false) => {
  if (!productID) {
    throw new Error('Product ID is required');
  }
  if (isSuperAdmin) {
    const data = await api.get(API_ROUTES.SUPER_ADMIN_PRODUCT(productID));
    return data?.data?.data;
  } else {
    const data = await api.get(API_ROUTES.PRODUCT(productID));
    return data?.data?.data;
  }
};

export const editProduct = async (productID, fields, isSuperAdmin = false) => {
  if (!productID) {
    throw new Error('Product ID is required');
  }
  const formData = new FormData();

  // Add all non-file fields to formData
  for (const key in fields) {
    if (key !== 'images' && key !== 'variants') {
      formData.append(key, fields[key]);
    }
  }

  // Add images as an array of files
  if (Array.isArray(fields.images)) {
    fields.images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
  }

  // Add variants as a nested structure
  if (Array.isArray(fields.variants)) {
    fields.variants.forEach((variant, index) => {
      for (const key in variant) {
        if (!isSuperAdmin && key === 'vendor_id') {
          continue;
        } else {
          formData.append(`variants[${index}][${key}]`, variant[key]);
        }
      }
    });
  }

  if (isSuperAdmin) {
    const response = await api.post(
      API_ROUTES.SUPER_ADMIN_EDIT_PRODUCT(productID),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  } else {
    const response = await api.post(
      API_ROUTES.EDIT_PRODUCT(productID),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }
};

export const deleteProduct = async (productID, isSuperAdmin) => {
  if (!productID) {
    throw new Error('Product ID is required');
  }

  if (isSuperAdmin) {
    const response = await api.delete(
      API_ROUTES.SUPER_ADMIN_DELETE_PRODUCT(productID)
    );
    return response.data.data;
  } else {
    const response = await api.delete(API_ROUTES.DELETE_PRODUCT(productID));
    return response.data.data;
  }
};

export const fetchStockStats = async (
  availability = 'In Stock',
  isSuperAdmin = false
) => {
  if (isSuperAdmin) {
    const data = await api.get(
      API_ROUTES.SUPER_ADMIN_STOCK_STATS(availability)
    );
    return data?.data?.data;
  } else {
    const data = await api.get(API_ROUTES.STOCK_STATS(availability));
    return data?.data?.data;
  }
};

export const fetchTransactions = async (
  currentPage = 1,
  perPage = 10,
  searchParams = '',
  startDate = null,
  endDate = null,
  status = 'All',
  isSuperAdmin = false
) => {
  if (isSuperAdmin) {
    const data = await api.get(
      API_ROUTES.SUPER_ADMIN_TRANSACTIONS(
        currentPage,
        perPage,
        searchParams,
        startDate,
        endDate,
        status
      )
    );
    return data?.data;
  } else {
    const data = await api.get(
      API_ROUTES.TRANSACTIONS(
        currentPage,
        perPage,
        searchParams,
        startDate,
        endDate,
        status
      )
    );
    return data?.data;
  }
};

export const changePassword = async (field, isSuperAdmin) => {
  if (isSuperAdmin) {
    const data = await api.post(API_ROUTES.CHANGE_PASSWORD, field);
    return data?.data?.data;
  } else {
    const data = await api.post(API_ROUTES.CHANGE_PASSWORD, field);
    return data?.data?.data;
  }
};

export const updateAvatar = async (fields) => {
  if (!fields.picture || !fields.name) throw Error();
  const formData = new FormData();
  for (const key in fields) {
    formData.append(key, fields[key]);
  }
  //   if (Array.isArray(fields.picture)) {
  //     fields.picture.forEach((file) => {
  //       formData.append('picture', file);
  //     });
  //   }
  const response = await api.post(API_ROUTES.UPDATE_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const enable2fa = async () => {
  const data = await api.get(API_ROUTES.ENABLE_2FA);
  return data?.data?.data;
};

export const finalize2fa = async (fields) => {
  if (!fields) return;
  const data = await api.post(API_ROUTES.FINALIZE_2FA, fields);
  return data?.data?.data;
};

export const disable2fa = async () => {
  const data = await api.get(API_ROUTES.DISABLE_2FA);
  return data?.data?.data;
};

export const logout = async (isSuperAdmin = false) => {
  if (isSuperAdmin) {
    const data = await api.get(API_ROUTES.SUPER_ADMIN_LOGOUT);
    return data?.data?.data;
  } else {
    const data = await api.get(API_ROUTES.LOGOUT);
    return data?.data?.data;
  }
};

export const logoutAllSession = async (isSuperAdmin = false) => {
  if (isSuperAdmin) {
    const data = await api.get(API_ROUTES.SUPER_ADMIN_LOGOUT_ALL_SESSIONS);
    return data?.data?.data;
  } else {
    const data = await api.get(API_ROUTES.LOGOUT_ALL_SESSIONS);
    return data?.data?.data;
  }
};

export const fetchTeamMembers = async (
  currentPage = 1,
  perPage = 10,
  isSuperAdmin = false
) => {
  if (isSuperAdmin) {
    const data = await api.get(
      `${API_ROUTES.SUPER_ADMIN_TEAM_MEMBERS}?page=${currentPage}&&per_page=${perPage}`
    );
    return data?.data;
  } else {
    const data = await api.get(
      `${API_ROUTES.TEAM_MEMBERS}?page=${currentPage}&&per_page=${perPage}`
    );
    return data?.data;
  }
};

export const fetchTeamMember = async (fields) => {
  const data = await api.post(API_ROUTES.TEAM_MEMBER, fields);
  return data?.data?.data;
};

export const addTeamMember = async (fields, isSuperAdmin) => {
  if (isSuperAdmin) {
    const data = await api.post(API_ROUTES.SUPER_ADMIN_ADD_TEAM_MEMBER, fields);
    return data?.data?.data;
  } else {
    const data = await api.post(API_ROUTES.ADD_TEAM_MEMBER, fields);
    return data?.data?.data;
  }
};

export const editTeamMember = async (fields, isSuperAdmin) => {
  if (isSuperAdmin) {
    const data = await api.post(
      API_ROUTES.SUPER_ADMIN_EDIT_TEAM_MEMBER,
      fields
    );
    return data?.data?.data;
  } else {
    const data = await api.post(API_ROUTES.EDIT_TEAM_MEMBER, fields);
    return data?.data?.data;
  }
};

export const fetchPreferences = async (isSuperAdmin = false) => {
  if (isSuperAdmin) {
    const data = await api.get(API_ROUTES.SUPER_ADMIN_PREFERENCES);
    return data?.data?.data;
  } else {
    const data = await api.get(API_ROUTES.PREFERENCES);
    return data?.data?.data;
  }
};

export const savePreferences = async (fields, isSuperAdmin) => {
  if (isSuperAdmin) {
    const data = await api.post(API_ROUTES.SUPER_ADMIN_PREFERENCES, fields);
    return data?.data?.data;
  } else {
    const data = await api.post(API_ROUTES.PREFERENCES, fields);
    return data?.data?.data;
  }
};

export const fetchNotifications = async () => {
  const data = await api.get(API_ROUTES.GET_NOTIFICATIONS);
  return data?.data?.data;
};

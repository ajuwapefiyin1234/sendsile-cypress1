export const createInventorySlice = (set) => ({
  brands: [],
  categories: [],
  loadingCategories: false,
  loadingBrands: false,
  meta: null,

  setLoadingCategories: (isLoading) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        loadingCategories: isLoading,
      },
    }));
  },
  setCategories: (categories) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        categories: categories,
      },
    }));
  },

  setLoadingBrands: (isLoading) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        loadingBrands: isLoading,
      },
    }));
  },

  setBrands: (brands) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        brands: brands,
      },
    }));
  },
  setMeta: (meta_data) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        meta: meta_data,
      },
    }));
  },
});

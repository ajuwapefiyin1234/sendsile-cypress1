export const createPartnerSlice = (set) => ({
  meta: null,

  setMeta: (meta_data) => {
    set((state) => ({
      partner: {
        ...state.partner,
        meta: meta_data,
      },
    }));
  },
});

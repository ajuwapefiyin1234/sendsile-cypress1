export const createTransactionsSlice = (set) => ({
  meta: null,

  setMeta: (meta_data) => {
    set((state) => ({
      transaction: {
        ...state.transaction,
        meta: meta_data,
      },
    }));
  },
});

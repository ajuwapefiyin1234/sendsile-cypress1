export const createMemberSlice = (set) => ({
  meta: null,

  setMeta: (meta_data) => {
    set((state) => ({
      member: {
        ...state.member,
        meta: meta_data,
      },
    }));
  },
});

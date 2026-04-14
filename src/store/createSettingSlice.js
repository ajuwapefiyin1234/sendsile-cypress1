export const createSettingSlice = (set) => ({
  enabled2fa: false,
  twoFAData: null,
  set2faData: async (data) => {
    set((state) => ({
      setting: {
        ...state.setting,
        twoFAData: data,
      },
    }));
  },
});

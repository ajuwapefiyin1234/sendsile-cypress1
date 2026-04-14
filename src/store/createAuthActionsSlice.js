import { ROUTE } from '@/routes';
import api from '@/utils/api';
import { toast } from 'sonner';

export const createAuthActionsSlice = (set, get) => ({
  login: async (fields) => {
    set({
      auth: {
        ...get().auth,
        user: null,
      },
    });
    try {
      const res = await api.post('/login', fields);
      set({ auth: { ...get().auth, user: res.data.data } });
      toast.success(res?.data?.message || 'Login successful');
      return res?.data?.data;
    } catch (error) {
      set({
        auth: {
          ...get().auth,
          user: null,
        },
      });
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  },
  loginAsAdmin: async (fields) => {
    if (!fields) return null;
    set({
      auth: {
        ...get().auth,
        user: null,
      },
    });
    try {
      const res = await api.post('/login', fields);
      set({ auth: { ...get().auth, user: res.data.data } });
      toast.success(res?.data?.message || 'Login successful');
      return res?.data?.data;
    } catch (error) {
      set({ auth: { ...get().auth, user: null } });
      toast.error('Something went wrong');
      if (error) return null;
    }
  },
  verify2faCode: async (fields) => {
    try {
      const res = await api.post('/verify/2fa-totp', fields);
      set({ auth: { ...get().auth, user: res.data.data } });
      toast.success(res?.data?.message || 'Login successful');
      return res?.data?.data;
    } catch (error) {
      set({
        auth: {
          ...get().auth,
          user: null,
        },
      });
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  },
  updateUserDetails: async (data) => {
    if (!data) return null;
    set((state) => ({
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          ...data,
        },
      },
    }));
  },
  updateTwoFactorStatus: async (status) => {
    if (status !== 'enabled' && status !== 'disabled') return;

    set((state) => ({
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          two_factor_enabled: status,
        },
      },
    }));
  },
  logoutUser: () => {
    set({ auth: { user: null } });
    window.location.href = ROUTE.login;
  },
});

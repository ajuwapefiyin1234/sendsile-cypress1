import api from "@/utils/api";
import { toast } from "sonner";

export const createOrderSlice = (set) => ({
  orders: null,
  isFetchingOrders: false,
  orderDetail: null,
  isFetchingOrderDetail: false,
  meta: null,

  getOrders: async (status = 'processing') => {
    set((state) => ({
      order: {
        ...state.order,
        isFetchingOrders: true,
      },
    }));
    try {
      const data = await api.get(`/partner/orders?status=${status}`);
      set((state) => ({
        order: {
          ...state.order,
          orders: data?.data?.data,
        },
      }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    } finally {
      set((state) => ({
        order: {
          ...state.order,
          isFetchingOrders: false,
        },
      }));
    }
  },

  viewOrderDetails: async (orderID) => {
    if (!orderID) return;
    set((state) => ({
      order: {
        ...state.order,
        isFetchingOrderDetail: true,
      },
    }));
    try {
      const data = await api.get(`partner/orders/${orderID}`);
      set((state) => ({
        order: {
          ...state.order,
          orderDetail: data?.data?.data,
        },
      }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    } finally {
      set((state) => ({
        order: {
          ...state.order,
          isFetchingOrderDetail: false,
        },
      }));
    }
  },
  setMeta: (meta_data) => {
    set((state) => ({
      order: {
        ...state.order,
        meta: meta_data,
      },
    }));
  },
});

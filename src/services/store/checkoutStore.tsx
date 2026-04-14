import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
  formData: {
    paymentMethod: string;
    deliveryDate: any;
    deliveryFee: string;
    serviceFee: string;
    paymentReference: string;
    deliveryMode: string;
    country: string;
    city: string;
    state: string;
    address: string;
    flat?: string;
    email?: string;
    number: string;
    // pin?: string;
  };

  updateFormData: (field: string, value: string) => void;
  resetForm: () => void;
};

export const useCheckoutData = create(
  persist<State>(
    (set) => ({
      formData: {
        city: '',
        country: '',
        deliveryDate: null,
        deliveryFee: '',
        paymentMethod: '',
        deliveryMode: 'me',
        paymentReference: '',
        serviceFee: '',
        state: '',
        email: '',
        address: '',
        flat: '',
        number: '',
        // pin: "",
      },

      updateFormData: (field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),

      resetForm: () =>
        set(() => ({
          formData: {
            city: '',
            country: '',
            deliveryDate: null,
            deliveryFee: '',
            paymentMethod: '',
            deliveryMode: 'me',
            paymentReference: '',
            email: '',
            serviceFee: '',
            state: '',
            address: '',
            flat: '',
            number: '',
            // pin: "",
          },
        })),
    }),
    {
      name: 'checkout',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

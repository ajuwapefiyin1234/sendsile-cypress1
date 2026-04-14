// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { toast } from 'react-toastify';
import { ROUTES } from '../utils/route-constants';
import { useCheckoutData } from '../services/store/checkoutStore';
import { useNavigate } from 'react-router-dom';

export const useMonnify = (totalPrice: number, name: string, email: string) => {
  const { updateFormData } = useCheckoutData();
  const navigate = useNavigate();

  const initializeMonnify = () => {
    MonnifySDK.initialize({
      amount: totalPrice.toFixed(2),
      currency: 'NGN',
      reference: new String(new Date().getTime()),
      customerFullName: name,
      customerEmail: email,
      apiKey: import.meta.env.VITE_APP_MONNIFY_API_KEY,
      contractCode: import.meta.env.VITE_APP_MONNIFY_CONTRACT_CODE,
      paymentDescription: 'Sendsile',
      metadata: {
        name: name,
      },
      paymentMethods: ['CARD', 'ACCOUNT_TRANSFER', 'USSD', 'PHONE_NUMBER'],

      onLoadStart: () => {
        toast.info('Please wait a moment', {
          toastId: 'monnify loading',
        });
      },

      onLoadComplete: () => {
        toast.success('Proceed to make payment', {
          toastId: 'monnify loading completed',
        });
      },

      onComplete: function (response) {
        toast.success('Payment successful', {
          toastId: 'payment completed',
        });

        updateFormData('paymentReference', response.paymentReference);
        navigate(ROUTES.checkout);
      },

      onClose: function () {
        toast.info('Payment modal closed, try again later!', {
          toastId: 'monnify error',
        });
      },
    });
  };

  return initializeMonnify;
};

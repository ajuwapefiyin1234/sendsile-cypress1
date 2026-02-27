import { useFlutterwave } from 'flutterwave-react-v3';

export const useHandleFlutterPayment = (
  totalPrice: any,
  name: string,
  email: string,
  phoneNumber: string
) => {
  const config = {
    public_key: import.meta.env.VITE_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: totalPrice ? totalPrice : 0,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      phone_number: phoneNumber,
      name: name,
    },

    customizations: {
      title: 'Sendsile',
      description: 'Payment for products in cart',
      logo: `${import.meta.env.VITE_APP_BASE_URL}/sendsile-payment.png`,
    },
  };

  return useFlutterwave(config);
};

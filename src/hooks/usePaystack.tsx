import { usePaystackPayment } from 'react-paystack';

export const usePaystack = (totalPrice: number, name: string, email: string) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: totalPrice ? parseFloat(totalPrice.toFixed(2)) * 100 : 0, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: import.meta.env.VITE_APP_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: name,
          variable_name: 'Sendsile-Groceries',
          value: name,
        },
      ],
    },
  };

  return usePaystackPayment(config);
};

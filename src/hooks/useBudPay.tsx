import { useBudPayPayment } from '@budpay/react';

export const useBudPay = (
  totalPrice: number,
  name: string,
  email: string,
  phoneNumber: string,
  callback: (reference: string) => void
) => {
  // const callback_url = import.meta.env.VITE_APP_MODE === "development" ? "http://localhost:3000/checkout"  : "https://ramadan.sendsile.com/checkout";
  const config = {
    api_key: import.meta.env.VITE_APP_BUDPAY_PUBLIC_KEY,
    amount: totalPrice ? totalPrice : 0,
    currency: 'NGN',
    reference: new Date().getTime().toString(),
    customer: {
      email: email,
      first_name: name.split(' ')[0],
      last_name: name.split(' ')[1] || '',
      phone: phoneNumber,
    },
    // callback_url: callback_url,
    onComplete: (data: any) => {
      console.log(data);
      console.log('Payment completed, Status:', data.status);
      console.log('Payment completed, Reference:', data.reference);
      callback(data.reference);
    },
    onCancel: (data: any) => {
      console.log('Payment cancelled, Status:', data.status);
      console.log('Payment cancelled, Reference:', data.reference);
    },
    custom_fields: { custom_field_1: 'value1', custom_field_2: 'value2' },
    debug: true,
  };

  return useBudPayPayment(config);
};

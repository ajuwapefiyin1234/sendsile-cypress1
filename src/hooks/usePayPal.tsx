import { PayPalButtons } from '@paypal/react-paypal-js';

export const usePayPalPayment = (totalPrice: number, currency: string = 'USD') => {
  const createOrder = (_: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice.toFixed(2),
            currency_code: currency,
          },
        },
      ],
    });
  };

  const onApprove = (_data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      console.log('Payment completed:', details);
      return details;
    });
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
    throw err;
  };

  return {
    PayPalButtons,
    createOrder,
    onApprove,
    onError,
  };
};

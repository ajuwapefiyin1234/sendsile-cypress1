export interface User {
  name: string;
  phone: string;
  email: string;
  photo: string | null;
  email_verified: boolean;
  status: string;
  balance: string;
  two_factor_enabled: string;
  pin_set: boolean;
}

export interface ITable {
  transaction_id: string;
  type: string;
  narration: string;
  amount: string;
  net_value: string;
  payment_method: string;
  payment_status: string;
  status: string;
  date: string;
}

export interface NotificationType {
  title: string;
  description: string;
  created_at: string;
  read_at: string | null;
}

export interface ErrorResponse {
  message: string;
}
export interface MeterDetails {
  address_on_meter: string;
  name_on_meter: string;
}

export interface TransactionStatusType {
  amount: string;
  date: string;
  details: {
    delivery_address: {
      address: string;
      city: string;
      state: string;
      postal_code: string;
      phone: string;
      country: string;
    };
    delivery_fee: string;
    delivery_mode: string;
    discount: string;
    order_id: string;
    service_fee: string;
    status: string;
    total: string;
  };
  line_items: {
    image: string;
    price: string;
    product_name: string;
    quantity: number;
    total: number;
  }[];
  narration: string;
  net_value: string;
  payment_method: string;
  payment_status: string;
  status: string;
  transaction_id: string;
  type: string;
}

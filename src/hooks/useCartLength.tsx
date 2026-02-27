import { useEffect, useState } from 'react';
import useAxiosPrivate from './useAxiosPrivate';
import { toast } from 'react-toastify';

const useCartLength = () => {
  const axiosPrivate = useAxiosPrivate();
  const [cartLength, setLength] = useState<number>();

  async function getCartLength() {
    try {
      const res = await axiosPrivate.get('/cart');
      if (res.status == 200) {
        setLength(res?.data?.data);
      } else {
        setLength(0);
        throw new Error();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  }

  useEffect(() => {
    getCartLength();
  }, []);

  return cartLength;
};

export default useCartLength;

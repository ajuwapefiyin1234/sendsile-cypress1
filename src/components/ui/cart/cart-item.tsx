import { priceFormatter } from '../../../utils/helpers';
import { Add } from '../../svgs/cart/add';
import { Delete } from '../../svgs/cart/delete';
import { Remove } from '../../svgs/cart/remove';
import { useState } from 'react';
import { useCartStore } from '../../../services/store/cartStore';

export const CartItem = ({
  name,
  price,
  count,
  image,
  id,
  variantId,
  action,
}: {
  name: string;
  price: number;
  count: number;
  image: any;
  id: string;
  variantId: string;
  action: () => void;
}) => {
  const [onHover, setHover] = useState(false);
  const { decreaseQuantity, increaseQuantity } = useCartStore();

  return (
    <div className="w-full flex flex-wrap xs:flex-nowrap gap-6 items-center pb-6 border-b border-[#E5E9EE]">
      <div className="bg-[#F7F7F7] h-[81px] min-w-[66px] md:h-[77px] md:min-w-[63px] flex items-center justify-center">
        <img
          className="block mx-auto w-full h-full max-w-[53px] max-h-[53px]"
          src={image}
          alt="cart item image"
        />
      </div>
      <div className="w-full flex justify-between items-start">
        <div className="">
          <h1 className="text-[#36454F] font-normal text-sm leading-5">{name}</h1>
          <div className="mt-[14px] flex items-center justify-center bg-[#F8F3F0] border-[0.75px] rounded-2xl w-[114px] h-7">
            <button
              onClick={() => decreaseQuantity(id, variantId)}
              className="px-[13.3px] w-full h-full"
            >
              <Remove />
            </button>
            <p className="px-[18.5px] py-1 h-full bg-white text-[#282828] text-sm leading-5 text-center font-medium">
              {count}
            </p>
            <button
              onClick={() => increaseQuantity(id, variantId)}
              className="px-[13.3px] w-full h-full"
            >
              <Add />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-5 justify-between items-end">
          <p className="text-prm-black text-[17px] leading-6 font-normal">
            {price ? priceFormatter(price, 2) : null}
          </p>

          <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={action}
          >
            <Delete color={onHover ? '#E4572E' : '#354052'} />
          </button>
        </div>
      </div>
    </div>
  );
};

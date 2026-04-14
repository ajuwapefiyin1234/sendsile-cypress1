import { priceFormatter } from '../../../utils/helpers';

export const CartItemPayment = ({
  img,
  cartItemName,
  qty,
  price,
}: {
  img: any;
  cartItemName: string;
  qty: number;
  price: number;
}) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-[#E9E9E9]">
      <div className="flex items-center gap-4 md:gap-6 font-normal ">
        <div className="min-w-16 h-[77px] bg-white flex items-center justify-center">
          <img src={img} alt="cart item image" className="w-auto max-w-[50px] object-cover" />
        </div>
        <div>
          <p className="text-sm mobile:text-base md:text-sm leading-5 text-prm-black mobile:w-[175px] md:w-full md:max-w-[210px]">
            {cartItemName}
          </p>
          <p className="pt-1 text-[14px] leading-5 font-normal text-[#36454F]">QTY:{qty}</p>
        </div>
      </div>
      <p className="text-[17px] leading-6 text-prm-black font-normal">{priceFormatter(price, 2)}</p>
    </div>
  );
};

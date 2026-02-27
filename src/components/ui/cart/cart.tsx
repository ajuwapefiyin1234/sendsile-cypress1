import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from '../../../assets/images';
import { useCartState, useCartStore } from '../../../services/store/cartStore';
import { CartItem } from './cart-item';
import { IoClose } from 'react-icons/io5';
import { ROUTES } from '../../../utils/route-constants';

import React, { useState } from 'react';
import { priceFormatter } from '../../../utils/helpers';

export const Cart = () => {
  const [isLoggedIn] = useState(() => {
    const token = localStorage.getItem('__user_access') || null;
    return !!token;
  });

  const isCartOpen = useCartState((state) => state.isCartOpen);
  const updateCartOpen = useCartState((state) => state.updateIsCartOpen);
  const { cart, guestCart, removeFromCart, totalPrice, isAuthenticated } = useCartStore();
  const cartItems = isAuthenticated && isAuthenticated ? cart : guestCart;
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (isLoggedIn && isAuthenticated) {
      updateCartOpen(false);
      navigate(ROUTES.checkout);
    } else {
      sessionStorage.setItem('fromCart', 'true');
      navigate(ROUTES.login);
    }
  };

  return (
    <>
      <div
        className={`${
          isCartOpen ? 'scale-100' : 'scale-0'
        } transition-all duration-500 fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:-translate-x-0 right-4 bg-white rounded-xl z-[99] w-[93%] md:w-[450px] overflow-auto  h-fit max-h-[95dvh] no-scrollbar px-3 mobile:px-5`}
      >
        <button
          onClick={() => updateCartOpen(false)}
          className="absolute top-[7px] right-[18px] bg-[#F6F1E8] p-[11px] rounded-full w-fit"
        >
          <div className="w-[18px] h-[18px] cursor-pointer">
            <IoClose size={18} />
          </div>
        </button>

        <React.Fragment>
          {cartItems?.length === 0 ? (
            <div className="min-h-full py-[138px] text-center flex flex-col items-center justify-center">
              <img src={ShoppingCart} alt="empty-cart" className="" />
              <div className="pt-6">
                <h1 className="text-2xl font-medium text-[#00070C]">Your cart is empty</h1>
                <p className="pt-4 pb-10 text-[15px] leading-5 text-[#36454F]">
                  Explore our categories and discover our best deals!
                </p>
                <button
                  onClick={() => updateCartOpen(false)}
                  type="button"
                  className="text-white bg-[#000E25] py-3 text-center rounded-full w-full"
                >
                  Start shopping
                </button>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div className="pt-[68px] pb-5 border-b border-[#E5E9EE] flex justify-between items-center">
                <h1 className="text-[#270C04] text-base leading-[22.4px] font-normal">
                  Your bag ({cartItems?.length}
                  {'  '} items)
                </h1>

                <h1 className="text-[#270C04] text-[22px] leading-[30.8px] font-bold">
                  {totalPrice ? priceFormatter(totalPrice, 2) : null}
                </h1>
              </div>

              <div className="pt-[18px] h-full sm:max-h-[400px] laptop:max-h-[458px] overflow-scroll no-scrollbar flex flex-col gap-[18px]">
                {cartItems?.map((data) => {
                  const { product_id, product, quantity, product_name, images } = data;
                  return product?.variants?.map((v) => {
                    return (
                      <CartItem
                        key={v.variant_id}
                        count={quantity}
                        name={product_name + ` (${v.variation})`}
                        price={v.price ? parseFloat(v.price) : 0}
                        id={product_id}
                        image={images?.[0]}
                        variantId={v.variant_id}
                        action={() => {
                          removeFromCart(product_id, v.variant_id);
                        }}
                      />
                    );
                  });
                })}
              </div>
              <div className="mt-[18px]">
                <div className="flex items-center justify-between">
                  <h1 className="text-[#270C04] font-normal text-lg leading-[25px] sm:text-base sm:leading-[22.4px]">
                    Service charge
                  </h1>
                  <h1 className="font-normal text-lg leading-[25px]  sm:text-[17px] sm:leading-[24px] text-[#270C04]">
                    ₦0
                  </h1>
                </div>
                <div className="flex items-center justify-between pt-4 pb-7">
                  <h1 className="text-[#270C04] font-medium text-lg leading-[25px]  sm:text-base sm:leading-[22.4px]">
                    Sub total
                  </h1>
                  <h1 className="font-medium text-lg leading-[25px]  sm:text-[17px] sm:leading-[24px] text-[#270C04]">
                    {totalPrice ? priceFormatter(totalPrice, 2) : null}
                  </h1>
                </div>
                <div className="flex flex-col gap-3 mb-20 sm:mb-5">
                  <button
                    onClick={handleNavigate}
                    type="button"
                    className="text-white bg-[#000E25] py-3 text-center rounded-full w-full"
                  >
                    Checkout
                  </button>
                  {/* <button className="font-normal text-center w-full py-4 md:py-3 text-[15px] leading-5 text-[#E4572E] flex justify-center items-center gap-[6px]">
                    <img src={Bookmark} alt="bookmark icon" />
                    <span>Save for later</span>
                  </button> */}
                </div>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      </div>

      <div
        onClick={() => updateCartOpen(false)}
        className={`${
          isCartOpen ? 'opacity-100 visible cursor-pointer' : 'invisible opacity-0'
        } fixed inset-0 bg-cartOverlay z-50 transition-all duration-150`}
      ></div>
    </>
  );
};

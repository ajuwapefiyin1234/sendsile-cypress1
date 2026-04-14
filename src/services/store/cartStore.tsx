import { create } from 'zustand';
import { ICartProduct, IProduct } from '../../types/products';
import { persist } from 'zustand/middleware';
import { axiosPrivate } from '../axios';
import { toast } from 'react-toastify';
import { updateToast } from '../../components/ui/cart/toast-message';

type CartStateType = {
  isCartOpen: boolean;
  isToastOpen: boolean;
  updateIsCartOpen: (isCartOpen: boolean) => void;
  updateToastOpen: (value: boolean) => void;
};

type CartStateStoreType = {
  cart: ICartProduct[];
  guestCart: ICartProduct[];
  totalPrice: number;
  payment_ref: string;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  addToCart: (product: IProduct, variantId: string) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  increaseQuantity: (id: string, v: string) => void;
  decreaseQuantity: (id: string, v: string) => void;
  getTotalQuantity: (cart: ICartProduct[]) => number;
  getTotalPrice: (carrt: ICartProduct[]) => number;
  clearCart: () => void;
  syncCartWithDatabase: () => void;
  mergeGuestCart: () => void;
};

export const useCartState = create<CartStateType>((set) => ({
  isCartOpen: false,
  isToastOpen: false,
  updateIsCartOpen: (isCartOpen) => set(() => ({ isCartOpen })),
  updateToastOpen: (value) => set(() => ({ isToastOpen: value })),
}));

const normalizeCartProduct = (product: IProduct, variantId: string): ICartProduct => {
  let selectedVariant = product.variants.find((v) => v.variant_id === variantId);
  if (!selectedVariant) selectedVariant = product.variants[0];
  return {
    product_id: product.product_id,
    product_name: product.name,
    images: product.images,
    quantity: 1,
    product: {
      variants: [selectedVariant],
    },
  };
};

export const useCartStore = create(
  persist<CartStateStoreType>(
    (set, get) => ({
      cart: [],
      isAuthenticated: false,
      guestCart: [],
      totalPrice: 0,
      payment_ref: '',
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
      addToCart: async (product: IProduct, variantId: string) => {
        const { isAuthenticated } = get();
        const newNormalizedProduct = normalizeCartProduct(product, variantId);
        set((state) => {
          const cartToUpdate = isAuthenticated ? state.cart : state.guestCart;
          const existingProductIndex = cartToUpdate.findIndex(
            (item) =>
              item.product_id === newNormalizedProduct.product_id &&
              item.product.variants[0].variant_id === variantId
          );

          let updatedCart: ICartProduct[];
          if (existingProductIndex !== -1) {
            updatedCart = [...cartToUpdate];
            updatedCart[existingProductIndex].quantity += 1;
          } else {
            updatedCart = [...cartToUpdate, newNormalizedProduct];
          }

          return isAuthenticated
            ? {
                cart: updatedCart,
                totalPrice: get().getTotalPrice(updatedCart),
              }
            : {
                guestCart: updatedCart,
                totalPrice: get().getTotalPrice(updatedCart),
              };
        });

        if (isAuthenticated) {
          try {
            await axiosPrivate.post('/cart/add', {
              product_id: product.product_id,
              variant_id: variantId,
              quantity: 1,
            });
            updateToast();
            await get().syncCartWithDatabase();
          } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong', {
              toastId: 'addToCart',
            });
          }
        } else {
          updateToast();
        }
      },

      removeFromCart: async (id: string, variantId: string) => {
        const { isAuthenticated } = get();
        set((state) => {
          const cartToUpdate = isAuthenticated ? state.cart : state.guestCart;
          const updatedCart = cartToUpdate.filter((item) => item.product_id !== id);
          return isAuthenticated
            ? {
                cart: updatedCart,
                totalPrice: get().getTotalPrice(updatedCart),
              }
            : {
                guestCart: updatedCart,
                totalPrice: get().getTotalPrice(updatedCart),
              };
        });

        if (isAuthenticated) {
          try {
            await axiosPrivate.delete(`/cart/remove/${id}`, {
              data: {
                variant_id: variantId,
              },
            });
            await get().syncCartWithDatabase();
          } catch (error: any) {
            if (error?.response?.status !== 404) {
              toast.error(error?.response?.data?.message || 'Something went wrong', {
                toastId: 'removed',
              });
            }
          }
        }
      },

      increaseQuantity: async (id: string, variantId: string) => {
        const { isAuthenticated } = get();

        set((state) => {
          const cartToUpdate = isAuthenticated ? state.cart : state.guestCart;
          const updatedCart = cartToUpdate.map((item) =>
            item.product_id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
          return isAuthenticated
            ? {
                cart: updatedCart,
                totalPrice: get().getTotalPrice(updatedCart),
              }
            : {
                guestCart: updatedCart,
                totalPrice: get().getTotalPrice(updatedCart),
              };
        });

        if (isAuthenticated) {
          try {
            await axiosPrivate.post('/cart/add', {
              product_id: id,
              variant_id: variantId,
              quantity: 1,
            });
            await get().syncCartWithDatabase();
          } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong', {
              toastId: 'increased',
            });
          }
        }
      },

      decreaseQuantity: async (id: string, variantId: string) => {
        const { isAuthenticated } = get();
        set((state) => {
          const cartToUpdate = isAuthenticated ? state.cart : state.guestCart;
          const updatedCart = cartToUpdate
            .map((item) =>
              item.product_id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
            )
            .filter((item) => item.quantity > 0);
          return isAuthenticated
            ? {
                cart: updatedCart,
                totalPrice: get().getTotalPrice(updatedCart),
              }
            : {
                guestCart: updatedCart,
                totalPrice: get().getTotalPrice(updatedCart),
              };
        });
        if (isAuthenticated) {
          try {
            await axiosPrivate.post(`/cart/decrease`, {
              quantity: 1,
              product_id: id,
              variant_id: variantId,
            });
            await get().syncCartWithDatabase();
          } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
          }
        }
      },

      getTotalPrice: (cart: ICartProduct[]) => {
        return cart.reduce(
          (total, item) => total + parseFloat(item.product.variants[0].price) * item.quantity,
          0
        );
      },

      getTotalQuantity: (cart: ICartProduct[]) => {
        return cart.reduce((accumulator, cartItem) => accumulator + cartItem.quantity, 0);
      },

      clearCart: () => {
        set({ cart: [], guestCart: [], totalPrice: 0 });
      },

      syncCartWithDatabase: async () => {
        const { isAuthenticated } = get();
        if (isAuthenticated) {
          try {
            const res = await axiosPrivate.get('/cart');
            // console.log(res)
            if (res?.data) {
              const normalizedCart: ICartProduct[] = res?.data?.data?.map((item: any) => ({
                product_id: item.product_id,
                product_name: item.product_name,
                images: item.product?.images,
                quantity: item.quantity,
                product: {
                  variants: item.product.variants,
                },
              }));

              //   (item: IProduct) => ({
              //     product_id: item.product_id,
              //     product_name: item.name,
              //     quantity: item?.quantity,
              //     product: {
              //       variants: [
              //         {
              //           discount: item.discount,
              //           stock: item.stock,
              //           price: item.price,
              //           variant_id: item.variant_id,
              //           variation: item.variation,
              //         },
              //       ],
              //     },
              //   })
              // );
              set({
                payment_ref: res?.data.meta.cart_payment_ref_id,
                cart: normalizedCart,
                totalPrice: get().getTotalPrice(normalizedCart),
              });
            }
          } catch (error: any) {
            if (error?.response?.status !== 404) {
              toast.error(error?.response?.data?.message || 'Something went wrong', {
                toastId: 'syncCart',
              });
            }
          }
        }
      },

      mergeGuestCart: async () => {
        const { isAuthenticated, guestCart } = get();
        if (isAuthenticated && guestCart?.length > 0) {
          try {
            const mergePromises = guestCart.map(async (item) => {
              try {
                await axiosPrivate.post('/cart/add', {
                  product_id: item.product_id,
                  variant_id: item.product.variants[0].variant_id,
                  quantity: item.quantity,
                });
              } catch (error: any) {
                console.error(`Error merging item ${item.product_id}:`, error);
                throw error;
              }
            });
            await Promise.all(mergePromises);
            set({ guestCart: [] });
            await get().syncCartWithDatabase();
          } catch (error: any) {
            if (error?.response?.status !== 401) {
              toast.error(error?.response.data?.message || 'Something went wrong', {
                toastId: 'cartMergingFailed',
              });
              await get().syncCartWithDatabase();
            }
          }
        }
      },
    }),
    {
      name: 'cart-store',
    }
  )
);

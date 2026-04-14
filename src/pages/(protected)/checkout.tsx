import '../../styles/packages/phoneInput.css';
import { Container } from '../../components/global/Container';
import React, { Fragment, useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Radio } from '../../components/ui/auth/radio';
import { paymentGateways } from '../../utils/constants';
import { CartItemPayment } from '../../components/ui/cart/cart-item-payment';
import { useCartState, useCartStore } from '../../services/store/cartStore';
import { CheckboxTab } from '../../components/ui/tab/checkbox-tab';
import { useNavigate } from 'react-router-dom';
import { formatDate, priceFormatter, convertNairaToUSD } from '../../utils/helpers';

import { ROUTES } from '../../utils/route-constants';
import { useHandleFlutterPayment } from '../../hooks/useFlutterwave';
import { closePaymentModal } from 'flutterwave-react-v3';
import { usePaystack } from '../../hooks/usePaystack';
import { useMonnify } from '../../hooks/useMonnify';
import { toast } from 'react-toastify';
import { useCheckoutData } from '../../services/store/checkoutStore';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { PulseLoader } from 'react-spinners';
import { userProfileState } from '../../services/store/userProfileStore';
import { SendAsGift } from '../../components/ui/dashboard/checkout/send-as-gift';
import { DeliverToMe } from '../../components/ui/dashboard/checkout/deliver-to-me';
// import { TransactionModal } from "../../components/modals";
// import { ToastMessage } from "../../components/ui/cart/toast-message";
// import { useSetCategoryIdStore } from "../../services/store/categoryIdStore";
import { usePayPalPayment } from '../../hooks/usePayPal';
import { useBudPay } from '../../hooks/useBudPay';

const Checkout = () => {
  const [addFlat, setFlat] = useState({
    deliverToMe: false,
    sendAsGift: false,
  });
  // const [processing, setProcessing] = useState(false);
  const [isOpen, setOpen] = useState('');
  const [isPinModalOpen, setPinModal] = useState(false);
  const [openSummary, setSummary] = useState(false);
  // const [isPinSet, setIsPinSet] = useState(false);
  const { cart, totalPrice, clearCart } = useCartStore();
  const [amountInUSD, setAmountInUSD] = useState<number | null>(null);
  const [isPaypalModalOpen, setPaypalModalOpen] = useState(false);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  // const { categoryID } = useSetCategoryIdStore();

  const { userData } = userProfileState();
  const intializePayment = usePaystack(totalPrice + 13000, userData?.name, userData?.email);
  const initializeMonnify = useMonnify(totalPrice + 13000, userData?.name, userData?.email);
  const handleFlutterPayment = useHandleFlutterPayment(
    totalPrice + 13000,
    userData?.name,
    userData?.email,
    userData?.phone
  );
  const initiateBudPayPayment = useBudPay(
    totalPrice + 13000,
    userData?.name,
    userData?.email,
    userData?.phone,
    (reference) => {
      updateFormData('paymentReference', reference);
    }
  );

  const { updateIsCartOpen } = useCartState();
  const { formData, updateFormData, resetForm } = useCheckoutData();

  const { PayPalButtons, createOrder, onApprove } = usePayPalPayment(amountInUSD || 0, 'USD');

  const handlePayPalPayment = async () => {
    try {
      const { amountInUSD, conversionRate } = await convertNairaToUSD(totalPrice + 13000);
      setAmountInUSD(amountInUSD);
      setConversionRate(conversionRate);
      console.log(conversionRate);
      if (amountInUSD) {
        setPaypalModalOpen(true);
      }
    } catch (error) {
      toast.error('Currency conversion failed. Please try again.');
    }
  };

  const handlePaymentSuccess = (details: any) => {
    console.log('Payment successful:', details);
    updateFormData('paymentReference', details.id);
    // setProcessing(false);
    setPaypalModalOpen(false);
    toast.success('Payment successful!');
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    // setProcessing(false);
    setPaypalModalOpen(false);
    toast.error('Payment failed. Please try again.');
  };

  // useGetUserLocation();

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleContinueShopping = () => {
    updateIsCartOpen(false);
    navigate('/ramadan-packages');
    // navigate(`/groceries?category=${encodeURIComponent(categoryID)}`);
  };

  const onSuccess = (reference: any) => {
    toast.success('Payment successfully completed', {
      toastId: 'paystack',
    });
    // setProcessing(false);
    updateFormData('paymentReference', reference.trxref);
    navigate(ROUTES.checkout);
  };

  const onClose = () => {
    toast.info('Payment modal closed, try again later!', {
      toastId: 'paystack error',
    });
    // setProcessing(false);
  };

  // const handleOpenPinModal = (e: FormEvent) => {
  //   e.preventDefault();
  //   if (isPinSet) {
  //     setPinModal(!isPinModalOpen);
  //   } else {
  //     updateToastOpen(true);
  //     setTimeout(() => {
  //       updateToastOpen(false);
  //       navigate(ROUTES.dashboardProfile);
  //     }, 4000);
  //   }
  // };

  const handlePayment = async (id: string) => {
    try {
      if (id === 'flutterwave') {
        handleFlutterPayment({
          callback: (response) => {
            updateFormData('paymentReference', response.tx_ref);
            navigate(ROUTES.checkout);
            closePaymentModal();
            // setProcessing(false);
          },
          onClose() {
            // setProcessing(false);
          },
        });
      } else if (id === 'paystack') {
        intializePayment({ onSuccess, onClose });
      } else if (id === 'monnify') {
        initializeMonnify();
        // setProcessing(false);
      } else if (id === 'paypal') {
        setPinModal(!isPinModalOpen);
        handlePayPalPayment();
      } else if (id === 'budpay') {
        initiateBudPayPayment();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  useEffect(() => {
    async function verifyPayment() {
      setIsVerifying(true);
      try {
        const date = formatDate(formData?.deliveryDate || '');

        const payload = {
          address_line1: formData.address,
          city: formData?.city,
          state: formData?.state,
          country: 'Nigeria',
          phone_number: formData?.number,
          payment_method: formData?.paymentMethod.toLowerCase(),
          payment_reference: formData?.paymentReference,
          delivery_mode: formData?.deliveryMode,
          delivery_date: date,
          service_fee: '0',
          delivery_fee: 13000,
          exchangeRate: conversionRate,
          cartCurrency: formData?.paymentMethod === 'paypal' ? 'USD' : 'NGN',
        };

        const res: any = await axiosPrivate.post('/cart/checkout', payload);

        if (res.status === 200) {
          toast.success(res.data.message || 'Order successfully placed', {
            autoClose: 3000,
          });
          resetForm();
          clearCart();
          navigate('/dashboard/orders');
        } else {
          const errorMessage = res?.message || 'Something went wrong. Please try again.';
          toast.error(errorMessage, {
            toastId: 'checkoutError',
            autoClose: 5000,
          });
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage =
          error.response?.data?.message || 'Something went wrong. Please try again.';
        toast.error(errorMessage, {
          toastId: 'checkoutError',
          autoClose: 5000,
        });
      } finally {
        setIsVerifying(false);
      }
    }

    if (formData.paymentReference) {
      verifyPayment();
    }
  }, [formData.paymentReference]);

  // useEffect(() => {
  //   async function getUserDetails() {
  //     try {
  //       const res = await axiosPrivate.get("/user");
  //       setIsPinSet(res?.data?.data?.pin_set);
  //     } catch (error: any) {
  //       toast.error(error?.response?.data?.message || "Something went wrong");
  //     }
  //   }
  //   getUserDetails();
  //   updateFormData("number", userData?.phone);
  // }, [navigate]);

  if (formData.paymentReference && isVerifying) {
    return (
      <div className="absolute z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <PulseLoader color="#000000" />
        <p>Verifying your payment</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      {/* <ToastMessage
        classname={`${isToastOpen ? "top-0" : "-translate-y-1/2"
          }  w-full transition-all duration-300`}
        message="Transaction pin not set"
      /> */}
      <Container>
        <section className="flex flex-col-reverse md:flex-row relative mt-[90px] md:mt-[72px]">
          <aside className="bg-white md:px-5 lg:px-10 xl:pl-[100px] xl:pr-[172px] pt-[18px] pb-[87px] md:w-1/2 xl:w-[781px]">
            <div className="px-4 md:px-0">
              <h1 className="pb-1 font-medium text-prm-black text-[22px] leading-[30px]">
                Delivery
              </h1>
              <p className="text-[17px] leading-6 md:text-[15px] md:leading-[21px] font-aeonikRegular text-[#36454F]">
                Enter delivery address
              </p>
            </div>
            <div className="px-4 md:px-0 mt-8 md:mt-[26px] flex gap-6 items-center">
              <div className="flex gap-[10px] items-center cursor-pointer">
                <CheckboxTab
                  id="me"
                  value={formData.deliveryMode}
                  action={() => updateFormData('deliveryMode', 'me')}
                  isChecked={formData.deliveryMode}
                  classname="border-[#EDEDED] size-[26px] md:size-5"
                />
                <label
                  htmlFor="me"
                  className="text-sm xs:text-[17px] leading-6 md:text-[15px] md:leading-5 cursor-pointer"
                >
                  Deliver to me
                </label>
              </div>
              <div className="flex gap-[10px] items-center cursor-pointer">
                <CheckboxTab
                  id="send-as-gift"
                  value={formData.deliveryMode}
                  action={() => updateFormData('deliveryMode', 'send-as-gift')}
                  isChecked={formData.deliveryMode}
                  classname="border-[#EDEDED] size-[26px] md:size-5"
                />
                <label
                  htmlFor="send-as-gift"
                  className="text-sm xs:text-[17px] leading-6 md:text-[15px] md:leading-5 cursor-pointer"
                >
                  Send as a gift
                </label>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment(formData.paymentMethod);
              }}
            >
              {formData.deliveryMode === 'me' ? (
                <DeliverToMe addFlat={addFlat} setFlat={setFlat} />
              ) : (
                <SendAsGift addFlat={addFlat} setFlat={setFlat} />
              )}
              <div className="md:hidden bg-[#FCFAF6] h-3 w-full"></div>

              <div className="w-full px-4 pt-6 md:px-0 md:pt-10">
                <h1 className="pb-1 font-medium text-prm-black text-[22px] leading-[30px]">
                  Payment
                </h1>
                <p className="text-[17px] leading-6 md:text-[15px] md:leading-[21px] font-normal text-[#36454F]">
                  Select mode of payment
                </p>

                <div className="mt-8 w-full border border-[#EAECF0] rounded-md">
                  <div className="flex flex-col divide-y divide-[#EAECF0]">
                    {paymentGateways.map((data, index) => (
                      <Fragment key={index}>
                        <div
                          onClick={() => setOpen(data.id)}
                          className="py-6 md:py-[14px] px-4 flex gap-3 items-center"
                        >
                          <Radio
                            id={data.id}
                            name="payment"
                            checked={formData.paymentMethod === data.id}
                            onChange={() => updateFormData('paymentMethod', data.id)}
                          />
                          <label htmlFor={data.id} className="w-full cursor-pointer">
                            <div className="flex items-center justify-between w-full">
                              <p className="font-medium leading-5 text-black">{data.name}</p>
                              <img
                                src={data.icon}
                                className="object-contain h-7 w-7"
                                alt={`${data.name} logo`}
                              />
                            </div>
                          </label>
                        </div>
                        {data.id === isOpen && (
                          <div className="border-t py-8 px-10  transition-all duration-100 text-base leading-6 md:text-sm md:leading-5 text-[#808080] text-center ">
                            {data.info}
                          </div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={formData.paymentMethod?.length <= 0}
                  className="disabled:cursor-not-allowed disabled:opacity-80 mt-10 text-white font-aeonikBold text-lg leading-[25px] bg-prm-black py-[14px] rounded-full w-full"
                >
                  Pay now
                </button>
              </div>
            </form>
          </aside>
          <aside className="sticky flex flex-col top-[72px] py-8 md:pb-0 md:pt-10 px-4 md:px-5 lg:px-10 xl:pl-12 xl:pr-[100px] border-y md:border-y-0 border-l border-[#D1D1D1] bg-[#FCFAF6] md:w-1/2 w-full h-full md:h-[calc(100vh-72px)]">
            <div className="w-full h-full md:hidden">
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => setSummary(!openSummary)}
                  className="flex items-center gap-1 text-prm-red text-sm md:text-[17px] md:leading-6"
                >
                  <p>Show order summary</p>
                  {openSummary ? (
                    <IoIosArrowDown className="text-sm mobile:text-[20px]" />
                  ) : (
                    <IoIosArrowUp className="text-sm mobile:text-[20px]" />
                  )}
                </button>
                <h1 className="text-prm-black text-[20px] font-bold">
                  {priceFormatter(totalPrice)}
                </h1>
              </div>
              {/* for mobile */}
              {openSummary && (
                <div className="flex flex-col">
                  <div className="md:hidden mt-4 max-h-[358px] overflow-auto scrollbar px-3 flex flex-col gap-2">
                    {cart?.map((item) => {
                      return item?.product.variants.map((v) => {
                        return (
                          <CartItemPayment
                            key={v.variant_id}
                            cartItemName={item?.product_name}
                            img={item?.images[0]}
                            price={parseFloat(v?.price)}
                            qty={item?.quantity}
                          />
                        );
                      });
                    })}
                  </div>
                  <div className="flex flex-col flex-shrink-0 gap-4 px-4 pt-6 md:gap-3">
                    <div className="flex justify-between">
                      <h1 className="text-[15px] leading-[18px] text-[#36454F]">Sub Total</h1>
                      <p className="text-[15px] leading-[22px] font-medium">
                        {priceFormatter(totalPrice)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <h1 className="text-[15px] leading-[18px] text-[#36454F]">Delivery fee</h1>
                      <p className="text-[15px] leading-[22px] font-medium">₦13,000</p>
                    </div>
                    {/* <div className="flex justify-between">
                      <h1 className="text-[15px] leading-[18px] text-[#36454F]">
                        Service fee
                      </h1>
                      <p className="text-[15px] leading-[22px] font-medium">
                        ₦ 0
                      </p>
                    </div> */}
                    <div className="py-[25px] border-y-[0.75px] border-[#E9E9E9] flex justify-between">
                      <h1 className="text-[20px] md:text-[18px] leading-[22px] text-prm-black font-bold md:font-medium">
                        Total
                      </h1>
                      <p className="text-[18px] leading-[25px] font-aeonikBold">
                        {priceFormatter(totalPrice + 13000)}
                      </p>
                    </div>
                    <button
                      onClick={handleContinueShopping}
                      className="text-[#E4572E] text-[15px] leading-[18px] font-medium py-6 relative after:contents-[''] after:w-[130px] after:bg-red-300  after:h-[1px] after:absolute after:bottom-6 after:left-1/2 after:-translate-x-1/2"
                    >
                      Continue shopping
                    </button>
                  </div>
                </div>
              )}
              {/* for mobile */}
            </div>
            <React.Fragment>
              <div className="flex-col hidden gap-2 px-4 mt-4 overflow-auto scrollbar md:flex">
                {cart?.map((item) => {
                  return item?.product.variants.map((v) => {
                    return (
                      <CartItemPayment
                        key={v.variant_id}
                        cartItemName={item?.product_name}
                        img={item?.images[0]}
                        price={parseFloat(v?.price)}
                        qty={item?.quantity}
                      />
                    );
                  });
                })}
              </div>
              <div className="flex-col flex-shrink-0 hidden gap-4 px-4 pt-6 md:flex md:gap-3">
                <div className="flex justify-between">
                  <h1 className="text-[15px] leading-[18px] text-[#36454F] font-aeonikRegular">
                    Sub Total
                  </h1>
                  <p className="text-[15px] leading-[22px] font-medium">
                    {priceFormatter(totalPrice)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-[15px] leading-[18px] text-[#36454F] font-aeonikRegular">
                    Delivery fee
                  </h1>
                  <p className="text-[15px] leading-[22px] font-medium">₦13,000</p>
                </div>
                {/* <div className="flex justify-between">
                  <h1 className="text-[15px] leading-[18px] text-[#36454F] font-aeonikRegular">
                    Service fee
                  </h1>
                  <p className="text-[15px] leading-[22px] font-medium">
                    &#8358;0
                  </p>
                </div> */}
                <div className="py-[25px] border-y-[0.75px] border-[#E9E9E9] flex justify-between">
                  <h1 className="text-[20px] md:text-[18px] leading-[22px] text-prm-black font-aeonikBold md:font-medium">
                    Total
                  </h1>
                  <p className="text-[18px] leading-[25px] font-aeonikBold">
                    {totalPrice ? priceFormatter(totalPrice + 13000) : '₦0.0'}
                  </p>
                </div>
                <button
                  onClick={handleContinueShopping}
                  className="text-[#E4572E] text-[15px] leading-[18px] font-medium py-6 relative after:contents-[''] after:w-[130px] after:bg-red-300  after:h-[1px] after:absolute after:bottom-6 after:left-1/2 after:-translate-x-1/2"
                >
                  Continue shopping
                </button>
              </div>
            </React.Fragment>
          </aside>
        </section>

        {/* <TransactionModal
          openOtpModal={isPinModalOpen}
          otp={formData.pin}
          setOTP={(value: any) => updateFormData("pin", value)}
          onClick={() => handlePayment(formData.paymentMethod)}
          handleTransactionClose={() => {
            updateFormData("pin", "");
            setPinModal(!isPinModalOpen);
          }}
          forgotPin={() => navigate(ROUTES.dashboardProfile)}
          processing={processing}
        /> */}
        {amountInUSD && (
          <>
            <div
              className={`${isPaypalModalOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-500 py-9 px-6 z-[99] bg-white [box-shadow:_0px_4px_6px_0px_#36454F26] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  w-[93%] md:w-[454px] rounded-md`}
            >
              <h1 className="text-lg pb-12 text-center leading-[18px] text-[#36454F] font-aeonikRegular">
                Continue With PayPal
              </h1>
              <PayPalButtons
                createOrder={createOrder}
                onApprove={(data, actions) => {
                  // setProcessing(true);
                  return onApprove(data, actions)
                    .then(handlePaymentSuccess)
                    .catch(handlePaymentError);
                }}
                onError={handlePaymentError}
              />
            </div>
            <div
              onClick={() => {
                setPaypalModalOpen(false);
              }}
              className={`${isPaypalModalOpen ? 'visible opacity-100' : 'invisible opacity-0'} bg-modalOverlay fixed inset-0 z-50 backdrop-blur-sm transition-all duration-200 cursor-pointer`}
            ></div>
          </>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Checkout;

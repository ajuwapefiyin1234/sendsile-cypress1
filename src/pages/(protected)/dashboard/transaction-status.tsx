import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../../components/global/Container';
import { NavLogo } from '../../../components/svgs/NavLogo';
import { Close } from '../../../components/svgs/farm-product/close';
import { Chip } from '../../../components/ui/dashboard/chip';
import { OrderDelivered, OrderPLaced, OrderRecieved, Payment } from '../../../assets/images';
import { TransactionState } from '../../../components/ui/dashboard/transaction-state';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { useTimer } from '../../../hooks/useTimer';
import React, { useCallback, useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import useEmblaCarousel from 'embla-carousel-react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { TransactionStatusType } from '../../../types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const states = [
  {
    icon: OrderPLaced,
    name: 'Order pending',
  },
  {
    icon: OrderRecieved,
    name: 'Order processing',
  },
  {
    icon: Payment,
    name: 'Order shipped',
  },
  {
    icon: OrderDelivered,
    name: 'Order delivered',
  },
];

const TransactionStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [isDisabled, setDisabled] = useState(true);
  const [currentItem, setCurrentItem] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatusType>();

  const { timerCount, timerCountSec, canCancel } = useTimer(29, 59);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const handleNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const handlePrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  useEffect(() => {
    setDisabled(true);

    async function getTransactionStatus() {
      setIsLoadingTransaction(true);
      try {
        const response = await axiosPrivate.get(`/transactions?id=${id}`);
        if (response.status === 200) {
          setTransactionStatus(response?.data?.data);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      } finally {
        setIsLoadingTransaction(false);
      }
    }
    getTransactionStatus();
  }, []);

  const updateButtonVisibility = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateButtonVisibility();
    emblaApi.on('select', updateButtonVisibility).on('reInit', updateButtonVisibility);
    return () => {
      emblaApi.off('select', updateButtonVisibility).off('reInit', updateButtonVisibility);
    };
  }, [emblaApi]);

  if (isLoadingTransaction) {
    return (
      <div className="flex items-center justify-center w-full h-screen gap-2">
        <div className="border-b rounded-full border-prm-black size-10 animate-spin"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAF6] min-h-screen overflow-auto">
      <header className={`top-0 fixed w-full z-50 bg-white `}>
        <Container>
          <nav className="flex items-center z-[99] justify-between px-4 md:px-10 lg:px-20 laptop:px-[272px] py-4">
            <Link to={'/'} className="w-[117px] h-[21px]">
              <NavLogo />
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="bg-[#F6F1E8] p-[11px] rounded-full w-fit"
            >
              <div className="w-[18px] h-[18px] cursor-pointer">
                <Close />
              </div>
            </button>
          </nav>
        </Container>
      </header>

      <section className="h-[calc(100vh-80px)] md:h-[calc(100vh-144px)] pt-[147px] pb-4 md:pt-[70px] px-4 sm:px-10 lg:px-0 md:grid md:place-items-center w-full md2:w-[896px] md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 overflow-auto no-scrollbar">
        <React.Fragment>
          <header className="flex items-center justify-between w-full">
            <p className="text-[#0D1415] text-[17px] md:text-base leading-6 ">
              Ref-{transactionStatus?.transaction_id}
            </p>
            <Chip
              statusText={transactionStatus?.status ? transactionStatus?.status : 'pending'}
              classname="py-3 px-5 mobile:px-9 bg-white text-[15px] leading-5"
            />
          </header>
          <section className="flex flex-col w-full gap-10 px-4 py-6 mt-5 bg-white md:mt-6 rounded-2xl mobile:pl-6 mobile:pr-5 md:flex-row">
            <aside>
              <div className="px-4 pb-[14px] bg-[#F7F7F7] rounded-[10px] w-full md:w-64 h-[274px] flex flex-col items-center justify-between">
                <img
                  src={transactionStatus?.line_items[currentItem]?.image}
                  alt="product"
                  className="w-auto max-w-[200px] max-h-[150px] mb-6 mt-[30px]"
                />
                <div className="self-start justify-self-start">
                  <h1 className="pb-3 text-black text-[20px] leading-7 font-medium">
                    {transactionStatus?.line_items[currentItem]?.product_name}
                  </h1>
                  <p className="text-[#0D1415] text-lg md:text-base font-normal leading-6">
                    ₦{transactionStatus?.line_items[currentItem]?.price}
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-4 w-full max-w-[280px] mx-auto md:w-auto">
                {canScrollPrev && (
                  <button onClick={handlePrev}>
                    <IoIosArrowBack />
                  </button>
                )}
                <div ref={emblaRef} className="w-[240px] md:w-[216px] overflow-hidden">
                  <div className="flex items-start gap-2">
                    {transactionStatus?.line_items?.map((item, idx) => {
                      return (
                        <div
                          key={idx}
                          onClick={() => setCurrentItem(idx)}
                          className="min-w-14 h-14 md:min-w-12 md:h-12 bg-[#F7F7F7] border-prm-red border-[0.75px] rounded-[2.5px] grid place-content-center"
                        >
                          <img src={item?.image} alt="item" className="w-full max-h-9 max-w-9" />
                        </div>
                      );
                    })}
                  </div>
                </div>
                {canScrollNext && (
                  <button onClick={handleNext}>
                    <IoIosArrowForward />
                  </button>
                )}
              </div>
            </aside>
            <aside className="w-full">
              <div className="flex items-center justify-between">
                <h1 className="text-prm-black font-medium text-[15px] md:text-sm leading-5">
                  Status update
                </h1>
                <p className="text-[#0D1415] font-medium text-base md:text-[15px] leading-5">
                  Ordered: {dayjs(transactionStatus?.date).format('DD MMMM, YYYY')}
                </p>
              </div>
              <div className="relative flex flex-col gap-2 mt-6">
                <div className="absolute w-full h-full bg-transactionGradient"></div>
                {states.map((state, idx) => {
                  const transactionState = transactionStatus?.status.toLowerCase();
                  const isActive =
                    transactionState === 'pending' && idx === 0
                      ? true
                      : transactionState === 'processing' && idx <= 1
                        ? true
                        : transactionState === 'shipped' && idx <= 2
                          ? true
                          : transactionState === 'delivered' && idx <= 3;
                  return (
                    <TransactionState
                      key={idx}
                      showCancelButton={idx === 0 && transactionState === 'pending' && canCancel}
                      icon={state.icon}
                      statusText={state.name}
                      timerCount={idx === 0 ? timerCount : undefined}
                      timerCountSec={idx === 0 ? timerCountSec : undefined}
                      classname={isActive ? 'z-30 shadow-2xl shadow-[#61616130]' : ''}
                    />
                  );
                })}
              </div>
            </aside>
          </section>
          <section className="flex flex-col w-full px-4 py-8 mt-4 bg-white rounded-2xl md:pl-6 md:pr-8 md:flex-row gap-7">
            <aside className="flex flex-col flex-grow gap-3">
              {transactionStatus?.line_items.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className={`py-[10px] px-4 flex items-center justify-between w-full border-[0.75px] ${
                      idx === currentItem && 'border-[#E3E6ED]'
                    } rounded-[4px]`}
                  >
                    <div>
                      <h1 className="text-lg md:text-[17px] leading-6 text-black font-medium w-full max-w-[256px]">
                        {item?.product_name || 'N/A'}
                      </h1>
                      <p className="pt-2 text-base leading-6 text-[#0D1415]">₦{item?.price}</p>
                    </div>
                    <Chip
                      statusText={transactionStatus?.status}
                      classname="px-0 py-0 border-none"
                    />
                  </div>
                );
              })}
            </aside>
            <aside className="flex-grow">
              <div className="w-full p-6 space-y-4 border-b border-[#E3E6ED]">
                <div className="flex items-center justify-between">
                  <h1 className="text-[17px] leading-5 md:text-[15px] md:leading-[18px] text-prm-black">
                    Sub Total
                  </h1>
                  <p className="text-[17px] md:text-base leading-6 text-prm-black font-medium">
                    ₦{transactionStatus?.details?.total}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <h1 className="text-[17px] leading-5 md:text-[15px] md:leading-[18px] text-prm-black">
                    Delivery fee
                  </h1>
                  <p className="text-[17px] md:text-base leading-6 text-prm-black font-medium">
                    ₦{transactionStatus?.details?.delivery_fee}
                  </p>
                </div>
                {/* <div className="flex items-center justify-between">
                  <h1 className="text-[17px] leading-5 md:text-[15px] md:leading-[18px] text-prm-black">
                    Service fee
                  </h1>
                  <p className="text-[17px] md:text-base leading-6 text-prm-black font-medium">
                    ₦{transactionStatus?.details?.service_fee}
                  </p>
                </div> */}
                <div className="flex items-center justify-between">
                  <h1 className="text-[17px] leading-5 md:text-[15px] font-medium md:leading-[18px] text-prm-black">
                    Total
                  </h1>
                  <p className="text-[17px] md:text-base leading-6 text-prm-black font-medium">
                    ₦{transactionStatus?.details?.total}
                  </p>
                </div>
              </div>
              <div className="min-w-full mt-4 space-y-4">
                <div className="px-6 py-4 border-b-[0.75px] border-[#E3E6ED]">
                  <p className="text-[15px] leading-5 font-normal text-[#0D1415]">
                    Delivery address
                  </p>
                  <h1 className="pt-2 text-[17px] md:text-base leading-6 font-medium">
                    {transactionStatus?.details?.delivery_address?.address || 'N/A'}
                  </h1>
                </div>
                <div className="px-6 py-4 border-b-[0.75px] border-[#E3E6ED]">
                  <p className="text-[15px] leading-5 font-normal text-[#0D1415]">Delivery date</p>
                  <h1 className="pt-2 text-[17px] md:text-base leading-6 font-medium">
                    24th June, 2024
                  </h1>
                </div>
                <div className="px-6 py-4 border-b-[0.75px] border-[#E3E6ED]">
                  <p className="text-[15px] leading-5 font-normal text-[#0D1415]">Payment method</p>
                  <h1 className="pt-2 text-[17px] md:text-base leading-6 font-medium">
                    {transactionStatus?.payment_method || 'N/A'}
                  </h1>
                </div>
              </div>
            </aside>
          </section>
        </React.Fragment>
      </section>

      <footer
        className={`bottom-0 fixed w-full z-50 bg-white shadow-[0px_2px_8px_4px_#7080901A] md:shadow-none`}
      >
        <Container>
          <div className={'flex items-center z-[99] justify-between px-4 lg:px-[272px] py-4'}>
            <button
              disabled={isDisabled}
              className="disabled:text-[#D5D9E0] disabled:bg-transparent bg-prm-black flex items-center gap-1 text-white px-4 py-[11px] rounded-full w-fit"
            >
              <FaArrowLeftLong />
              <p>Previous item</p>
            </button>
            <button
              disabled={isDisabled}
              className="disabled:text-[#D5D9E0] disabled:bg-transparent bg-prm-black flex items-center gap-1 text-white px-4 py-[11px] rounded-full w-fit"
            >
              <p>Next item</p>
              <FaArrowRightLong />
            </button>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default TransactionStatus;

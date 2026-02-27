import { InputField } from '../../ui/auth/pay-bills/input-field';
import CustomSelect from '../../ui/dropdown/custom-select';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Naira, UtilityImg, UtilityImg2, UtilityImg3 } from '../../../assets/images';
import {
  DISCOS,
  networkProviderData,
  networkProviderDataPlan,
  utilityPlan,
} from '../../../utils/constants';
import { FormEvent, Fragment, useState } from 'react';
import { Button } from '../../buttons/button';
import { useEmblaCarouselDotButton } from '../../../hooks/useEmblaCarousel';

import useEmblaCarousel from 'embla-carousel-react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { priceFormatter } from '../../../utils/helpers';
import LazyImage from '../../ui/lazy-image';
import { MeterDetails } from '../../../types';

const option3 = [
  {
    label: 'Plan 1',
    value: 'plan1',
  },
  {
    label: 'Plan 2',
    value: 'plan2',
  },
];

export const Utilities = () => {
  const [disco, setDisco] = useState('');
  const [plan, setPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [meterNo, setMeterNo] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [meterDetails, setMeterDetails] = useState({});

  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axiosPrivate.post('/utilities/electricity/validate-meter', {
        meter_no: meterNo,
        plan,
        disco,
        amount,
      });

      const data: MeterDetails[] = res?.data?.data;
      if (res.status === 200) {
        setMeterDetails(data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong', {
        toastId: 'initiatePub bills',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 md:mt-14 w-full px-4 lg:pl-10 lg:pr-3 bg-white rounded-[20px] flex gap-5 items-center laptop:gap-0 justify-between">
      <form onSubmit={onSubmit} className="py-4 md:py-[55px] w-full lg:w-1/2 xl:w-[533px]">
        <div className="font-medium flex items-center justify-between text-prm-black">
          {!meterDetails ? (
            <div>
              {/* <h2 className="text-[#00070C] text-lg font-medium">{meterDetails?.name_on_meter}</h2>
                <p className="text-[#00070C] text-lg">{meterDetails?.address_on_meter}</p> */}
            </div>
          ) : (
            <h1 className="text-[18px] leading-[25px] font-medium">Buy electricity units</h1>
          )}
          <p className="text-2xl md:text-[26px] leading-[36px] font-medium">
            {isNaN(parseInt(amount)) ? '0.00' : priceFormatter(parseInt(amount))}
          </p>
        </div>
        <div className="pt-10 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="meter-no"
              className="text-[17px] md:text-base leading-[22px] text-prm-black font-normal"
            >
              Meter number
            </label>
            <Fragment>
              <div className="h-[52px] md:h-12">
                <InputField
                  id="meter-no"
                  name="meterNo"
                  type="text"
                  onChange={(e) => {
                    setMeterNo(e.target.value);
                  }}
                />
              </div>
              {/* <span className="text-right uppercase flex justify-end pt-2 text-[#E4572E]">
                JOHN DOE
              </span> */}
            </Fragment>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="meter-no"
              className="text-[17px] md:text-base leading-[22px] text-prm-black font-normal"
            >
              Select plan
            </label>
            <CustomSelect
              value={plan}
              handleSelect={setPlan}
              option={utilityPlan}
              placeholder=" Select plan"
              placeholderStyles="text-[#536878] font-base leading-[22.4px] font-light"
              classname="bg-[#F7F7F7] py-[15px]"
              arrowDown={<IoIosArrowDown />}
              arrowUp={<IoIosArrowUp />}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="meter-no"
              className="text-[17px] md:text-base leading-[22px] text-prm-black font-normal"
            >
              Select distribution company
            </label>

            <CustomSelect
              value={disco}
              handleSelect={setDisco}
              option={DISCOS}
              placeholder=" Select DISCO"
              placeholderStyles="text-[#536878] font-base leading-[22.4px] font-light "
              classname="bg-[#F7F7F7] py-[15px] overflow-hidden text-ellipsis text-wrap"
              arrowDown={<IoIosArrowDown />}
              arrowUp={<IoIosArrowUp />}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="meter-no"
              className="text-[17px] md:text-base leading-[22px] text-prm-black font-normal"
            >
              Amount
            </label>
            <div className="relative h-[52px] md:h-12 w-full border border-[#D1D3D9] focus-within:border focus-within:border-[#E4572E] focus-within:ring-[#FFE6DC] focus-within:ring-[4.5px]  rounded-md bg-[#F7F7F7] ">
              <img
                src={Naira}
                alt="naira icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 pr-[10px] border-r border-[#D1D3D9]"
              />
              <input
                className="w-full pl-[47px] pr-4 py-[13px] bg-transparent h-full rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
                placeholder="0.00"
                type="tel"
                name="amount"
                id="meter-no"
                required
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" buttonStyle="py-4">
            {isSubmitting ? <PulseLoader size={10} color="#ffffff" /> : 'Make payment'}
          </Button>
        </div>
      </form>
      <LazyImage
        src={UtilityImg}
        alt="utitlity image"
        className="hidden lg:flex lg:w-1/2 xl:w-[557px] h-[673px] my-[11px] object-cover rounded-xl object-center"
      />
    </div>
  );
};

export const NetworkProvider = ({
  icon,
  text,
  action,
  active,
}: {
  icon: any;
  text: string;
  action: () => void;
  active: boolean;
}) => {
  return (
    <div
      onClick={action}
      className={`${
        active && 'border border-prm-red shadow-[0px_1px_32px_8px_#50626C1A]'
      } p-6 min-w-[150px] h-[160px] md:min-w-[292px] md:h-[313px] flex flex-col justify-center items-center md:items-start md:justify-between bg-white rounded-[20px]`}
    >
      <div className="flex flex-col items-start gap-[50px] ">
        <img src={icon} alt="provider icon" />
        <h1 className="hidden md:block text-prm-black font-medium text-lg leading-[26px]">
          {text}
        </h1>
      </div>

      <button
        onClick={() => action}
        className="hidden md:block border-[#757575] border-[0.75px] w-full rounded-full py-3"
      >
        Buy now
      </button>
    </div>
  );
};

export const AirtimeTopUp = () => {
  const [providerName, setProviderName] = useState('MTN Direct Top-up');
  const [active, setActive] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const { onDotButtonClick, scrollSnaps, selectedIndex } = useEmblaCarouselDotButton(
    emblaApi as any
  );

  const handleOnSelect = (index: number, providerName: string) => {
    setActive(index);
    setProviderName(providerName);
  };

  return (
    <section>
      <div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="mt-14 flex items-start gap-6">
            {networkProviderData.map((data, index) => {
              return (
                <NetworkProvider
                  key={index + data.text}
                  {...data}
                  active={active === index}
                  action={() => handleOnSelect(index, data.text)}
                />
              );
            })}
          </div>
        </div>
        <div className="flex laptop:hidden justify-center gap-[6px] items-center mt-5">
          {scrollSnaps.map((_, index) => {
            return (
              <button
                onClick={() => onDotButtonClick(index)}
                key={index}
                className={`${
                  index === selectedIndex
                    ? 'bg-prm-red w-9 h-[7px] rounded-lg'
                    : 'bg-[#D9D9D9] size-3 rounded-full'
                }`}
              ></button>
            );
          })}
        </div>
      </div>

      <div className="mt-[38px] px-4 lg:pl-10 lg:pr-[14px] py-[14px] flex gap-5 items-center rounded-[20px] laptop:gap-24 bg-white">
        <div className="w-full lg:w-1/2 xl:w-[533px]">
          <div className="pb-10 flex justify-between items-center">
            <h1 className="text-lg leading-6 text-prm-black font-medium">{providerName}</h1>

            <h1 className="text-prm-black text-2xl md:text-[26px] leading-9 font-medium">₦0.00</h1>
          </div>
          <div className="w-full space-y-8">
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="phone"
                className="text-[17px] leading-6 md:text-base md:leading-[22px] text-prm-black font-normal"
              >
                Recipient’s phone number
              </label>
              <input
                className="w-full  p-4 bg-[#F7F7F7] h-[52px] md:h-12 focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] border border-[#D1D3D9] rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
                placeholder="0.00"
                type="tel"
                name="amount"
                id="meter-no"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="meter-no"
                className="text-[17px] leading-6 md:text-base md:leading-[22px] text-prm-black font-normal"
              >
                Recharge amount
              </label>
              <div className="relative h-[52px] md:h-12 w-full border border-[#D1D3D9] rounded-md bg-[#F7F7F7] focus-within:border focus-within:border-[#E4572E] focus-within:ring-[#FFE6DC] focus-within:ring-[4.5px] ">
                <img
                  src={Naira}
                  alt="naira icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 pr-[10px] border-r border-[#D1D3D9]"
                />
                <input
                  className="w-full pl-[47px] pr-4 py-[13px] bg-transparent h-full rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
                  placeholder="0.00"
                  type="tel"
                  name="amount"
                  id="meter-no"
                  required
                />
              </div>
            </div>
          </div>
          <Button buttonStyle="py-4 mt-14 w-full">Make payment</Button>
        </div>
        <LazyImage
          src={UtilityImg2}
          alt="image"
          className="hidden lg:flex lg:w-1/2 xl:w-[557px] h-[447px] object-cover rounded-2xl"
        />
      </div>
    </section>
  );
};
export const DataRecharge = () => {
  const [providerName, setProviderName] = useState('MTN Mobile Data Plan');
  const [active, setActive] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const { onDotButtonClick, scrollSnaps, selectedIndex } = useEmblaCarouselDotButton(
    emblaApi as any
  );

  const handleOnSelect = (index: number, providerName: string) => {
    setActive(index);
    setProviderName(providerName);
  };

  return (
    <section>
      <div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="mt-14 flex items-start gap-6">
            {networkProviderDataPlan.map((data, index) => {
              return (
                <NetworkProvider
                  key={index + data.text}
                  action={() => handleOnSelect(index, data.text)}
                  active={index === active}
                  {...data}
                />
              );
            })}
          </div>
        </div>
        <div className="flex laptop:hidden justify-center gap-[6px] items-center mt-5">
          {scrollSnaps.map((_, index) => {
            return (
              <button
                onClick={() => onDotButtonClick(index)}
                key={index}
                className={`${
                  index === selectedIndex
                    ? 'bg-prm-red w-9 h-[7px] rounded-lg'
                    : 'bg-[#D9D9D9] size-3 rounded-full'
                }`}
              ></button>
            );
          })}
        </div>
      </div>

      <div className="mt-[38px] px-4 lg:pl-10 lg:pr-[14px] py-[14px] flex gap-5 items-center rounded-[20px] xl:gap-24 bg-white">
        <div className="w-full lg:w-1/2 xl:w-[533px]">
          <div className="pb-10 flex justify-between items-center">
            <h1 className="text-lg leading-6 text-prm-black">{providerName}</h1>
            <h1 className="text-prm-black text-2xl md:text-[26px] leading-9 font-medium">₦0.00</h1>
          </div>
          <div className="w-full space-y-8">
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="phone"
                className="text-[17px] leading-6 md:text-base md:leading-[22px] text-prm-black font-normal"
              >
                Recipient’s phone number
              </label>
              <input
                className="w-full  p-4 bg-[#F7F7F7] h-[52px] md:h-12 focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] border border-[#D1D3D9] rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
                type="tel"
                name="amount"
                id="meter-no"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="meter-no"
                className="text-[17px] leading-6 md:text-base md:leading-[22px] text-prm-black font-normal"
              >
                Select plan
              </label>
              <CustomSelect
                value=""
                handleSelect={() => ''}
                option={option3}
                placeholder=" Select option"
                placeholderStyles="text-[#536878] font-base leading-[22.4px] font-light"
                classname="bg-[#F7F7F7] py-[13px]"
                arrowDown={<IoIosArrowDown />}
                arrowUp={<IoIosArrowUp />}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="meter-no"
                className="text-[17px] leading-6 md:text-base md:leading-[22px] text-prm-black font-normal"
              >
                Recharge amount
              </label>
              <div className="relative h-[52px] md:h-12 w-full border border-[#D1D3D9] rounded-md bg-[#F7F7F7] focus-within:border focus-within:border-[#E4572E] focus-within:ring-[#FFE6DC] focus-within:ring-[4.5px] ">
                <img
                  src={Naira}
                  alt="naira icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 pr-[10px] border-r border-[#D1D3D9]"
                />
                <input
                  className="w-full pl-[47px] pr-4 py-[13px] bg-transparent h-full rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
                  placeholder="0.00"
                  type="tel"
                  name="amount"
                  id="meter-no"
                  required
                />
              </div>
            </div>
          </div>
          <Button buttonStyle="w-full mt-14 py-3">Make payment</Button>
        </div>
        <LazyImage
          src={UtilityImg3}
          alt="image"
          className="hidden lg:flex lg:w-1/2 xl:w-[557px] h-[524px] object-cover rounded-2xl"
        />
      </div>
    </section>
  );
};

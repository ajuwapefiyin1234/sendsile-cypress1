import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Naira } from '../../../assets/images';
import { Button } from '../../buttons/button';
import { AiOutlineClose } from 'react-icons/ai';
import { paymentGateways } from '../../../utils/constants';
import { Radio } from '../../ui/auth/radio';

interface PaymentMode {
  openModal: boolean;
  setModal: () => void;
  walletData: {
    amount: string;
    paymentMode: string;
  };
  setWalletData: Dispatch<
    SetStateAction<{
      amount: string;
      paymentMode: string;
    }>
  >;
}

interface FundWallet extends PaymentMode {
  onClick: () => void;
}

export const FundWallet = ({
  openModal,
  setModal,
  onClick,
  walletData,
  setWalletData,
}: FundWallet) => {
  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    onClick();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWalletData({
      ...walletData,
      [name]: value,
    });
  };

  const handleClose = () => {
    setWalletData({
      amount: '',
      paymentMode: '',
    });
    setModal();
  };

  return (
    <div className="">
      <div
        className={`${
          openModal ? 'visible opacity-100' : 'invisible opacity-0'
        } [box-shadow:_0px_4px_6px_0px_#36454F26] transition-all duration-500 py-9 px-14 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-[99] bg-white pt-9 pb-12 w-full max-w-[454px] mx-auto rounded`}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 ">
          <AiOutlineClose size={24} color="#00070C" className="text-[#00070C]" />
        </button>

        <h1 className=" pb-14 text-center text-2xl leading-[28px] font-medium">
          <span>Fund your</span>
          <span className="font-besley italic pl-1">wallet</span>
        </h1>

        <form onSubmit={handleNext}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="meter-no"
              className="text-[17px] leading-6 md:text-base md:leading-[22px] text-prm-black font-normal"
            >
              Funding amount
            </label>
            <div className="relative h-[52px] md:h-11 w-full border border-[#D1D3D9] rounded-md bg-[#F7F7F7] focus-within:border focus-within:border-[#E4572E] focus-within:ring-[#FFE6DC] focus-within:ring-[4.5px] ">
              <img
                src={Naira}
                alt="naira icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 pr-[10px] border-r border-[#D1D3D9]"
              />
              <input
                className="w-full pl-[47px] pr-4 py-[13px] bg-transparent h-full rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
                placeholder="0.00"
                onChange={(e) => handleChange(e)}
                type="number"
                name="amount"
                id="meter-no"
                required
              />
            </div>
          </div>
          <Button type="submit" buttonStyle="w-full mt-9">
            Make payment
          </Button>
        </form>
      </div>

      <div
        onClick={handleClose}
        className={`${
          openModal ? 'visible opacity-100' : 'invisible opacity-0'
        } bg-modalOverlay fixed inset-0 z-50 backdrop-blur-sm transition-all duration-200 `}
      ></div>
    </div>
  );
};

export const PaymentMode = ({ openModal, setModal, walletData, setWalletData }: PaymentMode) => {
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    !walletData.amount && !walletData.paymentMode ? setDisabled(true) : setDisabled(false);
  }, [walletData.paymentMode]);

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className={`${
          openModal ? 'visible opacity-100' : 'invisible opacity-0'
        } [box-shadow:_0px_4px_6px_0px_#36454F26] transition-all duration-500 py-9 px-14 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-[99] bg-white pt-9 pb-12 w-full max-w-[454px] mx-auto rounded`}
      >
        <button onClick={setModal} className="absolute top-4 right-4 ">
          <AiOutlineClose size={24} color="#00070C" className="text-[#00070C]" />
        </button>

        <h1 className=" pb-14 text-center text-2xl leading-[28px] font-medium">
          <span>Select mode of</span>
          <span className="font-besley italic pl-2">payment</span>
        </h1>

        <div className="w-full border border-[#EAECF0] rounded-md">
          <div className="flex flex-col divide-y divide-[#EAECF0]">
            {paymentGateways.map((data, index) => (
              <Fragment key={index}>
                <div className="py-6 md:py-[14px] px-4 flex gap-3 items-center">
                  <Radio
                    id={data.id}
                    name="payment"
                    checked={data.id === walletData.paymentMode}
                    onChange={() => setWalletData({ ...walletData, paymentMode: data.id })}
                    required
                  />
                  <label htmlFor={data.id} className="w-full cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-black leading-5 font-medium">{data.name}</p>
                      <img src={data.icon} alt={`${data.name} logo`} />
                    </div>
                  </label>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          buttonStyle="w-full mt-9 disabled:cursor-not-allowed disabled:opacity-80"
          disabled={disabled}
        >
          Make payment
        </Button>
      </form>

      <div
        onClick={setModal}
        className={`${
          openModal ? 'visible opacity-100' : 'invisible opacity-0'
        } bg-modalOverlay fixed inset-0 z-50 backdrop-blur-sm transition-all duration-200`}
      ></div>
    </div>
  );
};

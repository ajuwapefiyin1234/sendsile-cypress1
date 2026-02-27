import { Dispatch, FormEvent, Fragment, ReactNode, SetStateAction } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import PhoneInput from 'react-phone-input-2';
import InfoAlert from '../ui/info-alert';
import { Bademoji, NeutralEmoji, SmilingEmoji } from '../../assets/images';
import { twMerge } from 'tailwind-merge';
import OTPInput from 'react-otp-input';
import '../../styles/packages/react-otp-input.css';
import { PulseLoader } from 'react-spinners';
import { extractEmail } from '../../utils/helpers';
import { userProfileState } from '../../services/store/userProfileStore';

interface OTPModalProps {
  openOtpModal: boolean;
  setModal: () => void;
  otp: string;
  setOTP: any;
  modalTitle: string;
  modalTitleSpan: string;
  onClick: () => void;
  error?: string;
  processing?: boolean;
}

interface TransactionModalProps {
  openOtpModal: boolean;
  otp: string;
  setOTP: Dispatch<SetStateAction<string>>;
  onClick: () => void;
  handleTransactionClose: () => void;
  error?: string;
  processing?: boolean;
  forgotPin?: () => void;
}

interface SixDigitsModalProps {
  openOtpModal: boolean;
  otp: string;
  setOTP: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClick: () => void;
  handleTransactionClose: () => void;
}

interface PhoneNumberModalProps {
  handleSubmit: () => void;
  showNumberModal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  phoneNumber: string;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
  loading?: boolean;
}

export const ModalButton = ({
  children,
  classname,
  onClick,
  processing,
}: {
  classname: string;
  children: string | ReactNode;
  onClick: () => void;
  processing?: boolean;
}) => {
  return (
    <button
      disabled={processing}
      onClick={onClick}
      className={twMerge(
        `text-[15px] leading-5 text-white bg-prm-black py-3 rounded-full w-full disabled:opacity-80 disabled:cursor-not-allowed`,
        classname
      )}
      type="button"
    >
      {children}
    </button>
  );
};

export const PhoneNumberModal = ({
  handleSubmit,
  showNumberModal,
  setModal,
  phoneNumber,
  setPhoneNumber,
  loading,
}: PhoneNumberModalProps) => {
  return (
    <>
      <div
        className={`${
          showNumberModal ? 'visible opacity-100' : 'invisible opacity-0'
        }  duration-200 transition-all pt-9 pb-[50px] z-[99] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px 4px 6px 0px #36454F26] w-[93%] md:w-[454px] h-[425px] md:h-[325px] rounded-md`}
      >
        <button onClick={() => setModal(false)} className="absolute top-3 right-3 ">
          <AiOutlineClose size={24} color="#00070C" className="text-[#00070C]" />
        </button>

        <h1 className="w-full px-4 mobile:px-0 mobile:w-[286px] mx-auto sm:w-full text-center text-prm-black text-2xl font-medium">
          Enter your
          <span className="pl-[5px] font-besley font-medium italic">phone number</span>
        </h1>

        <div className="pt-[54px] px-[26px] md:px-14 pb-[50px]">
          <h1 className="pb-2 text-[17px] md:text-base leading-[22px] font-normal text-[#36454F]">
            Phone number
          </h1>
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder=""
            masks={{
              ng: '... ... ....',
              gb: '.. .... ....',
              us: '... ... ....',
              ca: '... ... ....',
            }}
            containerClass="sign-up-phone-input"
            buttonClass="phone-input-drop"
            onlyCountries={['ng', 'gb', 'us', 'ca']}
            buttonStyle={{
              backgroundColor: 'transparent',
              borderRight: 'none',
            }}
            country={'ng'}
          />
          <ModalButton classname="mt-9" onClick={handleSubmit}>
            {loading ? <PulseLoader size={10} color="#ffffff" /> : 'Submit'}
          </ModalButton>
        </div>
      </div>

      {/* modal overlay */}
      <div
        onClick={() => setModal(false)}
        className={`${
          showNumberModal ? 'visible opacity-100' : 'invisible opacity-0'
        } bg-modalOverlay fixed inset-0 z-50 backdrop-blur-sm`}
      ></div>
    </>
  );
};

export const FeedbackModal = ({
  openModal,
  setModal,
}: {
  openModal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleSubmit = (): void => {
    setModal(false);
  };

  return (
    <Fragment>
      <div
        className={`${
          openModal ? 'visible opacity-100' : 'invisible opacity-0'
        } transition-all duration-500 py-9 px-[30px] w-[93%] md:w-[472px] h-fit md:h-[572px] z-[99] bg-white rounded-md shadow-[#36454F26] shadow-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      >
        <button onClick={() => setModal(false)} className="absolute top-3 right-3 ">
          <AiOutlineClose size={24} color="#00070C" className="text-[#00070C]" />
        </button>

        <h1 className="pb-8 text-center  font-medium text-2xl">
          Rate your
          <span className="font-besley italic font-medium"> experience</span>
        </h1>

        <InfoAlert
          message="We value your feedback; if you need help or have a compliant about our services, please use our"
          urlRedirect={'mailto:team@sendsile.com'}
          pathName="Email address"
        />

        <div className="mt-8 mb-6 flex justify-between items-center">
          <button className="flex-col gap-1">
            <img src={Bademoji} alt="sad emoji feedback" />
            <p className="text-[#36454F] text-[15px] leading-5">Bad</p>
          </button>
          <button className="flex-col gap-1">
            <img src={NeutralEmoji} alt="sad emoji feedback" />
            <p className="text-[#36454F] text-[15px] leading-5">Neutral</p>
          </button>
          <button className="flex-col gap-1">
            <img src={SmilingEmoji} alt="sad emoji feedback" />
            <p className="text-[#36454F] text-[15px] leading-5">Good</p>
          </button>
        </div>

        <div className="mb-8 h-[10px] rounded-full w-full bg-[linear-gradient(90deg,_#2CD8D5_0%,_#C5C1FF_56%,_#FFBAC3_100%)]"></div>

        <textarea
          placeholder="Please tell us in few words"
          className="p-4 text-[#708090] text-sm outline-none focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] resize-none h-[94px] border border-[#DEDEDE] rounded-md w-full"
        />

        <ModalButton onClick={handleSubmit} classname="mt-9">
          Submit
        </ModalButton>
      </div>

      <div
        onClick={() => setModal(false)}
        className={`${
          openModal ? 'visible opacity-100' : 'invisible opacity-0'
        } bg-modalOverlay inset-0 z-50 backdrop-blur-sm transition-all duration-200 w-full h-full fixed`}
      ></div>
    </Fragment>
  );
};

export const OTPModal = ({
  openOtpModal,
  setModal,
  otp,
  setOTP,
  modalTitle,
  modalTitleSpan,
  onClick,
  error,
  processing,
}: OTPModalProps) => {
  return (
    <Fragment>
      <div
        className={`${
          openOtpModal ? 'visible opacity-100' : 'invisible opacity-0'
        } transition-all duration-500 py-9 px-6 z-[99] bg-white [box-shadow:_0px_4px_6px_0px_#36454F26] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[425px] md:h-[325px] w-[93%] md:w-[454px] rounded-md`}
      >
        <button onClick={setModal} className="absolute top-3 right-3 ">
          <AiOutlineClose size={24} color="#00070C" className="text-[#00070C]" />
        </button>

        <h1 className="w-full xs2:w-[286px] mx-auto md:w-full pb-14 text-center text-2xl leading-[28px] font-medium ">
          {modalTitle}
          <span className="font-besley italic">{modalTitleSpan}</span>
        </h1>
        <OTPInput
          value={otp}
          onChange={setOTP}
          numInputs={4}
          inputType="password"
          renderInput={(props) => <input {...props} />}
          inputStyle="otp-input"
          containerStyle={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
          }}
          shouldAutoFocus={true}
        />

        <ModalButton
          processing={processing}
          onClick={onClick}
          classname="mt-8 w-fit mx-auto block px-9"
        >
          {processing ? <PulseLoader size={10} color="#ffffff" /> : 'Continue'}
        </ModalButton>
        {!!error && <p className="pt-2 text-center text-prm-red text-sm font-normal">{error}</p>}
      </div>

      <div
        onClick={setModal}
        className={`${
          openOtpModal ? 'visible opacity-100' : 'invisible opacity-0'
        } bg-modalOverlay fixed inset-0 z-50 backdrop-blur-sm transition-all duration-200`}
      ></div>
    </Fragment>
  );
};

export const TransactionModal = ({
  openOtpModal,
  otp,
  setOTP,
  onClick,
  handleTransactionClose,
  error,
  processing,
  forgotPin,
}: TransactionModalProps) => {
  return (
    <>
      <div
        className={`${
          openOtpModal ? 'visible opacity-100' : 'invisible opacity-0'
        } transition-all duration-500 py-9 px-6 z-[99] bg-white [box-shadow:_0px_4px_6px_0px_#36454F26] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[425px] md:h-[325px] w-[93%] md:w-[454px] rounded-md`}
      >
        <h1 className="pb-14 text-center text-2xl leading-[28px] font-medium ">
          Enter your
          <span className="font-besley italic">{' transaction PIN'}</span>
        </h1>

        <div className="flex flex-col w-[202px] justify-center mx-auto">
          <OTPInput
            value={otp}
            onChange={setOTP}
            numInputs={4}
            inputType="password"
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input"
            shouldAutoFocus={true}
            containerStyle={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
            }}
          />
          <button onClick={forgotPin} className="text-[#E4572E] text-sm leading-5 self-end pt-2">
            Forgot PIN?
          </button>
        </div>
        <ModalButton onClick={onClick} classname="mt-8 w-fit mx-auto block px-9">
          {processing ? <PulseLoader size={10} color="#ffffff" /> : 'Continue'}
        </ModalButton>
        {!!error && <p className="pt-2 text-center text-prm-red text-sm font-normal">{error}</p>}
      </div>

      <div
        onClick={handleTransactionClose}
        className={`${
          openOtpModal ? 'visible opacity-100' : 'invisible opacity-0'
        } bg-modalOverlay fixed inset-0 z-50 backdrop-blur-sm transition-all duration-200 cursor-pointer`}
      ></div>
    </>
  );
};

export const SixDigitOtpModal = ({
  openOtpModal,
  otp,
  setOTP,
  onClick,
  handleTransactionClose,
  handleSubmit,
}: SixDigitsModalProps) => {
  const { userData } = userProfileState();
  return (
    <>
      <div
        className={`${
          openOtpModal ? 'visible opacity-100' : 'invisible opacity-0'
        } transition-all duration-500 py-9 px-6 z-[99] bg-white [box-shadow:_0px_4px_6px_0px_#36454F26] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[425px] md:h-[325px] w-[93%] md:w-[454px] rounded-md`}
      >
        <button onClick={handleTransactionClose} className="absolute top-3 right-3 ">
          <AiOutlineClose size={24} color="#00070C" className="text-[#00070C]" />
        </button>

        <h1 className="text-center text-2xl leading-[28px] font-medium ">
          Enter 6-digit
          <span className="font-besley italic">{' OTP'}</span>
        </h1>
        <p className="pt-1 pb-11 text-sm text-center leading-5 text-prm-black">
          Enter the code sent to {extractEmail(userData?.email, 7)}
        </p>
        <form onSubmit={handleSubmit}>
          <OTPInput
            value={otp}
            onChange={setOTP}
            numInputs={6}
            inputType="password"
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input"
            containerStyle={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
            }}
          />
          <button type="submit" style={{ display: 'none' }}>
            Submit
          </button>
        </form>
        <div className="mt-8 flex items-center gap-1 justify-center ">
          <p className="text-sm leading-5 text-[#536878]">Didn&Apos;t get any code?</p>
          <button onClick={onClick} className="text-prm-red text-sm leading-5">
            Resend code
          </button>
        </div>
      </div>

      <div
        onClick={handleTransactionClose}
        className={`${
          openOtpModal ? 'visible opacity-100' : 'invisible opacity-0'
        } bg-modalOverlay fixed inset-0 z-50 backdrop-blur-sm transition-all duration-200`}
      ></div>
    </>
  );
};

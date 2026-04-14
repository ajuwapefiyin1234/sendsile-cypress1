import { FormEvent, Fragment, ReactNode, useEffect, useState } from 'react';

import { DashboardWidth } from '../../../components/global/dashboard-width';
import { FeedbackText } from '../../../components/ui/dashboard/feedback-text';
import { ProfilePlaceholder } from '../../../components/ui/dashboard/profile-placeholder';
import { RiEarthFill } from 'react-icons/ri';
import { BsPhoneFill } from 'react-icons/bs';
import { MdArrowForwardIos } from 'react-icons/md';

import { OTPModal, SixDigitOtpModal } from '../../../components/modals';
// import { IoMdLock } from "react-icons/io";
import { ImLocation2 } from 'react-icons/im';
import { ROUTES } from '../../../utils/route-constants';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { User } from '../../../types';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { capitalizeFirstChar, extractCharacter } from '../../../utils/helpers';

import { UpdatePinScreen } from '../../../components/ui/dashboard/profile/update-pin-screen';
import { UpdatePasswordScreen } from '../../../components/ui/dashboard/profile/update-password';
import { TwoFAScreen } from '../../../components/ui/dashboard/profile/two-FA-screen';
import { userProfileState } from '../../../services/store/userProfileStore';
import { useLocationState } from '../../../services/store/selectLocationStore';
import { twMerge } from 'tailwind-merge';
import { UpdateAddress } from '../../../components/ui/dashboard/profile/update-address';

const Profile = () => {
  const [user, setUser] = useState<User>();
  const [isLoading, setLoading] = useState(false);
  const [switchState, setSwitchState] = useState(false);

  //sub-screen states
  const [updatePasswordScreen, setShowPasswordScreen] = useState(false);
  const [pinScreen, setPinScreen] = useState(false);
  const [twoFAScreen, setTwoFAScreen] = useState(false);
  const [changeAddress, toggleChangeAddress] = useState(false);
  //sub-screen states

  const [otp, setOTP] = useState('');
  const [confirmOTP, setConfirmOTP] = useState('');
  // const [transactionPin, setTransactionPin] = useState("");
  const [sixDigitPin, setSixDigitPin] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const [togglePasswordVisibility, setTogglePasswordVisiblity] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [togglePinVisibility, setTogglePinVisiblity] = useState({
    oldPin: false,
    newPin: false,
    confirmPin: false,
  });

  const [openModals, setOpenModals] = useState('');

  const { userData } = userProfileState();
  const { location } = useLocationState();

  const axiosPrivate = useAxiosPrivate();

  const handleTransactionPinClose = () => {
    setPinScreen(false);
    setOpenModals('');
    setSixDigitPin('');
    setOTP('');
    setConfirmOTP('');
  };

  const handleResendOTP = async () => {
    try {
      const res = await axiosPrivate.post('/resend/otp', {
        email: userData?.email,
      });
      if (res.status === 200) {
        toast.success(res?.data?.message);
      } else {
        throw new Error();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        toastId: 'resendOTPError',
      });
    }
  };

  const handleSixDigitOTP = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sixDigitPin?.length === 6) {
      setOpenModals('transactionPin');
    } else {
      toast.error('Please enter a valid 6 digit pin', {
        toastId: 'sixDigitPinError',
      });
    }
  };
  const handleOpenConfirmTransaction = () => {
    if (otp?.length === 4) {
      setOpenModals('confirmTransactionPin');
    } else {
      setError('PIN is required');
      // setTimeout(() => {
      //   setError("");
      // }, 3000);
    }
  };
  const handleTransactionPin = async () => {
    if (confirmOTP?.length < 4) {
      return;
    }
    if (otp === confirmOTP) {
      try {
        setProcessing(true);
        let endpoint = '/pin/set';
        let payload: { pin: string; confirm_pin: string; otp?: string } = {
          pin: otp,
          confirm_pin: confirmOTP,
        };

        if (sixDigitPin?.length) {
          endpoint = '/pin/reset';
          payload = {
            ...payload,
            otp: sixDigitPin,
          };
        }
        const res = await axiosPrivate.post(endpoint, payload);

        if (res.status === 200) {
          setOpenModals('');
          setPinScreen(false);
          setConfirmOTP('');
          setOTP('');
          setSixDigitPin('');
          toast.success(res?.data?.message || 'Pin succesfully set', {
            toastId: 'confirmPin',
          });
        } else {
          throw new Error();
        }
      } catch (error: any) {
        setError(error?.response?.data?.message || 'Something went wrong');
        setTimeout(() => {
          setError('');
        }, 3000);
      } finally {
        setProcessing(false);
      }
    } else {
      setError('Pins do not match');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  useEffect(() => {
    async function getUserDetails() {
      setLoading(true);
      try {
        const res = await axiosPrivate.get('/user');
        if (res.status === 200) {
          const is2FactorEnabled = res?.data?.data?.two_factor_enabled === 'enabled';
          setSwitchState(is2FactorEnabled);
          setUser(res.data.data);
        } else throw new Error();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    getUserDetails();
  }, []);

  useEffect(() => {
    if (pinScreen) {
      if (!user?.pin_set) {
        setOpenModals('transactionPin');
      }
    }
  }, [pinScreen]);

  return (
    <DashboardWidth>
      {updatePasswordScreen ? (
        <UpdatePasswordScreen
          setShowPasswordScreen={setShowPasswordScreen}
          togglePasswordVisibility={togglePasswordVisibility}
          setTogglePasswordVisiblity={setTogglePasswordVisiblity}
        />
      ) : pinScreen ? (
        <UpdatePinScreen
          togglePinVisibilty={togglePinVisibility}
          setTogglePinVisiblity={setTogglePinVisiblity}
          setOpenOTPModal={setOpenModals}
          setPinScreen={setPinScreen}
        />
      ) : twoFAScreen ? (
        <TwoFAScreen
          setTwoFAScreen={setTwoFAScreen}
          switchState={switchState}
          setSwitchState={setSwitchState}
        />
      ) : changeAddress ? (
        <UpdateAddress
          toggleChangeAddress={toggleChangeAddress}
          switchState={switchState}
          setSwitchState={setSwitchState}
        />
      ) : (
        <div className="px-4 sm:px-10 xl:px-0 pt-[160px] lg:pt-[90px] pb-10 w-full xl:w-[824px] 2xl:w-[920px] mx-auto">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Skeleton className="rounded-full size-14" />
              ) : (
                <ProfilePlaceholder>{extractCharacter(user?.name || 'UU')}</ProfilePlaceholder>
              )}
              <div>
                <h1 className="pb-2 text-prm-black text-[22px] md:text-2xl leading-7 font-medium">
                  {isLoading ? <Skeleton height={20} className="w-[200px]" /> : user?.name}
                </h1>
                <p className="text-sm leading-4 font-normal text-[#36454F]">
                  {isLoading ? <Skeleton className="w-[150px]" /> : user?.email}
                </p>
              </div>
            </div>
            <FeedbackText />
          </header>

          <div className="flex flex-col w-full gap-6 mt-6 md:mt-10">
            <article className="p-4 bg-white h-fit md:p-5 rounded-2xl">
              <h1 className="pb-4 text-[#0D1415] text-[15px] leading-5 font-normal">
                Contact Information
              </h1>
              <div className="flex flex-col gap-[10px]">
                <ProfileField
                  text={capitalizeFirstChar(location)}
                  icon={<RiEarthFill className="text-prm-red text-[20px]" />}
                />
                <ProfileField
                  text={userData?.phone}
                  icon={<BsPhoneFill className="text-prm-red" />}
                />
                <ProfileField
                  onClick={() => toggleChangeAddress(true)}
                  className="hover:border-[#E4572E] hover:ring-[#FFE6DC] hover:ring-[4.5px]"
                  text={userData?.delivery_address || 'Update address'}
                  icon={<ImLocation2 className="text-prm-red text-[20px]" />}
                  iconForward={<MdArrowForwardIos className="text-[12px] text-[#36454F]" />}
                />
              </div>
            </article>

            <article className="w-full p-5 bg-white h-fit rounded-2xl">
              <h1 className="pb-4 text-[#0D1415] text-[15px] leading-5 font-normal">Security</h1>
              <div className="flex flex-col gap-[10px]">
                <ProfileField
                  className="hover:border-[#E4572E] hover:ring-[#FFE6DC] hover:ring-[4.5px]"
                  onClick={() => setShowPasswordScreen(true)}
                  text="Update password"
                  icon={<RiEarthFill className="text-prm-red text-[20px]" />}
                  iconForward={<MdArrowForwardIos className="text-[12px] text-[#36454F]" />}
                />
                {/* <ProfileField
                  className="hover:border-[#E4572E] hover:ring-[#FFE6DC] hover:ring-[4.5px]"
                  onClick={() => setPinScreen(true)}
                  text="Transaction PIN"
                  icon={<IoMdLock className="text-prm-red text-[20px]" />}
                  iconForward={
                    <MdArrowForwardIos className="text-[12px] text-[#36454F]" />
                  }
                /> */}

                <ProfileField
                  className="hover:border-[#E4572E] hover:ring-[#FFE6DC] hover:ring-[4.5px]"
                  onClick={() => setTwoFAScreen(true)}
                  text="Enable two-factor authentication "
                  icon={<BsPhoneFill className="text-prm-red" />}
                  iconForward={<MdArrowForwardIos className="text-[12px] text-[#36454F]" />}
                />
              </div>
            </article>

            <article className="w-full p-5 bg-white h-fit rounded-2xl">
              <h1 className="pb-4 text-[#0D1415] text-[15px] leading-5 font-normal">Legal</h1>
              <div className="flex flex-col gap-[10px]">
                <ProfileField
                  className="hover:border-[#E4572E] hover:ring-[#FFE6DC] hover:ring-[4.5px]"
                  text="Privacy policy"
                  onClick={() => {
                    window.open(ROUTES.privacy, '_blank', 'noopener,noreferrer');
                  }}
                  icon={<RiEarthFill className="text-prm-red text-[20px]" />}
                  iconForward={<MdArrowForwardIos className="text-[12px] text-[#36454F]" />}
                />
                <ProfileField
                  className="hover:border-[#E4572E] hover:ring-[#FFE6DC] hover:ring-[4.5px]"
                  onClick={() => {
                    window.open(ROUTES.termsOfService, '_blank', 'noopener,noreferrer');
                  }}
                  text="Terms of service  "
                  icon={<BsPhoneFill className="text-prm-red" />}
                  iconForward={<MdArrowForwardIos className="text-[12px] text-[#36454F]" />}
                />
                <ProfileField
                  className="hover:border-[#E4572E] hover:ring-[#FFE6DC] hover:ring-[4.5px]"
                  onClick={() => {
                    window.open(ROUTES.cookies, '_blank', 'noopener,noreferrer');
                  }}
                  text="Cookies"
                  icon={<BsPhoneFill className="text-prm-red" />}
                  iconForward={<MdArrowForwardIos className="text-[12px] text-[#36454F]" />}
                />
              </div>
            </article>
          </div>
        </div>
      )}

      {/* setting transaction pin */}
      <Fragment>
        <OTPModal
          openOtpModal={openModals === 'transactionPin'}
          setModal={handleTransactionPinClose}
          otp={otp}
          setOTP={setOTP}
          modalTitle="Set your"
          modalTitleSpan=" transaction PIN"
          onClick={handleOpenConfirmTransaction}
          error={error}
        />

        <OTPModal
          openOtpModal={openModals === 'confirmTransactionPin'}
          setModal={() => setOpenModals('transactionPin')}
          otp={confirmOTP}
          setOTP={setConfirmOTP}
          modalTitle="Confirm"
          modalTitleSpan=" PIN"
          onClick={handleTransactionPin}
          error={error}
          processing={processing}
        />
      </Fragment>
      {/* setting transaction pin */}

      {/* Update transaction pin modal when user tries to update pin afer a sequence of chars have been set  */}
      <Fragment>
        <SixDigitOtpModal
          handleSubmit={handleSixDigitOTP}
          openOtpModal={openModals === 'sixDigitOtp'}
          otp={sixDigitPin}
          setOTP={setSixDigitPin}
          onClick={handleResendOTP}
          handleTransactionClose={handleTransactionPinClose}
        />
      </Fragment>
      {/* Update transaction pin modal when user tries to update pin afer a sequence of chars have been set  */}
    </DashboardWidth>
  );
};

export default Profile;

const ProfileField = ({
  text,
  icon,
  iconForward,
  onClick,
  className,
}: {
  iconForward?: ReactNode;
  text: string;
  icon: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  if (text)
    return (
      <div
        onClick={onClick}
        className={twMerge(
          `${
            iconForward ? 'cursor-pointer' : ''
          } p-4 h-[52px] flex items-center justify-between rounded-lg bg-[#FAFAFA] border border-[#F2F2F2]`,
          className
        )}
      >
        <div className="flex items-center gap-[10px]">
          <div className="size-5">{icon}</div>
          <p className="text-sm mobile:text-[15px] text-[#36454F] leading-[15px]">
            {text || 'N/A'}
          </p>
        </div>
        {iconForward && iconForward}
      </div>
    );
};

import OTPInput from 'react-otp-input';
import { ButtonBack } from '../../buttons/button-back';
import { FeedbackText } from '../feedback-text';
import { extractSvg } from '../../../../utils/helpers';
import { toast } from 'react-toastify';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { useStateWithSession } from '../../../../hooks/useStateWithSession';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { Switch } from '../../switch';

export const TwoFAScreen = ({
  setTwoFAScreen,
  switchState,
  setSwitchState,
}: {
  switchState: boolean;
  setSwitchState: Dispatch<SetStateAction<boolean>>;
  setTwoFAScreen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { value, setValue } = useStateWithSession(
    '2fa',
    sessionStorage.getItem('2fa') ? sessionStorage.getItem('2fa')! : ''
  );

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const axiosPrivate = useAxiosPrivate();

  const handle2FactorAuth = async () => {
    setLoading(true);
    const handleActivate2FactorAuth = async () => {
      try {
        setSwitchState(true);
        const res = await axiosPrivate.get('/user/enable/two-factor-auth/initiate');

        if (res?.status === 200) {
          setValue(res?.data?.data);
        } else {
          throw new Error();
        }
      } catch (error: any) {
        setSwitchState(false);
        toast.error(error?.response?.data?.message || 'Something went wrong', {
          toastId: '2fEnabled',
        });
      } finally {
        setLoading(false);
      }
    };
    const handleDeactivate2FactorAuth = async () => {
      try {
        setSwitchState(false);
        const res = await axiosPrivate.get('/user/disable/two-factor-auth');

        if (res.status === 200) {
          toast.success(res?.data?.data?.message || '2FA disabled successfully', {
            toastId: '2fa-disabled-success',
          });
          setValue('');
        } else {
          throw new Error();
        }
      } catch (error: any) {
        setSwitchState(true);
        toast.error(error?.response?.data?.message || 'Something went wrong', {
          toastId: '2fDisabled',
        });
      } finally {
        setLoading(false);
      }
    };

    if (!switchState) {
      handleActivate2FactorAuth();
    } else {
      handleDeactivate2FactorAuth();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    toast.info('Verifying code...', {
      toastId: 'verify-code',
    });
    try {
      const res = await axiosPrivate.post('/user/enable/two-factor-auth/finalize', {
        '2fa_code': otp,
      });
      if (res.status === 200) {
        toast.success(res?.data?.message || '2FA enabled succesfully', {
          toastId: 'activate2fa-finalized',
        });
      } else {
        throw new Error();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
      setSwitchState(false);
    } finally {
      setOtp('');
    }
  };

  function svgURL() {
    if (!value.qr_code_image) return '';
    const svgString = extractSvg(value.qr_code_image);
    const encodedSvg = encodeURIComponent(svgString);
    return `data:image/svg+xml,${encodedSvg}`;
  }

  return (
    <div className="pt-[160px] lg:pt-[90px] px-4 sm:px-10 xl:px-0 pb-10 w-full xl:w-[824px] 2xl:w-[920px] mx-auto">
      <header className="flex justify-between">
        <div>
          <ButtonBack onClick={() => setTwoFAScreen(false)} />
          <h1 className="pt-2 uppercase text-[15px] leading-[18px] text-prm-black">
            TWO-FACTOR AUTHENTICATION
          </h1>
        </div>
        <FeedbackText />
      </header>

      <div className="py-7 px-4 lg:px-20 xl:px-[140px] w-full  mt-10 rounded-2xl mx-auto bg-white">
        <div
          className={`flex flex-col-reverse md:flex-row items-start justify-center ${
            value && 'gap-[45px]'
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <p className="text-[15px] leading-5">Enable Two Factor Authentication</p>
              <div className="w-fit">
                <Switch switchState={switchState!} handle2FactorAuth={handle2FactorAuth} />
              </div>
            </div>
            <p className="text-[15px] leading-5 w-full sm:w-[340px]">
              Get verification code from an authenticator app such as Google Authenticator, it works
              even if your device is offline. Scan the QR Code.
            </p>

            {loading ? (
              <p className="blur-sm w-full sm:w-[340px]"></p>
            ) : (
              <p className="text-[15px] leading-5 w-full sm:w-[340px]">
                {value.secret ? (
                  <>
                    Enter this secret key to your Google Authenticator App -{' '}
                    <span className="">{value.secret}</span>
                  </>
                ) : (
                  ''
                )}
              </p>
            )}

            {value && (
              <form onSubmit={handleSubmit}>
                <p className="pb-[6px] text-[15px] leading-5 w-full sm:w-[340px]">
                  Enter authentication code
                </p>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  inputType="password"
                  renderInput={(props) => <input {...props} />}
                  inputStyle="otp-input-2"
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
            )}
          </div>

          <div className="space-y-4">
            {value ? (
              <img
                className={`p-[10px] border-[0.6px] w-full h-auto !max-w-[157px] !max-h-[157px] border-[#DEDEDE] rounded`}
                src={svgURL()}
                alt="qr_code"
              />
            ) : (
              <div className="hidden md:block size-[157px]"></div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 bg-[#FFFBF0] text-[15px] text-[#FD9C2B] rounded-lg p-4 w-fit mx-auto">
          If you having trouble using the QR code, select manual entry on your app.
        </div>
      </div>
    </div>
  );
};

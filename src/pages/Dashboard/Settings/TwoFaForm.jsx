import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { encodeSVG } from '@/lib/reusable';
import { useStore } from '@/store/store';
import { disable2fa, enable2fa, finalize2fa } from '@/utils/queries';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const TwoFaForm = () => {
  const { set2faData, twoFAData } = useStore((state) => state.setting);
  const { updateTwoFactorStatus } = useStore((state) => state.authActions);
  const { user } = useStore((state) => state.auth);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrcodeImage, setQrcodeImage] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const enable2faMutation = useMutation({
    mutationFn: enable2fa,
    onSuccess: (data) => {
      set2faData(data);
      updateTwoFactorStatus('enabled');
      setIs2FAEnabled(true);
      toast.success('2FA enabled successfully');
    },
    onError: (error) => {
      setIs2FAEnabled(false);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to enable 2FA'
      );
    },
  });

  const verify2faMutation = useMutation({
    mutationFn: finalize2fa,
    onSuccess: () => {
      updateTwoFactorStatus('enabled');
      setIs2FAEnabled(true);
      toast.success('2FA finalized successfully');
    },
    onError: (error) => {
      setIs2FAEnabled(false);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to enable 2FA'
      );
    },
  });

  const disable2faMutation = useMutation({
    mutationFn: disable2fa,
    onSuccess: () => {
      toast.success('2FA disabled successfully');
      set2faData(null);
      updateTwoFactorStatus('disabled');
    },
    onError: (error) => {
      setIs2FAEnabled(true);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to disable 2FA'
      );
    },
  });

  useEffect(() => {
    setIs2FAEnabled(user?.two_factor_enabled === 'enabled');
  }, [user?.two_factor_enabled]);
  useEffect(() => {
    if (is2FAEnabled && twoFAData) {
      const svgDataURL = encodeSVG(twoFAData?.qr_code_image);
      setQrcodeImage(svgDataURL);
    } else {
      setQrcodeImage(null);
    }
  }, [is2FAEnabled, twoFAData]);

  const handleToggle = async (checked) => {
    if (checked) {
      await enable2faMutation.mutateAsync();
    } else {
      await disable2faMutation.mutateAsync();
    }
  };

  const handleVerificationCodeChange = (e) => {
    const code = e.target.value;
    setVerificationCode(code);
    if (!user?.token) {
      toast.info('Unauthorized, please log in again.');
      return;
    }
    if (code.length === 6) {
      const formData = {
        '2fa_code': code,
      };
      verify2faMutation.mutateAsync(formData);
    }
  };

  return (
    <div className="gap-4 grid grid-cols-4 w-full">
      <h2 className="font-medium text-[16px] text-[#45464E] col-span-4 md:col-span-1">
        Two-factor Authentication
      </h2>

      <div className="flex flex-col col-span-4 md:col-span-2 items-start p-0 gap-5 grow w-full ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 grow w-full">
          <div className="flex flex-col gap-6 w-full">
            <p className="text-[14px] leading-[20px] text-[#536878]">
              Get verification code from an authenticator app such as Google
              Authenticator, it works even if your device is offline. Scan the
              QR Code.
            </p>

            <div className="flex gap-5 items-center ">
              <Label className="text-[14px] leading-[19px] text-[#2B2F32]">
                Enable Two-Factor Authentication
              </Label>

              <Switch
                disabled={
                  enable2faMutation.isPending || disable2faMutation.isPending
                }
                checked={is2FAEnabled}
                onCheckedChange={handleToggle}
                className="w-10 h-[14px]"
              />
            </div>
          </div>

          {qrcodeImage ? (
            <div className="flex flex-col gap-1 items-center">
              <img
                src={qrcodeImage}
                alt="QR Code"
                className="w-[144px] h-[144px]"
              />
              <p className="text-sm">or</p>
              {twoFAData?.secret && (
                <p className="text-sm">
                  Enter this secret key to your Google Authenticator App:{' '}
                  {twoFAData.secret}
                </p>
              )}
            </div>
          ) : (
            <div className=""></div>
          )}

          <div className="flex flex-col gap-2 w-full ">
            <Label className="text-[14px] leading-[20px] text-[#36454F]">
              Verification Code
            </Label>
            <div className="w-full ">
              <Input
                name="code"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                disabled={
                  enable2faMutation.isPending || disable2faMutation.isPending
                }
                className="border border-[#DEDEDE] w-full bg-white rounded-[6px]"
                maxLength={6}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFaForm;

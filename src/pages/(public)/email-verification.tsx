import { useEffect, useState } from 'react';
import { Container } from '../../components/global/Container';
import { Mail } from '../../components/svgs/auth/mail';
import { ButtonBack } from '../../components/ui/buttons/button-back';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTES } from '../../utils/route-constants';
import { MoonLoader, PulseLoader } from 'react-spinners';

const EmailVerification = () => {
  const [email] = useState(() => {
    if (localStorage.getItem('user_email')) {
      const dataFromStorage = localStorage.getItem('user_email')!;
      return dataFromStorage;
    } else {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [loadingResendLink, setLoadingResentLink] = useState(false);

  const { id, token } = useParams();
  const [searchParams] = useSearchParams();

  const signature = searchParams.get('signature');
  const expires = searchParams.get('expires');

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleResendEmailVerification = async () => {
    setLoadingResentLink(true);
    try {
      const res = await axiosPrivate.post('/email/resend', {
        email: email,
      });
      if (res.status === 200) {
        toast.success(res?.data?.data?.message);
      } else {
        throw new Error();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoadingResentLink(false);
    }
  };

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (token !== ':token' && id !== ':id') {
        try {
          setLoading(true);
          const res = await axiosPrivate.get(`/email/verify/${token}/${id}`, {
            params: {
              expires,
              signature,
            },
          });

          if (res.status === 200) {
            navigate(ROUTES.login);
          } else {
            throw new Error();
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
          setLoading(false);
        }
      }
    };
    handleVerifyEmail();
  }, []);

  return (
    <section className="bg-[#FCFAF6] min-h-screen w-full">
      {loading ? (
        <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <MoonLoader size={30} />
          <p className="text-center text-prm-black text-base md:text-lg">
            Verifying your email address
          </p>
        </div>
      ) : (
        <Container>
          <div className="top-[47px] left-4 absolute md:top-[146px] md:left-[100px]">
            <ButtonBack />
          </div>
          <div className="pt-[146px] px-4 sm:px-0 w-full sm:w-[438px] mx-auto text-center">
            <div className="mx-auto bg-white pt-[18.2px] pb-[25px] px-[22px] w-fit rounded-full">
              <Mail />
            </div>
            <h1 className="text-[26px] leading-[36px] font-medium text-prm-black">
              Check your inbox
            </h1>
            <p className="pt-4 pb-10 text-[#36454F] text-[15px] leading-[21px] font-normal">
              A verification email has been sent to your email{' '}
              <span className="text-prm-red"> {email}. </span> Please check your email and click on
              the link provided to complete your account registration.
            </p>
            <button
              disabled={loadingResendLink}
              onClick={handleResendEmailVerification}
              type="button"
              className="bg-prm-black disabled:opacity-80 disabled:cursor-not-allowed text-white py-3 mobile:px-10 sm:px-0 w-full mobile:w-fit sm:w-full rounded-full text-base leading-[22px] font-bold"
            >
              {loadingResendLink ? (
                <PulseLoader size={10} color="#ffffff" />
              ) : (
                'Resend verification email'
              )}
            </button>
          </div>
        </Container>
      )}
    </section>
  );
};

export default EmailVerification;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

import PhoneInput from 'react-phone-input-2';
import '../../styles/packages/phoneInput.css';
import { waitlist } from '../../assets/images';
import { Container } from '../../components/global/Container';

const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  country: z.string(),
  recipient_country: z.string().min(1, 'Recipient country is required'),
  question: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

const JoinWaitlist = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('44');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
  } = useForm<FormFields>({ resolver: zodResolver(schema), defaultValues: { country: 'GB' } });

  const formatPhoneNumber = (phone: string) => {
    const numericOnly = phone.replace(/\D/g, '');

    if (numericOnly.length >= 10) {
      return `(${numericOnly.slice(0, 3)}) ${numericOnly.slice(3, 6)}-${numericOnly.slice(6, 10)}`;
    }
    return phone;
  };

  const onSubmit = async (data: FormFields) => {
    setIsLoading(true);
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const payload = {
      ...data,
      phone_number: formattedPhoneNumber,
      country_code: countryCode,
      combined: `+${phoneNumber}`,
    };
    try {
      const response = await axios.post('https://api.sendsile.com/api/v1/wait-list/join', payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          channel: 'web',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (response.status === 201) {
        toast.success('Thank you for joining the waitlist!');
        navigate(-1);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);

      if (error?.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          setError(key as keyof FormFields, {
            message: value as string,
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (value: string, country: any) => {
    setPhoneNumber(value);
    setCountryCode(country.dialCode);
    setValue('phone_number', value);
  };

  return (
    <div className="bg-[#FCFAF6] py-16 lg:pt-28 min-h-screen">
      <nav className="mb-7">
        <Container>
          <div className="justify-between items-start flex-col px-4 lg:flex-row">
            <div
              onClick={() => navigate(-1)}
              className="text-[#E4572E] hover:text-[#FF7C55] duration-300 flex text-[15px] gap-2 items-center cursor-pointer mb-6 lg:mb-0"
            >
              <HiOutlineArrowNarrowLeft size={20} strokeWidth={1.5} />
              Go Back
            </div>
            <img src={waitlist} className="block mx-auto" alt="" />
            <div className="w-20"></div>
          </div>
        </Container>
      </nav>
      <Container>
        <div className="md:max-w-[606px] px-4 mx-auto w-full space-y-10">
          <div className="space-y-2">
            <h3 className="text-[#00070C] text-2xl lg:text-[40px] font-medium leading-[36px] lg:leading-[56px] text-center">
              Join the waitlist
            </h3>
            <p className="text-[#36454F] text-center leading-[22px]">
              To provide an exceptional experience from the start, we&apos;re rolling outSendsile
              gradually, so join our waitlist to be among the firstnotified when it officially
              launches.
            </p>
          </div>
          <FormBox
            onSubmit={handleSubmit(onSubmit)}
            className={`grid grid-cols-1 md:grid-cols-2 gap-3 bg-white py-6 px-4 lg:px-6 ${isLoading ? 'isLoading' : ''}`}
          >
            <FormInput>
              <label>First name</label>
              <input
                type="text"
                {...register('first_name')}
                className={errors.first_name ? 'border-red-500' : ''}
              />
              {errors.first_name && (
                <span className="text-red-500 text-sm">{errors.first_name.message}</span>
              )}
            </FormInput>

            <FormInput>
              <label>Last Name</label>
              <input
                type="text"
                {...register('last_name')}
                className={errors.last_name ? 'border-red-500' : ''}
              />
              {errors.last_name && (
                <span className="text-red-500 text-sm">{errors.last_name.message}</span>
              )}
            </FormInput>
            <FormInput className="md:col-span-2">
              <label>Email address</label>
              <input
                type="email"
                {...register('email')}
                placeholder="nedd@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </FormInput>
            <FormInput>
              <label>Country of Residence</label>
              <select {...register('country')}>
                <option value="CA">Canada</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="NG">Nigeria</option>
              </select>
            </FormInput>
            <FormInput>
              <label>Phone Number</label>
              <PhoneInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                masks={{
                  ng: '... ... ....',
                  gb: '.. .... ....',
                  us: '... ... ....',
                  ca: '... ... ....',
                }}
                placeholder=""
                containerClass="sign-up-phone-input"
                buttonClass="phone-input-drop"
                onlyCountries={['ng', 'gb', 'us', 'ca']}
                buttonStyle={{ backgroundColor: 'transparent', borderRight: 'none' }}
                country={'ng'}
              />
              {errors.phone_number && (
                <span className="text-red-500 text-sm">{errors.phone_number.message}</span>
              )}
            </FormInput>
            <FormInput className="md:col-span-2">
              <label>Where are you sending to?</label>
              <input
                type="text"
                {...register('recipient_country')}
                placeholder="Port harcourt, Rivers"
                className={errors.recipient_country ? 'border-red-500' : ''}
              />
              {errors.recipient_country && (
                <span className="text-red-500 text-sm">{errors.recipient_country.message}</span>
              )}
            </FormInput>
            <FormInput className="md:col-span-2">
              <label>Any question?</label>
              <textarea
                rows={5}
                {...register('question')}
                className={errors.question ? 'border-red-500' : ''}
              />
              {errors.question && (
                <span className="text-red-500 text-sm">{errors.question.message}</span>
              )}
            </FormInput>
            <div className="pt-9 md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="py-4 md:py-3 bg-prm-black disabled:opacity-90 disabled:cursor-not-allowed rounded-full text-white font-bold text-base leading-[22.5px] w-full"
              >
                {isLoading ? <PulseLoader size={10} color="#ffffff" /> : 'Submit'}
              </button>
            </div>
          </FormBox>
        </div>
      </Container>
    </div>
  );
};

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  label {
    margin-bottom: 0.5rem;
    font-size: 15px;
    line-height: 140%;
    font-weight: 400;
    color: #36454f;
  }

  input,
  select,
  .input-div {
    height: 48px;
  }

  textarea,
  input,
  select,
  .input-div {
    font-size: 14px;
    padding: 0.7rem 0.75rem;
    line-height: 140%;
    border: 1px solid #dedede;
    border-radius: 6px;
    width: 100%;
    background-color: #fff !important;
    outline: 0;
    resize: none;

    &:disabled {
      background-color: #f3f3f3 !important;
      cursor: not-allowed;
    }

    input,
    select,
    textarea {
      padding: 0 6px;
      border: 0;

      &:disabled {
        background-color: #d0d5dd !important;
      }
    }

    &::placeholder {
      color: #d2d2d2;
    }

    &:focus,
    &:focus-within {
      border-color: #ffa900;
      box-shadow: 0px 0px 0px 4.5px #fff3dc;
    }
  }

  .input-div:focus-within {
    input,
    select,
    textarea {
      box-shadow: none !important;
      border: 0 !important;
    }
  }

  @media (max-width: 768px) {
    input,
    select,
    .input-div {
      padding: 0.65rem 0.5rem;
    }
  }
`;

const boxLoader = keyframes`
  0% {
    transform: translateZ(0);
  }

  100% {
    transform: translate3d(280%, 0, 0);
  }
`;

const FormBox = styled.form`
  position: relative;
  overflow: hidden;

  &.isLoading {
    cursor: not-allowed;
    pointer-events: none;

    &::before {
      opacity: 1;
      cursor: not-allowed;
      z-index: 50;
      overflow: auto;
      content: '';
      position: absolute;
      height: calc(100% - 3px);
      width: 100%;
      bottom: 0px;
    }

    &::after {
      content: '';
      position: absolute;
      height: 3px;
      width: 40%;
      top: 0;
      left: -140px;
      animation: ${boxLoader} 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite alternate;
      background-color: #e2572e;
    }
  }
`;

export default JoinWaitlist;

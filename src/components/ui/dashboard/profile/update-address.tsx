import { FeedbackText } from '../feedback-text';
import { ButtonBack } from '../../buttons/button-back';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { InputField } from '../../auth/input-fields';
import { PulseLoader } from 'react-spinners';

const pinSchema = z.object({
  street_address: z.string(),
  region: z.string(),
  city: z.string(),
  country: z.string(),
});

type PinFormFields = z.infer<typeof pinSchema>;

export const UpdateAddress = ({
  // switchState,
  // setSwitchState,
  toggleChangeAddress,
}: {
  toggleChangeAddress: Dispatch<SetStateAction<boolean>>;
  setSwitchState: Dispatch<SetStateAction<boolean>>;
  switchState: boolean;
}) => {
  const [onSuccess, setSuccess] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PinFormFields>({
    resolver: zodResolver(pinSchema),
  });

  const axiosPrivate = useAxiosPrivate();

  const onSubmit: SubmitHandler<PinFormFields> = async ({
    street_address,
    region,
    city,
    country,
  }) => {
    try {
      const res = await axiosPrivate.post('/user/address', {
        street_address,
        region,
        city,
        country,
      });

      if (res.statusText === 'OK') {
        reset();
        setSuccess(res.data.message);
        // setTimeout(() => {
        //   setSuccess("");
        // }, 3000);
      }
    } catch (error: any) {
      setError('root', {
        message: error.response.data.message,
      });

      setTimeout(() => {
        setError('root', {
          message: '',
        });
      }, 3000);
    }
  };

  return (
    <div className="pt-[160px] lg:pt-[90px] px-4 sm:px-10 xl:px-0 pb-10 w-full xl:w-[824px] 2xl:w-[920px] mx-auto">
      <header className="flex justify-between">
        <div>
          <ButtonBack onClick={() => toggleChangeAddress(false)} />
          <h1 className="pt-2 uppercase text-[15px] leading-[18px] text-prm-black">
            CHANGE ADDRESS
          </h1>
        </div>
        <FeedbackText />
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pt-7 pb-[129px] px-3 sm:px-0 flex flex-col items-center justify-center gap-6 mt-10 rounded-2xl mx-auto bg-white"
      >
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="street_address" className="text-sm leading-5 font-normal text-[#36454F]">
            Delivery address
          </label>
          <InputField
            name="street_address"
            type="text"
            id="street_address"
            register={register}
            // errorActive={!!errors.email}
          />
        </div>
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="region" className="text-sm leading-5 font-normal text-[#36454F]">
            Region
          </label>
          <InputField
            name="region"
            type="text"
            id="region"
            register={register}
            // errorActive={!!errors.email}
          />
        </div>
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="city" className="text-sm leading-5 font-normal text-[#36454F]">
            City
          </label>
          <InputField
            name="city"
            type="text"
            id="city"
            placeholder=""
            register={register}
            // errorActive={!!errors.email}
          />
        </div>
        <div className="w-full mobile:w-[307px] flex flex-col gap-2">
          <label htmlFor="country" className="text-sm leading-5 font-normal text-[#36454F]">
            Country
          </label>
          <InputField
            name="country"
            type="text"
            id="country"
            placeholder=""
            register={register}
            // errorActive={!!errors.email}
          />
        </div>
        <button
          type="submit"
          className="mt-4 text-white bg-prm-black py-[10px] rounded-full w-full mobile:w-[307px]"
        >
          {isSubmitting ? <PulseLoader size={10} color="#ffffff" /> : 'Update Address'}
        </button>

        {errors.root && (
          <span className="-mt-4 text-prm-red text-sm text-center font-normal">
            {errors.root.message}
          </span>
        )}
        {onSuccess && (
          <span className="-mt-4 text-green-600 text-sm text-center font-normal">{onSuccess}</span>
        )}
      </form>
    </div>
  );
};

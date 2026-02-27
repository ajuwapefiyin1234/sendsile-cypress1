import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useCheckoutData } from '../../../../services/store/checkoutStore';
import PhoneInput from 'react-phone-input-2';
import { IoMdAdd } from 'react-icons/io';
import { FaMinus, FaRegBuilding } from 'react-icons/fa';
import { CiLocationOn } from 'react-icons/ci';
import { DeliveryDate } from './delivery-date';

export function DeliverToMe({
  addFlat,
  setFlat,
}: {
  addFlat: {
    deliverToMe: boolean;
    sendAsGift: boolean;
  };

  setFlat: Dispatch<SetStateAction<{ deliverToMe: boolean; sendAsGift: boolean }>>;
}) {
  const { formData, updateFormData } = useCheckoutData();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  return (
    <div className="pt-8 w-full px-4 md:px-0 sm:w-full md:w-full flex flex-col pb-6 gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="my-address"
          className="text-[#36454F] text-[17px] leading-6 md:text-sm font-normal md:leading-5"
        >
          Address
        </label>
        <div className="relative h-[52px] w-full rounded-md border border-[#D1D3D9]">
          <CiLocationOn className="absolute left-5 top-1/2 -translate-y-1/2 text-base text-[#CCC8BF]" />
          <input
            required
            onChange={(e) => handleChange(e)}
            name="address"
            type="text"
            value={formData.address}
            id="my-address"
            className="text-[#536878] focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] px-10 h-full w-full rounded-md outline-none"
          />
        </div>
      </div>
      <>
        {addFlat.deliverToMe ? (
          <>
            <div className="relative h-[52px] w-full rounded-md border border-[#D1D3D9]">
              <FaRegBuilding className="absolute left-5 top-1/2 -translate-y-1/2 text-base text-[#CCC8BF]" />
              <input
                required
                value={formData.flat}
                onChange={(e) => handleChange(e)}
                name="flat"
                type="text"
                className="text-[#536878] focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] px-10 h-full w-full rounded-md outline-none"
              />
            </div>
            <button
              onClick={() => setFlat({ ...addFlat, deliverToMe: false })}
              className="-mt-2 flex items-center gap-1 text-[#E4572E] font-medium text-sm leading-5"
            >
              <FaMinus className="text-xs" />
              <p>Remove</p>
            </button>
          </>
        ) : (
          <button
            onClick={() => setFlat({ ...addFlat, deliverToMe: true })}
            className="-mt-2 flex items-center gap-1 text-[#E4572E] font-medium text-base md:text-sm leading-5"
          >
            <IoMdAdd size={16} />
            <p>Add flat number, apartment, etc.</p>
          </button>
        )}
      </>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <label
            htmlFor="state"
            className="text-[#36454F] text-[17px] leading-6 md:text-sm font-normal md:leading-5"
          >
            State
          </label>
          <div className="h-[52px] md:h-[48px] w-full rounded-md border border-[#D1D3D9]">
            <input
              required
              onChange={(e) => handleChange(e)}
              name="state"
              type="text"
              id="state"
              value={formData.state}
              className="text-[#536878]  focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] px-4 h-full w-full rounded-md outline-none"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <label
            htmlFor="city"
            className="text-[#36454F] text-[17px] leading-6 md:text-sm font-normal md:leading-5"
          >
            City
          </label>
          <div className="h-[52px] md:h-[48px] w-full rounded-md border border-[#D1D3D9]">
            <input
              required
              name="city"
              onChange={(e) => handleChange(e)}
              value={formData.city}
              type="text"
              id="city"
              className="text-[#536878]  focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] px-4 h-full w-full rounded-md outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="phonenumber"
          className="text-[17px] md:text-sm leading-5 text-[#36454F] font-aeonikRegular"
        >
          Phone number
        </label>
        <PhoneInput
          value={formData.number}
          onChange={(value) => updateFormData('number', value)}
          placeholder=""
          containerClass="sign-up-phone-input"
          buttonClass="phone-input-drop"
          inputStyle={{ color: '#536878' }}
          onlyCountries={['ng', 'gb', 'us', 'ca']}
          buttonStyle={{
            backgroundColor: 'transparent',
            borderRight: 'none',
          }}
          country={'ng'}
        />
      </div>
      <DeliveryDate />
    </div>
  );
}

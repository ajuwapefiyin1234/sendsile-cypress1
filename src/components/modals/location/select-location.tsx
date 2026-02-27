import { CountryButton } from './button';
import { IoCloseOutline } from 'react-icons/io5';
import { Dispatch, SetStateAction } from 'react';
import { countries } from '../../../utils/constants';

export const SelectLocation = ({
  showModal,
  setLocationModal,
}: {
  showModal: boolean;
  setLocationModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={`overflow-hidden overlay fixed inset-0 ${
        showModal ? 'opacity-100 visible' : 'invisible opacity-0'
      } duration-100`}
    >
      <div
        onClick={() => setLocationModal(false)}
        className="bg-modalOverlay fixed inset-0 backdrop-blur-[2px]"
      ></div>

      <div className="top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-[999] fixed w-[90%] md:w-[649px] bg-white h-fit md:h-[429px] rounded flex flex-col md:flex-row">
        <div className="bg-[#F8F6F2] w-full md:w-[336px] py-10 md:pb-0 md:pt-[67px] px-8 text-[40px] leading-[44px] font-normal">
          <h1 className="w-[272px] md:w-auto font-medium">
            Select a <span className="font-besley italic">location</span>
          </h1>
          <p className="pt-4 md:pt-7  text-prm-black text-[20px] md:text-base leading-7 md:leading-[22.4px] font-normal">
            Choose a country or region to see content specific to the location you select
          </p>
        </div>
        <div className="pt-4 pb-[50px] md:pb-0 md:pt-[53px] relative flex flex-col gap-2 w-full md:w-[313px]">
          {countries.map((country, index) => {
            const { flag, countryName, value } = country;
            return (
              <CountryButton
                key={index}
                countryFlag={flag}
                countryName={countryName}
                value={value}
                setLocationModal={setLocationModal}
              />
            );
          })}

          <button
            onClick={() => setLocationModal(false)}
            className="absolute top-4 right-[14px] text-[24px] hidden md:block"
          >
            <IoCloseOutline />
          </button>
        </div>
      </div>
    </div>
  );
};

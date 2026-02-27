import { Dispatch, SetStateAction } from 'react';
import { useLocationState } from '../../../services/store/selectLocationStore';

export const CountryButton = ({
  countryFlag,
  countryName,
  value,
  setLocationModal,
}: {
  countryFlag: any;
  countryName: string;
  value: string;
  setLocationModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const location = useLocationState((state: any) => state.location);
  const updateLocation = useLocationState((state: any) => state.updateLocation);

  const handleUpdateLocation = () => {
    updateLocation(value);
    setLocationModal(false);
  };

  return (
    <button
      onClick={handleUpdateLocation}
      data-country={value}
      className={`${
        value === location ? 'bg-[#F9FAFB]' : ''
      } flex gap-4 items-center hover:bg-[#F9FAFB] pl-8 py-3 w-full`}
    >
      <img
        src={countryFlag}
        alt="country flag"
        className="s-8 rounded-full border-2 border-[#FFFFFF] shadow-[0px_2px_2px_0px_#26323826]"
      />
      <p className="font-medium text-[18px] leading-6 text-prm-black">{countryName}</p>
    </button>
  );
};

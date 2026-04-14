import { Fragment } from 'react/jsx-runtime';
import { useCheckoutData } from '../../../../services/store/checkoutStore';
import DatePicker from 'react-datepicker';
import { Calender } from '../../../../assets/images';

export function DeliveryDate() {
  const { formData, updateFormData } = useCheckoutData();
  const today = new Date();
  const currentDay = today.getDay();

  const isValidDeliveryDate = (date: Date) => {
    const day = date.getDay();

    if (day !== 2 && day !== 5) return false;

    const nextTuesday = new Date();
    nextTuesday.setDate(today.getDate() + ((2 - today.getDay() + 7) % 7 || 7));

    const nextFriday = new Date();
    nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7 || 7));

    if (currentDay >= 1 && currentDay <= 5) {
      return date >= nextTuesday || date >= nextFriday;
    } else if (currentDay === 0) {
      return date > nextTuesday || date >= nextFriday;
    } else if (currentDay === 6) {
      return true;
    }

    return false;
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="gift-address"
          className="text-[#36454F] text-[17px] leading-6 md:text-sm font-normal md:leading-5"
        >
          Choose a delivery date
        </label>
        <div className="border border-[#D1D3D9] rounded-md h-[52px] relative">
          <DatePicker
            required
            placeholderText="dd/mm/yy"
            className="min-w-full !min-h-full rounded-md px-4 text-sm placeholder:text-[#536878] outline-none focus-within:border focus-within:border-[#e4572e] focus-within:outline-[4.5px] focus-within:outline-[#ffe6dc] focus-within:rounded-[6px]"
            selected={formData.deliveryDate}
            onChange={(date: any) => updateFormData('deliveryDate', date)}
            minDate={new Date()}
            filterDate={isValidDeliveryDate}
          />
          <img
            src={Calender}
            alt="calender icon"
            className="absolute -translate-y-1/2 top-1/2 right-4"
          />
        </div>
      </div>
      <div className="w-full py-3 px-[14px] bg-[#FFF0E2] border-[0.5px] rounded border-prm-red">
        <p className="text-[15px] leading-5">
          Deliveries are available exclusively on <strong>Tuesdays</strong> and
          <strong> Fridays.</strong> Select a delivery date convenient for you. Please be available
          to pickup calls from our dispatch riders promptly.
        </p>
      </div>
    </Fragment>
  );
}

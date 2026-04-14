import { DashboardWidth } from '../../../components/global/dashboard-width';

import { PageHeader } from '../../../components/ui/dashboard/page-header';
// import { TabButton } from "../../../components/ui/tab/tab-button";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  // Naira,
  // UtilityImg,
  // UtilityImg2,
  // UtilityImg3,
  ComingSoon,
} from '../../../assets/images';
// import {
//   DISCOS,
//   networkProviderData,
//   networkProviderDataPlan,
//   utilityPlan,
// } from "../../../utils/constants";
// import { FormEvent, Fragment, useState } from "react";
// import { useEmblaCarouselDotButton } from "../../../hooks/useEmblaCarousel";
// import useEmblaCarousel from "embla-carousel-react";
// import CustomSelect from "../../../components/ui/dropdown/custom-select";
// import { Button } from "../../../components/buttons/button";
// import { InputField } from "../../../components/ui/auth/pay-bills/input-field";
// import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

// import { toast } from "react-toastify";
// import { PulseLoader } from "react-spinners";
// import { priceFormatter } from "../../../utils/helpers";
// import LazyImage from "../../../components/ui/lazy-image";
// import { MeterDetails } from "../../../types";

// const option3 = [
//   {
//     label: "Plan 1",
//     value: "plan1",
//   },
//   {
//     label: "Plan 2",
//     value: "plan2",
//   },
// ];

// const tabComtent = [
//   {
//     buttonText: "Utilities",
//     content: <Utilities />,
//   },
//   {
//     buttonText: "Airtime top-up",
//     content: <AirtimeTopUp />,
//   },
//   {
//     buttonText: "Data recharge",
//     content: <DataRecharge />,
//   },
// ];

const BillPayment = () => {
  // const [activeTab, setActiveTab] = useState<number>(0);
  // const handleClick = (index: number) => {
  //   setActiveTab(index);
  // };

  return (
    <DashboardWidth>
      <div className="px-4 md:px-10 pb-10 w-full xl:px-0 xl:w-[824px] 2xl:w-[920px] mx-auto">
        <PageHeader text="Bill payment" classname="text-2xl md:text-[32px]" />
        {/* <div className="flex gap-4 overflow-auto no-scrollbar">
          {tabComtent.map((tab, index) => {
            return (
              <TabButton
                handleClick={() => handleClick(index)}
                key={index}
                classname={`text-sm mobile:text-base md:text-[15px] leading-[22px] ${
                  activeTab === index
                    ? "text-white bg-[#E4572E]"
                    : "text-black bg-white"
                } transition-colors duration-200 font-normal rounded-full min-w-fit py-2 px-3 mobile:px-4 border-[0.75px] border-[#E6E3DD]`}
                text={tab.buttonText}
              />
            );
          })}
        </div>
        {tabComtent[activeTab].content} */}
        <div className="rounded-[20px] bg-white h-[337px] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-5">
            <img src={ComingSoon} alt="coming soon icon" />
            <h1 className="text-[#536878] text-base font-normal leading-6">Coming soon</h1>
          </div>
        </div>
      </div>
    </DashboardWidth>
  );
};

export default BillPayment;

// function Utilities() {
//   const [disco, setDisco] = useState("");
//   const [plan, setPlan] = useState("");
//   const [amount, setAmount] = useState("");
//   const [meterNo, setMeterNo] = useState("");
//   const [isSubmitting, setSubmitting] = useState(false);
//   const [meterDetails, setMeterDetails] = useState<MeterDetails>()

//   const axiosPrivate = useAxiosPrivate();

//   const onSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const res = await axiosPrivate.post("/utilities/electricity/validate-meter", {
//         meter_no: meterNo,
//         plan,
//         disco,
//         amount,
//       });

//       const data: MeterDetails = res?.data?.data;
//       if (res.status === 200) {
//         setMeterDetails(data);
//       }

//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || "Something went wrong", {
//         toastId: "initiate bills",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="mt-6 w-full px-5 py-4 bg-white rounded-[20px] flex gap-5 items-center laptop:gap-0 justify-between">
//       <form onSubmit={onSubmit} className=" w-full lg:w-1/2 xl:w-[403px]">
//         <div className="flex items-center justify-between font-medium text-prm-black">
//           {
//             meterDetails
//               ?
//               <div>
//                 <h2 className="text-[#00070C] text-lg font-medium">{meterDetails?.name_on_meter}</h2>
//                 <p className="text-[#00070C] text-sm !font-normal">{meterDetails?.address_on_meter}</p>
//               </div>
//               :
//               <h1 className="text-[18px] leading-[25px] font-medium">
//                 Buy electricity units
//               </h1>
//           }
//           <h1 className="text-2xl md:max-w-[200px] overflow-auto no-scrollbar md:text-[20px] leading-7 font-medium">
//             {isNaN(parseInt(amount))
//               ? "0.00"
//               : priceFormatter(parseInt(amount))}
//           </h1>
//         </div>
//         <div className="flex flex-col gap-8 pt-8 md:gap-6">
//           <div className="flex flex-col gap-2">
//             <label
//               htmlFor="meter-no"
//               className="text-[17px] md:text-[15px] leading-6 md:leading-[21px] text-prm-black font-normal"
//             >
//               Meter number
//             </label>
//             <Fragment>
//               <div className="h-[52px] md:h-11">
//                 <InputField
//                   id="meter-no"
//                   name="meterNo"
//                   type="text"
//                   onChange={(e) => {
//                     setMeterNo(e.target.value);
//                   }}
//                 />
//               </div>
//               {/* <span className="text-right uppercase flex justify-end pt-2 text-[#E4572E]">
//                 JOHN DOE
//               </span> */}
//             </Fragment>
//           </div>
//           <div className="flex flex-col gap-2">
//             <label
//               htmlFor="meter-no"
//               className="text-[17px] md:text-[15px] leading-6 md:leading-[21px] text-prm-black font-normal"
//             >
//               Select plan
//             </label>
//             <CustomSelect
//               value={plan}
//               handleSelect={setPlan}
//               option={utilityPlan}
//               placeholder=" Select plan"
//               placeholderStyles="text-[#536878] font-base leading-[22.4px] font-light"
//               classname="bg-[#F7F7F7] h-11"
//               arrowDown={<IoIosArrowDown />}
//               arrowUp={<IoIosArrowUp />}
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <label
//               htmlFor="meter-no"
//               className="text-[17px] md:text-[15px] leading-6 md:leading-[21px] text-prm-black font-normal"
//             >
//               Select distribution company
//             </label>

//             <CustomSelect
//               value={disco}
//               handleSelect={setDisco}
//               option={DISCOS}
//               placeholder=" Select DISCO"
//               placeholderStyles="text-[#536878] font-base leading-[22.4px] font-light"
//               classname="bg-[#F7F7F7] h-11 overflow-hidden text-ellipsis text-nowrap"
//               dropdownClass="text-wrap"
//               arrowDown={<IoIosArrowDown />}
//               arrowUp={<IoIosArrowUp />}
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <label
//               htmlFor="meter-no"
//               className="text-[17px] md:text-[15px] leading-6 md:leading-[21px] text-prm-black font-normal"
//             >
//               Amount
//             </label>
//             <div className="relative h-[52px] md:h-11 w-full border border-[#D1D3D9] focus-within:border focus-within:border-[#E4572E] focus-within:ring-[#FFE6DC] focus-within:ring-[4.5px]  rounded-md bg-[#F7F7F7] ">
//               <img
//                 src={Naira}
//                 alt="naira icon"
//                 className="absolute left-4 top-1/2 -translate-y-1/2 pr-[10px] border-r border-[#D1D3D9]"
//               />
//               <input
//                 onChange={(e) => {
//                   setAmount(e.target.value);
//                 }}
//                 className="w-full pl-[47px] pr-4 py-[13px] bg-transparent h-full rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
//                 placeholder="0.00"
//                 type="number"
//                 required
//               />
//               {
//                 amount && Number(amount) < 1100 &&
//                 <p className="text-sm font-medium text-red-600">Minimum amount to fund is 1,100 </p>
//               }
//             </div>
//           </div>
//         </div>
//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           buttonStyle="mt-[56px] md:mt-12 w-full py-3"
//         >
//           {isSubmitting ? (
//             <PulseLoader size={10} color="#ffffff" />
//           ) : (
//             "Make payment"
//           )}
//         </Button>
//       </form>

//       <LazyImage
//         src={UtilityImg}
//         alt="utitlity image"
//         className="hidden lg:flex lg:w-1/2 xl:w-[354px] h-[502px] my-[11px] object-cover rounded-xl object-center"
//       />
//     </div>
//   );
// }

// export const NetworkProvider = ({
//   icon,
//   text,
//   action,
//   active,
// }: {
//   icon: any;
//   text: string;
//   action: () => void;
//   active: boolean;
// }) => {
//   return (
//     <div
//       onClick={action}
//       className={`${active && "border border-prm-red shadow-[0px_1px_32px_8px_#50626C1A]"
//         } py-5 px-[10px] min-w-[150px] h-[160px] md:min-w-[188px] md:h-[176px] flex flex-col justify-center items-center md:items-start md:justify-between bg-white rounded-[20px]`}
//     >
//       <div className="flex flex-col items-start gap-6 ">
//         <img
//           src={icon}
//           alt="provider icon"
//           className="size-[62px] md:size-9 rounded"
//         />
//         <h1 className="hidden md:block text-prm-black font-medium text-[15px] leading-5">
//           {text}
//         </h1>
//       </div>

//       <button
//         onClick={() => action}
//         className="mt-6 hidden md:block border-[#757575] border-[0.75px] w-full text-sm font-medium rounded-full py-[6px]"
//       >
//         Buy now
//       </button>
//     </div>
//   );
// };

// function AirtimeTopUp() {
//   const [providerName, setProviderName] = useState("MTN Direct Top-up");
//   const [active, setActive] = useState(0);
//   const [emblaRef, emblaApi] = useEmblaCarousel();
//   const { onDotButtonClick, scrollSnaps, selectedIndex } =
//     useEmblaCarouselDotButton(emblaApi as any);

//   const handleOnSelect = (index: number, providerName: string) => {
//     setActive(index);
//     setProviderName(providerName);
//   };

//   return (
//     <section>
//       <div>
//         <div className="overflow-hidden" ref={emblaRef}>
//           <div className="flex items-start justify-between gap-6 mt-14">
//             {networkProviderData.map((data, index) => {
//               return (
//                 <NetworkProvider
//                   key={index + data.text}
//                   {...data}
//                   active={active === index}
//                   action={() => handleOnSelect(index, data.text)}
//                 />
//               );
//             })}
//           </div>
//         </div>
//         <div className="flex sm:hidden justify-center gap-[6px] items-center mt-5">
//           {scrollSnaps.map((_, index) => {
//             return (
//               <button
//                 onClick={() => onDotButtonClick(index)}
//                 key={index}
//                 className={`${index === selectedIndex
//                     ? "bg-prm-red w-9 h-[7px] rounded-lg"
//                     : "bg-[#D9D9D9] size-3 rounded-full"
//                   }`}
//               ></button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="mt-6 px-4 py-4 md:px-5 lg:py-4 flex gap-5 items-center rounded-[20px] laptop:gap-24 bg-white">
//         <div className="w-full lg:w-1/2 xl:w-[403px]">
//           <div className="flex items-center justify-between pb-10">
//             <h1 className="text-lg font-medium leading-6 md:text-base md:leading-6 text-prm-black">
//               {providerName}
//             </h1>

//             <h1 className="text-prm-black text-2xl md:text-[20px] md:leading-7 font-medium">
//               ₦0.00
//             </h1>
//           </div>
//           <div className="w-full">
//             <div className="space-y-6">
//               <div className="flex flex-col w-full gap-2">
//                 <label
//                   htmlFor="phone"
//                   className="text-[17px] leading-6 md:text-[15px] md:leading-5 text-prm-black font-normal"
//                 >
//                   Recipient’s phone number
//                 </label>
//                 <input
//                   className="w-full  p-4 bg-[#F7F7F7] h-[52px] md:h-11 focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] border border-[#D1D3D9] rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
//                   placeholder="0.00"
//                   type="tel"
//                   name="amount"
//                   id="meter-no"
//                   required
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label
//                   htmlFor="meter-no"
//                   className="text-[17px] leading-6 md:text-[15px] md:leading-5 text-prm-black font-normal"
//                 >
//                   Recharge amount
//                 </label>
//                 <div className="relative h-[52px] md:h-11 w-full border border-[#D1D3D9] rounded-md bg-[#F7F7F7] focus-within:border focus-within:border-[#E4572E] focus-within:ring-[#FFE6DC] focus-within:ring-[4.5px] ">
//                   <img
//                     src={Naira}
//                     alt="naira icon"
//                     className="absolute left-4 top-1/2 -translate-y-1/2 pr-[10px] border-r border-[#D1D3D9]"
//                   />
//                   <input
//                     className="w-full pl-[47px] pr-4 py-[13px] bg-transparent h-full rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
//                     placeholder="0.00"
//                     type="tel"
//                     name="amount"
//                     id="meter-no"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//             <Button buttonStyle="py-3 mt-8 w-full">Make payment</Button>
//           </div>
//         </div>
//         <LazyImage
//           src={UtilityImg2}
//           alt="image"
//           className="hidden lg:flex lg:w-1/2 xl:w-[354px] h-[317px] object-cover rounded-2xl"
//         />
//       </div>
//     </section>
//   );
// }
// function DataRecharge() {
//   const [providerName, setProviderName] = useState("MTN Mobile Data Plan");
//   const [active, setActive] = useState(0);
//   const [emblaRef, emblaApi] = useEmblaCarousel();
//   const { onDotButtonClick, scrollSnaps, selectedIndex } =
//     useEmblaCarouselDotButton(emblaApi as any);

//   const handleOnSelect = (index: number, providerName: string) => {
//     setActive(index);
//     setProviderName(providerName);
//   };

//   return (
//     <section>
//       <div>
//         <div className="overflow-hidden" ref={emblaRef}>
//           <div className="flex items-start justify-between gap-6 mt-14">
//             {networkProviderDataPlan.map((data, index) => {
//               return (
//                 <NetworkProvider
//                   key={index + data.text}
//                   {...data}
//                   active={active === index}
//                   action={() => handleOnSelect(index, data.text)}
//                 />
//               );
//             })}
//           </div>
//         </div>
//         <div className="flex sm:hidden justify-center gap-[6px] items-center mt-5">
//           {scrollSnaps.map((_, index) => {
//             return (
//               <button
//                 onClick={() => onDotButtonClick(index)}
//                 key={index}
//                 className={`${index === selectedIndex
//                     ? "bg-prm-red w-9 h-[7px] rounded-lg"
//                     : "bg-[#D9D9D9] size-3 rounded-full"
//                   }`}
//               ></button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="mt-6 px-4 py-4 md:px-5 lg:py-4 flex gap-5 items-center rounded-[20px] laptop:gap-24 bg-white">
//         <div className="w-full lg:w-1/2 xl:w-[403px]">
//           <div className="flex items-center justify-between pb-10">
//             <h1 className="text-lg font-medium leading-6 md:text-base md:leading-6 text-prm-black">
//               {providerName}
//             </h1>
//             <h1 className="text-prm-black text-2xl md:text-[20px] md:leading-7 font-medium">
//               ₦0.00
//             </h1>
//           </div>
//           <div className="w-full">
//             <div className="space-y-6">
//               <div className="flex flex-col w-full gap-2">
//                 <label
//                   htmlFor="phone"
//                   className="text-[17px] leading-6 md:text-[15px] md:leading-5 text-prm-black font-normal"
//                 >
//                   Recipient’s phone number
//                 </label>
//                 <input
//                   className="w-full  p-4 bg-[#F7F7F7] h-[52px] md:h-11 focus:border focus:border-[#E4572E] focus:ring-[#FFE6DC] focus:ring-[4.5px] border border-[#D1D3D9] rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
//                   type="tel"
//                   name="amount"
//                   id="meter-no"
//                   required
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label
//                   htmlFor="meter-no"
//                   className="text-[17px] leading-6 md:text-base md:leading-[22px] text-prm-black font-normal"
//                 >
//                   Select plan
//                 </label>
//                 <CustomSelect
//                   value=""
//                   handleSelect={() => ""}
//                   option={option3}
//                   placeholder=" Select option"
//                   placeholderStyles="text-[#536878] font-base leading-[22.4px] font-light"
//                   classname="bg-[#F7F7F7] h-11"
//                   arrowDown={<IoIosArrowDown />}
//                   arrowUp={<IoIosArrowUp />}
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label
//                   htmlFor="meter-no"
//                   className="text-[17px] leading-6 md:text-base md:leading-[22px] text-prm-black font-normal"
//                 >
//                   Recharge amount
//                 </label>
//                 <div className="relative h-[52px] md:h-11 w-full border border-[#D1D3D9] rounded-md bg-[#F7F7F7] focus-within:border focus-within:border-[#E4572E] focus-within:ring-[#FFE6DC] focus-within:ring-[4.5px] ">
//                   <img
//                     src={Naira}
//                     alt="naira icon"
//                     className="absolute left-4 top-1/2 -translate-y-1/2 pr-[10px] border-r border-[#D1D3D9]"
//                   />
//                   <input
//                     className="w-full pl-[47px] pr-4 py-[13px] bg-transparent h-full rounded-md outline-none text-base leading-[22px] text-prm-black font-normal placeholder:text-[#536878] placeholder:font-light"
//                     placeholder="0.00"
//                     type="tel"
//                     name="amount"
//                     id="meter-no"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Button buttonStyle="w-full mt-8 py-3">Make payment</Button>
//         </div>
//         <LazyImage
//           src={UtilityImg3}
//           alt="image"
//           className="hidden lg:flex lg:w-1/2 xl:w-[354px] h-[414px] object-cover rounded-2xl"
//         />
//       </div>
//     </section>
//   );
// }

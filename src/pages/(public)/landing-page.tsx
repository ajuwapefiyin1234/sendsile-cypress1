import { Hero } from '../../components/sections/Hero';
import Marquee from 'react-fast-marquee';
import LandingGrid from '../../components/ui/home/grid';
import { Description } from '../../components/sections/landing/description';
import { FarmProducts } from '../../components/sections/landing/farm-products';
import { Services } from '../../components/sections/landing/services';
import { Community } from '../../components/sections/landing/community';
import { Payment } from '../../components/sections/landing/payment';
import { Faq } from '../../components/sections/landing/faq';
import { useNavigate } from 'react-router-dom';
// import { SelectLocation } from "../../components/modals/location/select-location"
import { useEffect } from 'react';
import { useLocationState } from '../../services/store/selectLocationStore';
import { Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8, Img9 } from '../../assets/images';
import { useSetCategoryIdStore } from '../../services/store/categoryIdStore';
// import RamadanModal from "../../components/modals/ramadan"

const LandingPage = () => {
  const navigate = useNavigate();
  const { categoryID } = useSetCategoryIdStore();
  // const endDate = new Date('2025-03-29');
  // const currentDate = new Date();
  // const [isModalOpen, setIsModalOpen] = useState(false)
  // const modalRef = useRef<HTMLDivElement>(null)

  const setLocationModal = useLocationState((state: any) => state.updateModalOpen);

  // const showLocationModal = useLocationState((state: any) => state.isOpen)

  useEffect(() => {
    let locationTimer: any;

    const storedLocation = localStorage.getItem('location');
    const state = storedLocation ? JSON.parse(storedLocation).state : null;

    if (!state?.location) {
      locationTimer = setTimeout(() => {
        setLocationModal(true);
      }, 2000);
    }

    return () => clearTimeout(locationTimer);
  }, [setLocationModal]);

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //     setIsModalOpen(false)
  //   }
  // }

  // useEffect(() => {
  //   if (isModalOpen) {
  //     document.body.style.overflow = "hidden"
  //     document.addEventListener("mousedown", handleClickOutside)
  //   } else {
  //     document.body.style.overflow = "auto"
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //     document.body.style.overflow = "auto"
  //   }
  // }, [isModalOpen])

  // useEffect(() => {
  //   const isNotOpened = localStorage.getItem("ramadanModal") !== "true"
  //   if(isNotOpened){
  //     setIsModalOpen(true)
  //   }
  // }, [])

  // const handleClose = () => {
  //   setIsModalOpen(false)
  //   localStorage.setItem("ramadanModal", "true")
  // }

  return (
    <>
      <div className="bg-[#FEFFFE]">
        <div className="bg-[#F8F3F0]">
          <Hero
            classname="w-full max-w-[824px]"
            titleStyles="text-[54px] mobile:text-[64px] md:text-[96px] leading-[56px] md:leading-[112.2px] font-medium"
            spanStyles="text-[#FFA900] font-besley font-normal italic -leading-[56px] md:leading-[100.8px]"
            title="Bridging hearts across"
            titleSpan="miles"
            desc="We provide a compassionate hub for supporting loved ones through grocery delivery, bill payment, and meaningful causes during life's most challenging moments."
            btnText="Shop now"
            buttonAction={() => navigate(`/groceries?category=${encodeURIComponent(categoryID)}`)}
          />
          <div className="mt-16 lg:mt-[115px]">
            <Marquee autoFill={true}>
              <LandingGrid img1={Img1} img2={Img2} img3={Img3} text="COMMUNITY DONATIONS" />
              <LandingGrid img1={Img4} img2={Img5} img3={Img6} text="Grocery delivery" />
              <LandingGrid img1={Img7} img2={Img8} img3={Img9} text="Bill payment" />
            </Marquee>
          </div>
        </div>
        <Description />
        <FarmProducts />
        <Services />
        <Community />
        <Payment />
        <Faq />
      </div>
      {/* {
        <SelectLocation
          showModal={showLocationModal}
          setLocationModal={setLocationModal}
        />
      } */}
      {/* {isModalOpen && currentDate < endDate&& (
        <RamadanModal modalRef={modalRef} close={handleClose} />
      )} */}
    </>
  );
};

export default LandingPage;

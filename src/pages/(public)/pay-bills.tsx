// import { useState } from "react";
import { Container } from '../../components/global/Container';
// import {
//   Utilities,
//   AirtimeTopUp,
//   DataRecharge,
// } from "../../components/sections/pay-bills-tab/tab-content";
// import { TabButton } from "../../components/ui/tab/tab-button";
import ComingSoon from './ComingSoon';

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

const PayBills = () => {
  //   const [activeTab, setActiveTab] = useState<number>(0);

  //   const handleClick = (index: number) => {
  //     setActiveTab(index);
  //   };

  return (
    <section className="px-4 sm:px-10 md2:px-0 pb-20 md2:pb-[160px] bg-[#F1F0EB] w-full min-h-screen">
      <Container>
        <div className="pt-[160px] md2:pt-[180px] w-full md:w-[516px] md2:ml-[100px]">
          <h1 className="text-[48px] leading-[57px] md:text-[64px] md:leading-[77px] text-prm-black font-normal">
            Pay <span className="italic font-besley">bills</span> and{' '}
            <span className="italic font-besley">utlities</span>
          </h1>
          <p className="text-[20px] leading-7 text-[#36454F] font-normal pt-2">
            Shop affordable groceries for families and friends, anywhere around the world. Our
            network sources the freshest local produce, meats.
          </p>
        </div>

        <section className="md2:px-[100px] w-full">
          <ComingSoon />
          {/* <div className="flex overflow-auto no-scrollbar gap-4 mt-10">
            {tabComtent.map((tab, index) => {
              return (
                <TabButton
                  handleClick={() => handleClick(index)}
                  key={index}
                  classname={`text-base leading-[22px] ${
                    activeTab === index
                      ? "text-white bg-[#E4572E] font-medium"
                      : "text-black bg-white"
                  } transition-colors duration-200 font-normal min-w-fit rounded-full py-2 px-4 border-[0.75px] border-[#E6E3DD]`}
                  text={tab.buttonText}
                />
              );
            })}
          </div>
          <Fragment>{tabComtent[activeTab].content}</Fragment> */}
        </section>
      </Container>
    </section>
  );
};

export default PayBills;

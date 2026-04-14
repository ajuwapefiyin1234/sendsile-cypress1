import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IoSpeedometerSharp } from 'react-icons/io5';
import { BiSolidBowlHot } from 'react-icons/bi';
import { TbSnowflake } from 'react-icons/tb';

import { Container } from '../global/Container';
import { Accordion } from './Accordion';
import {
  connect1,
  connect2,
  okada,
  visa,
  uk,
  usa,
  canada,
  googleBtn,
  appleBtn,
  faq,
  footerblur,
  careWithSendsile,
} from '../../assets/images';

const Footer = () => {
  const questions = [
    {
      que: 'What is a Sendsile Agent, and how are they selected?',
      ans: 'Sendsile Agents are professionals carefully vetted through a rigorous selection process. This includes identity verification, background checks (including police clearance), and training on professionalism and safety. Only agents who meet our high standards are allowed on the platform.',
    },
    {
      que: 'How do I trust the agents working on Sendsile?',
      ans: 'Trust is at the core of Sendsile. All agents undergo background verification and must pass police checks before joining. Additionally, users can view agent ratings, reviews, and badges earned through our platform.',
    },
    {
      que: 'Can Sendsile Agents handle healthcare-related tasks?',
      ans: 'Yes, Sendsile Agents can assist with non-critical healthcare tasks such as delivering medications, accompanying loved ones to appointments, and providing basic caregiving services. For specialized care, we partner with qualified healthcare providers.',
    },
    {
      que: 'How quickly can I request a Sendsile Agent?',
      ans: 'You can request a Sendsile Agent instantly through the app. Depending on the service type and agent availability, most requests are fulfilled within a few hours.',
    },
    {
      que: 'What areas do Sendsile Agents operate in?',
      ans: ' Currently, Sendsile operates in key cities in Nigeria, including Lagos, Abuja, and Port Harcourt. We’re continuously expanding to more locations based on demand.',
    },
  ];
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    setActiveAccordion((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <div className="pt-10 lg:pt-20 bg-[#FEFFFE] ">
        <Container>
          <div className="px-4 lg:px-0">
            <div className="items-center flex-col text-center mb-14 max-w-[643px] mx-auto space-y-4 ">
              <h4 className=" text-gray-950 text-2xl lg:text-[42px] font-medium lg:leading-[54.60px]">
                Request . Pay . Deliver
              </h4>
              <p className="text-center text-custom-100 text-lg font-normal leading-6 lg:leading-[25.20px]">
                Providing care across miles to your loved ones is just as easy as texting them.{' '}
              </p>
            </div>

            <div className="items-center flex lg:justify-center gap-8 overflow-x-scroll lg:overflow-x-hidden">
              <div className="h-[400px] w-full min-w-[314px] lg:min-w-min lg:max-w-[314px] my-auto relative rounded-2xl bg-[#F7F7F7] pt-8 pb-4 px-5">
                <div className="h-full justify-between flex flex-col">
                  <div className="space-y-4">
                    <BiSolidBowlHot size={20} color="#00070C" />
                    <h6 className="text-black1 text-[22px] font-medium leading-[30.80px]">
                      Browse the app to find the service your loved one needs.
                    </h6>
                  </div>
                  <img src={connect1} alt="" />
                </div>
              </div>
              <div className="h-[400px] w-full min-w-[314px] lg:min-w-min lg:max-w-[314px] my-auto relative rounded-2xl bg-black pt-8 pb-4 px-5">
                <div className="h-full justify-between flex flex-col">
                  <div className="space-y-4">
                    <TbSnowflake size={20} color="#FFF" />
                    <h6 className="text-white text-[22px] font-medium leading-[30.80px]">
                      Diverse cross border payment options.
                    </h6>
                  </div>
                  <div className="w-full h-[164px] flex flex-col justify-between relative bg-gradient-to-b from-yellow-500 to-red-500 rounded-[10px] p-3">
                    <img src={visa} className="w-fit" alt="" />

                    <div className="items-center gap-3 justify-end flex">
                      <img src={usa} alt="" />
                      <img src={uk} alt="" />
                      <img src={canada} alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full min-w-[314px] lg:min-w-min lg:max-w-[314px] relative rounded-2xl pt-8 pb-4 px-5">
                <img src={connect2} className="absolute rounded-2xl h-full left-0 top-0" alt="" />
                <div className="h-full justify-between flex flex-col relative z-40">
                  <div className="space-y-4">
                    <IoSpeedometerSharp size={20} color="#FFF" />
                    <h6 className="text-white text-[22px] font-medium leading-[30.80px]">
                      Our Sendsile Agents complete requests with professionalism and care.
                    </h6>
                  </div>

                  <div className="bg-white rounded-[10px] p-3 space-y-8">
                    <div className="items-start justify-between flex">
                      <div className="items-center gap-2 py-2">
                        <IoSpeedometerSharp size={22} className="text-primary" />
                        <p className="w-[147px] text-gray-950 text-[17px] font-semiboldleading-normal">
                          Order Status
                        </p>
                      </div>
                      <img src={okada} alt="" />
                    </div>

                    <div>
                      <div className="w-full h-1.5 bg-zinc-100 rounded-[10px] flex-col justify-start items-start gap-1 flex mb-2">
                        <div className="w-[136px] grow shrink basis-0 bg-amber-500 rounded-[10px]" />
                      </div>
                      <p className=" text-slate-600 text-xs font-medium leading-none">
                        30 mins delivery time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container flex-col xl:flex-row py-14 px-4 xl:py-24 flex items-start justify-between gap-y-10 overflow-x-hidden ">
            <div className="flex w-full xl:w-4/12 items-start gap-4 relative ">
              <div className="space-y-4">
                <h4 className="text-2xl xl:text-[44px] font-medium leading-7 xl:leading-[52px] mb-4">
                  Some of the things you may want to know
                </h4>
                <p className="text-[#36454F] leading-[21px] xl:leading-[25px] text-[15px] xl:text-lg">
                  Explore answers without the need to pose the questions.
                </p>
              </div>
              <img src={faq} className="w-10 xl:w-auto xl:-ml-6 xl:mt-3" alt="" />
            </div>
            <div className="w-full md:w-[688px] flex flex-col gap-4">
              {questions.map((data, index) => {
                return (
                  <Accordion
                    classname="bg-[#F7F7F7] p-6"
                    titleStyle="text-[18px] leading-[25.2px]"
                    key={index + data.que}
                    title={data.que}
                    content={data.ans}
                    isActive={index === activeAccordion}
                    onClick={() => handleAccordionClick(index)}
                  />
                );
              })}
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-[#191C1F]">
        <div className="container pt-14 lg:pt-20">
          <footer>
            <section className="space-y-6 lg:space-y-10 mb-12 lg:mb-0">
              <h4 className="text-2xl lg:text-[48px] leading-7 lg:leading-[60px] font-bold text-center text-white w-full max-w-[600px] mx-auto">
                Unlock the convenience of catering to loved ones
              </h4>
              <div className="flex-col flex lg:flex-row items-center justify-center gap-4">
                <Link to="/join-waitlist">
                  <img src={googleBtn} className="w-36 lg:w-auto" alt="" />
                </Link>

                <Link to="/join-waitlist">
                  <img src={appleBtn} className="w-36 lg:w-auto" alt="" />
                </Link>
              </div>
              <small className="font-sm text-[#E5E9EE] block text-center">
                &copy; Sendsile {new Date().getFullYear()}. All Rights Reserved.
              </small>
            </section>
          </footer>
        </div>
        <div className="relative overflow-hidden">
          <img src={careWithSendsile} className="w-full" alt="" />
          <img src={footerblur} className="absolute right-0 top-0" alt="" />
        </div>
      </div>
    </>
  );
};

export default Footer;

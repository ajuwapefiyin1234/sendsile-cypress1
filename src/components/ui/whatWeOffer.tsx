import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { offer1, offer2, offer3, offer4 } from '../../assets/images';
const WhatWeOffer = () => {
  const [current, setCurrent] = useState(1);
  const whatWeOfferList = [
    {
      image: offer3,
      header: 'Quality laundry services for comfort',
      desc: 'Impeccable laundry services to keep your loved ones fresh and comfortable.',
      learnMore: '',
    },
    {
      image: offer1,
      header: 'Dedicated Elderly Care',
      desc: 'Compassionate caregivers to provide exceptional support to help your aged loved ones maintain independence with dignity.',
      learnMore: '',
    },
    {
      image: offer2,
      header: 'Premium Cleaning Services',
      desc: 'Spotless living spaces with our eco-friendly cleaning service delivered by certified professionals.',
      learnMore: '',
    },
    {
      image: offer4,
      header: 'Professional Health Support',
      desc: 'Experience medical care from licensed healthcare providers who come directly to you.',
      learnMore: '',
    },
  ];
  useEffect(() => {
    setTimeout(() => {
      setCurrent(current + 1);
    }, 8000);

    if (current > 3) setCurrent(1);
  }, [current]);
  return (
    <>
      <div className="items-center justify-between gap-8 !hidden md:!flex">
        <div className="space-y-10 ">
          {whatWeOfferList.map((item, index) => {
            return current === index + 1 ? (
              <ActiveText
                key={index}
                className={`max-w-md p-5 relative ${current === index + 1 ? 'active' : ''}`}
              >
                <div className="relative z-20 showText">
                  <h4 className="font-medium text-[22px] mb-2">{item.header}</h4>
                  <p className="text-[#536878] ">{item.desc}</p>
                  {/* <Link to={ROUTE.waitlist}>
                        <span className='text-[#FFA900] font-bold items-center gap-2 cursor-pointer'>
                          Learn more <FaArrowRightLong size={16} />
                        </span>
                      </Link> */}
                </div>
              </ActiveText>
            ) : (
              <h4
                key={index}
                className="font-medium text-[22px] px-5 cursor-pointer"
                onClick={() => setCurrent(index + 1)}
              >
                {item.header}
              </h4>
            );
          })}
        </div>
        <div className="">
          {whatWeOfferList.map((item, index) => {
            return (
              current === index + 1 && (
                <ShowImg
                  className=" rounded-2xl h-[205px] md:h-[337px] w-full lg:w-[650px] object-cover"
                  src={item.image}
                  alt=""
                  key={index}
                />
              )
            );
          })}
        </div>
      </div>

      <div className="space-y-6 bg-[#FFFBF3] block md:hidden">
        {whatWeOfferList.map((item, index) => {
          return (
            <div key={index}>
              <img src={item.image} alt="" className="w-full" />
              <ActiveText key={index} className={` p-5 relative bg-[#FEF5EA] rounded-b-lg`}>
                <div className="relative z-20 showText">
                  <h4 className="font-medium text-[17px] md:text-[22px] mb-2">{item.header}</h4>
                  <p className="text-[#536878] text-[15px] md:text-base ">{item.desc}</p>
                  {/* <Link to={ROUTE.waitlist} className='py-2 items-center'>
                      <span className='text-[#FFA900] font-bold items-center gap-2 cursor-pointer'>
                        Learn more <FaArrowRightLong size={16} />
                      </span>
                    </Link> */}
                </div>
              </ActiveText>
            </div>
          );
        })}
      </div>
    </>
  );
};

const changeBg = keyframes`
  from{
    top: -50%;
    opacity: 0;
  }
  to{
    top: 0;
    opacity: 1;
  }
`;

const showText = keyframes`
  from{
    /* top: -100%; */
    transform: translateY(-10px);
    opacity: 0;
  }
  to{
    transform: translateY(0px);
    /* top: 0; */
    opacity: 1;
  }
`;
const changeImg = keyframes`
  from{
    transform: translateX(50px);
    opacity: 0;
  }
  to{
    transform: translateX(0px);
    opacity: 1;
  }
`;

const ShowImg = styled.img`
  animation: ${changeImg} 0.3s linear;
`;
const ActiveText = styled.div`
  &.active {
    .showText {
      opacity: 1;
      animation: ${showText} 0.8s linear;
      /* animation-delay: 300ms; */
    }
    &::after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      background-color: #fef5ea;
      height: 100%;
      width: 100%;
      border-radius: 16px;
      animation: ${changeBg} 0.5s linear;
    }
  }
`;
export default WhatWeOffer;

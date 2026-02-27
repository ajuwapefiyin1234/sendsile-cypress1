import { useState } from 'react';
import { faqData } from '../../../utils/constants';
import { Container } from '../../global/Container';
import { Accordion } from '../../ui/Accordion';

export const Faq = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    setActiveAccordion((prev) => (prev === index ? null : index));
  };

  return (
    <Container>
      <div
        id="faq"
        className="flex flex-col gap-y-10 lg:gap-y-0 md:flex-row gap-[85px] px-4 lg:px-[100px] mt-[104px] lg:mt-[166px] mb-[43px] lg:mb-[88px]"
      >
        <div className="w-full md:w-[467px]">
          <h1 className="text-5xl md:text-[60px] leading-[52px] md:leading-[66px] text-black font-normal">
            Frequently asked <span className="italic font-besley">questions</span>{' '}
          </h1>
          <p className="pt-4 text-[20px] leading-7 md:leading-[31.2px] text-[#36454F] font-normal">
            Explore answers without the need to pose the questions.
          </p>
        </div>

        <div className="w-full md:w-[688px] flex flex-col gap-4">
          {faqData.map((data, index) => {
            return (
              <Accordion
                classname="bg-[#FAF5F1] p-6"
                titleStyle="text-[18px] leading-[25.2px]"
                key={index + data.title}
                title={data.title}
                content={data.content}
                isActive={index === activeAccordion}
                onClick={() => handleAccordionClick(index)}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
};

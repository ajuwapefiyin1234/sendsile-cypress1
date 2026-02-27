export const PaymentCard = ({
  title,
  desc,
  image,
  bgColor,
  bgInnerColor,
}: {
  title: string;
  desc: string;
  image: any;
  bgColor: string;
  bgInnerColor?: string;
}) => {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="px-[10px] w-full laptop:w-[375px] group relative h-[500px] mobile:h-[543px] rounded-[20px]"
    >
      <img
        className="group-first:h-[375px] group-even:absolute group-even:bottom-0 group-even:right-1 mobile:group-even:h-[600px] sm:group-even:h-[500px] md:group-even:h-auto group-last:pt-10 mobile:group-last:pt-20 md:group-last:pt-20 group-last:w-full group-last:h-[480px] xs:group-last:h-[380px] sm:group-last:h-[500px] md:group-last:h-[70%] md:group-last:w-auto group-last:object-contain md:group-last:object-cover object-cover object-center"
        src={image}
        alt="image"
      />
      <div
        style={{ backgroundColor: bgInnerColor }}
        className={`rounded-[10px] group-odd:bottom-[10px] group-odd:left-[10px] group-odd:right-[10px] absolute py-[18px] ${
          bgInnerColor
            ? 'pl-[18px] pr-[10px] lg:pr-[12px] h-fit mobile:h-[155px]'
            : 'pl-3 lg:pl-[18px] pr-2 lg:pr-[27px]'
        } `}
      >
        <h1
          className={`text-[22px] leading-[31px]  ${
            bgInnerColor ? 'text-prm-black' : 'text-[#E5EBEF]'
          } italic font-besley font-medium`}
        >
          {title}
        </h1>
        <p
          className={`text-lg lg:text-[17px] font-normal leading-[24px] ${
            bgInnerColor ? 'text-prm-black' : 'text-[#E5EBEF]'
          }  pt-4`}
        >
          {desc.includes('naira, dollars or pounds') ? (
            <>
              Pay easily online in <strong>naira, dollars or pounds</strong> —we handle the rest.
            </>
          ) : (
            desc
          )}
        </p>
      </div>
    </div>
  );
};

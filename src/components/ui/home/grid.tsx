import LazyImage from '../lazy-image';

const LandingGrid = ({
  img1,
  img2,
  img3,
  text,
}: {
  img1: any;
  img2: any;
  img3: any;
  text?: string;
}) => {
  return (
    <div className="ml-5 md:ml-[18px] flex items-start gap-5 md:gap-[20px]">
      <div className="relative h-[437px] w-[300px] md:h-[516px] md:w-[464px] rounded-2xl sm:rounded-[24px]">
        <LazyImage
          src={img1}
          alt="image"
          className="h-full w-full object-cover object-center rounded-2xl sm:rounded-[24px]"
        />

        <span className="uppercase absolute top-4 left-4 text-[#36454F] text-[13px] leading-[18.2px] py-[7px] px-4 bg-[#E4E4E4] rounded-full">
          {text}
        </span>
      </div>

      <div className="flex flex-col gap-[24px]">
        <LazyImage
          className="object-cover object-center h-[206px] w-[180px] md:w-[312px] md:h-[246px] rounded-2xl sm:rounded-[24px]"
          src={img2}
          alt="grid image"
        />

        <LazyImage
          className="object-cover object-center h-[206px] w-[180px] md:w-[312px] md:h-[246px] rounded-2xl sm:rounded-[24px]"
          src={img3}
          alt="grid image"
        />
      </div>
    </div>
  );
};

export default LandingGrid;

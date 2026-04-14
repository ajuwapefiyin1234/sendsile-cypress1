export const Hero = ({
  classname,
  titleStyles,
  spanStyles,
  title,
  titleSpan,
  desc,
  btnText,
  buttonAction,
}: {
  classname?: string;
  titleStyles?: string;
  spanStyles?: string;
  title: string;
  titleSpan: string;
  desc: string;
  btnText?: string;
  buttonAction?: () => void;
}) => {
  return (
    <section className={`${classname} px-4 lg:px-0 pt-[80px] mx-auto`}>
      <h1 className={`${titleStyles} text-center w-full`}>
        <span className="">{title}</span> <span className={`${spanStyles}`}>{titleSpan}</span>.
      </h1>
      <p className="hidden lg:block pt-4 text-center text-[#36454F] w-full font-normal text-[17px] md:text-2xl leading-[22px] md:leading-[28px]">
        {desc}
      </p>
      <p className="block lg:hidden pt-4 text-center text-[#36454F] w-full font-normal text-[20px] leading-[26px]">
        We provide a hub to support loved ones with food, health and personal care services
      </p>
      {btnText && (
        <button
          onClick={buttonAction}
          className="mt-6 font-bold text-[15px] leading-[21px] text-center mx-auto block hover:bg-white hover:text-prm-black text-white border-[0.75px] hover:border-[#74767E] transition-all duration-100 bg-[#000E25] rounded-[32px] py-4 px-[44px]"
        >
          {btnText}
        </button>
      )}
    </section>
  );
};

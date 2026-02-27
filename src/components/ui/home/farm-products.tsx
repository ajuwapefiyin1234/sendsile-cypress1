import { ImagePlaceholder } from '../image-placeholder';

export const FarmProduct = ({
  image,
  text,
  bg,
  classname,
  imageStyle,
  action,
}: {
  image: any;
  text: string;
  bg: string;
  classname: string;
  imageStyle?: string;
  action?: () => void;
}) => {
  return (
    <div onClick={action} className="h-full cursor-pointer">
      <div
        style={{ background: bg }}
        className={`${classname} flex flex-col items-start justify-center p-3`}
      >
        {image ? (
          <img
            className={`${imageStyle} block mx-auto w-full`}
            src={image}
            alt="farm product image"
          />
        ) : (
          <ImagePlaceholder className="sm:size-28" />
        )}
      </div>
      <p className="pt-[10px] text-wrap text-[#36454F] text-center text-base sm:text-sm leading-[20px] font-medium">
        {text}
      </p>
    </div>
  );
};

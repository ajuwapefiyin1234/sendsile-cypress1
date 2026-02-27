import { useState } from 'react';
import { priceFormatter } from '../../../utils/helpers';
import { Cart } from '../../svgs/cart';
import { FilterChip } from './filter-chip';
import { twMerge } from 'tailwind-merge';
import { ImagePlaceholder } from '../image-placeholder';

export const ProductCard = ({
  name,
  productImage,
  product_list,
  cardStyles,
  productPrice,
  action,
  onClick,
  imgStyle,
  textStyle,
}: {
  name: string;
  productImage: any;
  product_list?: string;
  cardStyles?: string;
  productPrice: number;
  action?: () => void;
  onClick: () => void;
  imgStyle?: string;
  textStyle?: string;
}) => {
  const [buttonHover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      className={twMerge(
        'pt-4 sm:pt-7 group pb-[10px] sm:pb-4 pl-4 sm:pl-3 pr-4 flex flex-col justify-between cursor-pointer rounded-[20px] bg-[#F7F7F7] h-[300px] sm:h-[400px] w-full',
        cardStyles
      )}
    >
      <div className="flex flex-col items-start gap-y-1">
        <h1 className="text-base leading-[22.4px] font-medium text-prm-black">{name}</h1>
        {product_list && (
          <h1 className="text-sm text-[#36454F] overflow-hidden line-clamp-2">{product_list}</h1>
        )}
      </div>
      {productImage ? (
        <img
          className={twMerge(
            'w-[100px] sm:w-auto sm:max-w-[60%] mx-auto object-contain  block group-hover:scale-110 sm:group-hover:scale-125 transition-all duration-200',
            imgStyle
          )}
          src={productImage}
          alt="Product image"
        />
      ) : (
        <ImagePlaceholder />
      )}

      <div className="flex flex-col-reverse items-center justify-between gap-2 sm:flex-row">
        <FilterChip
          action={action}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          classname="bg-white hover:bg-prm-black hover:text-white border-[#757575] justify-center sm: py-[10px] px-2.5 xs2:px-[14px] w-full sm:w-fit md:text-[15px] text-xs  md:leading-5"
          text="Add to bag"
          iconRight={
            <div className="w-4 h-[18px] mobile:w-4 mobile:h-[18px]">
              <Cart stroke={buttonHover ? '#ffffff' : '#354052'} />
            </div>
          }
        />
        <h1
          className={`${
            textStyle ? textStyle : 'text-[20px] xs:text-lg mobile:text-[20px]'
          } leading-7 text-[#270C04] font-bold sm:font-medium`}
        >
          {productPrice ? priceFormatter(productPrice, 2) : null}
        </h1>
      </div>
    </div>
  );
};

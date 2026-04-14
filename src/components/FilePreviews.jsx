import images from "@/assets/images";
import { convertFileToUrl } from "@/lib/reusable";
import PropTypes from "prop-types";
import { TbPlus } from 'react-icons/tb';

export const ProductNoFile = ({ name }) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="box-border border-dashed border border-[#A6A8B1] rounded-[12px] w-[200px] h-[194px] items-center justify-center flex">
        <div className="flex items-center w-full h-full justify-center">
          <img src={images.gallary} className="w-[70px] h-[70px]" />
        </div>
      </div>
      <div className="flex flex-col p-0 gap-0.5">
        <p className="text-[14px] leading-[20px] text-[#A6A8B1] w-full text-center">
          Drag and drop {name} logo here
        </p>
        <p className="w-full text-[14px] text-center text-[#A6A8B1]">or</p>
        <p className="font-medium text-center w-full text-[14px] leading-[20px] text-[#E4572E]">
          Browse image
        </p>
      </div>
    </div>
  );
};
ProductNoFile.propTypes = {
  name: PropTypes.string,
};

export const ProductFilePreview = ({ files, name }) => {
  // console.log('files', files);
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="box-border  w-[200px] h-[194px] items-center flex justify-center">
        <div className="flex items-center rounded-[12px] justify-center w-full h-full border-dashed border border-[#A6A8B1]">
          <img
            src={convertFileToUrl(files)}
            alt="upload image"
            className="overflow-hidden object-contain rounded-[12px]"
          />
        </div>
      </div>
      <div className="flex flex-col p-0 gap-0.5">
        <p className="text-[14px] leading-[20px] text-[#A6A8B1] w-full text-center">
          Drag and drop {name} logo here
        </p>
        <p className="w-full text-[14px] text-center text-[#A6A8B1]">or</p>
        <p className="font-medium text-center w-full text-[14px] leading-[20px] text-[#E4572E]">
          Browse image
        </p>
      </div>
    </div>
  );
};

ProductFilePreview.propTypes = {
  files: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  name: PropTypes.string,
};

export const NoProductImage = ({ main }) => (
  <div className="flex items-start gap-7 isolate w-[132px] h-[128.04px] ">
    <div className="box-border border-dashed border-[0.66px] rounded-[7.92px] w-full h-full">
      <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
        <TbPlus className="w-5 h-5 text-[#FFA900]" />

        <p className="text-[15px] leading-[21px] text-[#A6A8B1]">
          {main ? 'Main Image' : 'Image'}
        </p>
      </div>
    </div>
  </div>
);
NoProductImage.propTypes = {
  main: PropTypes.bool.isRequired,
};

export const ProductImagePreview = ({ files }) => {
  // console.log('files', files);
  return (
    <div className="flex items-start gap-7 isolate w-[132px] h-[128.04px]">
      <div className="box-border border-dashed border-[0.66px] rounded-[7.92px] w-full h-full">
        <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
          <img
            src={convertFileToUrl(files)}
            alt="upload image"
            className="overflow-hidden w-full h-full rounded-[7px]"
          />
        </div>
      </div>
    </div>
  );
};

ProductImagePreview.propTypes = {
  files: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

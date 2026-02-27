import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { IoStarSharp } from 'react-icons/io5';
import { Close } from '../svgs/farm-product/close';
import { Button } from '../buttons/button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../types';

export const ReviewModal = ({
  isReviewOpen,
  setReviewOpen,
  id,
  setIsReviewSubmitted,
}: {
  isReviewOpen: boolean;
  setReviewOpen: Dispatch<SetStateAction<boolean>>;
  setIsReviewSubmitted: Dispatch<SetStateAction<boolean>>;
  id: string | undefined;
}) => {
  const [rating, setRating] = useState(0);
  const [isProcessing, setProcessing] = useState(false);
  const [comment, setComment] = useState('');

  const axiosPrivate = useAxiosPrivate();

  const handleFeedbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await axiosPrivate.post(`/products/${id}/rate`, {
        rating,
        comment,
      });

      if (res.status === 201) {
        toast.success(res?.data?.data?.message || 'Feedback submitted successfully');
        setIsReviewSubmitted((prev) => !prev);
        setReviewOpen(false);
        setRating(0);
        setComment('');
      } else {
        throw new Error();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      toast.error(axiosError?.response?.data?.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={`${isReviewOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div
        onClick={() => setReviewOpen(false)}
        className="z-50 backdrop-blur-sm bg-reviewGradient fixed inset-0"
      ></div>
      <form
        onSubmit={handleFeedbackSubmit}
        className={`${
          isReviewOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-all duration-200 z-[99] bg-white w-[93%] md:w-[450px] pt-9 pb-7 px-5 rounded-xl fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 `}
      >
        <button
          type="button"
          onClick={() => setReviewOpen(false)}
          className="absolute top-[7px] right-[18px] bg-[#F6F1E8] p-[11px] rounded-full w-fit"
        >
          <div className="w-[18px] h-[18px] cursor-pointer">
            <Close />
          </div>
        </button>

        <p className="text-[24px] text-center leading-7 font-medium text-[#270C04]">
          Write a <span className="font-besley italic font-medium">review</span>
        </p>
        <div className="mt-[54px] mb-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="review"
              className="text-base leading-[22.4px] font-normal text-[#36454F]"
            >
              Write your review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              id="review"
              className="resize-none outline-none border border-[#DEDEDE] h-24 rounded-md p-3"
            ></textarea>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <h1>Rate this item</h1>
          <div className="py-3 flex gap-2 items-center">
            {[1, 1, 1, 1, 1].map((_, index) => (
              <IoStarSharp
                className="cursor-pointer"
                onClick={() => setRating(index + 1)}
                size={24}
                key={index}
                color={index + 1 <= rating ? '#FFA900' : '#DBDBDB'}
              />
            ))}
          </div>
        </div>
        <Button
          type="submit"
          disabled={isProcessing}
          buttonStyle="text-[15px] mt-9 bg-prm-black text-white w-full py-[17px] rounded-full"
        >
          {isProcessing ? <PulseLoader size={10} color="#ffffff" /> : 'Post your review'}
        </Button>
      </form>
    </div>
  );
};

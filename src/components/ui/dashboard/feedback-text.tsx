import { HiOutlineInformationCircle } from 'react-icons/hi';
import { Chat, Feedback, MailFast } from '../../../assets/images';
import { useEffect, useRef, useState } from 'react';
import { FeedbackModal } from '../../modals';

export const FeedbackText = () => {
  const [openBox, setBox] = useState(false);
  const [openModal, setModal] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleOnClick = (): void => {
    setBox(false);
    setModal(true);
  };

  const handleClickOutside = (e: MouseEvent | TouchEvent) => {
    if (boxRef.current && !boxRef.current.contains(e.target as Node)) setBox((prev) => !prev);
  };

  useEffect(() => {
    if (openModal) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'unset';
    }

    if (openBox) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openModal, openBox]);

  return (
    <>
      <div
        ref={boxRef}
        onClick={() => setBox(!openBox)}
        className="hidden lg:flex items-center gap-1 relative cursor-pointer"
      >
        <HiOutlineInformationCircle size={20} />
        <p className="select-none text-[20px] text-prm-black text-base leading-6 font-medium">
          Help & feedback
        </p>

        <div
          className={`w-[202px] h-[155px] flex flex-col z-50 absolute top-10 right-0 gap-1 bg-white rounded-lg border border-[#E3E6ED] shadow-[#00000014] shadow-sm ${
            openBox ? 'top-10 visible opacity-100' : 'top-4 invisible opacity-0'
          } transition-all duration-200 ease-in-out`}
        >
          <FeedBackActions icon={Chat} text="Live chat" action={() => setBox(false)} />
          <FeedBackActions
            icon={MailFast}
            text="Send us an email"
            action={() => {
              window.location.href = 'mailto:support@sendsile.com';
              setBox(false);
            }}
          />
          <FeedBackActions icon={Feedback} text="Submit your feedback" action={handleOnClick} />
        </div>
      </div>

      {/* feedback modal */}
      <FeedbackModal openModal={openModal} setModal={setModal} />
    </>
  );
};

const FeedBackActions = ({
  icon,
  text,
  action,
}: {
  icon: any;
  text: string;
  action: () => void;
}) => {
  return (
    <button onClick={action} className="flex items-center gap-1 hover:bg-gray-100 p-3">
      <img src={icon} alt="icons" />
      <p className="text-sm leading-6 text-[#36454F]">{text}</p>
    </button>
  );
};

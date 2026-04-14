import React from 'react';
import { TbX } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { fruits02, herobg } from '../../assets/images';

interface RamadanModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
  close: () => void;
}

const RamadanModal: React.FC<RamadanModalProps> = ({ modalRef, close }) => {
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    close();
    navigate('/#packages');
    localStorage.setItem('ramadanModal', 'true');
    setTimeout(() => {
      const section = document.getElementById('packages-section');
      if (section) {
        const offsetTop = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#222222] bg-opacity-50 transition-all duration-150">
      <div
        ref={modalRef}
        className="flex relative rounded-lg flex-col mx-2 bg-white max-w-[550px] w-full"
      >
        <div className="absolute z-20 cursor-pointer -right-5 -top-5" onClick={close}>
          <div className="bg-[#FFFFFF] p-2 rounded-full">
            <TbX size={24} />
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center w-full px-4 py-10 rounded-lg md:px-16 gap-y-2">
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundImage: `url(${herobg})`,
              backgroundSize: 'contain',
              backgroundPosition: 'top center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background:
                  'linear-gradient(179.13deg, rgba(255, 255, 255, 0) -19.69%, #FFFFFF 44.46%)',
              }}
            />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-y-2">
            <img
              src={fruits02}
              className="h-full w-full max-h-[187px] max-w-[320px]"
              alt="Ramadan fruits"
            />
            <span className="text-3xl text-center font-[500] text-[#0D1415]">
              Share the Blessings of{' '}
            </span>
            <span className="text-3xl text-center font-[500] italic text-[#FFA900] font-besley">
              Ramadan{' '}
            </span>
            <span className="text-[15px] text-center font-[400] text-[#536878]">
              Surprise your loved ones with fresh, handpicked fruits for their Iftar. Send love
              across miles with our special Ramadan fruit baskets.{' '}
            </span>
            <button
              onClick={handleClick}
              className="w-full py-4 items-center justify-center text-white bg-[#00070C] rounded-[32px] font-[700] tracking-wide text-base"
            >
              View ramadan packages
            </button>
            <span className="text-sm text-center font-[400] text-[#536878]">
              Orders must be placed at least 24 hours
              <br className="hidden md:block" /> in advance for scheduled delivery.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamadanModal;

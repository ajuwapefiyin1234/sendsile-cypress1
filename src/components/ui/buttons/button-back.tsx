import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '../../svgs/arrow-back';

export const ButtonBack = ({ onClick }: { onClick?: () => void }) => {
  const navigate = useNavigate();
  return (
    <button onClick={onClick ? onClick : () => navigate(-1)} className="flex items-center gap-1">
      <ArrowBack />
      <p className="text-sm leading-5 font-medium text-[#E4572E]">Back</p>
    </button>
  );
};

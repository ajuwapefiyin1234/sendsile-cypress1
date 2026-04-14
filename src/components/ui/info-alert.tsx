import { BsInfoCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const InfoAlert = ({
  message,
  urlRedirect,
  pathName,
}: {
  message: string;
  urlRedirect?: string;
  pathName?: string;
}) => {
  return (
    <div className="w-full flex items-start gap-3 p-4 border border-[#E3E6ED] rounded-lg">
      <div>
        <BsInfoCircle size={20} />
      </div>
      <p className="text-[15px] leading-5 font-normal">
        {message}
        {urlRedirect && (
          <Link target="_blank" to={urlRedirect} className="pl-[5px] text-[#E4572E] font-medium">
            {pathName}
          </Link>
        )}{' '}
      </p>
    </div>
  );
};

export default InfoAlert;

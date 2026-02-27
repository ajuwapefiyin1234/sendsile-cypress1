import { Link, useLocation } from 'react-router-dom';

export const Menu = ({
  text,
  iconActive,
  iconInActive,
  path,
  action,
}: // classname,
{
  path: string;
  text: string;
  iconActive: any;
  iconInActive: any;
  action?: () => void;

  // classname: string;
}) => {
  const { pathname } = useLocation();

  function checkPath(query: string) {
    if (query.includes('/dashboard/groceries')) {
      return '/dashboard/groceries';
    } else {
      return query;
    }
  }

  return (
    <Link
      onClick={action}
      to={path}
      className={` py-2 px-4 hover:bg-[#F7F5F2] text-prm-black font-normal text-[15px] leading-[21px] ${
        pathname === checkPath(path) ? 'bg-[#F7F5F2]' : "''"
      } rounded-lg w-full`}
    >
      <div className="flex gap-2 items-center">
        <div className="">{pathname === checkPath(path) ? iconActive : iconInActive}</div>
        <span>{text}</span>
      </div>
    </Link>
  );
};

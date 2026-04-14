import { Link, useNavigate } from 'react-router-dom';

const TimedBanner = () => {
  const endDate = new Date('2025-03-29');
  const currentDate = new Date();
  const navigate = useNavigate();

  if (currentDate > endDate) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/#packages');
    setTimeout(() => {
      const section = document.getElementById('packages-section');
      if (section) {
        const offsetTop = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="w-full transition-all duration-300 flex items-center justify-center h-[56px] bg-[#0D1415]">
      <span className="font-[500] text-center text-[#F9FAFB] text-sm md:text-base">
        Share <span className="text-[#FFA900] italic font-besley">Ramadan&apos;s</span> Blessings,
        One Fruit at a Time With Your Loved Ones.{' '}
        <Link to="/#packages" onClick={handleClick} className="underline font-[700]">
          View Packages
        </Link>
      </span>
    </header>
  );
};

export default TimedBanner;

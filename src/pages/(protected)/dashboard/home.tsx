import { DashboardWidth } from '../../../components/global/dashboard-width';
import {
  extractFirstName,
  getGreeting,
  priceFormatter,
  showCountryFlag,
} from '../../../utils/helpers';

import { useLocationState } from '../../../services/store/selectLocationStore';
import { TbCreditCardRefund } from 'react-icons/tb';
import { QuickAccess } from '../../../components/ui/dashboard/home/quick-access';
import { Basket, Bills, Gift } from '../../../assets/images';
import { Table } from '../../../components/ui/tables/table';
import { FeedbackText } from '../../../components/ui/dashboard/feedback-text';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { ROUTES } from '../../../utils/route-constants';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { userProfileState } from '../../../services/store/userProfileStore';
import { MoonLoader } from 'react-spinners';
import { FundWallet, PaymentMode } from '../../../components/modals/wallet';
import { useSetCategoryIdStore } from '../../../services/store/categoryIdStore';

const DashboardHome = () => {
  const location = useLocationState((state: any) => state.location);
  const setLocationModal = useLocationState((state: any) => state.updateModalOpen);
  const [balance, setBalance] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [noTransactions, setNoTransaction] = useState<boolean>();
  const [openWalletModal, setWalletModal] = useState('');
  const [walletData, setWalletData] = useState({
    amount: '',
    paymentMode: '',
  });
  const { userData } = userProfileState();
  const { categoryID } = useSetCategoryIdStore();

  const navigate = useNavigate();
  const userName = extractFirstName(userData.name);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getUserInfo() {
      setLoading(true);
      try {
        const res = await axiosPrivate.get('/user');
        if (res.status === 200) {
          setBalance(res?.data?.data?.balance);
          localStorage.setItem('2fa_enabled', res?.data?.data?.two_factor_enabled);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    const getAllTransactions = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get('/transactions');
        setData(Array.isArray(res?.data?.data) ? res.data.data.slice(0, 5) : []);
      } catch (error: any) {
        setNoTransaction(true);
      } finally {
        setLoading(false);
      }
    };

    getAllTransactions();
    getUserInfo();
  }, [axiosPrivate]);

  return (
    <DashboardWidth>
      <section className="px-4 lg:px-5 xl:px-0 pt-[90px] pb-10 w-full md:max-w-[824px] 2xl:max-w-[920px] mx-auto">
        <div className="pt-[52px] lg:pt-0 flex justify-between items-center">
          <h1 className="text-prm-black text-[32px] leading-9 font-medium">
            {getGreeting()},{' '}
            <span className="font-besley font-medium italic capitalize">{userName}!</span>
          </h1>
          <FeedbackText />
        </div>

        <div className="mt-6 md:mt-10 bg-white rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="pb-1 text-[#36454F] text-base leading-5 font-normal">Wallet balance</p>
              {loading ? (
                <Skeleton />
              ) : (
                <h1 className="font-bold text-[28px] leading-[33px] text-prm-black">
                  {priceFormatter(balance, 2) || 0.0}
                </h1>
              )}
            </div>
            <img
              onClick={() => setLocationModal(true)}
              src={showCountryFlag(location)}
              alt="country flag"
              className="s-[43px] cursor-pointer border-2 shadow-[0px_2px_2px_0px] shadow-[#26323826] rounded-full"
            />
          </div>
          <button
            onClick={() => setWalletModal('wallet')}
            className="mt-8 bg-[#E4572E] rounded-full py-2 px-4 flex  items-center gap-1"
          >
            <span className="text-white">Fund wallet</span>
            <TbCreditCardRefund className="text-white" size={24} />
          </button>
        </div>

        <div className="mt-10 bg-white rounded-2xl p-5">
          <h1 className="text-[17px] md:text-base text-prm-black leading-6 font-medium">
            Quick access
          </h1>
          <div className="mt-5 grid grid-cols-1 sm2:grid-cols-2 lg:grid-cols-3 gap-6 laptop:gap-0">
            <QuickAccess
              action={() =>
                navigate(`/dashboard/groceries?category=${encodeURIComponent(categoryID)}`)
              }
              icon={Basket}
              title="Buy groceries"
              text="Shop fresh, affordable farm fresh produce delivered to your doorstep."
            />
            <QuickAccess
              action={() => navigate(ROUTES.dashboardBillPayment)}
              icon={Bills}
              title="Pay bills"
              text="Pay your electricity bill, recharge your data and top-up your airtime."
            />
            <QuickAccess
              action={() => navigate(ROUTES.dashboardDonations)}
              icon={Gift}
              title="Make a donation"
              text="Donate and support a cause. Make a difference in your community today."
            />
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl p-5">
          <div className="flex justify-between">
            <h1 className="text-[17px] md:text-base text-prm-black leading-6 font-medium">
              Recent transactions
            </h1>
            <button
              onClick={() => navigate(ROUTES.dashboardTransactions)}
              className="text-[#E4572E] font-medium text-[17px] md:text-base leading-6"
            >
              See all
            </button>
          </div>
          {loading ? (
            <div className="mt-6 flex items-center justify-center">
              <MoonLoader size={25} />
            </div>
          ) : noTransactions ? (
            <Nodata />
          ) : (
            <Table data={data} showPagination={false} />
          )}
        </div>

        <FundWallet
          openModal={openWalletModal === 'wallet'}
          setModal={() => {
            setWalletModal('');
            setWalletData({
              amount: '',
              paymentMode: '',
            });
          }}
          walletData={walletData}
          setWalletData={setWalletData}
          onClick={() => setWalletModal('paymentMode')}
        />
        <PaymentMode
          openModal={openWalletModal === 'paymentMode'}
          setModal={() => setWalletModal('wallet')}
          walletData={walletData}
          setWalletData={setWalletData}
        />
      </section>
    </DashboardWidth>
  );
};

export default DashboardHome;

const Nodata = () => {
  return (
    <div className="py-[55px] w-[220px] mx-auto flex flex-col items-center justify-center">
      <div className="flex items-center flex-col  gap-6">
        <div className="size-12 rounded-md bg-[#C2C9D6]"></div>
        <p className="text-base leading-6 text-[#536878]">No recent transactions</p>
      </div>
    </div>
  );
};

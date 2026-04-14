import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

import { DashboardWidth } from '../../../components/global/dashboard-width';
import { FeedbackText } from '../../../components/ui/dashboard/feedback-text';
import { userProfileState } from '../../../services/store/userProfileStore';
import { extractFirstName, getGreeting, FormatCurrency } from '../../../utils/helpers';
import { TabButton } from '../../../components/ui/tab/tab-button';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { emptyorder } from '../../../assets/images';

const DashboardOrders = () => {
  const navigate = useNavigate();
  const { userData } = userProfileState();
  const userName = extractFirstName(userData.name);
  const [isLoading, setLoading] = useState(false);
  const [tableData, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  const axiosPrivate = useAxiosPrivate();
  const tabContent = ['all', 'ongoing', 'completed', 'cancelled'];

  const filteredData = tableData?.filter((item) => {
    if (activeTab === 1) return item?.details.status === 'processing';
    if (activeTab === 2)
      return item?.details.status === 'shipped' || item?.details.status === 'delivered';
    if (activeTab === 3) return item?.details.status === 'cancelled';
    return true;
  });

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/ramadan-packages');
    setTimeout(() => {
      const section = document.getElementById('packages-section');
      if (section) {
        const offsetTop = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    const getAllTransactions = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`/transactions`, {
          // params: {
          //     type: "Ramadan",
          // },
        });
        console.log(res);
        setData(res?.data?.data);
      } catch (error: any) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    getAllTransactions();
  }, []);

  const calculateQuantity = (item: any) => {
    const totalFees =
      Number(item?.details?.service_fee) +
      Number(item?.details?.delivery_fee) -
      Number(item?.details?.discount);
    const netValue = Number(item?.details?.total) - totalFees;
    const quantity = netValue / Number(item?.amount);

    return quantity.toLocaleString('en-US');
  };

  return (
    <DashboardWidth>
      <section className="px-4 lg:px-5 xl:px-0 pt-[90px] flex flex-col gap-y-10 pb-10 w-full md:max-w-[824px] 2xl:max-w-[920px] mx-auto">
        <div className="pt-[52px] lg:pt-0 flex justify-between items-center">
          <h1 className="text-prm-black text-[32px] leading-9 font-medium">
            {getGreeting()},{' '}
            <span className="italic font-medium capitalize font-besley">{userName}!</span>
          </h1>
          <FeedbackText />
        </div>
        <div className="flex flex-col items-start w-full gap-y-6">
          <div className="flex gap-2 overflow-auto sm:gap-4 no-scrollbar">
            {tabContent.map((tab, index) => {
              return (
                <TabButton
                  handleClick={() => handleClick(index)}
                  key={index}
                  classname={`text-sm capitalize mobile:text-base md:text-[15px] leading-[22px] ${activeTab === index ? 'text-white bg-[#E4572E]' : 'text-black bg-white'} transition-colors duration-200 font-normal rounded-full min-w-fit py-2 px-3 mobile:px-4 border-[0.75px] border-[#E6E3DD]`}
                  text={tab}
                />
              );
            })}
          </div>
          {isLoading ? (
            <div className="rounded-[20px] bg-white h-[337px] w-full flex-col gap-y-5 flex items-center justify-center">
              <MoonLoader size={25} />
              <p>Please wait</p>
            </div>
          ) : (
            <>
              {(!filteredData || filteredData?.length === 0) && (
                <div className="rounded-[20px] bg-white h-[337px] w-full flex-col gap-y-5 flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center gap-5">
                    <img src={emptyorder} className="h-[145px] w-[139px]" alt="empty order icon" />
                    <h1 className="text-[#536878] text-base font-normal leading-6">
                      No{' '}
                      {activeTab === 1
                        ? 'ongoing'
                        : activeTab === 2
                          ? 'completed'
                          : activeTab === 3
                            ? 'cancelled'
                            : ''}{' '}
                      order available
                    </h1>
                  </div>
                  <button
                    onClick={handleNavigate}
                    className="text-white text-base leading-6 bg-prm-black font-aeonikMedium py-2 px-[30px] rounded-full"
                  >
                    Shop Hampers
                  </button>
                </div>
              )}
              {filteredData?.length !== 0 && (
                <div className="flex flex-col items-start w-full gap-y-8">
                  {filteredData?.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col w-full bg-white border border-[#EBEAF2] overflow-hidden rounded-lg"
                    >
                      <div className="py-[10px] px-5 bg-[#FAFAFA] flex flex-col w-full justify-start gap-y-1">
                        <div className="flex flex-row items-center gap-x-2">
                          <span className="text-[14px] leading-5 font-[300] text-[#536878]">
                            Order ref:
                          </span>
                          <span className="text-[15px] leading-[21px] font-[400] text-[#536878]">
                            {item?.transaction_id}
                          </span>
                        </div>
                        <div className="flex flex-row items-center gap-x-2">
                          <span className="text-[14px] leading-5 font-[300] text-[#536878]">
                            Order status:
                          </span>
                          <span
                            className={`text-[15px] leading-[18px] font-[300] capitalize ${item?.status === 'delivered' ? 'text-[#12B76A]' : item?.status === 'processing' ? 'text-[#BC8034]' : 'text-[#E60026]'}`}
                          >
                            {item?.status}
                          </span>
                        </div>
                      </div>
                      <div className="py-[14px] px-5 bg-[#FFFFFF] flex flex-col w-full justify-start gap-y-1">
                        <div className="flex flex-col xs:flex-row items-start border-b md:border-b-0 pb-4 border-b-[#EBEAF2] justify-between w-full max-w-[596px]">
                          {item?.line_items?.length > 0 ? (
                            <div className="flex flex-col items-start w-full gap-y-12">
                              {item?.line_items.map((lineItem: any, index: number) => (
                                <div key={index} className="flex gap-5 md:gap-[100px] w-full">
                                  <div className="flex group justify-center items-center w-[120px] h-[120px] md:w-[160px] md:h-[160px] bg-[#F7F7F7] rounded-[2.5px]">
                                    <img
                                      src={lineItem?.image}
                                      className="h-full w-full max-h-[126px] max-w-[140px] md:max-h-[90px] md:max-w-[113px] object-contain"
                                      alt={lineItem?.product_name}
                                    />
                                  </div>
                                  <div className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row">
                                    <div className="flex flex-col gap-4 sm:gap-9">
                                      <span className="text-[16px] leading-[23px] font-[500] text-[#36454F]">
                                        {lineItem?.product_name}
                                      </span>
                                      <span className="text-[16px] leading-[23px] font-[400] text-[#36454F]">
                                        Qty: {lineItem?.quantity}
                                      </span>
                                    </div>
                                    <span className="text-[16px] leading-[23px] font-[500] text-[#36454F]">
                                      {FormatCurrency(lineItem?.price)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex gap-5 md:gap-[100px] w-full">
                              <div className="flex group justify-center items-center w-[120px] h-[120px] md:w-[160px] md:h-[160px] bg-[#F7F7F7] rounded-[2.5px]"></div>
                              <div className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row">
                                <div className="flex flex-col gap-4 sm:gap-9">
                                  <span className="text-[16px] leading-[23px] font-[500] text-[#36454F]">
                                    {item?.type}
                                  </span>
                                  <span className="text-[16px] leading-[23px] font-[400] text-[#36454F]">
                                    Qty: {calculateQuantity(item)}
                                  </span>
                                </div>
                                <span className="text-[16px] leading-[23px] font-[500] text-[#36454F]">
                                  {FormatCurrency(item?.amount)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-end justify-end w-full">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex flex-row items-center gap-x-2">
                              <span className="text-[13px] leading-[18px] font-[300] text-[#536878]">
                                Total price
                              </span>
                              <span className="text-[18px] leading-[26px] font-[400] text-[#36454F]">
                                {FormatCurrency(item?.net_value)}
                              </span>
                            </div>
                            <button
                              onClick={() => navigate(`/transactions/${item?.transaction_id}`)}
                              className="transition-all ease-in-out select-none font-normal text-prm-black flex items-center min-w-fit rounded-3xl border-[0.75px] border-[#E6E3DD] bg-white hover:bg-prm-black hover:text-white justify-center sm:py-[10px] px-2.5 xs2:px-[14px] w-full sm:w-fit text-[15px] mobile:text-[15px] leading-5"
                            >
                              View order
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </DashboardWidth>
  );
};

export default DashboardOrders;

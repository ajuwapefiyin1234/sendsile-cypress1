import images from "@/assets/images";
import SummaryCard from "@/components/SummaryCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbChevronDown, TbCopy, TbPrinter } from 'react-icons/tb';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import MobileRecieptTable from '@/components/Tables/MobileRecieptTable';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintableInvoice from '@/components/PrintableInvoice';
import Proptypes from 'prop-types';
import CancelOrderForm from '@/components/forms/CancelOrderForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus, viewOrderDetails } from '@/utils/queries';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SpinnerLoader from '@/components/loaders/SpinnerLoader';
import { format } from 'date-fns';
import { maskId } from '@/lib/reusable';
import { SUPER_ADMIN_ROUTES } from '@/routes/superAdminRoutes';
import { ROUTE } from '@/routes';

const mobileTableConfig = {
  image: 'productImage',
  title: 'product',
  subtitle: 'quantity',
  price: 'total',
  status: 'price',
  id: 'product',
};

const NoDetailsPage = ({ navigate, isSuperAdmin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <img src={images.noOrderEmptyState} className="w-20 h-20 mb-4" />
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        No Details Found
      </h1>
      <p className="mb-6 text-gray-500">
        Sorry, there seems to be no available information or details for this
        page.
      </p>
      <Button
        className="px-4 py-2 text-white rounded-lg "
        onClick={() =>
          navigate(
            isSuperAdmin
              ? SUPER_ADMIN_ROUTES.orderManagement
              : ROUTE.orderManagement
          )
        }
      >
        Go Back
      </Button>
    </div>
  );
};
NoDetailsPage.propTypes = {
  navigate: Proptypes.func.isRequired,
  isSuperAdmin: Proptypes.bool,
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  // Determine if the route is for the super admin
  const isSuperAdmin = location.pathname.includes('super-admin');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const printRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const statuses = [
    'Pending',
    'Completed',
    'Processing',
    'Cancelled',
    'Shipped',
  ];

  const {
    data: orderDetail,
    error,
    isLoading: isFetchingOrderDetail,
  } = useQuery({
    queryKey: ['orderDetail', id, isSuperAdmin],
    queryFn: () => viewOrderDetails(id, isSuperAdmin),
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Network error'
      );
    }
  }, [error]);

  const invoice = useMemo(
    () => ({
      orderId: orderDetail?.order_id || '',
      orderDate: orderDetail?.order_date
        ? format(new Date(orderDetail.order_date), 'MMMM d, yyyy')
        : 'N/A', // Provide a fallback value if the date is missing or invalid
      trackingId: orderDetail?.payment_reference || '9348drt37',
      summaryCardsData: [
        {
          icon: images.userIcon,
          heading: orderDetail?.customer_name || '',
          heading3: 'Email',
          status: orderDetail?.status || 'Pending',
          subtitle2: orderDetail?.customer_since || 'N/A', // Fallback for missing data
          subtitle3: orderDetail?.customer_email || '',
        },
        {
          icon: images.mapIcon,
          heading2: 'Delivery Address',
          heading3: 'Phone',
          subtitle2: orderDetail?.delivery_address || 'N/A',
          subtitle3: `+${orderDetail?.customer_phone || ''}`,
        },
        {
          icon: images.walletIcon,
          heading2: 'Payment Method',
          heading3: 'Delivery Date',
          subtitle2: orderDetail?.payment_method || 'N/A',
          subtitle3: orderDetail?.delivery_date || 'N/A'
        },
      ],
      ordersDetails: orderDetail?.order_details?.products || [],
      subtotal: orderDetail?.sub_total || '0.00',
      deliveryFee: orderDetail?.delivery_fee || '0.00',
      serviceFee: orderDetail?.service_fee || '0.00',
      total: orderDetail?.total || '0.00',
      total_items: orderDetail?.total_items || 0,
      discount: orderDetail?.discount || '0.00',
    }),
    [orderDetail]
  );

  const promiseResolveRef = useRef(null);
  const toastIdRef = useRef(null);
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Order Detail Slip',
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
        const loadingToastId = toast.loading('Printing invoice...');

        // Store the toast ID in a ref to update or remove it later
        toastIdRef.current = loadingToastId;
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
      toast.dismiss(toastIdRef.current); // Remove the loading toast
      toast.success('Printing successful');
    },
    onPrintError: () => {
      toast.dismiss(toastIdRef.current); // Remove the loading toast if an error occurs
      toast.error('Something went wrong');
    },

    preserveAfterPrint: true,
    suppressErrors: true,
  });

  const handleCopyClick = () => {
    const orderId = invoice.trackingId;
    navigator.clipboard
      .writeText(orderId)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy!');
      });
  };

  useEffect(() => {
    const updateSide = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', updateSide);
    updateSide(); // Initial call

    return () => {
      window.removeEventListener('resize', updateSide);
    };
  }, []);

  const changeStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
  });

  const changeStatus = async (status) => {
    if (isLoading) return;
    setIsLoading(true);
    const formValue = {
      order_id: id,
      status: status.toLowerCase(),
      isSuperAdmin: isSuperAdmin,
    };

    const submissionPromise = new Promise((resolve, reject) => {
      changeStatusMutation.mutate(formValue, {
        onSuccess: (data) => {
          queryClient.invalidateQueries(['orderDetail', 'orders']);
          resolve(data);
        },
        onError: (error) => {
          reject(error);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    });

    // Use toast.promise to handle the promise and show toast messages
    toast.promise(submissionPromise, {
      loading: 'Loading...',
      success: (data) => `Order status changed to ${data.status}`,
      error: (error) =>
        `Error: ${
          error?.response?.data?.message ||
          error.message ||
          'Error occurred while changing status'
        }`,
    });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {isFetchingOrderDetail ? (
        <div className="flex items-center justify-center w-full min-h-screen">
          <SpinnerLoader />
        </div>
      ) : error || !orderDetail ? (
        <NoDetailsPage navigate={navigate} />
      ) : (
        <>
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="sm:max-w-[426px]">
              <DialogHeader>
                <DialogTitle className="font-bold text-[22px] leading-[31px] text-[#45464E]">
                  Confirm Cancellation
                </DialogTitle>
              </DialogHeader>
              <CancelOrderForm setOpenModal={setOpenModal} />
            </DialogContent>
          </Dialog>
          <section
            style={{ display: isPrinting && isMobile ? 'none' : 'flex' }}
            className="flex flex-col md:flex-row justify-between items-center gap-6 rounded-[24px] w-full"
          >
            <div className="flex items-center gap-2.5 md:gap-6 flex-wrap w-full">
              <p className="text-[15px] leading-[21px] text-[#0D1415] font-medium">
                Order ID:{' '}
                <span className="text-[#8B909A]">
                  {maskId(invoice.orderId)}
                </span>
              </p>
              <p className="text-[15px] leading-[21px] text-[#0D1415] font-medium">
                Order Date:{' '}
                <span className="text-[#8B909A]">{invoice.orderDate}</span>
              </p>
              <div className="flex items-center gap-1">
                <p className="text-[15px] leading-[21px] text-[#0D1415] font-medium">
                  Tracking ID:{' '}
                  <span className="text-[#8B909A]">{invoice.trackingId}</span>
                </p>
                <TbCopy
                  className="text-[#E4572E] w-5 h-5 cursor-pointer"
                  onClick={handleCopyClick}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-end w-full gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="border-none ">
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    className="py-3 px-4 gap-2 border border-[#ECEEF4] bg-white rounded-[32px] font-medium text-[12px] md:text-[15px] text-[#0C1116] md:leading-[21px] leading-[16px]"
                  >
                    Change Status
                    <TbChevronDown className="w-5 h-5 text-[#8B909A]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[168px] bg-white gap-2.5 p-3"
                >
                  {statuses.map((status, index) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => changeStatus(status)}
                      className={`p-2 text-[14px] leading-[19px] text-[#8B909A] ${
                        statuses.length === index + 1
                          ? ''
                          : 'border-b border-[#ECEEF4]'
                      } `}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className="py-3 px-4 gap-2 border border-[#ECEEF4] bg-white rounded-[32px] font-medium text-[12px] md:text-[15px] text-[#0C1116] leading-[21px]"
                onClick={handlePrint}
                disabled={isLoading}
              >
                Print slip
                <TbPrinter className="w-5 h-5 text-[#8B909A]" />
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => setOpenModal(true)}
                className="py-3 px-4 gap-2 border border-[#ECEEF4] bg-[#00070C] rounded-[32px] font-medium text-[12px] md:text-[15px] text-white leading-[21px]"
              >
                Cancel Order
              </Button>
            </div>
          </section>
          <section
            style={{ display: isPrinting && isMobile ? 'none' : 'flex' }}
            className="flex flex-col py-3 gap-4 rounded-[8px]"
          >
            <div className="flex flex-col lg:flex-row items-start gap-[19px] w-full">
              {invoice.summaryCardsData.map((cardData, index) => (
                <SummaryCard key={index} {...cardData} />
              ))}
            </div>
          </section>
          <section
            style={{ display: isPrinting && isMobile ? 'none' : 'flex' }}
            className="flex items-start flex-col bg-white rounded-[8px] py-[15px]"
          >
            <header className="flex items-center pb-[15px] px-6 w-full rounded-[24px]">
              <h1 className="font-medium text-[16px] leading-[22px] text-[#45464E]">
                Items ({orderDetail?.total_items || 0})
              </h1>
            </header>
            <Table className="border-[#D0D5DD] hidden md:inline-table">
              <TableHeader>
                <TableRow className="border-t-0">
                  <TableHead className="p-6 font-medium text-[14px] leading-[19.6px] text-[#0D1415]">
                    Product
                  </TableHead>
                  <TableHead className="p-6 font-medium text-[14px] leading-[19.6px] text-[#0D1415]">
                    Quantity
                  </TableHead>
                  <TableHead className="p-6 font-medium text-[14px] leading-[19.6px] text-[#0D1415]">
                    Price(&#8358;)
                  </TableHead>
                  <TableHead className="p-6 font-medium text-[14px] leading-[19.6px] text-[#0D1415]">
                    Total(&#8358;)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.ordersDetails.map((orders, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-[15px] leading-[21px] font-normal text-[#8B909A] p-6">
                      <div className="flex items-center gap-4 p-0">
                        <img src={orders.image} alt="" className="w-8 h-8" />
                        {orders.product_name}
                      </div>
                    </TableCell>
                    <TableCell className="p-6 text-[15px] leading-[21px] font-normal text-[#8B909A]">
                      {orders.quantity}
                    </TableCell>
                    <TableCell className="p-6 text-[15px] leading-[21px] font-normal text-[#8B909A]">
                      {orders.price}
                    </TableCell>
                    <TableCell className="p-6 text-[15px] leading-[21px] font-normal text-[#8B909A]">
                      {orders.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-white border-[#ECEEF4]">
                <TableRow>
                  <TableCell
                    className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]"
                    colSpan={2}
                  >
                    <></>
                  </TableCell>
                  <TableCell className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]">
                    Subtotal
                  </TableCell>
                  <TableCell className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]">
                    {invoice.subtotal}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]"
                    colSpan={2}
                  >
                    <></>
                  </TableCell>
                  <TableCell className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]">
                    Delivery fee
                  </TableCell>
                  <TableCell className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]">
                    {invoice.deliveryFee}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]"
                    colSpan={2}
                  >
                    <></>
                  </TableCell>
                  <TableCell className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]">
                    Service fee
                  </TableCell>
                  <TableCell className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]">
                    {invoice.serviceFee}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]"
                    colSpan={2}
                  >
                    <></>
                  </TableCell>
                  <TableCell className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]">
                    Discount
                  </TableCell>
                  <TableCell className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]">
                    {invoice.discount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className="p-6 font-medium text-[15px] leading-[21px] text-[#8B909A]"
                    colSpan={2}
                  >
                    <></>
                  </TableCell>
                  <TableCell className="p-6 font-bold text-[16px] leading-[22.4px] text-[#0D1415]">
                    Total
                  </TableCell>
                  <TableCell className="p-6 font-bold text-[16px] leading-[22.4px] text-[#0D1415]">
                    {invoice.total}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <MobileRecieptTable
              data={invoice.ordersDetails}
              config={mobileTableConfig}
            />
          </section>

          {orderDetail && invoice && (
            <section
              style={{ display: isPrinting && isMobile ? 'block' : 'none' }}
            >
              <PrintableInvoice ref={printRef} invoiceDetail={invoice} />
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default OrderDetailsPage;

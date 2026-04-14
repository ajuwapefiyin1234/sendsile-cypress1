import React from "react";
import PropTypes from "prop-types";
import images from "@/assets/images";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QRCodeSVG } from 'qrcode.react';

const PrintableInvoice = React.forwardRef(({ invoiceDetail }, ref) => {
    const generateQRCodeData = () => {
      return JSON.stringify({
        orderId: invoiceDetail.orderId,
        trackingId: invoiceDetail.trackingId,
        total: invoiceDetail.total,
        orderDate: invoiceDetail.orderDate,
      });
    };
  return (
    <div
      ref={ref}
      className="w-full flex-col gap-5 flex justify-center items-center p-6 bg-[#F4F5FA] min-h-screen h-full"
    >
      {/* Render the invoice details here as needed */}
      <section className="px-4 flex justify-between items-start w-full">
        <div className="flex justify-center items-start gap-1">
          <img
            src={images.dashboardLogo}
            alt="logo"
            className="w-[48px] h-[33.73px]"
          />

          <div className="flex flex-col items-start gap-0.5">
            <h1 className="font-bold text-[18px] leading-[22px] text-[#1A1C21]">
              Sendsile
            </h1>

            <p className="text-[10px] leading-[14px] text-[#5E6470]">
              www.sendsile.com
            </p>

            <p className="text-[10px] leading-[14px] text-[#5E6470]">
              hello@sendsile.com
            </p>
            <p className="text-[10px] leading-[14px] text-[#5E6470]">
              +2348065650633
            </p>
          </div>
        </div>

        {/* <div>
          <img src={images.qrcode} alt="qrcode" className="w-[79px] h-[79px]" />
        </div> */}
        <div>
          <QRCodeSVG value={generateQRCodeData()} size={79} />
        </div>
      </section>

      <section className="w-full bg-[#FFFFFF] rounded-[8px] py-5 px-4 flex flex-col gap-5 relative ">
        <div className="w-full flex justify-between items-start">
          <div className="flex flex-col items-start gap-1 w-1/3">
            <p className="text-[10px] leading-[14px] text-[#5E6470]">
              Shipped to,
            </p>
            <div className="flex flex-col items-start p-0 gap-0.5">
              <h4 className="font-bold text-[#1A1C21] text-[10px] leading-[14px]">
                {invoiceDetail?.summaryCardsData[0]?.heading || 'N/A'}
              </h4>
              <p className="text-[#5E6470] text-[10px] leading-[14px] max-w-[145px]">
                {invoiceDetail?.summaryCardsData[1]?.subtitle2 || 'N/A'}
              </p>
              <p className="text-[#5E6470] text-[10px] leading-[14px] max-w-[145px]">
                {invoiceDetail?.summaryCardsData[0]?.subtitle2 || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 w-1/3">
            <p className="text-[10px] text-[#5E6470] leading-[14px]">
              Invoice number
            </p>
            <h4 className="font-bold text-[#1A1C21] text-[10px] leading-[14px]">
              {invoiceDetail?.orderId || '#AB2324-01'}
            </h4>
          </div>
          <div className="flex flex-col items-end gap-0.5 w-1/3">
            <p className="text-[#5E6470] text-[10px] leading-[14px] text-right">
              Invoice of (NGN)
            </p>

            <h2 className="font-bold text-[20px] leading-[28px] text-right text-[#E87117]">
              &#8358;{invoiceDetail?.total || 'N/A'}
            </h2>
          </div>
        </div>

        <div className="w-full flex justify-between items-start">
          <div className="flex flex-col items-start gap-0.5 w-1/3">
            <p className="text-[#5E6470] text-[10px] leading-[14px]">
              Tracking ID
            </p>
            <h4 className="font-bold text-[10px] leading-[14px] text-[#1A1C21]">
              {invoiceDetail?.trackingId || 'N/A'}
            </h4>
          </div>

          <div className="flex flex-col items-start gap-0.5 w-1/3">
            <p className="text-[#5E6470] text-[10px] leading-[14px]">
              Payment method
            </p>
            <h4 className="font-bold text-[10px] leading-[14px] text-[#1A1C21] capitalize">
              {invoiceDetail?.summaryCardsData[2]?.subtitle2 || 'N/A'}
            </h4>
          </div>
          <div className="flex flex-col items-end gap-0.5 w-1/3">
            <p className="text-[#5E6470] text-[10px] leading-[14px] text-right">
              Order date
            </p>
            <h4 className="font-bold text-[10px] leading-[14px] text-[#1A1C21] text-right">
              {invoiceDetail?.orderDate || 'N/A'}
            </h4>
          </div>
        </div>

        {/* table construction */}
        <Table className="border-[#D0D5DD]  inline-table">
          <TableHeader className="border-none">
            <TableRow className="border-t-[0.5px] border-l-0 border-r-0">
              <TableHead className="p-2 h-6 text-[8px] text-[#5E6470]">
                ITEM DETAIL
              </TableHead>
              <TableHead className="p-2 h-6 text-[8px] text-[#5E6470]">
                QTY
              </TableHead>
              <TableHead className="p-2 h-6 text-[8px] text-[#5E6470] text-right">
                RATE(&#8358;)
              </TableHead>
              <TableHead className="p-2 h-6 text-[8px] text-[#5E6470] text-right">
                AMOUNT(&#8358;)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-none ">
            {invoiceDetail?.ordersDetails.map((orders, index) => (
              <TableRow key={index} className="border-none">
                <TableCell className="font-bold text-[10px] text-[#1A1C21] p-2">
                  {orders.product_name}
                </TableCell>
                <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2">
                  {orders.quantity}
                </TableCell>
                <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2 text-right">
                  {orders.price}
                </TableCell>
                <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2 text-right">
                  {orders.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-white border-[#ECEEF4]">
            <TableRow className="border-x-0 ">
              <TableCell
                className="font-normal text-[10px] text-[#1A1C21] p-2 "
                colSpan={2}
              >
                <></>
              </TableCell>
              <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2">
                Subtotal
              </TableCell>
              <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2 text-right">
                {invoiceDetail?.subtotal}
              </TableCell>
            </TableRow>
            <TableRow className="border-none">
              <TableCell
                className="font-normal text-[10px] text-[#1A1C21] p-2 "
                colSpan={2}
              >
                <></>
              </TableCell>
              <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2 ">
                Delivery fee
              </TableCell>
              <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2 text-right">
                {invoiceDetail?.deliveryFee}
              </TableCell>
            </TableRow>
            <TableRow className="border-none">
              <TableCell
                className="font-normal text-[10px] text-[#1A1C21] p-2 "
                colSpan={2}
              >
                <></>
              </TableCell>
              <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2 ">
                Service fee
              </TableCell>
              <TableCell className="font-normal text-[10px] text-[#1A1C21] p-2 text-right">
                {invoiceDetail?.serviceFee}
              </TableCell>
            </TableRow>
            <TableRow className="border-none">
              <TableCell
                className="font-normal text-[10px] text-[#1A1C21] p-2 "
                colSpan={2}
              >
                <></>
              </TableCell>
              <TableCell className="border-t-[0.5px] text-[10px] text-[#1A1C21] p-2 font-bold">
                Total
              </TableCell>
              <TableCell className="border-t-[0.5px] text-[10px] text-[#1A1C21] p-2 text-right font-bold">
                {invoiceDetail?.total}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <div className="absolute bottom-5 ">
          <h2 className="text-[#1A1C21] text-[10px] leading-[14px] font-bold">
            Thanks for the business.
          </h2>
        </div>
      </section>
    </div>
  );
});

PrintableInvoice.displayName = 'PrintableInvoice';

PrintableInvoice.propTypes = {
  invoiceDetail: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    trackingId: PropTypes.string.isRequired,
    summaryCardsData: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        heading: PropTypes.string,
        heading2: PropTypes.string,
        heading3: PropTypes.string,
        status: PropTypes.string,
        subtitle: PropTypes.string,
        subtitle2: PropTypes.string,
        subtitle3: PropTypes.string,
      })
    ).isRequired,
    ordersDetails: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.string.isRequired,
        total: PropTypes.number.isRequired,
      })
    ).isRequired,

    subtotal: PropTypes.string.isRequired,
    deliveryFee: PropTypes.string.isRequired,
    serviceFee: PropTypes.string.isRequired,
    total: PropTypes.string.isRequired,
  }).isRequired,
};

export default PrintableInvoice;

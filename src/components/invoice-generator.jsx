"use client";
import { useState, useRef } from "react";
import { Printer, Download, Mail, CheckCircle, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import logo from "@/public/logo.png";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

export default function InvoiceGenerator({ order }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const invoiceRef = useRef(null);

  const handlePrint = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const originalContent = document.body.innerHTML;
      const printContent = invoiceRef.current.innerHTML;
      document.body.innerHTML = `
        <style>
          @media print {
            body { 
              padding: 2vw;
              color: #000;
              background-color: #fff;
              font-size: 12px;
            }
            button { 
              display: none !important; 
            }
            .invoice-container {
              max-width: 100%;
            }
          }
        </style>
        <div>${printContent}</div>
      `;
      window.print();
      document.body.innerHTML = originalContent;
      setIsGenerating(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const generateDeliveryQR = () => {
    const orderId = order.id;
    const orderIdNumbers = orderId.split("-")[1];
    return `https://greenthicks.live/orders/verify?globalId=${orderIdNumbers}`;
  };

  const generateUpiQR = (amount) => {
    return `upi://pay?pa=funnygn156@oksbi&pn=Green+Thicks@&mc=123456&tid=${order.id}&tr=${order.id}&tn=Payment+for+order&am=${amount}&cu=INR`;
  };

  const confirmCashPayment = () => {
    setPaymentConfirmed(true);
  };

  const togglePaymentQR = () => {
    setShowPaymentQR(!showPaymentQR);
  };

  const handleQRScan = () => {
    setShowDeliveryOptions(true);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const blob = new Blob(["This is your invoice content."], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!order) return null;

  return (
    <>
      {isGenerating && <LeafLoader />}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-2 xs:p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-base xs:text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">Invoice #{order.id}</h2>
          <div className="flex flex-wrap gap-1 xs:gap-2">
            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="flex items-center px-2 xs:px-3 py-1 xs:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-[10px] xs:text-sm sm:text-base touch-manipulation"
            >
              <Printer className="h-4 xs:h-5 w-4 xs:w-5 mr-1 xs:mr-2" />
              {isGenerating ? "Generating..." : "Print"}
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center px-2 xs:px-3 py-1 xs:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-[10px] xs:text-sm sm:text-base touch-manipulation"
            >
              <Download className="h-4 xs:h-5 w-4 xs:w-5 mr-1 xs:mr-2" />
              {isGenerating ? "Generating..." : "Download"}
            </button>
            <button className="flex items-center px-2 xs:px-3 py-1 xs:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-[10px] xs:text-sm sm:text-base touch-manipulation">
              <Mail className="h-4 xs:h-5 w-4 xs:w-5 mr-1 xs:mr-2" />
              Email
            </button>
          </div>
        </div>
        <div className="p-2 xs:p-4 sm:p-6 overflow-x-auto">
          <div ref={invoiceRef} className="invoice-container bg-white text-black p-2 xs:p-4 sm:p-6 max-w-3xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 xs:gap-4">
              <div className="w-full sm:w-auto">
                <h1 className="text-lg xs:text-xl sm:text-2xl font-bold">INVOICE</h1>
                <p className="text-gray-600 mt-1 text-[10px] xs:text-sm sm:text-base">#{order.id}</p>
                <div className="mt-1 xs:mt-2 sm:mt-4">
                  <div className="flex justify-start">
                    <div className="border-2 border-gray-200 p-1 rounded-lg">
                      <QRCode value={generateDeliveryQR()} size={Math.min(80, window.innerWidth * 0.2)} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <img src={logo.src || "/placeholder.svg"} alt="Green Thicks" className="h-8 xs:h-10 sm:h-12 mb-1 xs:mb-2 inline-block" />
                <p className="font-bold text-[10px] xs:text-sm sm:text-base">Green Thicks</p>
                <p className="text-gray-600 text-[8px] xs:text-xs sm:text-sm">Hanmakonda, Telangana, India</p>
                <p className="text-gray-600 text-[8px] xs:text-xs sm:text-sm">Tel: +91 9705045597</p>
                <p className="text-gray-600 text-[8px] xs:text-xs sm:text-sm">Email: greenthickss@gmail.com</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-4 xs:mt-6 sm:mt-8 gap-2 xs:gap-4">
              <div>
                <h2 className="font-bold text-gray-700 mb-1 xs:mb-2 text-[10px] xs:text-sm sm:text-base">BILL TO:</h2>
                <p className="font-medium text-[10px] xs:text-sm sm:text-base">{order.customer.name}</p>
                <p className="text-[8px] xs:text-xs sm:text-sm">{order.customer.address}</p>
                <p className="text-[8px] xs:text-xs sm:text-sm">{order.customer.phoneNumber || "PhoneNumber not provided"}</p>
                <p className="text-[8px] xs:text-xs sm:text-sm">{order.customer.email}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="mb-1 xs:mb-2">
                  <span className="font-bold text-gray-700 text-[10px] xs:text-sm sm:text-base">Invoice Date:</span>
                  <span className="ml-1 xs:ml-2 text-[10px] xs:text-sm sm:text-base">{formatDate(order.date)}</span>
                </div>
                <div className="mb-1 xs:mb-2">
                  <span className="font-bold text-gray-700 text-[10px] xs:text-sm sm:text-base">Payment Method:</span>
                  <span className="ml-1 xs:ml-2 text-[10px] xs:text-sm sm:text-base">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 text-[10px] xs:text-sm sm:text-base">Order Status:</span>
                  <span className="ml-1 xs:ml-2 text-[10px] xs:text-sm sm:text-base">{order.status}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 xs:mt-6 sm:mt-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-left border border-gray-300 text-[8px] xs:text-xs sm:text-sm">Item</th>
                      <th className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-right border border-gray-300 text-[8px] xs:text-xs sm:text-sm">Unit</th>
                      <th className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-right border border-gray-300 text-[8px] xs:text-xs sm:text-sm">Qty</th>
                      <th className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-right border border-gray-300 text-[8px] xs:text-xs sm:text-sm">Price</th>
                      <th className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-right border border-gray-300 text-[8px] xs:text-xs sm:text-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 border border-gray-300 text-[8px] xs:text-xs sm:text-sm">{item.name}</td>
                        <td className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-right border border-gray-300 text-[8px] xs:text-xs sm:text-sm">{item.unit}</td>
                        <td className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-right border border-gray-300 text-[8px] xs:text-xs sm:text-sm">{item.quantity}</td>
                        <td className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-right border border-gray-300 text-[8px] xs:text-xs sm:text-sm">{formatCurrency(item.price)}</td>
                        <td className="py-1 xs:py-2 px-1 xs:px-3 sm:px-4 text-right border border-gray五300 text-[8px] xs:text-xs sm:text-sm">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-2 xs:mt-4 flex justify-end">
              <div className="w-full xs:w-56 sm:w-64">
                <div className="flex justify-between py-1 xs:py-2 text-[10px] xs:text-sm sm:text-base">
                  <span className="fontになってmedium">Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between py-1 xs:py-2 text-green-600 text-[10px] xs:text-sm sm:text-base">
                    <span className="font-medium">Discount:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 xs:py-2 text-[10px] xs:text-sm sm:text-base">
                  <span className="font-medium">Delivery:</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between py-1 xs:py-2 border-t border-gray-300 font-bold text-[10px] xs:text-sm sm:text-base">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
            {showDeliveryOptions && (
              <div className="mt-4 xs:mt-6 border-2 border-blue-200 rounded-lg p-2 xs:p-4 sm:p-6 bg-blue-50">
                <h3 className="text-base xs:text-lg sm:text-xl font-bold text-center text-blue-800 mb-2 xs:mb-4">Delivery Verification</h3>
                <div className="bg-white p-2 xs:p-4 rounded-lg shadow-sm mb-2 xs:mb-4">
                  <h4 className="font-bold text-gray-800 text-[10px] xs:text-sm sm:text-base">Order #{order.id}</h4>
                  <p className="text-gray-600 text-[8px] xs:text-xs sm:text-sm">Total Amount: {formatCurrency(order.total)}</p>
                  <p className="text-gray-600 text-[8px] xs:text-xs sm:text-sm">Payment Method: {order.paymentMethod}</p>
                </div>
              </div>
            )}
            <div className="mt-4 xs:mt-6 sm:mt-8 pt-4 xs:pt-6 sm:pt-8 border-t border-gray-300">
              <h3 className="font-bold text-gray-700 mb-1 xs:mb-2 text-[10px] xs:text-sm sm:text-base">Terms & Conditions:</h3>
              <ul className="text-[8px] xs:text-xs sm:text-sm text-gray-600 list-disc pl-4 space-y-1">
                <li>All items are organic and fresh.</li>
                <li>Returns accepted within 4 hours of delivery if products are damaged.</li>
                <li>Payment is due as per the selected payment method.</li>
                <li>Delivery times are estimates and may vary based on location.</li>
              </ul>
              <div className="mt-4 xs:mt-6 text-center text-[8px] xs:text-xs sm:text-sm text-gray-600">
                <p>Thank you for shopping with Green Thicks!</p>
                <p className="mt-1">For any queries, please contact our customer support at greenthickss@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
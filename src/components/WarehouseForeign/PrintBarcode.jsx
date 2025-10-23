import React, { useRef } from "react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import ReactToPrint from "react-to-print";
import { Printer } from "lucide-react";

const PrintBarcode = () => {
  const componentRef = useRef(null);

  // List fake QR codes data
  const fakeQRCodes = [
    "SHIPMENT-001",
    "SHIPMENT-002",
    "SHIPMENT-003",
    "SHIPMENT-004",
    "SHIPMENT-005",
    "SHIPMENT-006",
    "SHIPMENT-007",
    "SHIPMENT-008",
    "SHIPMENT-009",
    "SHIPMENT-010",
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">In Mã QR Code</h1>
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors">
                <Printer className="w-5 h-5" />
                In Danh Sách
              </button>
            )}
            content={() => componentRef.current}
            pageStyle="@page { size: auto; margin: 10mm; } @media print { body { -webkit-print-color-adjust: exact; } }"
          />
        </div>

        {/* Printable Area */}
        <div
          ref={componentRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {fakeQRCodes.map((code, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <QRCode value={code} size={128} level="H" includeMargin={true} />
              <p className="mt-2 text-sm font-mono font-medium text-gray-900">
                {code}
              </p>
            </div>
          ))}
        </div>

        {/* Single Code Print Example */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            In Một Mã QR Code Duy Nhất
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <QRCode
                value="SHIPMENT-001"
                size={128}
                level="H"
                includeMargin={true}
              />
              <p className="mt-2 text-sm font-mono font-medium text-gray-900">
                SHIPMENT-001
              </p>
            </div>
            <ReactToPrint
              trigger={() => (
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors">
                  <Printer className="w-4 h-4" />
                  In Mã Này
                </button>
              )}
              content={() => {
                const singleRef = document.createElement("div");
                singleRef.innerHTML = `
                  <div style="text-align: center; padding: 16px;">
                    <img src="${
                      document.querySelector(".single-qr img")?.src
                    }" style="width: 128px; height: 128px;" />
                    <p style="margin-top: 8px; font-family: monospace; font-size: 14px; font-weight: 500;">SHIPMENT-001</p>
                  </div>
                `;
                return singleRef;
              }}
              pageStyle="@page { size: auto; margin: 10mm; } @media print { body { -webkit-print-color-adjust: exact; } }"
            />
            <div className="single-qr hidden">
              <QRCode value="SHIPMENT-001" size={128} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintBarcode;

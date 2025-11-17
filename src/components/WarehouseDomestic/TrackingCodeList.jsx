import React, { useState } from "react";
import Barcode from "react-barcode";
import { Printer, RefreshCw } from "lucide-react";

const generateMixedCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letter1 = chars[Math.floor(Math.random() * chars.length)];
  const letter2 = chars[Math.floor(Math.random() * chars.length)];
  const num = Math.floor(Math.random() * 90000) + 10000; // 5 số
  return `${letter1}${num}${letter2}`; // Ví dụ: A12345B
};

const generateCodeList = (count = 10) =>
  Array.from({ length: count }, () => generateMixedCode());

const CodeList = () => {
  const [codes, setCodes] = useState(generateCodeList());
  const [printingIndex, setPrintingIndex] = useState(null); // null = in tất cả

  const handlePrintSingle = (index) => {
    setPrintingIndex(index); // chế độ in 1 tem
    setTimeout(() => {
      window.print();
      setPrintingIndex(null); // reset về bình thường
    }, 0);
  };

  const handlePrintAll = () => {
    setPrintingIndex(null); // chế độ in tất cả
    setTimeout(() => window.print(), 0);
  };

  const handleRegenerate = () => {
    setCodes(generateCodeList());
  };

  return (
    <div className="p-4 print:p-0">
      <style>
        {`
          @media print {
            /* Ẩn mọi thứ ngoài vùng barcode-print-root */
            body * {
              visibility: hidden;
            }
            #barcode-print-root,
            #barcode-print-root * {
              visibility: visible;
            }

            #barcode-print-root {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 4mm;
            }

            .label-grid {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 4mm;
            }

            .label-item {
              border: 0.3mm solid #000;
              border-radius: 2mm;
              padding: 3mm 4mm;
              width: 55mm;
              min-height: 25mm;
              box-sizing: border-box;
              background: #fff;
            }

            /* In TẤT CẢ: giữ nguyên mọi tem */
            #barcode-print-root.printing-all .label-item {
              display: block !important;
            }

            /* In 1 TEM: ẩn hết, chỉ chừa tem có class print-target */
            #barcode-print-root.printing-single .label-item {
              display: none !important;
            }
            #barcode-print-root.printing-single .label-item.print-target {
              display: block !important;
              margin: auto;
            }

            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* container này sẽ là vùng được in */}
      <div
        id="barcode-print-root"
        className={printingIndex !== null ? "printing-single" : "printing-all"}
      >
        {/* Thanh điều khiển – chỉ xem trên màn hình */}
        <div className="no-print flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-blue-700">
              Danh sách mã vận đơn
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Bấm <b>“In tem này”</b> để in 1 tem nhỏ, hoặc{" "}
              <b>“In tất cả tem”</b> để in cả lô.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRegenerate}
              className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1 hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
              Tạo mã mới
            </button>
            <button
              onClick={handlePrintAll}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" />
              In tất cả tem
            </button>
          </div>
        </div>

        {/* Lưới tem */}
        <div className="label-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {codes.map((code, idx) => (
            <div
              key={idx}
              className={
                "label-item border border-gray-300 rounded-lg px-3 py-2 bg-white flex flex-col items-center " +
                (printingIndex === idx ? "print-target" : "")
              }
            >
              <div className="text-xs text-gray-600 mb-1">
                Mã vận đơn #{idx + 1}
              </div>

              <Barcode
                value={code}
                format="CODE128"
                displayValue={true}
                width={1.4}
                height={50}
                fontSize={14}
              />

              <button
                type="button"
                onClick={() => handlePrintSingle(idx)}
                className="no-print mt-2 inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Printer className="w-3 h-3" />
                In tem này
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeList;

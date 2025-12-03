import React, { useState } from "react";
import { FileDown, Printer, CheckSquare, Square, Loader2 } from "lucide-react";
import packingService from "../../Services/Warehouse/packingsService";

const ExportPacking = ({ packings = [], onExportSuccess }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedData, setExportedData] = useState(null);

  // Toggle select single item
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === packings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(packings.map((p) => p.id));
    }
  };

  // Export selected packings
  const handleExport = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một kiện hàng để xuất!");
      return;
    }

    setIsExporting(true);
    try {
      const data = await packingService.exportPackings(selectedIds);
      setExportedData(data);

      // Call success callback if provided
      if (onExportSuccess) {
        onExportSuccess(data);
      }

      // Optional: Auto print after export
      // handlePrint(data);
    } catch (error) {
      console.error("Export error:", error);
      alert("Có lỗi xảy ra khi xuất dữ liệu. Vui lòng thử lại!");
    } finally {
      setIsExporting(false);
    }
  };

  // Print labels
  const handlePrint = (data = exportedData) => {
    if (!data || data.length === 0) {
      alert("Không có dữ liệu để in!");
      return;
    }

    const printWindow = window.open("", "_blank");
    const printContent = generatePrintHTML(data);

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Generate HTML for printing
  const generatePrintHTML = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Packing Labels</title>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .label {
            page-break-inside: avoid;
            border: 2px solid #000;
            padding: 15px;
            margin-bottom: 20px;
            background: white;
          }
          .label-header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .label-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .label-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 14px;
          }
          .label-field {
            font-weight: bold;
          }
          .label-dimensions {
            background: #f5f5f5;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
          }
          @media print {
            .label {
              page-break-after: always;
            }
            .label:last-child {
              page-break-after: auto;
            }
          }
        </style>
      </head>
      <body>
        ${data
          .map(
            (item) => `
          <div class="label">
            <div class="label-header">
              <div class="label-title">${item.packingCode}</div>
              <div>Tracking: ${item.trackingCode || "N/A"}</div>
            </div>
            
            <div class="label-row">
              <span><span class="label-field">Mã đơn:</span> ${
                item.orderCode
              }</span>
              <span><span class="label-field">Nhân viên:</span> ${
                item.staffName
              }</span>
            </div>
            
            <div class="label-row">
              <span><span class="label-field">Khách hàng:</span> ${
                item.customerName
              }</span>
            </div>
            
            <div class="label-row">
              <span><span class="label-field">Mã KH:</span> ${
                item.customerCode
              }</span>
              <span><span class="label-field">SĐT:</span> ${
                item.customerPhone
              }</span>
            </div>
            
            <div class="label-row">
              <span><span class="label-field">Địa chỉ:</span> ${
                item.address
              }</span>
            </div>
            
            <div class="label-dimensions">
              <div class="label-row">
                <span><span class="label-field">Kích thước (DxRxC):</span> ${
                  item.length
                } x ${item.width} x ${item.height} cm</span>
              </div>
              <div class="label-row">
                <span><span class="label-field">Trọng lượng:</span> ${
                  item.netWeight
                } kg</span>
                <span><span class="label-field">DIM:</span> ${item.dim}</span>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </body>
      </html>
    `;
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
          >
            {selectedIds.length === packings.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {selectedIds.length === packings.length
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </button>

          <span className="text-sm text-gray-600">
            Đã chọn: <span className="font-semibold">{selectedIds.length}</span>{" "}
            / {packings.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={selectedIds.length === 0 || isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            {isExporting ? "Đang xuất..." : "Xuất dữ liệu"}
          </button>

          {exportedData && (
            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              In nhãn
            </button>
          )}
        </div>
      </div>

      {/* Packing List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === packings.length &&
                      packings.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Mã kiện
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Mã đơn
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tracking
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Kích thước
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Trọng lượng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {packings.map((packing) => (
                <tr
                  key={packing.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedIds.includes(packing.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(packing.id)}
                      onChange={() => toggleSelect(packing.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {packing.packingCode || packing.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {packing.orderCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {packing.trackingCode || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {packing.customerName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {packing.length}x{packing.width}x{packing.height}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {packing.netWeight} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exported Data Preview */}
      {exportedData && exportedData.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-800">
                Xuất dữ liệu thành công!
              </h3>
              <p className="text-sm text-green-600 mt-1">
                Đã xuất {exportedData.length} kiện hàng
              </p>
            </div>
            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              In nhãn ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPacking;

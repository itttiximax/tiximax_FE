import React, { useState } from "react";
import packingsService from "../../Services/Warehouse/packingsService";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

const ExportPacking = () => {
  const [packingIds, setPackingIds] = useState([""]);
  const [packingsData, setPackingsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddInput = () => {
    setPackingIds([...packingIds, ""]);
  };

  const handleRemoveInput = (index) => {
    const newIds = packingIds.filter((_, i) => i !== index);
    setPackingIds(newIds);
  };

  const handleInputChange = (index, value) => {
    const newIds = [...packingIds];
    newIds[index] = value;
    setPackingIds(newIds);
  };

  const handleExport = async () => {
    const validIds = packingIds
      .filter((id) => id.trim() !== "")
      .map((id) => parseInt(id));

    if (validIds.length === 0) {
      toast.error("Vui lòng nhập ít nhất một Packing ID!");
      return;
    }

    setLoading(true);
    try {
      const data = await packingsService.exportPackings(validIds);
      setPackingsData(data);
      toast.success(`Export thành công ${data.length} kiện hàng!`);
    } catch (error) {
      toast.error(error.message || "Export thất bại!");
      setPackingsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (packingsData.length === 0) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    // Tạo data cho Excel
    const excelData = [
      // Header row
      [
        "STT",
        "Mã kiện hàng",
        "Mã đơn hàng",
        "Mã tracking",
        "Chiều cao (cm)",
        "Chiều dài (cm)",
        "Chiều rộng (cm)",
        "Thể tích (m³)",
        "Trọng lượng (kg)",
        "Mã khách hàng",
        "Tên khách hàng",
        "Điểm đến",
        "Nhân viên",
      ],
      // Data rows
      ...packingsData.map((packing, index) => [
        index + 1,
        packing.packingCode || "",
        packing.orderCode || "",
        packing.trackingCode || "",
        packing.height || "",
        packing.length || "",
        packing.width || "",
        packing.dim ? packing.dim.toFixed(4) : "",
        packing.netWeight ? packing.netWeight.toFixed(2) : "",
        packing.customerCode || "",
        packing.customerName || "",
        packing.destination || "",
        packing.staffName || "",
      ]),
    ];

    // Tạo worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 }, // STT
      { wch: 18 }, // Mã kiện hàng
      { wch: 15 }, // Mã đơn hàng
      { wch: 15 }, // Mã tracking
      { wch: 15 }, // Chiều cao
      { wch: 15 }, // Chiều dài
      { wch: 15 }, // Chiều rộng
      { wch: 15 }, // Thể tích
      { wch: 18 }, // Trọng lượng
      { wch: 15 }, // Mã KH
      { wch: 20 }, // Tên KH
      { wch: 15 }, // Điểm đến
      { wch: 20 }, // Nhân viên
    ];

    // Style cho header (row đầu tiên)
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;

      ws[cellAddress].s = {
        fill: {
          fgColor: { rgb: "2563EB" }, // Blue-600 color
        },
        font: {
          color: { rgb: "FFFFFF" }, // White text
          bold: true,
          sz: 12,
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Packings");

    // Xuất file
    XLSX.writeFile(
      wb,
      `packings_export_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    toast.success("Xuất file Excel thành công!");
  };

  const handleClear = () => {
    setPackingIds([""]);
    setPackingsData([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          Export Packing
        </h2>

        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3">
            Packing IDs <span className="text-red-500">*</span>
          </label>

          {packingIds.map((id, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="number"
                value={id}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="Nhập Packing ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleRemoveInput(index)}
                disabled={packingIds.length === 1}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                -
              </button>
            </div>
          ))}

          <button
            onClick={handleAddInput}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            + Thêm Packing ID
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
          >
            {loading ? "Đang xử lý..." : "Execute"}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={packingsData.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 font-semibold"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold"
          >
            Clear
          </button>
        </div>

        {/* Results Table */}
        {packingsData.length > 0 && (
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-700">
                Kết quả: {packingsData.length} kiện hàng
              </h3>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Packing Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Order Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Tracking Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Height (cm)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Length (cm)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Width (cm)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    DIM (m³)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Trọng lượng (kg)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Khách hàng
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Điểm đến
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Nhân viên
                  </th>
                </tr>
              </thead>
              <tbody>
                {packingsData.map((packing, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {packing.packingCode}
                    </td>
                    <td className="px-4 py-3 text-sm">{packing.orderCode}</td>
                    <td className="px-4 py-3 text-sm">
                      {packing.trackingCode}
                    </td>
                    <td className="px-4 py-3 text-sm">{packing.height}</td>
                    <td className="px-4 py-3 text-sm">{packing.length}</td>
                    <td className="px-4 py-3 text-sm">{packing.width}</td>
                    <td className="px-4 py-3 text-sm">
                      {packing.dim.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {packing.netWeight.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{packing.customerName}</div>
                      <div className="text-xs text-gray-500">
                        {packing.customerCode}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{packing.destination}</td>
                    <td className="px-4 py-3 text-sm">{packing.staffName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && packingsData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có dữ liệu. Vui lòng nhập Packing IDs và nhấn Execute.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPacking;

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiPackage } from "react-icons/fi";
import warehouseService from "../../Services/Warehouse/warehouseService";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage, pageSize]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await warehouseService.getReadyWarehouses(
        currentPage,
        pageSize
      );

      setWarehouses(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch {
      toast.error("Có lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePageSize = (newSize) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (warehouses.length === 0 && !loading) {
    return (
      <div className="p-6  min-h-screen">
        <Toaster position="top-right" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Danh sách Kho Hàng
          </h1>
          <p className="text-gray-600">Quản lý thông tin kho hàng sẵn sàng</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
          <FiPackage className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
          <p className="text-lg">Chưa có dữ liệu kho hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Danh sách Kho Hàng
        </h1>
        <p className="text-gray-600">Tổng số: {totalElements} mặt hàng</p>
      </div>

      <div className="mb-6">
        <select
          value={pageSize}
          onChange={(e) => changePageSize(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 mục</option>
          <option value={20}>20 mục</option>
          <option value={30}>30 mục</option>
          <option value={50}>50 mục</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Mã Tracking
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Mã Đơn
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Trọng Lượng
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                TL Thực
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Kích Thước
              </th>{" "}
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Ngày Tạo
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : (
              warehouses.map((item) => (
                <tr
                  key={item.warehouseId}
                  className="hover:bg-gray-50 border-b"
                >
                  <td className="px-6 py-4 text-sm font-mono">
                    {item.trackingCode}
                  </td>
                  <td className="px-6 py-4 text-sm">{item.orderCode}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    {item.weight} kg
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {item.netWeight} kg
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {item.dim} m³
                  </td>{" "}
                  <td className="px-6 py-4 text-sm">
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && warehouses.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Trang {currentPage + 1} / {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseList;

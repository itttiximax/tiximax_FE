import React, { useState, useEffect } from "react";
import packingsService from "../../Services/Warehouse/packingsService"; // Import service

const PackingAwaitList = () => {
  const [orders, setOrders] = useState([]); // Lưu danh sách orders
  const [page, setPage] = useState(0); // Trang hiện tại
  const [limit] = useState(10); // Số item mỗi trang
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Lưu lỗi nếu có
  const [selectedPackings, setSelectedPackings] = useState([]); // Lưu packingId được chọn
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [flightCode, setFlightCode] = useState(""); // flightCode input
  const [assignLoading, setAssignLoading] = useState(false); // Trạng thái loading khi gán flight
  const [assignError, setAssignError] = useState(null); // Lỗi khi gán flight
  const [assignSuccess, setAssignSuccess] = useState(null); // Thông báo thành công

  // Fetch dữ liệu khi component mount hoặc page thay đổi
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await packingsService.getAwaitingFlightOrders(
          page,
          limit
        );
        setOrders(response.content || []);
        // Reset selectedPackings khi chuyển trang
        setSelectedPackings([]);
      } catch (err) {
        setError(err.message || "Failed to fetch awaiting-flight orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  // Format ngày giờ cho dễ đọc (DD/MM/YYYY HH:MM)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // Handle chuyển trang
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  // Handle chọn checkbox
  const handleSelectPacking = (packingId) => {
    setSelectedPackings((prev) =>
      prev.includes(packingId)
        ? prev.filter((id) => id !== packingId)
        : [...prev, packingId]
    );
  };

  // Handle chọn tất cả
  const handleSelectAll = () => {
    if (selectedPackings.length === orders.length) {
      setSelectedPackings([]);
    } else {
      setSelectedPackings(orders.map((order) => order.packingId));
    }
  };

  // Handle gán chuyến bay
  const handleAssignFlight = async () => {
    if (!flightCode.trim()) {
      setAssignError("Flight code is required");
      return;
    }

    setAssignLoading(true);
    setAssignError(null);
    setAssignSuccess(null);

    try {
      // Gọi API assignFlight với mảng packingIds
      await packingsService.assignFlight(selectedPackings, flightCode);
      setAssignSuccess("Flights assigned successfully");
      // Làm mới danh sách orders
      const response = await packingsService.getAwaitingFlightOrders(
        page,
        limit
      );
      setOrders(response.content || []);
      setSelectedPackings([]); // Reset lựa chọn
      setFlightCode(""); // Reset input
      setShowModal(false); // Đóng modal
    } catch (err) {
      setAssignError(
        err.response?.status === 405
          ? "Method Not Allowed: Check if the API supports PUT"
          : err.message || "Failed to assign flights"
      );
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Awaiting Flight Orders
      </h2>

      {/* Thông báo khi gán chuyến bay */}
      {assignSuccess && (
        <p className="text-center text-green-500 mb-4">{assignSuccess}</p>
      )}
      {assignError && (
        <p className="text-center text-red-500 mb-4">{assignError}</p>
      )}

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-center text-gray-500">No orders found.</p>
      )}

      {orders.length > 0 && (
        <>
          {/* Nút Tạo Chuyến Bay */}
          <div className="mb-4">
            <button
              onClick={() => setShowModal(true)}
              disabled={selectedPackings.length === 0}
              className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors`}
            >
              Tạo Chuyến Bay
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    <input
                      type="checkbox"
                      checked={
                        selectedPackings.length === orders.length &&
                        orders.length > 0
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    Packing ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    Packing Code
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    Packing List
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    Packed Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                    Flight Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.packingId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedPackings.includes(order.packingId)}
                        onChange={() => handleSelectPacking(order.packingId)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-600">
                      {order.packingId}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-600">
                      {order.packingCode}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-600">
                      {order.packingList.join(", ")}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-600">
                      {formatDate(order.packedDate)}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-600">
                      {order.flightCode || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 0}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors`}
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page + 1}</span>
        <button
          onClick={handleNextPage}
          disabled={orders.length < limit}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors`}
        >
          Next
        </button>
      </div>

      {/* Modal để nhập flightCode */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Assign Flight</h3>
            <input
              type="text"
              value={flightCode}
              onChange={(e) => setFlightCode(e.target.value)}
              placeholder="Enter Flight Code (e.g., FL123)"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {assignError && (
              <p className="text-red-500 text-sm mb-4">{assignError}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFlightCode("");
                  setAssignError(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignFlight}
                disabled={assignLoading}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed`}
              >
                {assignLoading ? "Assigning..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingAwaitList;

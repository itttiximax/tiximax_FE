import React, { useState, useEffect } from "react";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import toast from "react-hot-toast";

const DetailOrderLink = ({ linkId, onClose }) => {
  const [orderLink, setOrderLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order link detail
  useEffect(() => {
    if (linkId) {
      fetchOrderLinkDetail();
    }
  }, [linkId]);

  const fetchOrderLinkDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderlinkService.getOrderLinkById(linkId);
      setOrderLink(data);
    } catch (error) {
      console.error("Error fetching order link detail:", error);
      setError(error.message);
      toast.error("Không thể tải chi tiết sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "HOAT_DONG":
        return "bg-green-100 text-green-800";
      case "TAM_DUNG":
        return "bg-yellow-100 text-yellow-800";
      case "HUY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải chi tiết...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không thể tải chi tiết
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={fetchOrderLinkDetail}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderLink) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết sản phẩm
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Thông tin sản phẩm
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm
                    </label>
                    <p className="text-gray-900">
                      {orderLink.productName !== "string"
                        ? orderLink.productName
                        : "Chưa có tên sản phẩm"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link sản phẩm
                    </label>
                    {orderLink.productLink &&
                    orderLink.productLink !== "string" ? (
                      <a
                        href={orderLink.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {orderLink.productLink}
                      </a>
                    ) : (
                      <p className="text-gray-500">Chưa có link</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <p className="text-gray-900">
                        {orderLink.website !== "string"
                          ? orderLink.website
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng
                      </label>
                      <p className="text-gray-900">{orderLink.quantity}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã tracking
                    </label>
                    <div className="inline-flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-blue-900 font-mono text-sm">
                        {orderLink.trackingCode}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group Tag
                    </label>
                    <p className="text-gray-900">
                      {orderLink.groupTag !== "string"
                        ? orderLink.groupTag
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        orderLink.status
                      )}`}
                    >
                      {orderLink.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Image */}
              {orderLink.purchaseImage &&
                orderLink.purchaseImage !== "string" && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Hình ảnh sản phẩm
                    </h3>
                    <div className="text-center">
                      <img
                        src={orderLink.purchaseImage}
                        alt="Product"
                        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                        style={{ maxHeight: "300px" }}
                      />
                    </div>
                  </div>
                )}
            </div>

            {/* Pricing Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  Thông tin giá cả
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Giá web</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {orderLink.priceWeb?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Phí ship</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {orderLink.shipWeb?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Tổng web</div>
                    <div className="text-xl font-bold text-blue-600">
                      {orderLink.totalWeb?.toLocaleString() || 0}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">
                        Phí mua hộ
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {orderLink.purchaseFee?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Phụ phí</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {orderLink.extraCharge?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="text-sm text-green-700 mb-1 font-medium">
                      Thành tiền (VND)
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {formatCurrency(orderLink.finalPriceVnd)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailOrderLink;

import React, { useState, useEffect } from "react";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import toast from "react-hot-toast";

const DetailOrderLink = ({ linkId, onClose }) => {
  const [orderLink, setOrderLink] = useState(null);
  const [staff, setStaff] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order link detail
  useEffect(() => {
    if (linkId) {
      fetchOrderLinkDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  const fetchOrderLinkDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderlinkService.getOrderLinkById(linkId);

      // Expecting structure: { orderLink: {...}, staff: {...}, customer: {...} }
      setOrderLink(data?.orderLink || null);
      setStaff(data?.staff || null);
      setCustomer(data?.customer || null);
    } catch (err) {
      console.error("Error fetching order link detail:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while loading details.";
      setError(message);
      toast.error("Unable to load order link details");
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      return "N/A";
    }
    try {
      return Number(amount).toLocaleString("en-US");
    } catch {
      return String(amount);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "HOAT_DONG":
        return "bg-green-100 text-green-800";
      case "CHO_MUA":
        return "bg-blue-100 text-blue-800";
      case "TAM_DUNG":
        return "bg-yellow-100 text-yellow-800";
      case "HUY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status label (English)
  const getStatusLabel = (status) => {
    const labels = {
      HOAT_DONG: "Active",
      CHO_MUA: "Pending purchase",
      TAM_DUNG: "On hold",
      HUY: "Cancelled",
    };
    return labels[status] || status || "Unknown";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading details...</span>
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
              Unable to load details
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={fetchOrderLinkDetail}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
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
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
                Order Link Details
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
            {/* LEFT COLUMN: Product + Staff */}
            <div className="space-y-6">
              {/* Product Information (kèm hình) */}
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
                  Product Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <p className="text-gray-900">
                      {orderLink.productName &&
                      orderLink.productName !== "string"
                        ? orderLink.productName
                        : "No product name"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Link
                    </label>
                    {orderLink.productLink &&
                    orderLink.productLink !== "string" ? (
                      <a
                        href={orderLink.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all text-sm"
                      >
                        {orderLink.productLink}
                      </a>
                    ) : (
                      <p className="text-gray-500">No link available</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <p className="text-gray-900">
                        {orderLink.website && orderLink.website !== "string"
                          ? orderLink.website
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {orderLink.quantity || 0}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Variant
                      </label>
                      <p className="text-gray-900">
                        {orderLink.classify && orderLink.classify !== "string"
                          ? orderLink.classify
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Name
                      </label>
                      <p className="text-gray-900">
                        {orderLink.groupTag && orderLink.groupTag !== "string"
                          ? orderLink.groupTag
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note
                    </label>
                    <p className="text-gray-900">
                      {orderLink.note && orderLink.note !== "string"
                        ? orderLink.note
                        : "No note"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        orderLink.status
                      )}`}
                    >
                      {getStatusLabel(orderLink.status)}
                    </span>
                  </div>

                  {/* Product Image gộp vào cuối card */}
                  {orderLink.purchaseImage &&
                    orderLink.purchaseImage !== "string" &&
                    orderLink.purchaseImage !== "" && (
                      <div className="pt-4 border-t border-gray-200 mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Image
                        </label>
                        <div className="text-center">
                          <img
                            src={orderLink.purchaseImage}
                            alt="Product"
                            className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                            style={{ maxHeight: "260px" }}
                          />
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Staff Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 14c2.21 0 4-1.79 4-4s-1.79-4-4-4M8 14c2.21 0 4-1.79 4-4S10.21 6 8 6m8 4v.01M8 10v.01M12 14v6m0 0H6m6 0h6"
                    />
                  </svg>
                  Staff Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Staff Name</label>
                    <p className="font-medium text-gray-900">
                      {staff?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-gray-900">{staff?.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="text-gray-900">{staff?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Staff Code</label>
                    <p className="text-gray-900">{staff?.staffCode || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Customer + Pricing */}
            <div className="space-y-6">
              {/* Pricing Information */}
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
                  Pricing Information
                </h3>

                <div className="space-y-4">
                  {/* Web Pricing */}
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-3">
                      Web Purchase
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Web Price:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(orderLink.priceWeb || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Shipping Fee:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(orderLink.shipWeb || 0)}
                        </span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-blue-700">
                            Web Total:
                          </span>
                          <span className="text-lg font-bold text-blue-700">
                            {formatCurrency(orderLink.totalWeb || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Fees */}
                  <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                    <h4 className="text-sm font-semibold text-amber-800 mb-3">
                      Additional Fees
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Purchase Fee:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {orderLink.purchaseFee || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Extra Charge:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(orderLink.extraCharge || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Customer Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">
                      Customer Name
                    </label>
                    <p className="font-medium text-gray-900">
                      {customer?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="text-gray-900">{customer?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="text-gray-900">{customer?.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Customer Code
                    </label>
                    <p className="text-gray-900">
                      {customer?.customerCode || "N/A"}
                    </p>
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
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailOrderLink;

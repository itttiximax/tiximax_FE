import React, { useState } from "react";
import {
  X,
  Package,
  CreditCard,
  ShoppingCart,
  FileText,
  MapPin,
  User,
  Users,
  Calendar,
  Loader2,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  Truck,
  ClipboardList,
} from "lucide-react";

// Sub-dialog: Purchases
const PurchasesDialog = ({ purchases, onClose }) => {
  // Hàm để lấy thông tin hiển thị cho từng trạng thái
  const getStatusDisplay = (status) => {
    const statusMap = {
      DA_MUA: {
        label: "Đã mua",
        className: "bg-blue-100 text-blue-800",
      },
      CHO_THANH_TOAN: {
        label: "Chờ thanh toán",
        className: "bg-yellow-100 text-yellow-800",
      },
      DA_DU_HANG: {
        label: "Đã đủ hàng",
        className: "bg-purple-100 text-purple-800",
      },
      CHO_MUA: {
        label: "Chờ mua",
        className: "bg-orange-100 text-orange-800",
      },
      DA_HUY: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-800",
      },
      DAU_GIA_THANH_CONG: {
        label: "Đấu giá thành công",
        className: "bg-red-100 text-red-800",
      },
      DA_NHAP_KHO_VN: {
        label: "Đã nhập kho VN",
        className: "bg-red-100 text-red-800",
      },
    };

    return (
      statusMap[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-purple-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Chi tiết mua hàng</h3>
            <span className="text-sm text-gray-600">
              ({purchases.length} đơn mua)
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-purple-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {purchases.map((purchase, idx) => (
            <div
              key={purchase.purchaseId}
              className="mb-4 border rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-lg text-purple-600">
                    {purchase.purchaseCode}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(purchase.purchaseTime).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Tổng tiền:</div>
                  <div className="font-bold text-lg text-purple-600">
                    {purchase.finalPriceOrder?.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </div>

              {purchase.purchaseImage && (
                <div className="mb-3">
                  <img
                    src={purchase.purchaseImage}
                    alt="Purchase"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}

              {purchase.note && (
                <div className="mb-3 text-sm text-gray-600">
                  <span className="font-medium">Ghi chú: </span>
                  {purchase.note}
                </div>
              )}

              {/* Order Links */}
              {purchase.orderLinks?.length > 0 && (
                <div className="mt-3 border-t pt-3">
                  <div className="font-medium text-sm text-gray-700 mb-2">
                    Sản phẩm ({purchase.orderLinks.length}):
                  </div>
                  {purchase.orderLinks.map((link) => {
                    const statusInfo = getStatusDisplay(link.status);

                    return (
                      <div
                        key={link.linkId}
                        className="bg-white p-3 rounded border mb-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-blue-600 flex-1 mr-2">
                            {link.productName}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Số lượng: </span>
                            <span className="font-medium">{link.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Giá web: </span>
                            <span className="font-medium">
                              {link.priceWeb?.toLocaleString("vi-VN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Ship web: </span>
                            <span className="font-medium">
                              {link.shipWeb?.toLocaleString("vi-VN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Phí mua: </span>
                            <span className="font-medium">
                              {link.purchaseFee?.toLocaleString("vi-VN")}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Tổng VNĐ: </span>
                            <span className="font-bold text-green-600">
                              {link.finalPriceVnd?.toLocaleString("vi-VN")} ₫
                            </span>
                          </div>
                        </div>

                        {link.trackingCode && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">Mã tracking: </span>
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {link.trackingCode}
                            </span>
                          </div>
                        )}
                        {link.productLinke && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">Mã tracking: </span>
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {link.productLink}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// Sub-dialog: Payments
const PaymentsDialog = ({ payments, onClose }) => {
  // Hàm để lấy thông tin hiển thị cho từng trạng thái thanh toán
  const getPaymentStatusDisplay = (status) => {
    const statusMap = {
      ĐA_XAC_NHAN: {
        label: "Đã xác nhận",
        className: "bg-green-100 text-green-800",
      },
      CHO_THANH_TOAN: {
        label: "Chờ thanh toán",
        className: "bg-yellow-100 text-yellow-800",
      },
      CHO_THANH_TOAN_SHIP: {
        label: "Chờ thanh toán ship",
        className: "bg-blue-100 text-blue-800",
      },
      THAT_BAI: {
        label: "Thất bại",
        className: "bg-red-100 text-red-800",
      },
      DA_HUY: {
        label: "Đã hủy",
        className: "bg-gray-100 text-gray-800",
      },
      DA_HOAN_TIEN: {
        label: "Đã hoàn tiền",
        className: "bg-purple-100 text-purple-800",
      },
      DA_THANH_TOAN: {
        label: "Đã thanh toán",
        className: "bg-green-100 text-green-800",
      },
    };

    return (
      statusMap[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-green-50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Chi tiết thanh toán</h3>
            {payments.length > 0 && (
              <span className="text-sm text-gray-600">
                ({payments.length} giao dịch)
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-green-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có thanh toán nào
            </div>
          ) : (
            payments.map((payment) => {
              const statusInfo = getPaymentStatusDisplay(payment.status);

              return (
                <div
                  key={payment.paymentId}
                  className="mb-3 border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-green-600">
                        {payment.paymentCode}
                      </div>
                      {payment.paymentTime && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(payment.paymentTime).toLocaleString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">
                        {payment.amount?.toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Phương thức: </span>
                      <span className="font-medium">{payment.method}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Trạng thái: </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${statusInfo.className}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {payment.note && (
                    <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border-l-2 border-gray-300">
                      <span className="font-medium">Ghi chú: </span>
                      {payment.note}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-dialog: Order Links
const OrderLinksDialog = ({ orderLinks, onClose }) => {
  // Hàm để lấy thông tin hiển thị cho từng trạng thái
  const getStatusDisplay = (status) => {
    const statusMap = {
      DA_MUA: {
        label: "Đã mua",
        className: "bg-blue-100 text-blue-800",
      },
      CHO_THANH_TOAN: {
        label: "Chờ thanh toán",
        className: "bg-yellow-100 text-yellow-800",
      },
      DA_DU_HANG: {
        label: "Đã đủ hàng",
        className: "bg-purple-100 text-purple-800",
      },
      CHO_MUA: {
        label: "Chờ mua",
        className: "bg-orange-100 text-orange-800",
      },
      DA_HUY: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-800",
      },
      DA_NHAP_KHO_NN: {
        label: "Đã nhập kho nước ngoài",
        className: "bg-red-100 text-red-800",
      },
      DAU_GIA_THANH_CONG: {
        label: "Đấu giá thành công",
        className: "bg-red-100 text-red-800",
      },
      DA_NHAP_KHO_VN: {
        label: "Đã nhập kho VN",
        className: "bg-red-100 text-red-800",
      },
    };

    return (
      statusMap[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
            <span className="text-sm text-gray-600">
              ({orderLinks.length} sản phẩm)
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {orderLinks.map((link) => {
            const statusInfo = getStatusDisplay(link.status);

            return (
              <div
                key={link.linkId}
                className="mb-3 border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-blue-600 flex-1 mr-2">
                    {link.productName}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                  <div>
                    <div className="text-gray-600 text-xs">Số lượng</div>
                    <div className="font-medium">{link.quantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Giá web</div>
                    <div className="font-medium">
                      {link.priceWeb?.toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Tổng VNĐ</div>
                    <div className="font-bold text-green-600">
                      {link.finalPriceVnd?.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                </div>

                {link.trackingCode && (
                  <div className="text-sm mb-2">
                    <span className="text-gray-600">Mã tracking: </span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {link.trackingCode}
                    </span>
                  </div>
                )}
                {link.productLink && (
                  <div className="text-sm mb-2">
                    <span className="text-gray-600">Linnk: </span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {link.productLink}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Sub-dialog: Process Logs
const ProcessLogsDialog = ({ logs, onClose }) => {
  const getActionText = (action) => {
    const actionMap = {
      DA_MUA_HANG: "Đã mua hàng",
      TAO_THANH_TOAN_HANG: "Tạo thanh toán hàng",
      XAC_NHAN_DON: "Xác nhận đơn",
      DA_THANH_TOAN: "Đã thanh toán",
      NHAP_KHO: "Nhập kho",
      XUAT_KHO: "Xuất kho",
      DONG_GOI: "Đóng gói",
      GIAO_HANG: "Giao hàng",
      HUY_DON: "Hủy đơn",
      HOAN_THANH: "Hoàn thành",
      DA_NHAP_KHO_NN: "Đã nhập kho nước ngoài",
      DA_NHAP_KHO_VN: "Đã nhập kho VN",
      DAU_GIA_THANH_CONG: "Đấu giá thành công",
    };
    return actionMap[action] || action;
  };

  const getRoleText = (role) => {
    const roleMap = {
      CUSTOMER: "Khách hàng",
      STAFF_SALE: "Nhân viên bán hàng",
      LEAD_SALE: "Trưởng phòng kinh doanh",
      STAFF_WAREHOUSE: "Nhân viên kho",
      STAFF_PURCHASER: "Nhân viên mua hàng",
      MANAGER: "Quản lý",
      ADMIN: "Quản trị viên",
      STAFF_WAREHOUSE_FOREIGN: "Nhân viên kho nước ngoài",
    };
    return roleMap[role] || role;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-indigo-50">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Nhật ký xử lý</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-indigo-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div key={log.logId} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                  {idx < logs.length - 1 && (
                    <div className="w-0.5 h-full bg-indigo-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-indigo-600">
                        {getActionText(log.action)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Mã:{" "}
                      <span className="font-mono bg-white px-2 py-0.5 rounded">
                        {log.actionCode}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Vai trò:{" "}
                      <span className="font-medium">
                        {getRoleText(log.roleAtTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component: DetailOrder
const DetailOrder = ({
  orderData,
  onClose,
  availableStatuses = [],
  isLoading = false,
}) => {
  const [showPurchases, setShowPurchases] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showOrderLinks, setShowOrderLinks] = useState(false);
  const [showProcessLogs, setShowProcessLogs] = useState(false);

  if (!orderData) return null;

  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status) => {
    const statusInfo = availableStatuses.find((s) => s.key === status);
    if (!statusInfo) return "bg-gray-100 text-gray-800";

    const colorMap = {
      gray: "bg-gray-100 text-gray-800",
      green: "bg-green-100 text-green-800",
      orange: "bg-orange-100 text-orange-800",
      blue: "bg-blue-100 text-blue-800",
      indigo: "bg-indigo-100 text-indigo-800",
      slate: "bg-slate-100 text-slate-800",
      purple: "bg-purple-100 text-purple-800",
      yellow: "bg-yellow-100 text-yellow-800",
      cyan: "bg-cyan-100 text-cyan-800",
      pink: "bg-pink-100 text-pink-800",
      teal: "bg-teal-100 text-teal-800",
      emerald: "bg-emerald-100 text-emerald-800",
      red: "bg-red-100 text-red-800",
    };
    return colorMap[statusInfo.color] || "bg-gray-100 text-gray-800";
  };

  const getOrderTypeText = (type) => {
    const typeMap = {
      MUA_HO: "Mua hộ",
      VAN_CHUYEN: "Vận chuyển",
      DAU_GIA: "Đấu giá",
      KY_GUI: "Ký gửi",
    };
    return typeMap[type] || type;
  };

  const getRoleText = (role) => {
    const roleMap = {
      CUSTOMER: "Khách hàng",
      STAFF_SALE: "Nhân viên bán hàng",
      LEAD_SALE: "Trưởng phòng kinh doanh",
      STAFF_WAREHOUSE: "Nhân viên kho",
      STAFF_PURCHASER: "Nhân viên mua hàng",
      MANAGER: "Quản lý",
      ADMIN: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

  const getStatusText = (status) => {
    const statusInfo = availableStatuses.find((s) => s.key === status);
    return statusInfo ? statusInfo.label : status;
  };

  const SkeletonLine = () => (
    <div className="animate-pulse flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-lg bg-white mb-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết đơn hàng
              </h2>
              {isLoading && (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: Order Info */}
              <div className="space-y-4">
                {/* Basic Order Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-700" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Thông tin đơn hàng
                    </h3>
                  </div>
                  {isLoading ? (
                    <div className="space-y-3">
                      <SkeletonLine />
                      <SkeletonLine />
                      <SkeletonLine />
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mã đơn:</span>
                        <span className="font-semibold text-blue-700">
                          {orderData.orderCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Loại đơn:</span>
                        <span className="font-medium">
                          {getOrderTypeText(orderData.orderType)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            orderData.status
                          )}`}
                        >
                          {getStatusText(orderData.status)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span className="font-medium">
                          {new Date(orderData.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Kiểm tra:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            orderData.checkRequired
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {orderData.checkRequired ? "Bắt buộc" : "Không"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Info */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-5 h-5 text-green-700" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Thông tin tài chính
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tỷ giá:</span>
                      <span className="font-medium">
                        {orderData.exchangeRate
                          ? `${orderData.exchangeRate.toLocaleString(
                              "vi-VN"
                            )} VNĐ`
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-green-200">
                      <span className="text-gray-700 font-medium">
                        Tổng tiền:
                      </span>
                      <span className="font-bold text-lg text-green-700">
                        {formatPrice(orderData.finalPriceOrder)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route & Destination */}
                {orderData.route && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-purple-700" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Tuyến & Điểm đến
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tuyến:</span>
                        <span className="font-medium">
                          {orderData.route.name}
                        </span>
                      </div>
                      {orderData.route.shipTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Thời gian ship:</span>
                          <span>{orderData.route.shipTime} ngày</span>
                        </div>
                      )}
                      {orderData.destination && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Điểm đến:</span>
                          <span className="font-medium">
                            {orderData.destination.destinationName}
                          </span>
                        </div>
                      )}
                      {orderData.route.note && (
                        <div className="pt-2 border-t border-purple-200 text-xs text-gray-600">
                          {orderData.route.note}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2: Customer & Staff */}
              <div className="space-y-4">
                {/* Customer Info */}
                {orderData.customer && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-orange-700" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Khách hàng
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mã KH:</span>
                        <span className="font-semibold text-orange-700">
                          {orderData.customer.customerCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tên:</span>
                        <span className="font-medium">
                          {orderData.customer.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">SĐT:</span>
                        <span className="font-medium">
                          {orderData.customer.phone}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-xs">
                          {orderData.customer.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Nguồn:</span>
                        <span>{orderData.customer.source}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            orderData.customer.status === "HOAT_DONG"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {orderData.customer.status === "HOAT_DONG"
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Staff Info */}
                {orderData.staff && (
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-indigo-700" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Nhân viên phụ trách
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mã NV:</span>
                        <span className="font-semibold text-indigo-700">
                          {orderData.staff.staffCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tên:</span>
                        <span className="font-medium">
                          {orderData.staff.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Chức vụ:</span>
                        <span>{getRoleText(orderData.staff.role)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Phòng ban:</span>
                        <span>{orderData.staff.department}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">SĐT:</span>
                        <span className="font-medium">
                          {orderData.staff.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Column 3: Quick Stats & Actions */}
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-gray-700" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Thống kê nhanh
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Purchases */}
                    <button
                      onClick={() => setShowPurchases(true)}
                      disabled={!orderData.purchases?.length}
                      className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <ShoppingCart className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                      <div className="text-xl font-bold text-purple-600">
                        {orderData.purchases?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Mua hàng</div>
                      {orderData.purchases?.length > 0 && (
                        <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-purple-600" />
                      )}
                    </button>

                    {/* Payments */}
                    <button
                      onClick={() => setShowPayments(true)}
                      disabled={!orderData.payments?.length}
                      className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-green-600" />
                      <div className="text-xl font-bold text-green-600">
                        {orderData.payments?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Thanh toán</div>
                      {orderData.payments?.length > 0 && (
                        <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-green-600" />
                      )}
                    </button>

                    {/* Order Links */}
                    <button
                      onClick={() => setShowOrderLinks(true)}
                      disabled={!orderData.orderLinks?.length}
                      className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <LinkIcon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-xl font-bold text-blue-600">
                        {orderData.orderLinks?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Sản phẩm</div>
                      {orderData.orderLinks?.length > 0 && (
                        <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-blue-600" />
                      )}
                    </button>

                    {/* Process Logs */}
                    <button
                      onClick={() => setShowProcessLogs(true)}
                      disabled={!orderData.orderProcessLogs?.length}
                      className="p-3 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <ClipboardList className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                      <div className="text-xl font-bold text-indigo-600">
                        {orderData.orderProcessLogs?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Nhật ký</div>
                      {orderData.orderProcessLogs?.length > 0 && (
                        <ChevronRight className="w-4 h-4 mx-auto mt-1 text-gray-400 group-hover:text-indigo-600" />
                      )}
                    </button>

                    {/* Warehouses */}
                    <div className="p-3 bg-white rounded-lg border">
                      <Package className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                      <div className="text-xl font-bold text-orange-600">
                        {orderData.warehouses?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Kho hàng</div>
                    </div>

                    {/* Shipment Tracking */}
                    <div className="p-3 bg-white rounded-lg border">
                      <Truck className="w-5 h-5 mx-auto mb-1 text-teal-600" />
                      <div className="text-xl font-bold text-teal-600">
                        {orderData.shipmentTrackings?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Vận đơn</div>
                    </div>
                  </div>
                </div>

                {/* Note Section */}
                {orderData.note && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-yellow-700" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Ghi chú
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700">{orderData.note}</p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-700" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Thông tin khác
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phản hồi:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          orderData.feedback
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {orderData.feedback ? "Có" : "Chưa có"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Sub-dialogs */}
      {showPurchases && orderData.purchases?.length > 0 && (
        <PurchasesDialog
          purchases={orderData.purchases}
          onClose={() => setShowPurchases(false)}
        />
      )}

      {showPayments && (
        <PaymentsDialog
          payments={orderData.payments || []}
          onClose={() => setShowPayments(false)}
        />
      )}

      {showOrderLinks && orderData.orderLinks?.length > 0 && (
        <OrderLinksDialog
          orderLinks={orderData.orderLinks}
          onClose={() => setShowOrderLinks(false)}
        />
      )}

      {showProcessLogs && orderData.orderProcessLogs?.length > 0 && (
        <ProcessLogsDialog
          logs={orderData.orderProcessLogs}
          onClose={() => setShowProcessLogs(false)}
        />
      )}
    </>
  );
};

export default DetailOrder;

import React from "react";
import { X, ShoppingCart } from "lucide-react";

const PurchasesDetailSale = ({ purchases, onClose }) => {
  const getStatusDisplay = (status) => {
    const statusMap = {
      DA_MUA: { label: "Đã mua", className: "bg-blue-100 text-blue-800" },
      CHO_THANH_TOAN: {
        label: "Chờ thanh toán",
        className: "bg-yellow-100 text-yellow-800",
      },
      DA_DU_HANG: {
        label: "Đã đủ hàng",
        className: "bg-purple-100 text-purple-800",
      },
      CHO_MUA: { label: "Chờ mua", className: "bg-orange-100 text-orange-800" },
      DA_HUY: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
      DAU_GIA_THANH_CONG: {
        label: "Đấu giá thành công",
        className: "bg-green-100 text-green-800",
      },
      DA_NHAP_KHO_VN: {
        label: "Đã nhập kho VN",
        className: "bg-teal-100 text-teal-800",
      },
      DA_GIAO: {
        label: "Đã giao",
        className: "bg-emerald-100 text-emerald-800",
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
          {purchases.map((purchase) => (
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
                    {purchase.finalPriceOrder?.toLocaleString("vi-VN")}
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
                        {link.productLink && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">Link: </span>
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs break-all">
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

export default PurchasesDetailSale;

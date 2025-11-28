import React from "react";
import { X, Link as LinkIcon } from "lucide-react";

const OrderLinksDetailSale = ({ orderLinks, onClose }) => {
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
      DA_NHAP_KHO_NN: {
        label: "Đã nhập kho nước ngoài",
        className: "bg-teal-100 text-teal-800",
      },
      DAU_GIA_THANH_CONG: {
        label: "Đấu giá thành công",
        className: "bg-green-100 text-green-800",
      },
      DA_NHAP_KHO_VN: {
        label: "Đã nhập kho VN",
        className: "bg-cyan-100 text-cyan-800",
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
          {orderLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có sản phẩm nào
            </div>
          ) : (
            orderLinks.map((link) => {
              const statusInfo = getStatusDisplay(link.status);
              return (
                <div
                  key={link.linkId}
                  className="mb-3 border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 mr-2">
                      <div className="font-semibold text-lg text-blue-600 mb-1">
                        {link.productName}
                      </div>
                      {link.classify && (
                        <div className="text-xs text-gray-600 mb-1">
                          Phân loại:{" "}
                          <span className="font-medium">{link.classify}</span>
                        </div>
                      )}
                      {link.groupTag && (
                        <div className="text-xs text-gray-600">
                          Tag:{" "}
                          <span className="font-medium">{link.groupTag}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Purchase Image */}
                  {link.purchaseImage && (
                    <div className="mb-3">
                      <img
                        src={link.purchaseImage}
                        alt="Product"
                        className="w-32 h-32 object-cover rounded border"
                      />
                    </div>
                  )}

                  {/* Price Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                    <div className="bg-white p-2 rounded border">
                      <div className="text-gray-600 text-xs">Số lượng</div>
                      <div className="font-medium text-lg">{link.quantity}</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-gray-600 text-xs">Giá web</div>
                      <div className="font-medium">
                        {link.priceWeb?.toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-gray-600 text-xs">Ship web</div>
                      <div className="font-medium">
                        {link.shipWeb?.toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-gray-600 text-xs">Tổng web</div>
                      <div className="font-medium">
                        {link.totalWeb?.toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-gray-600 text-xs">Phí mua</div>
                      <div className="font-medium">
                        {link.purchaseFee?.toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-gray-600 text-xs">Phụ phí</div>
                      <div className="font-medium">
                        {link.extraCharge?.toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>

                  {/* Total VND */}
                  <div className="bg-green-50 p-3 rounded border border-green-200 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">
                        Tổng tiền :
                      </span>
                      <span className="font-bold text-xl text-green-600">
                        {link.finalPriceVnd?.toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Codes & Website */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                    {link.trackingCode && (
                      <div>
                        <span className="text-gray-600">Mã đơn hàng: </span>
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">
                          {link.trackingCode}
                        </span>
                      </div>
                    )}
                    {link.shipmentCode && (
                      <div>
                        <span className="text-gray-600">Mã vận đơn: </span>
                        <span className="font-mono bg-orange-100 px-2 py-1 rounded text-orange-800">
                          {link.shipmentCode}
                        </span>
                      </div>
                    )}
                    {link.website && (
                      <div>
                        <span className="text-gray-600">Website: </span>
                        <span className="font-medium bg-purple-100 px-2 py-1 rounded text-purple-800">
                          {link.website}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Link */}
                  {link.productLink && (
                    <div className="text-sm">
                      <span className="text-gray-600">Link sản phẩm: </span>
                      <a
                        href={link.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono bg-gray-100 px-2 py-1 rounded text-xs break-all text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {link.productLink}
                      </a>
                    </div>
                  )}

                  {/* Note */}
                  {link.note && (
                    <div className="mt-3 text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                      <span className="font-medium text-gray-700">
                        Ghi chú:{" "}
                      </span>
                      <span className="text-gray-600">{link.note}</span>
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

export default OrderLinksDetailSale;

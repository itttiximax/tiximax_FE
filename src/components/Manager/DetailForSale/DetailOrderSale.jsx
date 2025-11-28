import React, { useState } from "react";
import { X, Package, Loader2 } from "lucide-react";
import OrderColumnDetailSale from "./OrderColumnDetailSale";
import UserColumnDetailSale from "./UserColumnDetailSale";
import StatsColumnDetailSale from "./StatsColumnDetailSale";

// Import sub-dialogs
import PurchasesDetailSale from "./PurchasesDetailSale";
import PaymentsDetailSale from "./PaymentsDetailSale";
import WarehousesDetailSale from "./WarehousesDetailSale";
import ProcessLogsDetailSale from "./ProcessLogsDetailSale";
import OrderLinksDetailSale from "./OrderLinksDetailSale";

const DetailOrderSale = ({
  orderData,
  onClose,
  availableStatuses = [],
  isLoading = false,
}) => {
  const [showPurchases, setShowPurchases] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showWarehouses, setShowWarehouses] = useState(false);
  const [showProcessLogs, setShowProcessLogs] = useState(false);
  const [showOrderLinks, setShowOrderLinks] = useState(false);

  if (!orderData) return null;

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
              <OrderColumnDetailSale
                orderData={orderData}
                availableStatuses={availableStatuses}
                isLoading={isLoading}
              />

              {/* Column 2: Customer & Staff */}
              <UserColumnDetailSale
                customer={orderData.customer}
                staff={orderData.staff}
                isLoading={isLoading}
              />

              {/* Column 3: Quick Stats & Actions */}
              <StatsColumnDetailSale
                orderData={orderData}
                onShowPurchases={() => setShowPurchases(true)}
                onShowPayments={() => setShowPayments(true)}
                onShowWarehouses={() => setShowWarehouses(true)}
                onShowProcessLogs={() => setShowProcessLogs(true)}
                onShowOrderLinks={() => setShowOrderLinks(true)}
              />
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
        <PurchasesDetailSale
          purchases={orderData.purchases}
          onClose={() => setShowPurchases(false)}
        />
      )}

      {showPayments && orderData.payments?.length > 0 && (
        <PaymentsDetailSale
          payments={orderData.payments}
          onClose={() => setShowPayments(false)}
        />
      )}

      {showWarehouses && orderData.warehouses?.length > 0 && (
        <WarehousesDetailSale
          warehouses={orderData.warehouses}
          onClose={() => setShowWarehouses(false)}
        />
      )}

      {showOrderLinks && orderData.orderLinks?.length > 0 && (
        <OrderLinksDetailSale
          orderLinks={orderData.orderLinks}
          onClose={() => setShowOrderLinks(false)}
        />
      )}

      {showProcessLogs && orderData.orderProcessLogs?.length > 0 && (
        <ProcessLogsDetailSale
          logs={orderData.orderProcessLogs}
          onClose={() => setShowProcessLogs(false)}
        />
      )}
    </>
  );
};

export default DetailOrderSale;

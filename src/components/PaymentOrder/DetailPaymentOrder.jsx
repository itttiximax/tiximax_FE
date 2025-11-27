// src/Components/Payment/DetailPaymentOrder.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  QrCode,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import paymentService from "../../Services/Payment/paymentService";

const STATUS_CONFIG = {
  CHO_THANH_TOAN: {
    label: "Chờ thanh toán",
    color: "bg-yellow-50 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500",
  },
  DA_THANH_TOAN: {
    label: "Đã thanh toán",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  DA_HUY: {
    label: "Đã hủy",
    color: "bg-red-50 text-red-800 border-red-200",
    dot: "bg-red-500",
  },
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "-";
  try {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });
  } catch {
    return value;
  }
};

const DetailPaymentOrder = ({ codeFromProp }) => {
  const params = useParams();
  const paymentCode = codeFromProp || params.paymentCode;
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPayment = useCallback(async () => {
    if (!paymentCode) {
      toast.error("Không tìm thấy payment code");
      return;
    }
    try {
      setLoading(true);
      const data = await paymentService.getPaymentByCode(paymentCode);
      setPayment(data);
    } catch (error) {
      console.error("Error fetching payment detail:", error);
      toast.error("Không tải được thông tin thanh toán");
    } finally {
      setLoading(false);
    }
  }, [paymentCode]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  const handleCopy = (text, label = "Đã copy") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const statusConfig =
    (payment && STATUS_CONFIG[payment.status]) || STATUS_CONFIG.CHO_THANH_TOAN;

  const remainingAmount =
    payment && payment.amount != null && payment.collectedAmount != null
      ? payment.amount - payment.collectedAmount
      : null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Loading */}
      {loading && !payment && (
        <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-2 animate-pulse" />
          Đang tải thông tin thanh toán...
        </div>
      )}

      {/* Không có dữ liệu */}
      {!loading && !payment && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-sm">
          <AlertCircle className="w-6 h-6 mb-2" />
          Không tìm thấy thông tin thanh toán.
        </div>
      )}

      {/* Có payment */}
      {payment && (
        <div className="grid lg:grid-cols-[1.5fr,2fr] gap-6">
          {/* LEFT – Thông tin */}
          <div className="space-y-4">
            {/* INFO BOX */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 space-y-4">
              {/* Dòng trên: icon + mã + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Mã thanh toán
                    </p>
                    <button
                      onClick={() =>
                        handleCopy(payment.paymentCode, "Đã copy mã thanh toán")
                      }
                      className="flex items-center gap-2 text-lg font-mono font-semibold hover:text-blue-600"
                    >
                      {payment.paymentCode}
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Status badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${statusConfig.color}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
                  />
                  {statusConfig.label}
                </div>
              </div>

              {/* Order + merged info */}
              <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Đơn hàng</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">
                      {payment.content || "-"}
                    </span>
                    {payment.content && (
                      <button
                        onClick={() =>
                          handleCopy(payment.content, "Đã copy mã đơn hàng")
                        }
                        className="p-1.5 rounded-full hover:bg-gray-100"
                      >
                        <Copy className="w-3 h-3 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Thanh toán gộp</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 text-gray-500" />
                    {payment.isMergedPayment ? "Có" : "Không"}
                  </div>
                </div>
              </div>
            </div>

            {/* AMOUNT INFO */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 space-y-4">
              <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Thông tin số tiền
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Số tiền cần thu */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-gray-500 mb-1">Số tiền cần thu</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>

                {/* Đã thu */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-gray-500 mb-1">Đã thu</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(payment.collectedAmount)}
                  </p>
                </div>

                {/* Còn lại */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-gray-500 mb-1">Còn lại</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {remainingAmount != null
                      ? formatCurrency(remainingAmount)
                      : "-"}
                  </p>
                </div>

                {/* Tỷ lệ đặt cọc */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-gray-500 mb-1">Tỷ lệ đặt cọc</p>
                  <p className="text-sm font-semibold">
                    {payment.depositPercent != null
                      ? `${payment.depositPercent}%`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT – QR CODE (giữ nguyên) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:py-10 flex flex-col items-center">
            {payment.qrCode ? (
              <>
                <img src={payment.qrCode} alt="QR thanh toán" />

                <button
                  onClick={() =>
                    handleCopy(payment.qrCode, "Đã copy link mã QR")
                  }
                  className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                >
                  <Copy className="w-3 h-3" />
                  Copy link mã QR
                </button>
              </>
            ) : (
              <div className="text-gray-500 text-sm flex flex-col items-center py-10">
                <AlertCircle className="w-6 h-6 mb-2" />
                Chưa có mã QR cho phiếu thanh toán này.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPaymentOrder;

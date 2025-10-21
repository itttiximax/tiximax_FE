import React from "react";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.",
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy",
  loading = false,
  loadingText = "Đang xử lý...", // THÊM PROP NÀY
  type = "danger", // 'danger' | 'warning' | 'info'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const currentStyle = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b">
          <div
            className={`flex-shrink-0 w-10 h-10 ${currentStyle.iconBg} rounded-full flex items-center justify-center`}
          >
            <FiAlertTriangle className={`w-5 h-5 ${currentStyle.iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {/* <p className="text-sm text-gray-600 mt-1">
              Hành động này không thể hoàn tác
            </p> */}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {typeof message === "string" ? (
            <p className="text-gray-700">{message}</p>
          ) : (
            message
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 ${currentStyle.buttonBg} text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {loadingText}
              </>
            ) : (
              <>
                {/* <FiTrash2 className="w-4 h-4" /> */}
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

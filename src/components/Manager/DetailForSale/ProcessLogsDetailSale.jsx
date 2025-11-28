import React from "react";
import { X, ClipboardList } from "lucide-react";

const ProcessLogsDetailSale = ({ logs, onClose }) => {
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
      DA_GIAO: "Đã giao",
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
      STAFF_WAREHOUSE_DOMESTIC: "Nhân viên kho trong nước",
      STAFF_WAREHOUSE_FOREIGN: "Nhân viên kho nước ngoài",
      STAFF_PURCHASER: "Nhân viên mua hàng",
      MANAGER: "Quản lý",
      ADMIN: "Quản trị viên",
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
            <span className="text-sm text-gray-600">
              ({logs.length} hoạt động)
            </span>
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

export default ProcessLogsDetailSale;

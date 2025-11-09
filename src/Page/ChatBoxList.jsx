import React, { useState } from "react";
import { MessageCircle, X, Phone, MessageSquare, Bot } from "lucide-react";

/**
 * ChatBoxList
 * Props (tùy chọn):
 * - phone: string (VD "1900 545 403")
 * - onLiveChat: () => void
 * - onAssistant: () => void
 * - zaloHref: string (VD "https://zalo.me/...")
 * - hotlineHref: string (VD "tel:1900545403")
 */
const ChatBoxList = ({
  phone = "1900 545 403",
  zaloHref = "#",
  hotlineHref = "tel:1900545403",
  onLiveChat,
  onAssistant,
}) => {
  const [open, setOpen] = useState(false); // Bắt đầu với trạng thái đóng để tránh mở tự động

  const Item = ({
    icon,
    title,
    subtitle,
    actionLabel,
    onClick,
    href,
    iconBgColor,
    iconBorderColor,
    iconTextColor,
  }) => (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgColor} border ${iconBorderColor} ${iconTextColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {href ? (
        <a
          href={href}
          className="rounded-full bg-yellow-50 border border-yellow-200 px-4 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-100 transition-colors"
        >
          {actionLabel}
        </a>
      ) : (
        <button
          onClick={onClick}
          className="rounded-full bg-yellow-50 border border-yellow-200 px-4 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-100 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Nút nổi mở/đóng */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transition-colors duration-200 hover:scale-105"
          aria-label="Mở hộp hỗ trợ"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      {/* Hộp chat */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
            <h4 className="text-base font-semibold text-gray-900">
              Hỗ trợ mua sắm 24/7
            </h4>
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng hộp hỗ trợ"
              className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {/* Zalo */}
            <Item
              icon={
                // Icon Zalo dạng chữ Z đơn giản, với màu xanh dương
                <span className="text-base font-bold text-blue-600">Z</span>
              }
              title="Chat Zalo"
              subtitle="Kết nối nhanh chóng"
              actionLabel="Chat"
              href={zaloHref}
              iconBgColor="bg-blue-50"
              iconBorderColor="border-blue-200"
              iconTextColor="text-blue-600"
            />
            {/* Hỗ trợ trực tuyến */}
            <Item
              icon={<MessageSquare className="h-5 w-5" />}
              title="Hỗ trợ trực tuyến"
              subtitle="Phản hồi trong vài phút"
              actionLabel="Chat"
              onClick={() => onLiveChat && onLiveChat()}
              iconBgColor="bg-green-50"
              iconBorderColor="border-green-200"
              iconTextColor="text-green-600"
            />
            {/* Trợ lý mua sắm */}
            <Item
              icon={<Bot className="h-5 w-5" />}
              title="Trợ lý AI"
              subtitle="Tư vấn tự động, chính xác"
              actionLabel="Chat"
              onClick={() => onAssistant && onAssistant()}
              iconBgColor="bg-purple-50"
              iconBorderColor="border-purple-200"
              iconTextColor="text-purple-600"
            />
            {/* Hotline */}
            <Item
              icon={<Phone className="h-5 w-5" />}
              title="Hotline hỗ trợ"
              subtitle={phone}
              actionLabel="Gọi"
              href={hotlineHref}
              iconBgColor="bg-red-50"
              iconBorderColor="border-red-200"
              iconTextColor="text-red-600"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBoxList;

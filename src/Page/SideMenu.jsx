import React, { useState } from "react";
import { ChevronRight, DollarSign, Tag, Truck, Home } from "lucide-react";

const SideMenu = () => {
  // nút nào đang được mở rộng (hiện text). null = không cái nào mở
  const [activeIdx, setActiveIdx] = useState(null);
  // còn giữ toggle tổng nếu bạn muốn ẩn/hiện cả cụm
  const [isOpen, setIsOpen] = useState(true);

  const items = [
    { icon: Home, label: "Trang chủ" },
    { icon: DollarSign, label: "Tra cứu tỉ giá" },
    { icon: Tag, label: "Mã giảm giá" },
    { icon: Truck, label: "Theo dõi vận chuyển" },
  ];

  return (
    <div className="fixed top-1/2 left-0 -translate-y-1/2 z-50 flex flex-col items-start">
      {/* Nút Toggle tổng (giữ lại nếu cần) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-green-700 to-green-800 text-white p-3 rounded-r-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <ChevronRight
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={20}
        />
      </button>

      {/* Danh mục Menu: luôn chỉ hiện icon; click để mở rộng riêng từng nút */}
      <div
        className={`flex flex-col gap-2 mt-2 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeIdx === idx;

          return (
            <button
              key={item.label}
              onClick={() => setActiveIdx(isActive ? null : idx)}
              aria-label={item.label}
              className={[
                "group flex items-center bg-gradient-to-r from-green-600 to-green-700",
                "hover:from-green-700 hover:to-green-800 text-white rounded-r-md",
                "shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden",
              ].join(" ")}
              // dùng inline width để anim mượt across browsers
              style={{
                width: isActive ? 224 : 48, // ~ w-56 khi mở, ~ w-12 khi đóng
                padding: isActive ? "12px 16px" : "12px", // px-4 py-3 vs p-3
                justifyContent: isActive ? "flex-start" : "center",
              }}
            >
              <Icon size={22} className="shrink-0" />
              {/* Label: chỉ hiện khi active, có transition mượt */}
              <span
                className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;

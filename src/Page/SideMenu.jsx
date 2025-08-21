import React from "react";
import { ChevronRight, DollarSign, Tag, Truck, Home } from "lucide-react";

const SideMenu = () => {
  const [menuOpen, setMenuOpen] = React.useState(true);

  const items = [
    { icon: Home, label: "Trang chủ" },
    { icon: DollarSign, label: "Tra cứu tỉ giá" },
    { icon: Tag, label: "Mã giảm giá" },
    { icon: Truck, label: "Theo dõi vận chuyển" },
  ];

  return (
    <div className="fixed top-1/2 left-0 -translate-y-1/2 z-50 flex flex-col items-start font-sans">
      {/* Toggle button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-gray-800 text-white px-3 py-3 rounded-r-lg shadow-lg hover:bg-gray-900 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Toggle menu"
      >
        <ChevronRight
          size={20}
          className={`transition-transform duration-300 ease-in-out ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu items */}
      <div
        className={`mt-2 flex flex-col gap-2 transition-all duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4 pointer-events-none"
        }`}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="group flex items-center bg-green-600 text-white rounded-r-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:bg-green-700 hover:shadow-xl w-12 hover:w-60 h-12 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {/* Icon container: fixed width, shifted right */}
              <div className="flex items-center justify-start w-12 h-full pl-2">
                <Icon size={22} className="transition-none" />
              </div>

              {/* Text: appears on hover */}
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-2 pr-4 text-sm font-medium">
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

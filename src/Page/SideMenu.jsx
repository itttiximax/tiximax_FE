import React from "react";
import {
  ChevronRight,
  DollarSign,
  Tag,
  Truck,
  Home,
  Calculator,
  Gift,
} from "lucide-react";

const SideMenu = () => {
  const [menuOpen, setMenuOpen] = React.useState(true);

  const items = [
    { icon: Home, label: "Trang chủ", color: "from-blue-500 to-blue-600" },
    {
      icon: Calculator,
      label: "Tra cứu tỉ giá",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Gift,
      label: "Mã giảm giá",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Truck,
      label: "Theo dõi vận chuyển",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="fixed top-1/2 left-0 -translate-y-1/2 z-50 flex flex-col items-start font-sans">
      {/* Toggle button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-3 py-2 rounded-r-xl shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-300 group"
        aria-label="Toggle menu"
      >
        <ChevronRight
          size={18}
          className={`transition-transform duration-300 ease-in-out group-hover:scale-110 ${
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
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`group flex items-center bg-gradient-to-r ${item.color} hover:scale-105 text-white rounded-r-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl w-10 hover:w-52 h-10 focus:outline-none focus:ring-2 focus:ring-white/50 relative`}
              style={{
                transitionDelay: menuOpen ? `${index * 50}ms` : "0ms",
              }}
            >
              {/* Icon container */}
              <div className="flex items-center justify-center w-10 h-full">
                <Icon
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Text: appears on hover */}
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pl-2 pr-4 text-sm font-medium transform translate-x-2 group-hover:translate-x-0">
                {item.label}
              </span>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-xl"></div>
            </button>
          );
        })}
      </div>

      {/* Quick access badge */}
      <div className="mt-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-r-lg shadow-sm text-xs font-medium border-l-2 border-yellow-400">
          Quick Access
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

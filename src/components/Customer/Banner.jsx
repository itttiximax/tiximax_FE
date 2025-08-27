import React from "react";
import { MapPin, Phone, Clock, Shield } from "lucide-react";

const Banner = () => {
  const content = [
    { icon: MapPin, text: "TixiMax - 123 Đường Lê Lợi, Quận 1, TP.HCM" },
    { icon: Phone, text: "Hotline: 0909 444 909" },
    { icon: Clock, text: "Hỗ trợ 24/7" },
    { icon: Shield, text: "An toàn - Nhanh chóng - Uy tín" },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-800 via-black to-gray-800 text-white py-2 px-4 shadow-sm overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-32 h-full bg-yellow-400 transform -skew-x-12"></div>
        <div className="absolute top-0 right-1/4 w-32 h-full bg-yellow-400 transform skew-x-12"></div>
      </div>

      <div className="flex whitespace-nowrap relative z-10">
        <div className="animate-banner flex items-center space-x-8">
          {content.concat(content).map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-xs md:text-sm font-medium"
            >
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <item.icon className="w-3 h-3 text-black" />
              </div>
              <span className="text-gray-200">{item.text}</span>
              {index < content.concat(content).length - 1 && (
                <div className="w-1 h-1 bg-yellow-400 rounded-full mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes banner {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-banner {
          display: flex;
          animation: banner 30s linear infinite;
        }
        .animate-banner:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Banner;
